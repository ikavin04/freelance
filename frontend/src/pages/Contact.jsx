import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Confetti from 'react-confetti';
import { FaUser, FaCity, FaBriefcase, FaCalendarAlt, FaPaperPlane, FaFileAlt, FaImage, FaEnvelope } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const Contact = () => {
  const { theme } = useTheme();
  const [showConfetti, setShowConfetti] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [formData, setFormData] = useState({
    client_name: '',
    email: '',
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
    setSubmittedEmail('');

    // Validate required fields
    if (!formData.client_name || !formData.email || !formData.service_type || !formData.project_description) {
      toast.error('Please fill in all required fields!');
      return;
    }

    // Validate days
    if (parseInt(formData.days) < 3) {
      toast.error('Minimum 3 days required to complete the project!', {
        icon: '⚠️',
      });
      const form = e.target;
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
      return;
    }

    setLoading(true);
    try {
      // Use FormSubmit.co - completely free, no API key needed
      const response = await fetch('https://formsubmit.co/ajax/vkavin2006@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.client_name,
          email: formData.email,
          city: formData.city,
          service: formData.service_type,
          duration: `${formData.days} days`,
          description: formData.project_description,
          images: formData.reference_images || 'None provided',
          _subject: `🎯 New Project Request from ${formData.client_name} - CREO STUDIOS`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setSubmittedEmail(formData.email);
        toast.dismiss();
        toast.success('Form submitted', {
          position: 'top-right',
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          closeButton: false,
          icon: false,
        });
      } else {
        throw new Error('Failed to send email');
      }
      
      // Show confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      // Reset form
      setFormData({
        client_name: '',
        email: '',
        city: '',
        service_type: '',
        project_description: '',
        days: 3,
        reference_images: ''
      });

    } catch (error) {
      toast.error('Failed to submit your request. Please try again.');
      console.error('Contact form submit error:', error);
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
          numberOfPieces={200}
          recycle={false}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-4xl ${theme === 'dark' ? 'bg-black border-2 border-[#D4AF37]/30' : 'bg-white border border-gray-200'} shadow-2xl rounded-2xl p-8`}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`inline-flex items-center justify-center w-16 h-16 ${theme === 'dark' ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B]' : 'bg-gradient-to-r from-blue-500 to-purple-600'} rounded-full mb-4 shadow-lg ${theme === 'dark' ? 'shadow-[#D4AF37]/50' : 'shadow-blue-500/50'}`}
          >
            <FaEnvelope className={theme === 'dark' ? 'text-black text-2xl' : 'text-blue-400 text-2xl'} />
          </motion.div>
          <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-gray-900'} mb-2`}>
            Contact Us
          </h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
            Tell us about your project and we'll get back to you!
          </p>
        </div>

        {submittedEmail && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              theme === 'dark'
                ? 'border-[#D4AF37]/30 bg-gray-900 text-[#F6E6B4]'
                : 'border-blue-200 bg-white text-blue-400'
            }`}
          >
            Reply will be sent to the email you entered ({submittedEmail}). Further contact will be through email.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <label className={`flex items-center text-sm font-medium ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-blue-400'}`}>
                <FaUser className={`mr-2 ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-blue-400'}`} />
                Full Name *
              </label>
              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'border-[#D4AF37]/30 bg-gray-900 text-[#F6E6B4] placeholder-gray-500' : 'border-gray-400 bg-white text-gray-900 placeholder-gray-400 shadow-sm'} focus:ring-2 ${theme === 'dark' ? 'focus:ring-[#D4AF37] focus:border-[#D4AF37]' : 'focus:ring-blue-500 focus:border-blue-500'} transition-all duration-200`}
                placeholder="Enter your full name"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <label className={`flex items-center text-sm font-medium ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-blue-400'}`}>
                <FaEnvelope className={`mr-2 ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-blue-400'}`} />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'border-[#D4AF37]/30 bg-gray-900 text-[#F6E6B4] placeholder-gray-500' : 'border-gray-400 bg-white text-gray-900 placeholder-gray-400 shadow-sm'} focus:ring-2 ${theme === 'dark' ? 'focus:ring-[#D4AF37] focus:border-[#D4AF37]' : 'focus:ring-purple-500 focus:border-purple-500'} transition-all duration-200`}
                placeholder="Enter your email"
                required
              />
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <label className={`flex items-center text-sm font-medium ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-blue-400'}`}>
                <FaCity className={`mr-2 ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-blue-400'}`} />
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'border-[#D4AF37]/30 bg-gray-900 text-[#F6E6B4] placeholder-gray-500' : 'border-gray-400 bg-white text-gray-900 placeholder-gray-400 shadow-sm'} focus:ring-2 ${theme === 'dark' ? 'focus:ring-[#D4AF37] focus:border-[#D4AF37]' : 'focus:ring-green-500 focus:border-green-500'} transition-all duration-200`}
                placeholder="Enter your city"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <label className={`flex items-center text-sm font-medium ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-blue-400'}`}>
                <FaBriefcase className={`mr-2 ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-blue-400'}`} />
                Service Type *
              </label>
              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'border-[#D4AF37]/30 bg-gray-900 text-[#F6E6B4]' : 'border-gray-400 bg-white text-gray-900 shadow-sm'} focus:ring-2 ${theme === 'dark' ? 'focus:ring-[#D4AF37] focus:border-[#D4AF37]' : 'focus:ring-orange-500 focus:border-orange-500'} transition-all duration-200`}
                required
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-2"
          >
            <label className={`flex items-center text-sm font-medium ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-blue-400'}`}>
              <FaFileAlt className={`mr-2 ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-blue-400'}`} />
              Project Description * 
              <span className={`ml-2 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                ({getWordCount(formData.project_description)}/10,000 words)
              </span>
            </label>
            <textarea
              name="project_description"
              value={formData.project_description}
              onChange={handleChange}
              rows="6"
              className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'border-[#D4AF37]/30 bg-gray-900 text-[#F6E6B4] placeholder-gray-500' : 'border-gray-400 bg-white text-gray-900 placeholder-gray-400 shadow-sm'} focus:ring-2 ${theme === 'dark' ? 'focus:ring-[#D4AF37] focus:border-[#D4AF37]' : 'focus:ring-red-500 focus:border-red-500'} transition-all duration-200 resize-none`}
              placeholder="Describe your project in detail..."
              required
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-2"
            >
              <label className={`flex items-center text-sm font-medium ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-blue-400'}`}>
                <FaCalendarAlt className={`mr-2 ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-blue-400'}`} />
                Project Duration (Days) - Min: 3
              </label>
              <input
                type="number"
                name="days"
                value={formData.days}
                onChange={handleChange}
                min="3"
                className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'border-[#D4AF37]/30 bg-gray-900 text-[#F6E6B4]' : 'border-gray-400 bg-white text-gray-900 shadow-sm'} focus:ring-2 ${theme === 'dark' ? 'focus:ring-[#D4AF37] focus:border-[#D4AF37]' : 'focus:ring-indigo-500 focus:border-indigo-500'} transition-all duration-200`}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-2"
            >
              <label className={`flex items-center text-sm font-medium ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-blue-400'}`}>
                <FaImage className={`mr-2 ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-blue-400'}`} />
                Reference Images (URLs)
              </label>
              <input
                type="text"
                name="reference_images"
                value={formData.reference_images}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'border-[#D4AF37]/30 bg-gray-900 text-[#F6E6B4] placeholder-gray-500' : 'border-gray-400 bg-white text-gray-900 placeholder-gray-400 shadow-sm'} focus:ring-2 ${theme === 'dark' ? 'focus:ring-[#D4AF37] focus:border-[#D4AF37]' : 'focus:ring-pink-500 focus:border-pink-500'} transition-all duration-200`}
                placeholder="Paste image URLs (optional)"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="pt-6"
          >
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${theme === 'dark' ? 'bg-gradient-to-r from-[#D4AF37] via-[#C9A227] to-[#B8860B] text-black shadow-[#D4AF37]/50' : 'bg-blue-400 text-white shadow-blue-400/50'} font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed ${
                loading ? 'animate-pulse' : ''
              }`}
            >
              <span className="flex items-center justify-center">
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <FaPaperPlane className="mr-2" />
                )}
                {loading ? 'Submitting...' : 'Submit Request'}
              </span>
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;