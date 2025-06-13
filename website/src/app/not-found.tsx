'use client';

import Link from 'next/link';
import { Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
        </div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            الصفحة غير موجودة
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            عذراً، لا يمكن العثور على الصفحة التي تبحث عنها
          </p>
          <p className="text-gray-500">
            تأكد من صحة الرابط أو ارجع إلى الصفحة الرئيسية
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button>
              <Home className="h-4 w-4 mr-2" />
              العودة للرئيسية
            </Button>
          </Link>
          
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowRight className="h-4 w-4 mr-2" />
            رجوع
          </Button>
        </div>
        
        <div className="mt-12">
          <div className="text-6xl opacity-20 mb-4">🔍</div>
          <p className="text-sm text-gray-400">
            إذا استمرت المشكلة، تواصل مع فريق الدعم
          </p>
        </div>
      </div>
    </div>
  );
}
