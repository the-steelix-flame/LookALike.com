import React from 'react';

// This layout will apply to all pages inside the (auth) group,
// like /login and /signup.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-primary">
      {children}
    </main>
  );
}
