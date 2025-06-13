'use client';

import { Loader2 } from 'lucide-react';

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50" dir="rtl">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-medium text-gray-900 mb-2">جاري التحميل...</h2>
        <p className="text-gray-600">يرجى الانتظار قليلاً</p>
      </div>
    </div>
  );
}
