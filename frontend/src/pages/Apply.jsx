import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Confetti from 'react-confetti';
import { FaUser, FaCity, FaBriefcase, FaCalendarAlt, FaPaperPlane, FaFileAlt, FaImage } from 'react-icons/fa';
import { applicationAPI, authHelpers } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Apply = () => {
  const navigate = useNavigate();
  const user = authHelpers.getUser();
  const { theme } = useTheme();
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    client_name: user?.name || '',
    city: '',
    service_type: '',
    project_description: '',
    days: 3,
    reference_images: ''
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
    
    // Count words for project description
    if (name === 'project_description') {
      const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
      if (wordCount > 10000) {
        toast.warning('Project description cannot exceed 10,000 words!');
        return;
      }
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const getWordCount = (text) => {
    if (!text || text.trim() === '') return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
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
        project_description: '',
        days: 3,
        reference_images: ''
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
          className="glass-dark p-8 sm:p-10 rounded-3xl glow-golden-strong"
        >
          {/* Header with Golden Accent */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full border-4 border-golden-glow flex items-center justify-center mx-auto mb-4"
            >
              <FaPaperPlane className="text-3xl gradient-text-golden" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 font-serif gradient-text-golden">
              Submit Project <span className="gradient-text-golden">Proposal</span>
            </h1>
            <p className="text-gray-400">Complete the form below to begin your project consultation</p>
            <div className="mt-4 inline-block px-4 py-2 glass rounded-full text-sm border border-golden-glow">
              <span className="gradient-text-golden">Complimentary consultation included</span>
            </div>
          </div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-4 rounded-xl mb-6 border border-white/20"
          >
            <p className="text-gray-300">
              Welcome, <span className="text-white font-semibold">{user?.name}</span>!
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
              <label className="block text-sm font-medium mb-2">Client Name <span className="text-red-400">*</span></label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:ring-2 focus:ring-white transition-all"
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
              <label className="block text-sm font-medium mb-2">City <span className="text-red-400">*</span></label>
              <div className="relative">
                <FaCity className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:ring-2 focus:ring-white transition-all"
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
              <label className="block text-sm font-medium mb-2">Type of Service <span className="text-red-400">*</span></label>
              <div className="relative">
                <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <select
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:ring-2 focus:ring-white transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled className={theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white'}>
                    Select a service
                  </option>
                  {services.map((service) => (
                    <option key={service} value={service} className={theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white'}>
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

            {/* Project Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium mb-2">
                Project Description <span className="text-red-400">*</span>
                <span className="text-gray-400 text-xs ml-2">
                  ({getWordCount(formData.project_description)}/10,000 words)
                </span>
              </label>
              <div className="relative">
                <FaFileAlt className="absolute left-4 top-4 text-gray-400" />
                <textarea
                  name="project_description"
                  value={formData.project_description}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:ring-2 focus:ring-white transition-all resize-vertical"
                  placeholder="Describe your project in detail... What are your goals, requirements, target audience, style preferences, etc."
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Please provide a detailed description of your project (maximum 10,000 words)
              </p>
            </motion.div>

            {/* Days to Complete */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-medium mb-2">
                Days to Complete <span className="text-red-400">*</span> <span className="text-gray-400">(Minimum: 3 days)</span>
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
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:ring-2 focus:ring-white transition-all"
                  placeholder="3"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Note: Projects require a minimum of 3 days to ensure quality delivery
              </p>
            </motion.div>

            {/* Reference Images - Optional */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label className="block text-sm font-medium mb-2">
                Reference Images <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <FaImage className="absolute left-4 top-4 text-gray-400" />
                <textarea
                  name="reference_images"
                  value={formData.reference_images}
                  onChange={handleChange}
                  rows="3"
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:ring-2 focus:ring-white transition-all resize-vertical"
                  placeholder="Paste image URLs or describe reference materials (e.g., https://example.com/image1.jpg, https://example.com/image2.png)"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                You can provide links to reference images, inspiration, or similar designs you'd like to achieve
              </p>
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="glass p-4 rounded-xl border-2 border-white/20"
            >
              <p className="text-sm text-gray-300">
                <span className="text-white font-semibold">Note:</span> Fields marked with <span className="text-red-400">*</span> are mandatory. 
                This is a free application. Payment integration will be added in future updates. 
                Once submitted, we'll review your request and get back to you soon!
              </p>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black rounded-xl font-semibold text-lg hover:bg-transparent hover:text-white border-2 border-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            transition={{ delay: 1.1 }}
            className="text-center mt-6"
          >
            <button
              onClick={() => navigate('/my-applications')}
              className="text-white hover:text-gray-300 font-medium text-sm"
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
