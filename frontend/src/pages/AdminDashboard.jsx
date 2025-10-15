import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaCalendarAlt,
  FaEye,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { applicationAPI, authHelpers } from '../services/api';

const AdminDashboard = () => {
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchAllApplications();
  }, []);

  const fetchAllApplications = async () => {
    try {
      const response = await applicationAPI.getAllApplications();
      const apps = response.data.applications || [];
      
      // Add status field to existing applications if not present
      const appsWithStatus = apps.map(app => ({
        ...app,
        status: app.status || 'pending'
      }));
      
      setAllApplications(appsWithStatus);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (serviceType) => {
    const icons = {
      'Video Production': '🎬',
      'Video Editing': '🎬',
      'Poster Design': '🎨',
      'Graphic Design': '🎨',
      'Website Creation': '🌐',
      'Web Development': '🌐',
      'App Development': '📱',
      'Mobile Solutions': '📱'
    };
    return icons[serviceType] || '💼';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-white bg-white/20';
      case 'accepted': return 'text-white bg-white/30';
      case 'completed': return 'text-white bg-white/40';
      case 'rejected': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const updateApplicationStatus = async (appId, newStatus) => {
    try {
      const response = await applicationAPI.updateApplicationStatus(appId, newStatus);
      
      // Update local state
      setAllApplications(prev => 
        prev.map(app => 
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );
      
      // Show success message
      const statusMessage = newStatus === 'accepted' ? 'accepted and client notified' : 
                           newStatus === 'rejected' ? 'rejected and client notified' : 
                           newStatus;
      toast.success(`Application ${statusMessage}!`);
      
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  const stats = {
    total: allApplications.length,
    pending: allApplications.filter(app => app.status === 'pending').length,
    accepted: allApplications.filter(app => app.status === 'accepted').length,
    completed: allApplications.filter(app => app.status === 'completed').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-400">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Simple Header with Golden Accent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold mb-2 gradient-text-golden">My Applications</h1>
          <p className="text-gray-400">Manage client project requests</p>
          <div className="w-24 h-px mt-4 divider-golden" />
        </motion.div>

        {/* Applications List */}
        {allApplications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-dark p-12 rounded-3xl text-center"
          >
            <div className="text-6xl text-gray-600 mx-auto mb-4">📋</div>
            <h3 className="text-2xl font-bold mb-2">No Applications Found</h3>
            <p className="text-gray-400">
              No client applications have been submitted yet
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {allApplications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="glass p-6 rounded-2xl hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Main Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-4xl">{getServiceIcon(app.service_type)}</div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-bold">{app.service_type}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full capitalize ${getStatusColor(app.status || 'pending')}`}>
                          {app.status || 'pending'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <FaEnvelope className="text-white" />
                          <span>{app.user_email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <FaMapMarkerAlt className="text-white" />
                          <span>{app.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <FaClock className="text-white" />
                          <span>{app.days} days</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <FaCalendarAlt className="text-white" />
                          <span>{formatDate(app.created_at)}</span>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-2">
                          <span className="text-gray-400 text-xs">ID: #{app.id.toString().padStart(4, '0')}</span>
                        </div>
                      </div>

                      {app.project_description && (
                        <div className="mt-3">
                          <p className="text-gray-400 text-xs mb-1">Project Description:</p>
                          <p className="text-gray-300 text-sm bg-black/20 p-3 rounded-lg line-clamp-3">
                            {app.project_description}
                          </p>
                        </div>
                      )}

                      {app.reference_images && (
                        <div className="mt-2">
                          <p className="text-gray-400 text-xs mb-1">Reference Images:</p>
                          <p className="text-blue-400 text-sm bg-black/20 p-2 rounded-lg truncate">
                            {app.reference_images}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(app.id, 'accepted')}
                          className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-transparent hover:text-white border-2 border-white rounded-lg text-sm font-medium transition-all"
                        >
                          <FaCheck />
                          Accept
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app.id, 'rejected')}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 border-2 border-gray-600 rounded-lg text-sm font-medium transition-all"
                        >
                          <FaTimes />
                          Reject
                        </button>
                      </>
                    )}
                    
                    {app.status === 'accepted' && (
                      <button
                        onClick={() => updateApplicationStatus(app.id, 'completed')}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-transparent hover:text-white border-2 border-white rounded-lg text-sm font-medium transition-all"
                      >
                        <FaCheck />
                        Mark Complete
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="flex items-center gap-2 px-4 py-2 bg-transparent text-white hover:bg-white hover:text-black border-2 border-white rounded-lg text-sm font-medium transition-all"
                    >
                      <FaEye />
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedApplication(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-dark p-6 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Application Details</h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Service Type</label>
                    <p className="font-semibold">{selectedApplication.service_type}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Status</label>
                    <p className={`font-semibold capitalize ${getStatusColor(selectedApplication.status || 'pending').replace('bg-', 'text-').replace('/20', '')}`}>
                      {selectedApplication.status || 'pending'}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Client Name</label>
                    <p className="font-semibold">{selectedApplication.client_name}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Client Email</label>
                    <p className="font-semibold">{selectedApplication.user_email}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Location</label>
                    <p className="font-semibold">{selectedApplication.city}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Timeline</label>
                    <p className="font-semibold">{selectedApplication.days} days</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-400 text-sm">Submitted</label>
                    <p className="font-semibold">{formatDate(selectedApplication.created_at)}</p>
                  </div>
                </div>

                {selectedApplication.project_description && (
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Project Description</label>
                    <div className="p-4 bg-black/30 rounded-lg max-h-60 overflow-y-auto">
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {selectedApplication.project_description}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Word count: {selectedApplication.project_description.split(/\s+/).filter(w => w.length > 0).length} words
                    </p>
                  </div>
                )}

                {selectedApplication.reference_images && (
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">Reference Images</label>
                    <div className="p-4 bg-black/30 rounded-lg">
                      <p className="text-blue-400 break-all">
                        {selectedApplication.reference_images}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;