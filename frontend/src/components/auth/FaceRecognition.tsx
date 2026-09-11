import React, { useState, useCallback, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { Shield, UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import * as faceapi from 'face-api.js';
import { api, type SignupData, type UserProfile } from '@/services/api';

// ── Face-api.js models CDN ────────────────────────────────────────────────────
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.14/model';

// ── EAR: Eye Aspect Ratio ─────────────────────────────────────────────────────
function getEAR(eye: faceapi.Point[]): number {
  if (eye.length < 6) return 1;
  const A = Math.hypot(eye[1].x - eye[5].x, eye[1].y - eye[5].y);
  const B = Math.hypot(eye[2].x - eye[4].x, eye[2].y - eye[4].y);
  const C = Math.hypot(eye[0].x - eye[3].x, eye[0].y - eye[3].y);
  return (A + B) / (2.0 * C);
}

const EAR_OPEN_THRESHOLD   = 0.25;  
const EAR_CLOSED_THRESHOLD = 0.20;  
const MIN_OPEN_FRAMES       = 5;    
const MIN_CLOSED_FRAMES     = 2;    

interface FaceRecognitionProps {
  onAuthenticated: (user: UserProfile) => void;
}

const FaceRecognition: React.FC<FaceRecognitionProps> = ({ onAuthenticated }) => {
  const webcamRef      = useRef<Webcam>(null);
  const rafRef         = useRef<number>(0);
  const blinkRunning   = useRef(false);

  const openFrames    = useRef(0);
  const closedFrames  = useRef(0);
  const sawOpen       = useRef(false);

  const [modelsLoaded,  setModelsLoaded]  = useState(false);
  const [blinkDetected, setBlinkDetected] = useState(false);
  const [blinkCount,    setBlinkCount]    = useState(0);
  const [earValue,      setEarValue]      = useState<number | null>(null);
  const [faceFound,     setFaceFound]     = useState(false);

  const [progress,    setProgress]    = useState(0);
  const [status,      setStatus]      = useState('LOADING_MODELS');
  const [error,       setError]       = useState<string | null>(null);
  const [showSignup,  setShowSignup]  = useState(false);
  
  // شلنا emergency_contact من الـ state هنا
  const [signupData,  setSignupData]  = useState<SignupData>({ name: '', age: 0, phone: '', emergency_contact: '' });
  
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        setStatus('BLINK_TO_LOGIN');
      } catch {
        setError('Failed to load face models. Check your connection.');
        setStatus('MODEL_ERROR');
      }
    })();
    return () => { cancelAnimationFrame(rafRef.current); blinkRunning.current = false; };
  }, []);

  const startBlinkLoop = useCallback(() => {
    if (!modelsLoaded || blinkRunning.current) return;
    blinkRunning.current = true;

    openFrames.current   = 0;
    closedFrames.current = 0;
    sawOpen.current      = false;

    const detect = async () => {
      if (!blinkRunning.current) return;

      const video = webcamRef.current?.video as HTMLVideoElement | null;
      if (!video || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.4 }))
        .withFaceLandmarks(true);

      if (!detection) {
        setFaceFound(false);
        setEarValue(null);
        openFrames.current   = 0;
        closedFrames.current = 0;
        sawOpen.current      = false;
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      setFaceFound(true);
      const pts      = detection.landmarks.positions;
      const leftEye  = pts.slice(36, 42);
      const rightEye = pts.slice(42, 48);
      const ear      = (getEAR(leftEye) + getEAR(rightEye)) / 2;
      setEarValue(parseFloat(ear.toFixed(3)));

      if (ear >= EAR_OPEN_THRESHOLD) {
        closedFrames.current = 0;
        openFrames.current  += 1;
        if (openFrames.current >= MIN_OPEN_FRAMES) {
          sawOpen.current = true;
        }
      } else if (ear < EAR_CLOSED_THRESHOLD && sawOpen.current) {
        closedFrames.current += 1;
        openFrames.current    = 0;

        if (closedFrames.current >= MIN_CLOSED_FRAMES) {
          blinkRunning.current = false;
          cancelAnimationFrame(rafRef.current);
          setBlinkCount(c => c + 1);
          setBlinkDetected(true);
          return;
        }
      }

      rafRef.current = requestAnimationFrame(detect);
    };

    rafRef.current = requestAnimationFrame(detect);
  }, [modelsLoaded]);

  useEffect(() => {
    if (modelsLoaded) startBlinkLoop();
  }, [modelsLoaded, startBlinkLoop]);

  useEffect(() => {
    if (blinkDetected && !isLoggingIn && !showSignup) {
      loginWithCapture();
    }
  }, [blinkDetected]);

  const captureFrame = useCallback((): Blob | null => {
    const src = webcamRef.current?.getScreenshot();
    if (!src) return null;
    const bytes = atob(src.split(',')[1]);
    const mime  = src.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(bytes.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) ia[i] = bytes.charCodeAt(i);
    return new Blob([ab], { type: mime });
  }, []);

  const loginWithCapture = useCallback(async () => {
    setIsLoggingIn(true);
    setError(null);
    setProgress(30);
    setStatus('BLINK_VERIFIED ✓  CAPTURING');

    await new Promise(r => setTimeout(r, 400));
    const photoUrl = webcamRef.current?.getScreenshot() ?? null;

    const blob = captureFrame();
    if (!blob) {
      setError('Could not capture image.');
      setStatus('FAILED'); setProgress(0); setIsLoggingIn(false); setBlinkDetected(false);
      startBlinkLoop();
      return;
    }

    setProgress(65); setStatus('VERIFYING_IDENTITY');
    try {
      const user = await api.login(blob);
      if (photoUrl) user.photo_url = photoUrl;
      setProgress(100); setStatus('AUTHENTICATED ✓');
      setTimeout(() => onAuthenticated(user), 600);
    } catch (err: any) {
      setProgress(0); setStatus('FACE_NOT_RECOGNIZED');
      setError(err.message || 'Authentication failed. Blink again to retry.');
      setIsLoggingIn(false); setBlinkDetected(false);
      startBlinkLoop();
    }
  }, [captureFrame, onAuthenticated, startBlinkLoop]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blinkDetected) { setError('Blink first to verify liveness.'); return; }
    setIsSigningUp(true); setError(null);
    const blob = captureFrame();
    if (!blob) { setError('Could not capture image.'); setIsSigningUp(false); return; }
    try {
      await api.signup(signupData, blob);
      setShowSignup(false);
      setSignupData({ name: '', age: 0, phone: '', emergency_contact: '' });
      setBlinkDetected(false);
      blinkRunning.current = false;
      startBlinkLoop();
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    } finally { setIsSigningUp(false); }
  };

  const earColor = earValue === null
    ? 'text-muted-foreground'
    : earValue < EAR_OPEN_THRESHOLD ? 'text-amber-400' : 'text-accent';

  if (showSignup) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="relative w-full max-w-[440px] mx-4 p-6 sm:p-8 bg-surface rounded-2xl glow-border">
          <button onClick={() => setShowSignup(false)}
            className="flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft size={14} /> BACK
          </button>
          <div className="flex items-center gap-2 mb-1">
            <UserPlus size={16} className="text-primary" />
            <h2 className="text-primary font-mono text-sm tracking-widest uppercase">Sign Up</h2>
          </div>
          <p className="text-muted-foreground text-xs mb-4 font-mono">Blink once, then fill the form.</p>

          <div className="relative w-full aspect-video bg-background rounded-lg overflow-hidden mb-3">
            <Webcam ref={webcamRef} className="absolute inset-0 w-full h-full object-cover opacity-70"
              mirrored audio={false} screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: 'user' }} />
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-primary" />
            <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono font-bold border ${
              blinkDetected ? 'bg-accent/20 border-accent text-accent' : 'bg-amber-400/10 border-amber-400/40 text-amber-400'
            }`}>
              {blinkDetected ? '✓ BLINK VERIFIED' : 'BLINK TO VERIFY'}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3 text-[9px] font-mono">
            {faceFound ? <Eye size={10} className="text-accent" /> : <EyeOff size={10} className="text-muted-foreground" />}
            <span className="text-muted-foreground">EAR:</span>
            <span className={earColor}>{earValue ?? '--'}</span>
            <span className="text-muted-foreground ml-auto">Blinks: {blinkCount}</span>
          </div>

          {error && <p className="text-destructive text-xs font-mono mb-3">{error}</p>}

          <form onSubmit={handleSignup} className="space-y-3">
            {/* شلنا الـ emergency_contact من المصفوفة اللي بتعمل الـ inputs */}
            {(['name', 'age', 'phone'] as const).map(field => (
              <input key={field}
                type={field === 'age' ? 'number' : field === 'phone' ? 'tel' : 'text'}
                required placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={(signupData as any)[field] || ''}
                onChange={(e) => setSignupData(d => ({ ...d, [field]: field === 'age' ? parseInt(e.target.value) || 0 : e.target.value }))}
                className="w-full h-9 px-3 bg-secondary rounded-lg text-xs font-mono text-foreground placeholder:text-muted-foreground border-none outline-none focus:ring-1 focus:ring-primary/30"
              />
            ))}
            <button type="submit" disabled={isSigningUp || !blinkDetected}
              className="w-full h-9 bg-primary/20 border border-primary/30 rounded-lg text-primary text-xs font-mono font-bold hover:bg-primary/30 transition-all disabled:opacity-40">
              {isSigningUp ? 'SAVING...' : !blinkDetected ? 'BLINK FIRST TO UNLOCK' : 'REGISTER & SCAN FACE'}
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  // الجزء الباقي من الكود كما هو تماماً...
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="relative w-full max-w-[420px] mx-4 p-6 sm:p-8 bg-surface rounded-2xl glow-border">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={16} className="text-primary" />
          <h2 className="text-primary font-mono text-sm tracking-widest uppercase">Face Recognition</h2>
        </div>
        <p className="text-muted-foreground text-xs mb-5 font-mono">
          {modelsLoaded ? 'Look at camera and blink once to authenticate' : 'Loading face detection models...'}
        </p>

        {error && (
          <div className="mb-4 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-destructive text-xs font-mono">{error}</p>
          </div>
        )}

        <div className="relative w-full aspect-square bg-background rounded-lg overflow-hidden">
          <Webcam ref={webcamRef} className="absolute inset-0 w-full h-full object-cover opacity-60"
            mirrored audio={false} screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'user' }} />

          <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-primary" />
          <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-primary" />
          <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-primary" />
          <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-primary" />

          {isLoggingIn && (
            <motion.div animate={{ translateY: [0, 300, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute top-0 left-0 w-full h-[2px] bg-primary" />
          )}

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full border border-primary/30" />
            <div className="absolute w-[1px] h-10 bg-primary/30" />
            <div className="absolute w-10 h-[1px] bg-primary/30" />
          </div>

          {modelsLoaded && !isLoggingIn && (
            <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono font-bold border transition-all ${
              blinkDetected
                ? 'bg-accent/20 border-accent text-accent animate-pulse'
                : faceFound
                  ? 'bg-primary/10 border-primary/40 text-primary'
                  : 'bg-secondary border-border text-muted-foreground'
            }`}>
              {blinkDetected ? '✓ BLINK DETECTED — PROCESSING'
                : faceFound ? '👁 FACE DETECTED — BLINK NOW'
                : '🔍 SEARCHING FOR FACE...'}
            </div>
          )}

          {!modelsLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {modelsLoaded && (
          <div className="mt-3 flex items-center gap-3 text-[9px] font-mono">
            {faceFound ? <Eye size={10} className="text-accent" /> : <EyeOff size={10} className="text-muted-foreground" />}
            <span className="text-muted-foreground">EAR:</span>
            <span className={earColor}>{earValue ?? '--'}</span>
            <span className="text-muted-foreground ml-auto">Blinks: {blinkCount}</span>
          </div>
        )}

        <div className="mt-3 space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono text-primary">
            <span>{status}...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary" style={{ width: `${progress}%` }} transition={{ duration: 0.2 }} />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button onClick={() => setShowSignup(true)}
            className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors">
            <UserPlus size={14} /> SIGN_UP
          </button>
          {error && !isLoggingIn && (
            <button onClick={() => { setError(null); setBlinkDetected(false); setProgress(0); blinkRunning.current = false; startBlinkLoop(); }}
              className="text-xs font-mono text-primary hover:text-primary/80">
              RETRY
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FaceRecognition;