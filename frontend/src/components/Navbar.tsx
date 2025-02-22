import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Menu, X } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { RootState } from '../redux/store';
import { clearAuth } from '../redux/authSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const isLoggedIn = !!user;

  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(clearAuth());
    navigate('/login');
  };

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
            
            {/* Navigation Links - Desktop */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="/" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium">
                Home
              </a>
            </div>
          </div>

          {/* Theme Toggle and Auth Section */}
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 text-foreground hover:text-primary transition-colors focus:outline-none">
                    <User className="h-6 w-6" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <a
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90"
                >
                  Sign up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <a
              href="/"
              className="block px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Home
            </a>
            <a
              href="/shows"
              className="block px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Shows
            </a>
            <a
              href="/about"
              className="block px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              About
            </a>
            {!isLoggedIn && (
              <div className="border-t border-border pt-4 pb-3">
                <a
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="block px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Sign up
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;