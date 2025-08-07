import Image from 'next/image';
import { LoginForm } from '@/features/auth/components/login-form';
import Link from 'next/link';

export const metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to sign in to your account
          </p>
        </div>
        <LoginForm />


      </div>
    </div>
  );
}
