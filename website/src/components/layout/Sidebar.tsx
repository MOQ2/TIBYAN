'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Upload, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Users, 
  LogOut,
  Menu,
  X,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getUserRoleDisplayName } from '@/lib/utils';

interface SidebarProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'لوحة التحكم', href: '/dashboard', icon: LayoutDashboard },
  { name: 'رفع الملفات', href: '/upload', icon: Upload },
  { name: 'التحليلات الشخصية', href: '/analytics', icon: BarChart3 },
  { name: 'محلل المحادثات', href: '/conversations', icon: MessageSquare },
  { name: 'الإعدادات', href: '/settings', icon: Settings },
];

const adminNavigation = [
  { name: 'إدارة المستخدمين', href: '/admin', icon: Users },
];

export default function Sidebar({ children }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  const userNavigation = [...navigation];
  if (session?.user?.role === 'admin') {
    userNavigation.push(...adminNavigation);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">فتح القائمة الجانبية</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900 font-amiri">
          تِبيان - TIBYAN
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">تِبيان</h1>
                <p className="text-xs text-gray-500">TIBYAN</p>
              </div>
            </div>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {userNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-gray-700 hover:text-green-600 hover:bg-green-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium"
                      >
                        <item.icon
                          className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-green-600"
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              
              {/* User info and logout */}
              <li className="mt-auto">
                <div className="border-t border-gray-200 pt-4">
                  {session?.user && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-green-600">
                            {session.user.name?.charAt(0)}
                          </span>
                        </div>
                        <div className="mr-3 min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {getUserRoleDisplayName(session.user.role || '', 'ar')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 ml-2" />
                    تسجيل الخروج
                  </Button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                  <span className="sr-only">إغلاق القائمة</span>
                  <X className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">تِبيان</h1>
                      <p className="text-xs text-gray-500">TIBYAN</p>
                    </div>
                  </div>
                </div>
                
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {userNavigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className="text-gray-700 hover:text-green-600 hover:bg-green-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium"
                            >
                              <item.icon
                                className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-green-600"
                                aria-hidden="true"
                              />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pr-72">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
