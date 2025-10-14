import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Confetti from 'react-confetti';
import { FaUser, FaCity, FaBriefcase, FaCalendarAlt, FaPaperPlane } from 'react-icons/fa';
import { applicationAPI, authHelpers } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Apply = () => {
  const navigate = useNavigate();
  const user = authHelpers.getUser();
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    client_name: user?.name || '',
    city: '',
    service_type: '',
    days: 3
  });
  const [loading, setLoading] = useState(false);

  const services = [
    'Video Editing',
    'Poster Design',
    'Website Creation',
    'App Development'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate days
    if (parseInt(formData.days) < 3) {
      toast.error('Minimum 3 days required to complete the project!', {
        icon: '⚠️',
      });
      // Shake animation
      const form = e.target;
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
      return;
    }

    setLoading(true);
    try {
      const response = await applicationAPI.submitApplication(formData);
      toast.success('Your request has been submitted successfully!');
      
      // Show confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      // Reset form
      setFormData({
        client_name: user?.name || '',
        city: '',
        service_type: '',
        days: 3
      });

      // Navigate to applications after delay
      setTimeout(() => navigate('/my-applications'), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-10 px-4">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-dark p-8 sm:p-10 rounded-3xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center mx-auto mb-4 glow-purple"
            >
              <FaPaperPlane className="text-3xl" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Submit Project <span className="gradient-text">Proposal</span>
            </h1>
            <p className="text-gray-400">Complete the form below to begin your project consultation</p>
            <div className="mt-4 inline-block px-4 py-2 glass rounded-full text-sm">
              <span className="text-green-400">Complimentary consultation included</span>
            </div>
          </div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-4 rounded-xl mb-6"
          >
            <p className="text-gray-300">
              Welcome, <span className="text-primary-400 font-semibold">{user?.name}</span>!
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Client Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium mb-2">Client Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="Your name"
                />
              </div>
            </motion.div>

            {/* City */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium mb-2">City</label>
              <div className="relative">
                <FaCity className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="New York"
                />
              </div>
            </motion.div>

            {/* Service Type */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium mb-2">Type of Service</label>
              <div className="relative">
                <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <select
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:ring-2 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select a service</option>
                  {services.map((service) => (
                    <option key={service} value={service} className="bg-gray-900">
                      {service}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Days to Complete */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium mb-2">
                Days to Complete <span className="text-red-400">(Minimum: 3 days)</span>
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  required
                  min="3"
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="3"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Note: Projects require a minimum of 3 days to ensure quality delivery
              </p>
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="glass p-4 rounded-xl border border-primary-500/30"
            >
              <p className="text-sm text-gray-300">
                <span className="text-primary-400 font-semibold">Note:</span> This is a free application. 
                Payment integration will be added in future updates. Once submitted, we'll review your 
                request and get back to you soon!
              </p>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Submit Proposal
                </>
              )}
            </motion.button>
          </form>

          {/* View Applications Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center mt-6"
          >
            <button
              onClick={() => navigate('/my-applications')}
              className="text-primary-400 hover:text-primary-300 font-medium text-sm"
            >
              View My Applications →
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Apply;
