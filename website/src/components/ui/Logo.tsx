// Logo component for TIBYAN platform
import React from 'react';
import { MessageCircle } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'icon' | 'text' | 'full';
  className?: string;
}

export const TibyanLogo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  variant = 'full',
  className = '' 
}) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8', 
    large: 'h-12 w-12'
  };

  const iconSizes = {
    small: 'h-4 w-4',
    medium: 'h-5 w-5',
    large: 'h-7 w-7'
  };

  if (variant === 'icon') {
    return (
      <div className={`bg-green-600 rounded-full flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        {/* Replace MessageCircle with your logo image */}
        {/* <img src="/logo-icon.png" alt="TIBYAN" className={iconSizes[size]} /> */}
        <MessageCircle className={`${iconSizes[size]} text-white`} />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={className}>
        <h1 className={`font-bold text-gray-900 ${size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-xl' : 'text-lg'}`}>
          تِبيان
        </h1>
        <p className="text-xs text-gray-500">TIBYAN</p>
      </div>
    );
  }

  // Full logo with icon and text
  return (
    <div className={`flex items-center space-x-3 space-x-reverse ${className}`}>
      {/* Logo Icon */}
      <div className={`bg-green-600 rounded-full flex items-center justify-center ${sizeClasses[size]}`}>
        {/* Option 1: Use your image logo */}
        {/* <img src="/logo-icon.png" alt="TIBYAN" className={iconSizes[size]} /> */}
        
        {/* Option 2: Keep the current icon */}
        <MessageCircle className={`${iconSizes[size]} text-white`} />
      </div>
      
      {/* Logo Text */}
      <div>
        <h1 className={`font-bold text-gray-900 ${size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-xl' : 'text-lg'}`}>
          تِبيان
        </h1>
        <p className="text-xs text-gray-500">TIBYAN</p>
      </div>
    </div>
  );
};

export default TibyanLogo;
