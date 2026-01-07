"use client";

import React from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useAuth } from '../hooks/use-auth';
import { useToast } from '../hooks/use-toast';
import type { AuthError } from 'firebase/auth';

interface LoginModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const GoogleIcon = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.83 0-5.22-1.9-6.08-4.44H2.21v2.84C4.08 21.09 7.72 23 12 23z"/>
        <path fill="#FBBC05" d="M5.92 14.41A6.97 6.97 0 0 1 5.56 12c0-.81.14-1.6.4-2.32V6.84H2.21A11.97 11.97 0 0 0 0 12c0 1.94.46 3.75 1.26 5.36l4.66-3.95z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.72 1 4.08 2.91 2.21 6.84l3.71 2.84C6.78 7.28 9.17 5.38 12 5.38z"/>
    </svg>
);

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, setIsOpen }) => {
  const { toast } = useToast();
  const { signInWithGoogle, user } = useAuth();
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setIsOpen(false);
    }
  }, [user, setIsOpen]);

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      // The useEffect above will close the modal on user change
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'auth/popup-closed-by-user') {
        // User closed the popup, do nothing.
      } else {
        console.error("Error signing in with Google: ", error);
        toast({
          title: "Error",
          description: "Failed to sign in with Google. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
        setIsSigningIn(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center font-headline">Join the Community</DialogTitle>
          <DialogDescription className="text-center">
            Sign in with Google to RSVP for events and connect with other members.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isSigningIn}>
                <GoogleIcon />
                {isSigningIn ? 'Signing in...' : 'Continue with Google'}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
