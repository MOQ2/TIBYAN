import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/mongodb';
import { UserModel } from '@/lib/models/User';
import { UserRole } from '@/types';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Demo mode - use hardcoded users for testing
          const demoUsers = [
            {
              id: '1',
              email: 'admin@tibyan.com',
              name: 'مدير النظام',
              role: 'admin' as UserRole,
              department: 'الإدارة',
              avatar: undefined,
              preferences: { language: 'ar' as const, theme: 'light' as const, notifications: true }
            },
            {
              id: '2', 
              email: 'analyst@tibyan.com',
              name: 'محلل البيانات',
              role: 'data_analyst' as UserRole,
              department: 'التحليل',
              avatar: undefined,
              preferences: { language: 'ar' as const, theme: 'light' as const, notifications: true }
            },
            {
              id: '3',
              email: 'supervisor@tibyan.com', 
              name: 'مشرف الجودة',
              role: 'quality_supervisor' as UserRole,
              department: 'ضمان الجودة',
              avatar: undefined,
              preferences: { language: 'ar' as const, theme: 'light' as const, notifications: true }
            }
          ];

          const user = demoUsers.find(u => u.email === credentials.email.toLowerCase());
          
          if (!user) {
            return null;
          }

          // Demo password for all users
          const isPasswordValid = credentials.password === 'password123';

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            department: user.department,
            preferences: user.preferences,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Store additional user data in token
        token.userId = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
        token.department = user.department;
        token.preferences = user.preferences;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        // Add custom properties to session
        session.user.id = token.userId as string;
        session.user.role = token.role as UserRole;
        session.user.avatar = token.avatar as string;
        session.user.department = token.department as string;
        session.user.preferences = token.preferences;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
