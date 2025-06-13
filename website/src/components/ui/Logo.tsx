// Logo component for TIBYAN platform
import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'icon' | 'text' | 'full';
  className?: string;
}

export const TibyanLogo: React.FC<LogoProps> = ({ 
  size = 'large', 
  variant = 'full',
  className = '' 
}) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12', 
    large: 'h-16 w-16'
  };

  if (variant === 'icon') {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <img 
          src="/tibyan-logo.png" 
          alt="TIBYAN" 
          className={`${sizeClasses[size]} object-contain`} 
        />
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
      <div className={sizeClasses[size]}>
        <img 
          src="/tibyan-logo.png" 
          alt="TIBYAN" 
          className={`${sizeClasses[size]} object-contain`} 
        />
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