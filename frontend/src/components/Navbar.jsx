import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { authHelpers } from '../services/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsAuthenticated(authHelpers.isAuthenticated());
    setUser(authHelpers.getUser());
  }, [location]);

  const handleLogout = () => {
    authHelpers.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo with Golden Accent */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
                className="text-2xl sm:text-3xl font-serif font-bold tracking-tight transition-all duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, #ffffff 0%, #d4af37 50%, #ffffff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s ease-in-out infinite'
                }}
            >
              KAVIN
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Only show navigation links if user is not an admin */}
            {!user?.is_admin && navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm uppercase tracking-wider font-medium transition-colors relative group ${
                  isActive(link.path) ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-white transition-all duration-300 ${
                    isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                {user?.is_admin ? (
                  /* Admin-only navigation */
                  <>
                    <Link
                      to="/admin"
                      className="px-6 py-2 bg-white text-black hover:bg-transparent hover:text-white border-2 border-white transition-all font-medium uppercase tracking-wider text-xs flex items-center gap-2"
                    >
                      <FaUser className="text-xs" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-2 border-2 border-white/20 hover:border-white transition-all font-medium uppercase tracking-wider text-xs flex items-center gap-2"
                    >
                      <FaSignOutAlt className="text-xs" />
                      Exit
                    </button>
                  </>
                ) : (
                  /* Regular user navigation */
                  <>
                    <Link
                      to="/apply"
                      className="px-6 py-2 bg-white text-black hover:bg-transparent hover:text-white border-2 border-white transition-all font-medium uppercase tracking-wider text-xs"
                    >
                      Apply Now
                    </Link>
                    <Link
                      to="/my-applications"
                      className="px-6 py-2 border-2 border-white/20 hover:border-white transition-all font-medium uppercase tracking-wider text-xs flex items-center gap-2"
                    >
                      <FaUser className="text-xs" />
                      Projects
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-2 border-2 border-white/20 hover:border-white transition-all font-medium uppercase tracking-wider text-xs flex items-center gap-2"
                    >
                      <FaSignOutAlt className="text-xs" />
                      Logout
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 border-2 border-white/20 hover:border-white transition-all font-medium uppercase tracking-wider text-xs"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-white text-black hover:bg-transparent hover:text-white border-2 border-white transition-all font-medium uppercase tracking-wider text-xs"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 border border-white/20 hover:border-white transition-all"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black border-t border-white/10 mt-2 mb-4 overflow-hidden"
            >
              <div className="flex flex-col space-y-2 p-4">
                {/* Only show navigation links if user is not an admin */}
                {!user?.is_admin && navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 border-b border-white/5 font-medium uppercase tracking-wider text-xs transition-all ${
                      isActive(link.path)
                        ? 'bg-white text-black'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <>
                    {user?.is_admin ? (
                      /* Admin mobile navigation */
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setIsOpen(false)}
                          className="px-6 py-3 bg-white text-black hover:bg-transparent hover:text-white border-2 border-white transition-all font-medium uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                        >
                          <FaUser className="text-xs" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                          className="px-6 py-3 border-2 border-white/20 hover:border-white transition-all font-medium uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                        >
                          <FaSignOutAlt className="text-xs" />
                          Exit
                        </button>
                      </>
                    ) : (
                      /* Regular user mobile navigation */
                      <>
                        <Link
                          to="/apply"
                          onClick={() => setIsOpen(false)}
                          className="px-6 py-3 bg-white text-black hover:bg-transparent hover:text-white border-2 border-white transition-all font-medium uppercase tracking-wider text-xs"
                        >
                          Apply Now
                        </Link>
                        <Link
                          to="/my-applications"
                          onClick={() => setIsOpen(false)}
                          className="px-6 py-3 border-2 border-white/20 hover:border-white transition-all font-medium uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                        >
                          <FaUser className="text-xs" />
                          Projects
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                          className="px-6 py-3 border-2 border-white/20 hover:border-white transition-all font-medium uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                        >
                          <FaSignOutAlt className="text-xs" />
                          Logout
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-3 border-2 border-white/20 hover:border-white transition-all font-medium uppercase tracking-wider text-xs"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-3 bg-white text-black hover:bg-transparent hover:text-white border-2 border-white transition-all font-medium uppercase tracking-wider text-xs"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
