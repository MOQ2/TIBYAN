import { UserRole, UserPreferences } from '@/types';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      avatar?: string;
      department?: string;
      preferences: UserPreferences;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    department?: string;
    preferences: UserPreferences;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    avatar?: string;
    department?: string;
    preferences: UserPreferences;
  }
}
