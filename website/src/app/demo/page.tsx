'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { TibyanLogo } from '@/components/ui/Logo';

export default function Demo() {
  const demoData = {
    totalMessages: 1250,
    positiveCount: 750,
    negativeCount: 300,
    neutralCount: 200,
    recentAnalyses: [
      { id: 1, text: "الخدمة ممتازة وسريعة جداً", sentiment: "positive", confidence: 0.92 },
      { id: 2, text: "لم أحصل على الرد المناسب", sentiment: "negative", confidence: 0.87 },
      { id: 3, text: "الموقع يعمل بشكل طبيعي", sentiment: "neutral", confidence: 0.75 },
      { id: 4, text: "فريق العمل رائع ومتعاون", sentiment: "positive", confidence: 0.89 },
      { id: 5, text: "التطبيق بطيء ويحتاج تحسين", sentiment: "negative", confidence: 0.84 },
    ]
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'إيجابي';
      case 'negative': return 'سلبي';
      default: return 'محايد';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 font-amiri">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <TibyanLogo size="large" />
              <h1 className="text-2xl font-bold font-amiri arabic-decorative bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                تِبيان - عرض توضيحي
              </h1>
            </div>
            <Link href="/landing">
              <Button variant="outline" className="font-amiri">
                <ArrowLeft className="ml-2 h-4 w-4" />
                العودة للرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Demo Introduction */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-amiri mb-4 arabic-decorative">
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              جرّب قوة تحليل المشاعر
            </span>
          </h2>
          <p className="text-xl text-gray-600 font-amiri max-w-3xl mx-auto">
            شاهد كيف يعمل تِبيان على تحليل المشاعر في النصوص العربية بدقة عالية
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center bg-gradient-to-b from-white to-blue-50 border-blue-100">
            <CardHeader>
              <MessageSquare className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <CardTitle className="font-amiri text-blue-700">إجمالي الرسائل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 font-amiri">
                {demoData.totalMessages.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-b from-white to-green-50 border-green-100">
            <CardHeader>
              <div className="w-8 h-8 mx-auto bg-green-600 rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-sm">+</span>
              </div>
              <CardTitle className="font-amiri text-green-700">إيجابية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 font-amiri">
                {demoData.positiveCount}
              </div>
              <div className="text-sm text-green-600 font-amiri">
                {Math.round((demoData.positiveCount / demoData.totalMessages) * 100)}%
              </div>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-b from-white to-red-50 border-red-100">
            <CardHeader>
              <div className="w-8 h-8 mx-auto bg-red-600 rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-sm">-</span>
              </div>
              <CardTitle className="font-amiri text-red-700">سلبية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900 font-amiri">
                {demoData.negativeCount}
              </div>
              <div className="text-sm text-red-600 font-amiri">
                {Math.round((demoData.negativeCount / demoData.totalMessages) * 100)}%
              </div>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-b from-white to-yellow-50 border-yellow-100">
            <CardHeader>
              <div className="w-8 h-8 mx-auto bg-yellow-600 rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-sm">=</span>
              </div>
              <CardTitle className="font-amiri text-yellow-700">محايدة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-900 font-amiri">
                {demoData.neutralCount}
              </div>
              <div className="text-sm text-yellow-600 font-amiri">
                {Math.round((demoData.neutralCount / demoData.totalMessages) * 100)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-amiri text-2xl text-center">
              تحليلات حديثة للمشاعر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoData.recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-amiri text-gray-800 mb-2">{analysis.text}</p>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <span className={`px-3 py-1 rounded-full text-sm font-amiri ${getSentimentColor(analysis.sentiment)}`}>
                        {getSentimentLabel(analysis.sentiment)}
                      </span>
                      <span className="text-sm text-gray-500 font-amiri">
                        دقة: {Math.round(analysis.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-8 text-white">
          <h3 className="text-3xl font-bold font-amiri mb-4">
            مُعجب بما رأيت؟
          </h3>
          <p className="text-xl font-amiri mb-6">
            ابدأ الآن واكتشف قوة تحليل المشاعر لعملك
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 font-amiri">
                إنشاء حساب مجاني
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-amiri">
                تسجيل الدخول
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
