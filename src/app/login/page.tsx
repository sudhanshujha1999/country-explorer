'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/lib/auth-store';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{username?: string; password?: string; general?: string}>({});
  
  const { login } = useAuthStore();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: {username?: string; password?: string} = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await login(username, password);
      if (result.success) {
        router.push('/');
      } else {
        setErrors({ general: result.error || 'Invalid username or password. Please try again.' });
      }
    } catch {
      setErrors({ general: 'An error occurred during login. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full space-y-6">
        <header className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-theme mb-2">
            Log in to your account
          </h1>
          <p className="text-sm sm:text-base text-muted">
            Sign in to access your favorite countries and personalized features
          </p>
        </header>
        
        {/* Error announcement for screen readers */}
        {hasErrors && (
          <div 
            role="alert" 
            aria-live="assertive"
            className="sr-only"
          >
            There are errors in the form. Please review and correct them.
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <fieldset disabled={isLoading} className="space-y-4">
            <legend className="sr-only">Login credentials</legend>
            
            {errors.general && (
              <div 
                role="alert"
                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.general}
                </p>
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-theme mb-2">
                Username *
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) {
                    setErrors(prev => ({ ...prev, username: undefined }));
                  }
                }}
                className={`w-full border rounded-lg py-3 px-4 text-base focus:outline-none focus:ring-2 bg-theme text-theme ${
                  errors.username 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-theme focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Enter your username"
                aria-describedby={errors.username ? "username-error" : "username-help"}
                aria-invalid={!!errors.username}
                autoComplete="username"
              />
              {errors.username && (
                <p id="username-error" role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.username}
                </p>
              )}
              <p id="username-help" className="mt-2 text-xs text-muted">
                Use &quot;testuser&quot; for demo access
              </p>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-theme mb-2">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }
                }}
                className={`w-full border rounded-lg py-3 px-4 text-base focus:outline-none focus:ring-2 bg-theme text-theme ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-theme focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Enter your password"
                aria-describedby={errors.password ? "password-error" : "password-help"}
                aria-invalid={!!errors.password}
                autoComplete="current-password"
              />
              {errors.password && (
                <p id="password-error" role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
              <p id="password-help" className="mt-2 text-xs text-muted">
                Use &quot;password123&quot; for demo access
              </p>
            </div>
          </fieldset>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[48px]"
              aria-describedby="submit-help"
            >
              {isLoading ? (
                <>
                  <span className="sr-only">Signing in, please wait</span>
                  <span aria-hidden="true">Signing in...</span>
                </>
              ) : (
                'Sign in'
              )}
            </button>
            <p id="submit-help" className="sr-only">
              Press Enter or click this button to sign in with your credentials
            </p>
          </div>

          <div className="text-center text-sm text-muted bg-accent/5 p-4 rounded-lg">
            <h2 className="font-medium text-theme mb-3">Demo Credentials</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Username:</span>
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">testuser</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Password:</span>
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">password123</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
} 