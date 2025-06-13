import { Schema, model, models } from 'mongoose';
import { User, UserRole, UserPreferences } from '@/types';

const UserPreferencesSchema = new Schema<UserPreferences>({
  language: {
    type: String,
    enum: ['ar', 'en'],
    default: 'ar',
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light',
  },
  notifications: {
    type: Boolean,
    default: true,
  },
});

const UserSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['customer_service', 'quality_supervisor', 'data_analyst', 'pr_manager', 'admin'] as UserRole[],
    required: true,
    default: 'customer_service',
  },
  avatar: {
    type: String,
    default: null,
  },
  department: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  preferences: {
    type: UserPreferencesSchema,
    default: () => ({}),
  },
}, {
  timestamps: true,
});

// Create indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// Transform output to match our interface
UserSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret._id = ret._id.toString();
    return ret;
  }
});

export const UserModel = models.User || model<User>('User', UserSchema);
