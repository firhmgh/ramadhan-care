import { useState, useRef } from 'react';
import { Camera, X, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onCancel?: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
        stopCamera();
      }
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      setCapturedImage(null);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleCancel = () => {
    stopCamera();
    setCapturedImage(null);
    if (onCancel) onCancel();
  };

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {!isActive && !capturedImage && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-accent/30 border border-border"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-1">Ambil Foto Sahur</h3>
              <p className="text-sm text-muted-foreground">
                Dokumentasikan momen sahur Anda
              </p>
            </div>
            <Button onClick={startCamera} className="rounded-2xl">
              <Camera className="w-4 h-4 mr-2" />
              Buka Kamera
            </Button>
          </motion.div>
        )}

        {isActive && !capturedImage && (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative rounded-3xl overflow-hidden bg-black"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleCancel}
                className="rounded-full w-12 h-12 bg-white/90 hover:bg-white"
              >
                <X className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                onClick={capturePhoto}
                className="rounded-full w-16 h-16 bg-primary hover:bg-primary-hover shadow-lg"
              >
                <Camera className="w-6 h-6" />
              </Button>
            </div>
          </motion.div>
        )}

        {capturedImage && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-4 right-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-10 h-10 rounded-full bg-success flex items-center justify-center shadow-lg"
              >
                <Check className="w-5 h-5 text-white" />
              </motion.div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={handleRetake}
                className="rounded-2xl bg-white/90 hover:bg-white"
              >
                Foto Ulang
              </Button>
              <Button
                onClick={handleConfirm}
                className="rounded-2xl"
              >
                <Check className="w-4 h-4 mr-2" />
                Simpan
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
