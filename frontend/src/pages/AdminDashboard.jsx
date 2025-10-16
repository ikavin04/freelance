import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaCalendarAlt,
  FaEye,
  FaCheck,
  FaTimes,
  FaVideo,
  FaPalette,
  FaGlobe,
  FaMobileAlt,
  FaBriefcase,
  FaUpload,
  FaFileVideo,
  FaFileImage,
  FaFilePdf,
  FaFileArchive,
  FaGithub,
  FaRocket,
  FaTruck
} from 'react-icons/fa';
import { applicationAPI } from '../services/api';

const AdminDashboard = () => {
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(null);
  const [deliveryData, setDeliveryData] = useState({
    delivery_file_url: '',
    delivery_apk_url: '',
    delivery_github_url: '',
    delivery_deployed_url: '',
    delivery_notes: ''
  });
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchAllApplications();
  }, []);

  const fetchAllApplications = async () => {
    try {
      const response = await applicationAPI.getAllApplications();
      const apps = response.data.applications || [];
      
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
    const iconMap = {
      'Video Production': FaVideo,
      'Video Editing': FaVideo,
      'Poster Design': FaPalette,
      'Graphic Design': FaPalette,
      'Website Creation': FaGlobe,
      'Web Development': FaGlobe,
      'App Development': FaMobileAlt,
      'Mobile Solutions': FaMobileAlt
    };
    const Icon = iconMap[serviceType] || FaBriefcase;
    return <Icon className="text-3xl text-white" />;
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
      case 'accepted': return 'text-blue-400 bg-blue-400/20';
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const updateApplicationStatus = async (appId, newStatus) => {
    try {
      await applicationAPI.updateApplicationStatus(appId, newStatus);
      
      setAllApplications(prev => 
        prev.map(app => 
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );
      
      const statusMessage = newStatus === 'accepted' ? 'accepted and client notified' : 
                           newStatus === 'rejected' ? 'rejected and client notified' : 
                           newStatus;
      toast.success(`Application ${statusMessage}!`);
      
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  const openDeliveryModal = (app) => {
    setShowDeliveryModal(app);
    setDeliveryData({
      delivery_file_url: app.delivery_file_url || '',
      delivery_apk_url: app.delivery_apk_url || '',
      delivery_github_url: app.delivery_github_url || '',
      delivery_deployed_url: app.delivery_deployed_url || '',
      delivery_notes: app.delivery_notes || ''
    });
    setUploadedFile(null);
    setUploadProgress(0);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadProgress(0);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate upload progress (you'll need to implement actual upload to your server/cloud storage)
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // TODO: Replace this with your actual file upload endpoint
      // Example: const response = await fetch('/api/upload', { method: 'POST', body: formData });
      
      // For now, create a local URL (this should be replaced with actual cloud storage URL)
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload delay
      
      clearInterval(uploadInterval);
      setUploadProgress(100);
      
      // Store file info
      setUploadedFile(file);
      
      // In production, you would get the URL from your upload response
      // For now, show a placeholder message
      toast.info(`File "${file.name}" ready. Please upload to Google Drive and paste the link, or implement server upload.`);
      
      setTimeout(() => setUploadProgress(0), 1500);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      setUploadProgress(0);
    }
  };

  const handleDeliverySubmit = async (e) => {
    e.preventDefault();
    setDeliveryLoading(true);

    try {
      await applicationAPI.deliverFinalProduct(showDeliveryModal.id, deliveryData);
      
      setAllApplications(prev =>
        prev.map(app =>
          app.id === showDeliveryModal.id
            ? { ...app, ...deliveryData, status: 'completed', delivered_at: new Date().toISOString() }
            : app
        )
      );

      toast.success('🎉 Final product delivered and client notified!');
      setShowDeliveryModal(null);
      setDeliveryData({
        delivery_file_url: '',
        delivery_apk_url: '',
        delivery_github_url: '',
        delivery_deployed_url: '',
        delivery_notes: ''
      });
      setUploadedFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error delivering product:', error);
      toast.error('Failed to deliver product');
    } finally {
      setDeliveryLoading(false);
    }
  };

  const getDeliveryFields = (serviceType) => {
    switch(serviceType) {
      case 'Video Editing':
      case 'Video Production':
        return {
          title: 'Video Delivery',
          icon: FaFileVideo,
          fields: [
            { key: 'delivery_file_url', label: 'Video File URL', placeholder: 'https://drive.google.com/file/d/...', icon: FaFileVideo, accept: '.mp4, .mov, .avi, .mkv' },
          ]
        };
      
      case 'Poster Design':
      case 'Graphic Design':
        return {
          title: 'Design Delivery',
          icon: FaFileImage,
          fields: [
            { key: 'delivery_file_url', label: 'Design Files URL', placeholder: 'https://drive.google.com/file/d/... (PNG, JPG, PDF)', icon: FaFileImage, accept: '.png, .jpg, .jpeg, .pdf, .psd, .ai' },
          ]
        };
      
      case 'App Development':
      case 'Mobile Solutions':
        return {
          title: 'App Delivery',
          icon: FaMobileAlt,
          fields: [
            { key: 'delivery_apk_url', label: 'APK File URL', placeholder: 'https://drive.google.com/file/d/...', icon: FaFileArchive, accept: '.apk' },
            { key: 'delivery_github_url', label: 'GitHub Repository', placeholder: 'https://github.com/username/repo', icon: FaGithub },
          ]
        };
      
      case 'Website Creation':
      case 'Web Development':
        return {
          title: 'Website Delivery',
          icon: FaGlobe,
          fields: [
            { key: 'delivery_deployed_url', label: 'Deployed Website URL', placeholder: 'https://yourwebsite.com', icon: FaRocket },
            { key: 'delivery_github_url', label: 'GitHub Repository', placeholder: 'https://github.com/username/repo', icon: FaGithub },
            { key: 'delivery_file_url', label: 'Source Files (Optional)', placeholder: 'https://drive.google.com/file/d/...', icon: FaFileArchive, accept: '.zip' },
          ]
        };
      
      default:
        return {
          title: 'File Delivery',
          icon: FaUpload,
          fields: [
            { key: 'delivery_file_url', label: 'File URL', placeholder: 'https://drive.google.com/file/d/...', icon: FaUpload },
          ]
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 gradient-text-golden">Admin Dashboard</h1>
          <p className="text-gray-400">Manage client project requests and deliveries</p>
          <div className="w-24 h-px mt-4 divider-golden" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass p-4 rounded-xl text-center"
          >
            <div className="text-2xl font-bold text-white">{allApplications.length}</div>
            <div className="text-gray-400 text-sm">Total</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass p-4 rounded-xl text-center"
          >
            <div className="text-2xl font-bold text-yellow-400">{allApplications.filter(a => a.status === 'pending').length}</div>
            <div className="text-gray-400 text-sm">Pending</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass p-4 rounded-xl text-center"
          >
            <div className="text-2xl font-bold text-blue-400">{allApplications.filter(a => a.status === 'accepted').length}</div>
            <div className="text-gray-400 text-sm">Accepted</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass p-4 rounded-xl text-center"
          >
            <div className="text-2xl font-bold text-green-400">{allApplications.filter(a => a.status === 'completed').length}</div>
            <div className="text-gray-400 text-sm">Completed</div>
          </motion.div>
        </div>

        {allApplications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-dark p-12 rounded-3xl text-center"
          >
            <div className="text-6xl text-gray-600 mx-auto mb-4 flex justify-center">
              <FaBriefcase />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Applications Found</h3>
            <p className="text-gray-400">No client applications have been submitted yet</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {allApplications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass p-6 rounded-2xl hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl border-2 border-white/30 flex items-center justify-center bg-white/5 flex-shrink-0">
                        {getServiceIcon(app.service_type)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{app.service_type}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full capitalize inline-block mt-1 ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'accepted')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-medium transition-all"
                          >
                            <FaCheck /> Accept
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'rejected')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-all"
                          >
                            <FaTimes /> Reject
                          </button>
                        </>
                      )}
                      
                      {app.status === 'accepted' && (
                        <button
                          onClick={() => openDeliveryModal(app)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg text-sm font-medium transition-all"
                        >
                          <FaTruck /> Deliver Product
                        </button>
                      )}

                      {app.status === 'completed' && app.delivered_at && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm font-medium">
                          <FaCheck /> Delivered
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="flex items-center gap-2 px-4 py-2 bg-transparent text-white hover:bg-white hover:text-black border-2 border-white rounded-lg text-sm font-medium transition-all"
                      >
                        <FaEye /> View
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaEnvelope className="text-white" />
                      <span className="truncate">{app.user_email}</span>
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
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {showDeliveryModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto"
              onClick={() => setShowDeliveryModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-dark p-6 rounded-2xl max-w-2xl w-full my-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FaTruck className="text-2xl text-purple-400" />
                    <div>
                      <h3 className="text-2xl font-bold">Deliver Final Product</h3>
                      <p className="text-gray-400 text-sm">{showDeliveryModal.service_type} - {showDeliveryModal.client_name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeliveryModal(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleDeliverySubmit} className="space-y-4">
                  {(() => {
                    const config = getDeliveryFields(showDeliveryModal.service_type);
                    const FieldIcon = config.icon;
                    
                    return (
                      <>
                        <div className="flex items-center gap-2 mb-4 text-purple-400">
                          <FieldIcon className="text-xl" />
                          <h4 className="font-semibold">{config.title}</h4>
                        </div>

                        {config.fields.map((field) => {
                          const Icon = field.icon;
                          const isFileUploadField = (showDeliveryModal.service_type === 'Video Editing' || 
                                                     showDeliveryModal.service_type === 'Video Production' ||
                                                     showDeliveryModal.service_type === 'Poster Design' ||
                                                     showDeliveryModal.service_type === 'Graphic Design') && 
                                                    field.key === 'delivery_file_url';
                          
                          return (
                            <div key={field.key}>
                              <label className="block text-sm font-medium mb-2 text-gray-300">
                                <Icon className="inline mr-2" />
                                {field.label}
                                {field.accept && <span className="text-xs text-gray-500 ml-2">({field.accept})</span>}
                              </label>
                              
                              {isFileUploadField ? (
                                <div className="space-y-3">
                                  <div className="flex gap-2">
                                    <input
                                      type="url"
                                      value={deliveryData[field.key]}
                                      onChange={(e) => setDeliveryData({ ...deliveryData, [field.key]: e.target.value })}
                                      className="flex-1 px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
                                      placeholder={field.placeholder}
                                    />
                                    <label className="relative cursor-pointer">
                                      <input
                                        type="file"
                                        accept={field.accept}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                      />
                                      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-medium transition-all whitespace-nowrap">
                                        <FaUpload /> Upload
                                      </div>
                                    </label>
                                  </div>
                                  
                                  {uploadProgress > 0 && uploadProgress < 100 && (
                                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                      <div 
                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                      />
                                    </div>
                                  )}
                                  
                                  {uploadedFile && (
                                    <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                      <FaCheck className="text-green-400" />
                                      <span className="text-sm text-green-300">
                                        {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <input
                                  type="url"
                                  value={deliveryData[field.key]}
                                  onChange={(e) => setDeliveryData({ ...deliveryData, [field.key]: e.target.value })}
                                  className="w-full px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
                                  placeholder={field.placeholder}
                                />
                              )}
                            </div>
                          );
                        })}
                      </>
                    );
                  })()}

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      📝 Delivery Notes (Optional)
                    </label>
                    <textarea
                      value={deliveryData.delivery_notes}
                      onChange={(e) => setDeliveryData({ ...deliveryData, delivery_notes: e.target.value })}
                      className="w-full px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-purple-500 transition-all min-h-[100px]"
                      placeholder="Add any instructions, passwords, or important notes for the client..."
                    />
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-sm text-blue-300">
                      💡 <strong>Tip:</strong> You can upload files directly from your device or paste a Google Drive/Dropbox link. 
                      The client will receive an email with all delivery links.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowDeliveryModal(null)}
                      className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={deliveryLoading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deliveryLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Delivering...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <FaTruck /> Deliver & Notify Client
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedApplication && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto"
              onClick={() => setSelectedApplication(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-dark p-6 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8"
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

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm">Service Type</label>
                      <p className="font-semibold">{selectedApplication.service_type}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Status</label>
                      <p className="font-semibold capitalize">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedApplication.status)}`}>
                          {selectedApplication.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Client Name</label>
                      <p className="font-semibold">{selectedApplication.client_name}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Email</label>
                      <p className="font-semibold text-sm">{selectedApplication.user_email}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Location</label>
                      <p className="font-semibold">{selectedApplication.city}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Timeline</label>
                      <p className="font-semibold">{selectedApplication.days} days</p>
                    </div>
                  </div>

                  {selectedApplication.project_description && (
                    <div>
                      <label className="text-gray-400 text-sm block mb-2">Project Description</label>
                      <div className="p-4 bg-black/30 rounded-lg max-h-60 overflow-y-auto">
                        <p className="whitespace-pre-wrap leading-relaxed text-sm">
                          {selectedApplication.project_description}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedApplication.reference_images && (
                    <div>
                      <label className="text-gray-400 text-sm block mb-2">Reference Images</label>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <a 
                          href={selectedApplication.reference_images} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 hover:underline break-all text-sm"
                        >
                          {selectedApplication.reference_images}
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedApplication.status === 'completed' && selectedApplication.delivered_at && (
                    <div className="border-t border-white/10 pt-6">
                      <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-400">
                        <FaCheck /> Delivery Information
                      </h4>
                      
                      <div className="space-y-3">
                        {selectedApplication.delivery_file_url && (
                          <div>
                            <label className="text-gray-400 text-sm">File URL</label>
                            <a href={selectedApplication.delivery_file_url} target="_blank" rel="noopener noreferrer" 
                               className="block text-blue-400 hover:underline break-all text-sm">
                              {selectedApplication.delivery_file_url}
                            </a>
                          </div>
                        )}
                        
                        {selectedApplication.delivery_apk_url && (
                          <div>
                            <label className="text-gray-400 text-sm">APK File</label>
                            <a href={selectedApplication.delivery_apk_url} target="_blank" rel="noopener noreferrer"
                               className="block text-blue-400 hover:underline break-all text-sm">
                              {selectedApplication.delivery_apk_url}
                            </a>
                          </div>
                        )}
                        
                        {selectedApplication.delivery_github_url && (
                          <div>
                            <label className="text-gray-400 text-sm">GitHub Repository</label>
                            <a href={selectedApplication.delivery_github_url} target="_blank" rel="noopener noreferrer"
                               className="block text-blue-400 hover:underline break-all text-sm">
                              {selectedApplication.delivery_github_url}
                            </a>
                          </div>
                        )}
                        
                        {selectedApplication.delivery_deployed_url && (
                          <div>
                            <label className="text-gray-400 text-sm">Deployed Website</label>
                            <a href={selectedApplication.delivery_deployed_url} target="_blank" rel="noopener noreferrer"
                               className="block text-blue-400 hover:underline break-all text-sm">
                              {selectedApplication.delivery_deployed_url}
                            </a>
                          </div>
                        )}
                        
                        {selectedApplication.delivery_notes && (
                          <div>
                            <label className="text-gray-400 text-sm block mb-2">Delivery Notes</label>
                            <div className="p-3 bg-yellow-500/10 rounded-lg">
                              <p className="text-sm whitespace-pre-wrap">{selectedApplication.delivery_notes}</p>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <label className="text-gray-400 text-sm">Delivered At</label>
                          <p className="font-semibold text-sm">{formatDate(selectedApplication.delivered_at)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;