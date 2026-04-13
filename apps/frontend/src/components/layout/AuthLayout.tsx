import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[color:var(--surface)]">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[color:var(--accent-primary)]/10 blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[color:var(--accent-primary)]/5 blur-[100px]" />
      </div>

      {/* Noise overlay */}
      <div className="noise-dark pointer-events-none absolute inset-0 opacity-[0.02]" />

      {/* Content container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {children}
      </div>
    </div>
  );
};