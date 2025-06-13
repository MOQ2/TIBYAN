'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart3, Users, TrendingUp, MessageSquare, Sparkles, ChevronLeft } from 'lucide-react';
import { TibyanLogo } from '@/components/ui/Logo';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 font-amiri">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo only - removed text */}
            <TibyanLogo size="large" variant="icon" />
            
            <nav className="flex items-center space-x-4 space-x-reverse">
              <Link href="/auth/signin">
                <Button variant="ghost" className="font-amiri">
                  تسجيل الدخول
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="font-amiri bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
                  إنشاء حساب
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold font-amiri mb-6 arabic-decorative">
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              منصة تحليل المشاعر الذكية
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 font-amiri max-w-4xl mx-auto leading-relaxed">
            اكتشف ما يشعر به عملاؤك حقاً من خلال تحليل متقدم للمشاعر باستخدام الذكاء الاصطناعي. 
            احصل على رؤى عميقة لتحسين خدماتك وزيادة رضا العملاء بطريقة ذكية ومبتكرة.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 space-x-reverse">
            <Link href="/auth/signup">
              <Button 
                size="lg" 
                className="font-amiri bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in"
              >
                ابدأ الآن مجاناً
                <ChevronLeft className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button 
                size="lg" 
                variant="outline" 
                className="font-amiri text-lg px-8 py-4 border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300"
              >
                عرض توضيحي
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 backdrop-blur">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold font-amiri text-center mb-4 arabic-decorative">
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              لماذا تختار تِبيان؟
            </span>
          </h3>
          <p className="text-center text-gray-600 font-amiri mb-12 max-w-2xl mx-auto">
            منصة شاملة ومتطورة لتحليل المشاعر العربية بدقة عالية
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-b from-white to-emerald-50 border-emerald-100">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-amiri text-emerald-700">تحليل دقيق</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-amiri text-gray-600">
                  تحليل متقدم للمشاعر باستخدام نماذج الذكاء الاصطناعي المدربة على النصوص العربية
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-b from-white to-blue-50 border-blue-100">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-amiri text-blue-700">رؤى فورية</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-amiri text-gray-600">
                  احصل على تقارير فورية ومفصلة حول مشاعر العملاء مع إحصائيات شاملة ومرئية
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-b from-white to-purple-50 border-purple-100">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-amiri text-purple-700">سهولة الاستخدام</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-amiri text-gray-600">
                  واجهة بسيطة وسهلة الاستخدام مصممة خصيصاً للمستخدمين العرب بتجربة متميزة
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-b from-white to-green-50 border-green-100">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-amiri text-green-700">دعم شامل</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-amiri text-gray-600">
                  دعم فني متخصص ومتاح على مدار الساعة لضمان أفضل تجربة استخدام ممكنة
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold font-amiri mb-2">+10,000</div>
              <div className="text-emerald-100 font-amiri">محادثة محللة</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold font-amiri mb-2">+500</div>
              <div className="text-emerald-100 font-amiri">عميل راضٍ</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold font-amiri mb-2">98%</div>
              <div className="text-emerald-100 font-amiri">دقة التحليل</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-4xl font-bold font-amiri mb-6 arabic-decorative">
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                جاهز لتحسين تجربة عملائك؟
              </span>
            </h3>
            <p className="text-xl text-gray-600 mb-8 font-amiri leading-relaxed">
              انضم إلى آلاف الشركات التي تستخدم تِبيان لفهم عملائها بشكل أفضل وتحقيق نتائج استثنائية
            </p>
            <Link href="/auth/signup">
              <Button 
                size="lg" 
                className="font-amiri bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-xl px-10 py-5 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                ابدأ رحلتك مع تِبيان
                <Sparkles className="mr-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              {/* Logo only in footer - removed text */}
              <div className="mb-4">
                <TibyanLogo size="medium" variant="icon" className="brightness-0 invert" />
              </div>
              <p className="font-amiri text-gray-300 mb-4 max-w-md">
                منصة تحليل المشاعر الذكية الرائدة في العالم العربي، نساعدك على فهم عملائك بشكل أعمق.
              </p>
            </div>
            
            <div>
              <h4 className="font-amiri font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 font-amiri text-gray-300">
                <li><Link href="/auth/signin" className="hover:text-emerald-400 transition-colors">تسجيل الدخول</Link></li>
                <li><Link href="/auth/signup" className="hover:text-emerald-400 transition-colors">إنشاء حساب</Link></li>
                <li><Link href="/demo" className="hover:text-emerald-400 transition-colors">عرض توضيحي</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-amiri font-bold mb-4">تواصل معنا</h4>
              <ul className="space-y-2 font-amiri text-gray-300">
                <li>البريد الإلكتروني: info@tibyan.ai</li>
                <li>الهاتف: +966 11 234 5678</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="font-amiri text-gray-400">
              © 2024 تِبيان. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;