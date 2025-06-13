'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Upload, FileText, MessageSquare, Download, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  status: 'processing' | 'completed' | 'error';
  conversationsCount?: number;
  sentimentSummary?: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Load uploaded files from API
    const loadFiles = async () => {
      try {
        const response = await fetch('/api/files');        if (response.ok) {
          const data = await response.json();
          if (data.success && data.files) {            // Convert uploadDate strings to Date objects
            const filesWithDates = data.files.map((file: {
              id: string;
              name: string;
              size: number;
              type: string;
              uploadDate: string;
              status: string;
              conversationsCount?: number;
              sentimentSummary?: {
                positive: number;
                negative: number;
                neutral: number;
              };
            }) => ({
              ...file,
              uploadDate: new Date(file.uploadDate)
            }));
            setUploadedFiles(filesWithDates);
          }
        } else {
          // Fallback to mock data if API fails
          setUploadedFiles([
            {
              id: '1',
              name: 'whatsapp_conversations_2024.csv',
              size: 2456789,
              type: 'text/csv',
              uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
              status: 'completed',
              conversationsCount: 245,
              sentimentSummary: { positive: 120, negative: 45, neutral: 80 }
            },
            {
              id: '2',
              name: 'customer_support_chats.txt',
              size: 1234567,
              type: 'text/plain',
              uploadDate: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
              status: 'processing',
              conversationsCount: 156
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to load files:', error);
        // Fallback to mock data
        setUploadedFiles([
          {
            id: '1',
            name: 'whatsapp_conversations_2024.csv',
            size: 2456789,
            type: 'text/csv',
            uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
            status: 'completed',
            conversationsCount: 245,
            sentimentSummary: { positive: 120, negative: 45, neutral: 80 }
          }
        ]);
      }
    };

    loadFiles();
  }, [session, status, router]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
  };
  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true);
    
    for (const file of files) {
      // Add file to UI immediately with processing status
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        status: 'processing'
      };
      
      setUploadedFiles(prev => [newFile, ...prev]);
      
      try {
        // Create form data for upload
        const formData = new FormData();
        formData.append('file', file);
        
        // Upload file to API
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }
        
        const result = await response.json();
        
        // Update file status with real results
        setUploadedFiles(prev => prev.map(f => 
          f.id === newFile.id 
            ? { 
                ...f, 
                status: 'completed' as const,
                conversationsCount: result.conversationsCount,
                sentimentSummary: result.sentimentSummary
              }
            : f
        ));
        
      } catch (error) {
        console.error('Upload error:', error);
        
        // Update file status to error
        setUploadedFiles(prev => prev.map(f => 
          f.id === newFile.id 
            ? { ...f, status: 'error' as const }
            : f
        ));
        
        // You could show a toast notification here
        alert(error instanceof Error ? error.message : 'Upload failed');
      }
    }
    
    setIsUploading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: UploadedFile['status']) => {
    switch (status) {
      case 'processing':
        return 'جاري المعالجة...';
      case 'completed':
        return 'مكتمل';
      case 'error':
        return 'خطأ';
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      <Sidebar>
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              رفع الملفات
            </h1>
            <p className="text-gray-600">
              ارفع ملفات المحادثات لتحليل المشاعر (CSV, TXT, JSON)
            </p>
          </div>

          {/* Upload Area */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                رفع ملف جديد
              </CardTitle>
              <CardDescription>
                اختر ملفات المحادثات من WhatsApp أو Messenger للتحليل
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  اسحب الملفات هنا أو اضغط للاختيار
                </h3>
                <p className="text-gray-600 mb-4">
                  أنواع الملفات المدعومة: CSV, TXT, JSON (حتى 10 MB)
                </p>
                <input
                  type="file"
                  multiple
                  accept=".csv,.txt,.json"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="fileInput"
                />
                <Button
                  onClick={() => document.getElementById('fileInput')?.click()}
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      جاري الرفع...
                    </>
                  ) : (
                    'اختيار الملفات'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                الملفات المرفوعة ({uploadedFiles.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploadedFiles.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">لم يتم رفع أي ملفات بعد</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{file.name}</h4>
                          <p className="text-sm text-gray-600">
                            {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString('ar')}
                          </p>
                          {file.conversationsCount && (
                            <p className="text-sm text-blue-600">
                              {file.conversationsCount} محادثة
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Status */}
                        <div className="flex items-center gap-2">
                          {getStatusIcon(file.status)}
                          <span className="text-sm text-gray-600">
                            {getStatusText(file.status)}
                          </span>
                        </div>

                        {/* Sentiment Summary */}
                        {file.sentimentSummary && file.status === 'completed' && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                              إيجابي: {file.sentimentSummary.positive}
                            </span>
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                              سلبي: {file.sentimentSummary.negative}
                            </span>
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              محايد: {file.sentimentSummary.neutral}
                            </span>
                          </div>
                        )}

                        {/* Actions */}
                        {file.status === 'completed' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/analyzer?file=${file.id}`)}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              تحليل
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-1" />
                              تحميل
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>          </Card>
        </div>
        </main>
      </Sidebar>
    </div>
  );
}
