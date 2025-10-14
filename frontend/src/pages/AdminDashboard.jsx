import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FaUsers, 
  FaClipboardList, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock, 
  FaCalendarAlt,
  FaEye,
  FaCheck,
  FaTimes,
  FaFilter,
  FaSearch
} from 'react-icons/fa';
import { applicationAPI, authHelpers } from '../services/api';

const AdminDashboard = () => {
  const [allApplications, setAllApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [allApplications, filterStatus, searchTerm]);

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

  const filterApplications = () => {
    let filtered = allApplications;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
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
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'in-progress': return 'text-blue-400 bg-blue-400/20';
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const updateApplicationStatus = (appId, newStatus) => {
    setAllApplications(prev => 
      prev.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      )
    );
    toast.success(`Application ${newStatus === 'in-progress' ? 'accepted' : newStatus}`);
  };

  const stats = {
    total: allApplications.length,
    pending: allApplications.filter(app => app.status === 'pending').length,
    inProgress: allApplications.filter(app => app.status === 'in-progress').length,
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Manage all client project requests and applications
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                <FaClipboardList className="text-2xl" />
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-gray-400 text-sm">Total Applications</div>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-600 to-orange-600 flex items-center justify-center">
                <FaClock className="text-2xl" />
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
                <div className="text-gray-400 text-sm">Pending Review</div>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <FaUsers className="text-2xl" />
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">{stats.inProgress}</div>
                <div className="text-gray-400 text-sm">In Progress</div>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center">
                <FaCheck className="text-2xl" />
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
                <div className="text-gray-400 text-sm">Completed</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-2xl mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-primary-400 transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-primary-400 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-dark p-12 rounded-3xl text-center"
          >
            <FaClipboardList className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Applications Found</h3>
            <p className="text-gray-400">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No client applications have been submitted yet'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app, index) => (
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
                          <FaEnvelope className="text-primary-400" />
                          <span>{app.user_email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <FaMapMarkerAlt className="text-accent-400" />
                          <span>{app.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <FaClock className="text-green-400" />
                          <span>{app.days} days</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <FaCalendarAlt className="text-blue-400" />
                          <span>{formatDate(app.created_at)}</span>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-2">
                          <span className="text-gray-400 text-xs">ID: #{app.id.toString().padStart(4, '0')}</span>
                        </div>
                      </div>

                      {app.description && (
                        <p className="text-gray-300 text-sm bg-black/20 p-3 rounded-lg">
                          "{app.description}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(app.id, 'in-progress')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          <FaCheck />
                          Accept
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app.id, 'cancelled')}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          <FaTimes />
                          Decline
                        </button>
                      </>
                    )}
                    
                    {app.status === 'in-progress' && (
                      <button
                        onClick={() => updateApplicationStatus(app.id, 'completed')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        <FaCheck />
                        Complete
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <FaEye />
                      View
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
                  <div>
                    <label className="text-gray-400 text-sm">Submitted</label>
                    <p className="font-semibold">{formatDate(selectedApplication.created_at)}</p>
                  </div>
                </div>

                {selectedApplication.description && (
                  <div>
                    <label className="text-gray-400 text-sm">Project Description</label>
                    <p className="mt-2 p-4 bg-black/30 rounded-lg">
                      {selectedApplication.description}
                    </p>
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