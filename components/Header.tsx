'use client'; // Add use client for useState

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'; // Import useState
import ThemeToggle from './ThemeToggle';

// A simple ChevronDownIcon component - not used in this version, can be removed if not needed elsewhere
// const ChevronDownIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 inline-block ml-1">
//     <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
//   </svg>
// );

// Hamburger Icon Component
const HamburgerIcon = ({ open }: { open: boolean }) => (
  <svg className="w-6 h-6 text-foreground" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    {open ? (
      <path d="M6 18L18 6M6 6l12 12"></path> // X icon
    ) : (
      <path d="M4 6h16M4 12h16M4 18h16"></path> // Hamburger icon
    )}
  </svg>
);

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary/90 text-card backdrop-blur-md shadow-md py-3 sm:py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3" onClick={closeMobileMenu}>
          <Image 
            src="https://yrasqdvnkyxnhjxftjak.supabase.co/storage/v1/object/public/automationdfy-assets//logo.png" 
            alt="AutomationDFY Logo"
            width={140} // Slightly smaller for mobile flexibility
            height={35}
            className="h-8 sm:h-10 md:h-12 w-auto" // Responsive height
            priority // Add priority for LCP
          />
          {/* Hide text logo on very small screens if needed, or make font smaller */}
          <span className="hidden sm:inline text-xl sm:text-2xl font-bold text-card self-center">
            AutomationDFY
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-5 lg:space-x-6 items-center">
          <Link href="/#features" className="text-card/90 hover:text-card transition-colors">
            Features
          </Link>
          <Link href="/#use-cases" className="text-card/90 hover:text-card transition-colors">
            Use Cases
          </Link>
          <Link href="/templates" className="text-card/90 hover:text-card transition-colors">
            Templates
          </Link>
          <Link href="/tutorials" className="text-card/90 hover:text-card transition-colors">
            Tutorials
          </Link>
          {/* Add other desktop links here if any */}
        </nav>
        <div className="hidden md:flex items-center space-x-3">
          <ThemeToggle />
          <Link
            href="/book-demo"
            className="bg-card text-primary px-4 py-2 rounded-md hover:bg-uranian_blue-900 transition-colors text-sm font-medium"
          >
            Book a demo
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            className="p-2 rounded-md text-card hover:bg-card/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-card"
          >
            <HamburgerIcon open={isMobileMenuOpen} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-card shadow-lg rounded-b-md border-t border-border">
          <nav className="flex flex-col space-y-1 px-4 py-3">
            <Link 
              href="/#features" 
              className="text-foreground hover:bg-border/30 block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMobileMenu}
            >
              Features
            </Link>
            <Link 
              href="/#use-cases" 
              className="text-foreground hover:bg-border/30 block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMobileMenu}
            >
              Use Cases
            </Link>
            <Link 
              href="/templates" 
              className="text-foreground hover:bg-border/30 block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMobileMenu}
            >
              Templates
            </Link>
            <Link 
              href="/tutorials" 
              className="text-foreground hover:bg-border/30 block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMobileMenu}
            >
              Tutorials
            </Link>
            {/* Add other mobile links here */}
            <div className="pt-2 mt-2 border-t border-border">
              <Link
                href="/book-demo"
                className="bg-primary text-card block w-full text-center px-4 py-2.5 rounded-md hover:bg-azul-600 transition-colors text-base font-medium"
                onClick={closeMobileMenu}
              >
                Book a demo
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
} 