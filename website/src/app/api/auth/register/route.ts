import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import { UserModel } from '@/lib/models/User';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  role: z.enum(['customer_service', 'quality_supervisor', 'data_analyst', 'pr_manager', 'admin']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
      // Connect to database
    await connectDB();
    
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    
    // Create user
    const user = new UserModel({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      company: validatedData.company,
      role: validatedData.role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    await user.save();
    
    // Return success response (don't include password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user.toObject();
    
    return NextResponse.json({
      message: 'تم إنشاء الحساب بنجاح',
      user: userWithoutPassword,
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'البيانات المدخلة غير صحيحة', errors: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}
