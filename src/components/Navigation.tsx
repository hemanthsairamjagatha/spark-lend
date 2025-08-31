import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Menu, X, User, LogOut, CreditCard, DollarSign } from 'lucide-react';

interface NavigationProps {
  userRole?: 'borrower' | 'lender';
  onRoleSwitch?: (role: 'borrower' | 'lender') => void;
}

const Navigation: React.FC<NavigationProps> = ({ userRole = 'borrower', onRoleSwitch }) => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleSwitch = (newRole: 'borrower' | 'lender') => {
    onRoleSwitch?.(newRole);
    setMobileMenuOpen(false);
  };

  const navLinks = user ? [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/loans', label: userRole === 'borrower' ? 'My Loans' : 'My Investments' },
    { href: '/browse', label: userRole === 'borrower' ? 'Browse Lenders' : 'Browse Requests' },
  ] : [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#safety', label: 'Safety' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-primary text-primary-foreground font-bold">
            S
          </div>
          <span className="font-bold text-xl">SparkLend</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8 md:ml-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4 ml-auto">
          {user ? (
            <>
              {/* Role Switch */}
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant={userRole === 'borrower' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleRoleSwitch('borrower')}
                  className="text-xs"
                >
                  <CreditCard className="w-3 h-3 mr-1" />
                  Borrower
                </Button>
                <Button
                  variant={userRole === 'lender' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleRoleSwitch('lender')}
                  className="text-xs"
                >
                  <DollarSign className="w-3 h-3 mr-1" />
                  Lender
                </Button>
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.email}</p>
                      <Badge variant="secondary" className="w-fit text-xs">
                        {userRole}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block text-foreground/60 hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className="space-y-2 pt-4 border-t">
                <div className="flex space-x-2">
                  <Button
                    variant={userRole === 'borrower' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleRoleSwitch('borrower')}
                    className="flex-1"
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    Borrower
                  </Button>
                  <Button
                    variant={userRole === 'lender' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleRoleSwitch('lender')}
                    className="flex-1"
                  >
                    <DollarSign className="w-4 h-4 mr-1" />
                    Lender
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button variant="hero" className="w-full" asChild>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;