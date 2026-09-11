import face_recognition
import cv2
import numpy as np
from supabase import create_client
from app.core.config import get_settings

# ─── الإعدادات والاتصال ───────────────────────────────────────────────────────
settings = get_settings()
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
fernet = settings.fernet


# ─── Helper: Eye Aspect Ratio (لكشف الرمش) ────────────────────────────────────
def get_ear(eye_landmarks):
    """كل ما الرقم يقل يعني العين بتتقفل"""
    top = np.mean(eye_landmarks[1:3], axis=0)
    bottom = np.mean(eye_landmarks[4:6], axis=0)
    return np.linalg.norm(top - bottom)


# ─── Helper: تحميل المستخدمين المسجلين من Supabase ────────────────────────────
def load_registered_users():
    try:
        response = supabase.table("users").select("*").execute()
        registered_users = []
        for user in response.data:
            encrypted = user["face_embedding"]
            try:
                encrypted_data = encrypted.encode() if isinstance(encrypted, str) else encrypted
                decrypted_bytes = fernet.decrypt(encrypted_data)
                embedding = np.frombuffer(decrypted_bytes, dtype=np.float64)
                registered_users.append({
                    "id":                user["id"],
                    "name":              user["name"],
                    "age":               user.get("age"),
                    "phone":             user.get("phone"),
                    "embedding":         embedding
                })
            except Exception as dec_err:
                print(f"⚠️ Error decrypting user {user.get('name')}: {dec_err}")
        print(f"✅ Loaded {len(registered_users)} users.")
        return registered_users
    except Exception as e:
        print(f"❌ Database Error: {e}")
        return []


# ─── Helper: تحويل bytes صورة → numpy array (لـ face_recognition) ─────────────
def bytes_to_rgb_frame(image_bytes: bytes) -> np.ndarray:
    """يحول صورة JPEG/PNG من bytes إلى numpy array RGB"""
    np_arr = np.frombuffer(image_bytes, np.uint8)
    bgr_frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if bgr_frame is None:
        raise ValueError("Could not decode image")
    return cv2.cvtColor(bgr_frame, cv2.COLOR_BGR2RGB)


# ══════════════════════════════════════════════════════════════════════════════
# ✨ جديد: LOGIN من صورة مرسلة من المتصفح
# ══════════════════════════════════════════════════════════════════════════════
def web_face_login(image_bytes: bytes) -> dict | None:
    """
    يستقبل صورة JPEG من المتصفح ويقارنها بالـ embeddings في Supabase.
    يرجع بيانات المستخدم لو تم التعرف عليه، أو None لو لأ.
    """
    users = load_registered_users()
    if not users:
        print("❌ No registered users found.")
        return None

    rgb_frame = bytes_to_rgb_frame(image_bytes)

    # تصغير الصورة للسرعة
    small_frame = cv2.resize(rgb_frame, (0, 0), fx=0.5, fy=0.5)

    face_locations = face_recognition.face_locations(small_frame)
    face_encodings = face_recognition.face_encodings(small_frame, face_locations)

    if not face_encodings:
        print("⚠️ No face found in the image.")
        return None

    for face_encoding in face_encodings:
        for user in users:
            matches = face_recognition.compare_faces(
                [user["embedding"]], face_encoding, tolerance=0.5
            )
            if matches[0]:
                # ── Step 1: جيب آخر لوجين سابق قبل ما تسجل الحالي ─────────────
                last_login = None
                try:
                    uid = str(user["id"])
                    print(f"🔍 Querying last login for user_id='{uid}'")
                    att_res = supabase.table("attendance") \
                        .select("created_at") \
                        .eq("user_id", uid) \
                        .eq("status", "Present") \
                        .order("created_at", desc=True) \
                        .limit(1) \
                        .execute()
                    rows = att_res.data or []
                    print(f"🔍 attendance rows returned: {rows}")
                    if rows:
                        last_login = rows[0]["created_at"]
                        print(f"✅ last_login = {last_login}")
                    else:
                        print(f"⚠️ No previous attendance found for user_id='{uid}'")
                except Exception as e:
                    print(f"⚠️ Last-login fetch error: {e}")

                # ── Step 2: سجّل الحضور الحالي ───────────────────────────────────
                try:
                    supabase.table("attendance").insert({
                        "user_id": str(user["id"]),   # text دايماً
                        "status": "Present"
                    }).execute()
                except Exception as e:
                    print(f"⚠️ Attendance Insert Error: {e}")

                print(f"✅ Welcome {user['name']}!")
                return {
                    "id":                user["id"],
                    "name":              user["name"],
                    "age":               user["age"],
                    "phone":             user["phone"],
                    "status":            "Present",
                    "last_login":        last_login,   # ✅ من attendance
                }

    print("⚠️ Face not recognized.")
    return None


# ══════════════════════════════════════════════════════════════════════════════
# ✨ جديد: SIGNUP من صورة مرسلة من المتصفح
# ══════════════════════════════════════════════════════════════════════════════
def web_capture_and_register(user_data: dict, image_bytes: bytes) -> bool:
    """
    يستقبل بيانات المستخدم + صورة JPEG من المتصفح ويسجلهم في Supabase.
    """
    rgb_frame = bytes_to_rgb_frame(image_bytes)

    encodings = face_recognition.face_encodings(rgb_frame)
    if not encodings:
        print("⚠️ No face detected in registration image.")
        return False

    # تشفير الـ embedding وتخزينه
    encoding_bytes = np.array(encodings[0]).tobytes()
    encrypted_encoding = fernet.encrypt(encoding_bytes).decode()

    new_user = {
        "name": user_data["name"],
        "age": user_data["age"],
        "phone": user_data["phone"],
        "face_embedding": encrypted_encoding
    }
    supabase.table("users").insert(new_user).execute()
    print(f"✅ User {user_data['name']} registered!")
    return True


# ══════════════════════════════════════════════════════════════════════════════
# القديم: Login/Signup من كاميرا السيرفر (محفوظ للاستخدام المحلي)
# ══════════════════════════════════════════════════════════════════════════════
def capture_and_register(user_data: dict) -> bool:
    """يفتح كاميرا السيرفر ويسجل مستخدم جديد — للاستخدام المحلي فقط"""
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open camera.")
        return False

    blinked = False
    print(f"Starting registration for: {user_data['name']}")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_landmarks_list = face_recognition.face_landmarks(rgb_frame)

        if face_landmarks_list:
            face_marks = face_landmarks_list[0]
            if 'left_eye' in face_marks and 'right_eye' in face_marks:
                ear = (get_ear(face_marks['left_eye']) + get_ear(face_marks['right_eye'])) / 2
                if ear < 0.25:
                    blinked = True
                    print("✅ Blink Detected!")

        status_color = (0, 255, 0) if blinked else (0, 0, 255)
        status_msg = "READY: Press 'S' to Save" if blinked else "BLINK TO VERIFY"
        cv2.putText(frame, status_msg, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, status_color, 2)
        cv2.imshow("Registration", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('s') and blinked:
            encodings = face_recognition.face_encodings(rgb_frame)
            if encodings:
                encoding_bytes = np.array(encodings[0]).tobytes()
                encrypted_encoding = fernet.encrypt(encoding_bytes).decode()
                supabase.table("users").insert({
                    "name": user_data["name"],
                    "age": user_data["age"],
                    "phone": user_data["phone"],
                    "face_embedding": encrypted_encoding
                }).execute()
                print("✅ Saved to database!")
                break
        elif key == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    return True


def live_face_scan() -> str | None:
    """يفتح كاميرا السيرفر لتسجيل الدخول — للاستخدام المحلي فقط"""
    users = load_registered_users()
    cap = cv2.VideoCapture(0)
    liveness_verified = False

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        landmarks = face_recognition.face_landmarks(rgb_frame)

        if landmarks:
            face_marks = landmarks[0]
            ear = (get_ear(face_marks['left_eye']) + get_ear(face_marks['right_eye'])) / 2
            if ear < 0.25:
                liveness_verified = True

        if liveness_verified:
            small_frame = cv2.resize(rgb_frame, (0, 0), fx=0.25, fy=0.25)
            face_encodings = face_recognition.face_encodings(small_frame)

            for face_encoding in face_encodings:
                for user in users:
                    matches = face_recognition.compare_faces([user["embedding"]], face_encoding, 0.5)
                    if matches[0]:
                        try:
                            supabase.table("attendance").insert({
                                "user_id": user["id"],
                                "status": "Present"
                            }).execute()
                        except Exception as e:
                            print(f"⚠️ Attendance Error: {e}")
                        print(f"✅ Welcome {user['name']}!")
                        cap.release()
                        cv2.destroyAllWindows()
                        return user["name"]

        cv2.imshow("Secure Login", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    return None


def process_logout(user_id: int) -> bool:
    """تسجيل خروج المستخدم في الداتابيز"""
    try:
        response = supabase.table("attendance").insert({
            "user_id": str(user_id),   # text دايماً
            "status": "Signed Out"
        }).execute()
        if response.data:
            print(f"✅ User {user_id} signed out.")
            return True
        return False
    except Exception as e:
        print(f"❌ Logout Error: {e}")
        return False


# ─── Chair Control ────────────────────────────────────────────────────────────
def update_chair_target_mode(mode: str) -> bool:
    try:
        response = supabase.table("chair_control")\
            .update({"target_mode": mode})\
            .eq("id", 1).execute()
        return bool(response.data)
    except Exception as e:
        print(f"❌ Service Error: {e}")
        return False


def get_chair_status() -> dict | None:
    try:
        response = supabase.table("chair_control").select("*").eq("id", 1).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"❌ Service Error: {e}")
        return None


# ─── Navigation ───────────────────────────────────────────────────────────────
def set_navigation_target(location_name: str) -> bool:
    try:
        loc_res = supabase.table("campus_locations")\
            .select("slam_x, slam_y").eq("name", location_name).execute()
        if loc_res.data:
            target = loc_res.data[0]
            supabase.table("chair_control").update({
                "target_x": target["slam_x"],
                "target_y": target["slam_y"],
                "target_mode": "Autonomous"
            }).eq("id", 1).execute()
            return True
        return False
    except Exception as e:
        print(f"❌ Nav Service Error: {e}")
        return False