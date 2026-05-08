'use client';

import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessToastProps {
  message?: string;
  show: boolean;
  onHide: () => void;
}

export default function SuccessToast({
  message = 'Barakallahu feek, keep going! 🌿',
  show,
  onHide,
}: SuccessToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onHide, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="flex items-center gap-3 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 text-emerald-400 px-5 py-3 rounded-xl shadow-emerald-lg">
        <CheckCircle className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
