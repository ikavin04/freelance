import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaCheck, FaTimes } from 'react-icons/fa';
import { authAPI } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Password strength validation
  const passwordStrength = useMemo(() => {
    const password = formData.password;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    const passedChecks = Object.values(checks).filter(Boolean).length;
    return { checks, passedChecks };
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register(formData);
      toast.success(response.data.message);
      setRegisteredEmail(formData.email);
      setShowOTPModal(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    
    try {
      const response = await authAPI.verifyOTP({ email: registeredEmail, otp });
      toast.success(response.data.message);
      setShowOTPModal(false);
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await authAPI.resendOTP(registeredEmail);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-dark p-8 rounded-3xl glow-golden-strong"
        >
          {/* Header with Golden Accent */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full border-4 border-golden-glow flex items-center justify-center mx-auto mb-4"
            >
              <FaUser className="text-3xl gradient-text-golden" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2 font-serif gradient-text-golden">Create Account</h1>
            <p className="text-gray-400">Join Creo Studios today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:ring-2 focus:ring-white transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  minLength={8}
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 glass rounded-lg space-y-2"
                >
                  <p className="text-xs font-semibold text-gray-300 mb-2">Password Requirements:</p>
                  <div className="space-y-1 text-xs">
                    <div className={`flex items-center gap-2 ${passwordStrength.checks.length ? 'text-green-400' : 'text-gray-400'}`}>
                      {passwordStrength.checks.length ? <FaCheck className="text-xs" /> : <FaTimes className="text-xs" />}
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.checks.uppercase ? 'text-green-400' : 'text-gray-400'}`}>
                      {passwordStrength.checks.uppercase ? <FaCheck className="text-xs" /> : <FaTimes className="text-xs" />}
                      <span>One uppercase letter</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.checks.lowercase ? 'text-green-400' : 'text-gray-400'}`}>
                      {passwordStrength.checks.lowercase ? <FaCheck className="text-xs" /> : <FaTimes className="text-xs" />}
                      <span>One lowercase letter</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.checks.number ? 'text-green-400' : 'text-gray-400'}`}>
                      {passwordStrength.checks.number ? <FaCheck className="text-xs" /> : <FaTimes className="text-xs" />}
                      <span>One number</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.checks.special ? 'text-green-400' : 'text-gray-400'}`}>
                      {passwordStrength.checks.special ? <FaCheck className="text-xs" /> : <FaTimes className="text-xs" />}
                      <span>One special character (!@#$%^&*)</span>
                    </div>
                  </div>
                  
                  {/* Strength Bar */}
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            level <= passwordStrength.passedChecks
                              ? passwordStrength.passedChecks <= 2
                                ? 'bg-red-500'
                                : passwordStrength.passedChecks <= 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs mt-1 ${
                      passwordStrength.passedChecks <= 2
                        ? 'text-red-400'
                        : passwordStrength.passedChecks <= 3
                        ? 'text-yellow-400'
                        : 'text-green-400'
                    }`}>
                      {passwordStrength.passedChecks === 5
                        ? 'Strong password'
                        : passwordStrength.passedChecks >= 3
                        ? 'Medium password'
                        : 'Weak password'}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full pl-12 pr-12 py-3 glass rounded-xl focus:ring-2 focus:ring-white transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
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
                  Registering...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:text-gray-300 font-medium">
              Login
            </Link>
          </p>
        </motion.div>
      </div>

      {/* OTP Modal */}
      <AnimatePresence>
        {showOTPModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-dark p-8 rounded-3xl max-w-md w-full"
            >
              <div className="text-center mb-6">
                <FaCheckCircle className="text-5xl text-white mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 font-serif">Verify Your Email</h2>
                <p className="text-gray-400">
                  We've sent a 6-digit OTP to <br />
                  <span className="text-white font-semibold">{registeredEmail}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full px-4 py-3 glass rounded-xl text-center text-2xl tracking-widest focus:ring-2 focus:ring-white transition-all"
                    placeholder="000000"
                  />
                </div>

                <button
                  type="submit"
                  disabled={otpLoading}
                  className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-transparent hover:text-white border-2 border-white transition-all disabled:opacity-50"
                >
                  {otpLoading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="w-full py-2 text-white hover:text-gray-300 font-medium"
                >
                  Resend OTP
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
