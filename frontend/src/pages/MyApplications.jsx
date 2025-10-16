import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaClipboardList, FaCalendarAlt, FaMapMarkerAlt, FaBriefcase, FaClock, FaPlus, FaVideo, FaPalette, FaGlobe, FaMobileAlt, FaDownload, FaFileVideo, FaFileImage, FaFileArchive, FaGithub, FaRocket, FaCheck, FaTimes, FaHourglassHalf, FaEye } from 'react-icons/fa';
import { applicationAPI, authHelpers } from '../services/api';
import { useNavigate } from 'react-router-dom';

const MyApplications = () => {
  const navigate = useNavigate();
  const user = authHelpers.getUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationAPI.getApplications();
      console.log('Applications fetched:', response.data.applications);
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
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

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        icon: FaHourglassHalf,
        text: 'Pending Review',
        className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      },
      accepted: {
        icon: FaCheck,
        text: 'Accepted - In Progress',
        className: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      },
      completed: {
        icon: FaCheck,
        text: 'Completed & Delivered',
        className: 'bg-green-500/20 text-green-400 border-green-500/30'
      },
      rejected: {
        icon: FaTimes,
        text: 'Rejected',
        className: 'bg-red-500/20 text-red-400 border-red-500/30'
      }
    };
    
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1 ${badge.className}`}>
        <Icon className="text-xs" />
        {badge.text}
      </span>
    );
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
        {/* Header with Golden Accent */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-serif gradient-text-golden">
            My <span className="gradient-text-golden">Applications</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Track all your project submissions in one place
          </p>
          <div className="w-32 h-px mx-auto mt-6 divider-golden" />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6"
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
                <FaClock className="text-2xl text-yellow-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">
                  {applications.filter(a => a.status === 'pending').length}
                </div>
                <div className="text-gray-400 text-sm">Pending</div>
              </div>
            </div>
          </div>

          <div className="glass border-2 border-white/20 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl border-2 border-white flex items-center justify-center">
                <FaCheck className="text-2xl text-green-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">
                  {applications.filter(a => a.status === 'completed').length}
                </div>
                <div className="text-gray-400 text-sm">Completed</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="glass border-2 border-white/20 p-6 rounded-2xl">
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
                      {getStatusBadge(app.status || 'pending')}
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
                  
                  {app.project_description && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-gray-400 text-xs mb-1">Project Description:</p>
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {app.project_description}
                      </p>
                    </div>
                  )}
                  
                  {app.reference_images && (
                    <div className="mt-2">
                      <p className="text-gray-400 text-xs mb-1">Reference Images Provided</p>
                      <p className="text-blue-400 text-xs truncate">
                        {app.reference_images}
                      </p>
                    </div>
                  )}
                </div>

                {/* Delivery Indicator */}
                {app.status === 'completed' && app.delivered_at && (
                  <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaCheck className="text-green-400" />
                        <span className="text-sm font-semibold text-green-400">Product Delivered</span>
                      </div>
                      <button
                        onClick={() => {
                          console.log('Opening delivery modal for app:', app);
                          setExpandedApp(app);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all"
                      >
                        <FaEye /> View Details
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Delivered on {formatDate(app.delivered_at)}
                    </div>
                  </div>
                )}

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
            className="glass border-2 border-white/20 p-6 rounded-2xl text-center mt-8"
          >
            <p className="text-gray-300">
              <span className="text-white font-semibold">Tip:</span> All applications are 
              currently free! We'll review your submissions and contact you via email at{' '}
              <span className="text-white">{user?.email}</span>
            </p>
          </motion.div>
        )}

        {/* Delivery Details Modal */}
        <AnimatePresence>
          {expandedApp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto"
              onClick={() => setExpandedApp(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-dark p-6 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {console.log('Modal rendering with expandedApp:', {
                  delivery_file_url: expandedApp.delivery_file_url,
                  delivery_apk_url: expandedApp.delivery_apk_url,
                  delivery_github_url: expandedApp.delivery_github_url,
                  delivery_deployed_url: expandedApp.delivery_deployed_url,
                  delivery_notes: expandedApp.delivery_notes,
                  delivered_at: expandedApp.delivered_at
                })}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <FaCheck className="text-green-400" /> Final Product Delivered
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {expandedApp.service_type} - Delivered on {formatDate(expandedApp.delivered_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedApp(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                <div className="space-y-3">
                  {expandedApp.delivery_file_url && (
                    <a
                      href={expandedApp.delivery_file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl transition-all group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                        <FaFileVideo className="text-xl text-blue-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white">Download File</div>
                        <div className="text-xs text-gray-400 truncate">{expandedApp.delivery_file_url}</div>
                      </div>
                      <FaDownload className="text-white text-xl group-hover:translate-y-1 transition-transform flex-shrink-0" />
                    </a>
                  )}
                  
                  {expandedApp.delivery_apk_url && (
                    <a
                      href={expandedApp.delivery_apk_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl transition-all group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                        <FaFileArchive className="text-xl text-purple-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white">Download APK</div>
                        <div className="text-xs text-gray-400 truncate">{expandedApp.delivery_apk_url}</div>
                      </div>
                      <FaDownload className="text-white text-xl group-hover:translate-y-1 transition-transform flex-shrink-0" />
                    </a>
                  )}
                  
                  {expandedApp.delivery_github_url && (
                    <a
                      href={expandedApp.delivery_github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl transition-all group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gray-500/20 border border-gray-500/30 flex items-center justify-center flex-shrink-0">
                        <FaGithub className="text-xl text-gray-300 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white">View on GitHub</div>
                        <div className="text-xs text-gray-400 truncate">{expandedApp.delivery_github_url}</div>
                      </div>
                      <FaRocket className="text-white text-xl group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </a>
                  )}
                  
                  {expandedApp.delivery_deployed_url && (
                    <a
                      href={expandedApp.delivery_deployed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl transition-all group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                        <FaRocket className="text-xl text-cyan-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white">Visit Live Website</div>
                        <div className="text-xs text-gray-400 truncate">{expandedApp.delivery_deployed_url}</div>
                      </div>
                      <FaGlobe className="text-white text-xl group-hover:rotate-12 transition-transform flex-shrink-0" />
                    </a>
                  )}
                  
                  {expandedApp.delivery_notes && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-lg">📝</div>
                        <div className="text-sm font-semibold text-yellow-400">Special Notes from Admin:</div>
                      </div>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {expandedApp.delivery_notes}
                      </p>
                    </div>
                  )}

                  {!expandedApp.delivery_file_url && 
                   !expandedApp.delivery_apk_url && 
                   !expandedApp.delivery_github_url && 
                   !expandedApp.delivery_deployed_url && (
                    <div className="text-center p-8 text-gray-400">
                      <FaCheck className="text-4xl text-green-400 mx-auto mb-3" />
                      <p>No downloadable files. Check your email for delivery details.</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setExpandedApp(null)}
                    className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyApplications;
