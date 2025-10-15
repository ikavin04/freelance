import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt, FaUserShield } from 'react-icons/fa';
import { authAPI, authHelpers } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { access_token, user } = response.data;
      
      // Store token and user info
      authHelpers.setToken(access_token);
      authHelpers.setUser(user);
      
      toast.success('Login successful! Welcome back!');
      setTimeout(() => navigate('/apply'), 1000);
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (adminLoading) return;

    // Check if admin credentials are entered
    if (formData.email !== 'vkavin2006@gmail.com' || formData.password !== 'Kavin2006@') {
      toast.error('Invalid admin credentials');
      return;
    }

    setAdminLoading(true);
    try {
      const response = await authAPI.adminLogin();
      const { access_token, user } = response.data;
      
      // Store token and user data
      authHelpers.setToken(access_token);
      authHelpers.setUser(user);
      
      toast.success('Admin login successful!');
      setTimeout(() => navigate('/admin'), 1000);
    } catch (error) {
      const message = error.response?.data?.message || 'Admin login failed';
      toast.error(message);
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-dark p-8 rounded-3xl"
          style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.15)' }}
        >
          {/* Header with Golden Accent */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto mb-4"
              style={{ borderColor: 'rgba(212, 175, 55, 0.4)', boxShadow: '0 0 20px rgba(212, 175, 55, 0.2)' }}
            >
              <FaSignInAlt className="text-3xl gradient-text-golden" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2 font-serif gradient-text-golden">Welcome Back</h1>
            <p className="text-gray-400">Login to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:ring-2 focus:ring-white transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 glass rounded-xl focus:ring-2 focus:ring-white transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-transparent hover:text-white border-2 border-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Admin Login Link */}
          <div className="mt-4 text-center">
            {!showAdminLogin ? (
              <button
                type="button"
                onClick={() => setShowAdminLogin(true)}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Admin Login
              </button>
            ) : (
              <div className="mt-2">
                <button
                  onClick={handleAdminLogin}
                  disabled={adminLoading || !formData.email || !formData.password}
                  className="px-4 py-2 bg-white text-black hover:bg-transparent hover:text-white border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed text-sm rounded-lg transition-all flex items-center gap-2 mx-auto"
                >
                  {adminLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <FaUserShield className="text-sm" />
                      Login as Admin
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="text-gray-500 hover:text-gray-300 text-xs mt-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-white hover:text-gray-300 font-medium">
              Register
            </Link>
          </p>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 glass rounded-xl border border-white/20"
          >
            <p className="text-sm text-gray-400 text-center">
              <span className="text-white font-medium">First time here?</span> 
              <br />
              Register to start applying for free projects!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
