import { Linkedin } from 'lucide-react';
import Logo from './logo';
import ViewCounter from '../view-counter';
const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-8 w-8"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);


const Footer = () => {

  return (
    <footer className="bg-background/30 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-2xl font-semibold text-muted-foreground mb-4">
          Connect with us
        </p>
        <div className="flex justify-center space-x-6">
          <a target='_blank' href="https://chat.whatsapp.com/LDQshr8AOh2HWbIWwjjJj9" className="text-muted-foreground hover:text-google-green transition-colors group">
            <span className="sr-only">WhatsApp</span>
            <img src="/whatsapp.png" alt="WhatsApp" width={32} height={32} className="h-8 w-8 block group-hover:hidden" />
            <img src="/whatsapp-red.png" alt="WhatsApp" width={32} height={32} className="h-8 w-8 hidden group-hover:block" />
          </a>
          <a target='_blank' href="https://www.linkedin.com/company/gdg-scoe/" className="text-muted-foreground hover:text-google-blue transition-colors">
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-8 w-8" />
          </a>
          <a target='_blank' href="https://x.com/gdgscoe" className="text-muted-foreground hover:text-google-yellow transition-colors">
            <span className="sr-only">X</span>
            <XIcon />
          </a>
        </div>
        <div className="mt-8 flex items-center justify-center space-x-2">
          <Logo />
        </div>
        <ViewCounter />
        <p className="mt-2 text-center text-sm text-muted-foreground/80">
          &copy; {new Date().getFullYear()} GDG on Campus SCOE. All rights reserved.
        </p>
        <p className="mt-1 text-center text-md text-muted-foreground/60 flex items-center justify-center gap-1">
          Designed & Developed by Mehvish Mulani and Devavrat Dhaygude 😎
        </p>
      </div>
    </footer>
  );
};

export default Footer;
