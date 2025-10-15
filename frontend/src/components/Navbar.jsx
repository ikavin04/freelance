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
        scrolled ? 'glass-dark shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
                className="text-2xl sm:text-3xl font-bold gradient-text"
            >
              Kavin
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Only show navigation links if user is not an admin */}
            {!user?.is_admin && navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm lg:text-base font-medium transition-colors relative group ${
                  isActive(link.path) ? 'text-primary-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-400 to-accent-400 transition-all duration-300 ${
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
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
                    >
                      <FaUser className="text-sm" />
                      Admin Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg font-medium hover:bg-red-600/30 transition-all flex items-center gap-2"
                    >
                      <FaSignOutAlt className="text-sm" />
                      Logout
                    </button>
                  </>
                ) : (
                  /* Regular user navigation */
                  <>
                    <Link
                      to="/apply"
                      className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/50 transition-all"
                    >
                      Apply Now
                    </Link>
                    <Link
                      to="/my-applications"
                      className="px-4 py-2 glass rounded-lg font-medium hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                      <FaUser className="text-sm" />
                      My Projects
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg font-medium hover:bg-red-600/30 transition-all flex items-center gap-2"
                    >
                      <FaSignOutAlt className="text-sm" />
                      Logout
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 glass rounded-lg font-medium hover:bg-white/20 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/50 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg glass hover:bg-white/20 transition-all"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-dark rounded-lg mt-2 mb-4 overflow-hidden"
            >
              <div className="flex flex-col space-y-2 p-4">
                {/* Only show navigation links if user is not an admin */}
                {!user?.is_admin && navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive(link.path)
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-white/10'
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
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium text-center flex items-center justify-center gap-2"
                        >
                          <FaUser className="text-sm" />
                          Admin Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                          className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg font-medium flex items-center justify-center gap-2"
                        >
                          <FaSignOutAlt className="text-sm" />
                          Logout
                        </button>
                      </>
                    ) : (
                      /* Regular user mobile navigation */
                      <>
                        <Link
                          to="/apply"
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-medium text-center"
                        >
                          Apply Now
                        </Link>
                        <Link
                          to="/my-applications"
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-2 glass rounded-lg font-medium text-center flex items-center justify-center gap-2"
                        >
                          <FaUser className="text-sm" />
                          My Projects
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                          className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg font-medium flex items-center justify-center gap-2"
                        >
                          <FaSignOutAlt className="text-sm" />
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
                      className="px-4 py-2 glass rounded-lg font-medium text-center"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-medium text-center"
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
