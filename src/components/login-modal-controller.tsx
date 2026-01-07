"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/use-auth';
import LoginModal from './login-modal';

interface LoginModalControllerProps {
    children: (onLoginClick: () => void) => React.ReactNode;
}

export default function LoginModalController({ children }: LoginModalControllerProps) {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setLoginModalOpen(false);
    }
  }, [user]);

  const handleLoginClick = () => setLoginModalOpen(true);

  return (
    <>
      {children(handleLoginClick)}
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setLoginModalOpen} />
    </>
  );
}
