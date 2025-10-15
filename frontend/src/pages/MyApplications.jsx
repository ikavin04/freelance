import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaClipboardList, FaCalendarAlt, FaMapMarkerAlt, FaBriefcase, FaClock, FaPlus, FaVideo, FaPalette, FaGlobe, FaMobileAlt } from 'react-icons/fa';
import { applicationAPI, authHelpers } from '../services/api';
import { useNavigate } from 'react-router-dom';

const MyApplications = () => {
  const navigate = useNavigate();
  const user = authHelpers.getUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationAPI.getApplications();
      setApplications(response.data.applications);
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (serviceType) => {
    const iconMap = {
      'Video Editing': <FaVideo className="text-2xl text-white" />,
      'Poster Design': <FaPalette className="text-2xl text-white" />,
      'Website Creation': <FaGlobe className="text-2xl text-white" />,
      'App Development': <FaMobileAlt className="text-2xl text-white" />
    };
    return iconMap[serviceType] || <FaBriefcase className="text-2xl text-white" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-400">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-serif">
            My <span className="text-white">Applications</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Track all your project submissions in one place
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          <div className="glass border-2 border-white/20 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl border-2 border-white flex items-center justify-center">
                <FaClipboardList className="text-2xl text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold">{applications.length}</div>
                <div className="text-gray-400 text-sm">Total Applications</div>
              </div>
            </div>
          </div>

          <div className="glass border-2 border-white/20 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl border-2 border-white flex items-center justify-center">
                <FaClock className="text-2xl text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">Pending</div>
                <div className="text-gray-400 text-sm">Under Review</div>
              </div>
            </div>
          </div>

          <div className="glass border-2 border-white/20 p-6 rounded-2xl sm:col-span-2 lg:col-span-1">
            <button
              onClick={() => navigate('/apply')}
              className="w-full h-full flex items-center justify-center gap-2 text-white hover:text-gray-300 font-semibold transition-all group"
            >
              <FaPlus className="group-hover:rotate-90 transition-transform" />
              New Application
            </button>
          </div>
        </motion.div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-dark p-12 rounded-3xl text-center"
          >
            <FaClipboardList className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Applications Yet</h3>
            <p className="text-gray-400 mb-6">
              You haven't submitted any applications. Start by applying for a project!
            </p>
            <button
              onClick={() => navigate('/apply')}
              className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-transparent hover:text-white border-2 border-white transition-all"
            >
              Apply for a Project
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {applications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="glass-dark p-6 rounded-2xl hover:bg-white/5 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl border-2 border-white flex items-center justify-center">
                      {getServiceIcon(app.service_type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{app.service_type}</h3>
                      <span className="text-xs text-white bg-white/20 px-2 py-1 rounded-full border border-white/30">
                        Pending Review
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaMapMarkerAlt className="text-white" />
                    <span>{app.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaClock className="text-white" />
                    <span>{app.days} days to complete</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaCalendarAlt className="text-white" />
                    <span>Submitted on {formatDate(app.created_at)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Application ID</span>
                    <span className="text-white font-mono">#{app.id.toString().padStart(4, '0')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Box */}
        {applications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass border-2 border-white/20 p-6 rounded-2xl text-center"
          >
            <p className="text-gray-300">
              <span className="text-white font-semibold">Tip:</span> All applications are 
              currently free! We'll review your submissions and contact you via email at{' '}
              <span className="text-white">{user?.email}</span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
