"use client";

import React from 'react';
import Header from './header';
import LoginModalController from '../login-modal-controller';

export default function MainLayout({
  children,
  footer
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <LoginModalController>
      {(onLoginClick) => (
        <div className="flex flex-col min-h-screen">
          <Header onLoginClick={onLoginClick} />
          <main className="flex-grow">
            {children}
          </main>
          {footer}
        </div>
      )}
    </LoginModalController>
  );
}
