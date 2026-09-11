const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface UserProfile {
  id: number;
  name: string;
  age: number;
  phone: string;
  emergency_contact: string;
  status?: string;
  face_embedding?: string;
  last_login?: string;    // ✅ آخر تسجيل دخول من جدول attendance
  photo_url?: string;     // ✅ صورة ملتقطة وقت اللوجين (data URL)
}

// ✅ Fix: كانت مش متعرفة هنا وبيتم import عليها في FaceRecognition.tsx
export interface SignupData {
  name: string;
  age: number;
  phone: string;
  emergency_contact: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────
export const api = {

  /**
   * تسجيل دخول بالوجه من المتصفح.
   * بيستقبل صورة JPEG كـ Blob من الـ Webcam ويبعتها للـ Backend.
   */
  async login(imageBlob: Blob): Promise<UserProfile> {
    const formData = new FormData();
    formData.append('image', imageBlob, 'face.jpg');

    const res = await fetch(`${API_URL}/users/login-web`, {
      method: 'POST',
      body: formData,
    });

    if (res.status === 401) {
      throw new Error('Face not recognized. Please register first.');
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Login failed');
    }

    const data: UserProfile = await res.json();
    localStorage.setItem('wheelchair_user', JSON.stringify(data));
    return data;
  },

  /**
   * تسجيل مستخدم جديد من المتصفح.
   * بيبعت بيانات المستخدم + صورة من الـ Webcam.
   */
  async signup(data: SignupData, imageBlob: Blob): Promise<boolean> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('age', data.age.toString());
    formData.append('phone', data.phone);
    formData.append('emergency_contact', data.emergency_contact);
    formData.append('image', imageBlob, 'face.jpg');

    const res = await fetch(`${API_URL}/users/signup-web`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Signup failed');
    }
    return true;
  },

  /**
   * تسجيل خروج المستخدم
   */
  async signout(): Promise<void> {
    try {
      const user = this.getCurrentUser();
      localStorage.removeItem('wheelchair_user');
      if (user?.id) {
        await fetch(`${API_URL}/users/logout?user_id=${user.id}`, {
          method: 'POST',
        });
      }
    } catch (error) {
      console.error('Signout Error:', error);
    }
    // ✅ Fix: مش بنعمل redirect لـ /login (مش موجود كـ route)
    // الـ Index.tsx هو اللي بيتحكم في الـ state
  },

  /**
   * جلب بيانات المستخدم من الـ localStorage
   */
  getCurrentUser(): UserProfile | null {
    const stored = localStorage.getItem('wheelchair_user');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as UserProfile;
    } catch {
      return null;
    }
  },
};