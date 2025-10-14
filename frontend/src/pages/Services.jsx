import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaVideo, FaImage, FaCode, FaMobile, FaArrowRight, FaCheck } from 'react-icons/fa';
import { authHelpers } from '../services/api';
import { useScrollAnimation, scrollAnimationVariants } from '../hooks/useScrollAnimation';

const Services = () => {
  const [servicesRef, servicesVisible] = useScrollAnimation(0.1);
  const [processRef, processVisible] = useScrollAnimation(0.1);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);
  
  const services = [
    {
      icon: FaVideo,
      title: 'Video Production',
      description: 'Professional video editing and post-production services to create compelling visual narratives for your brand.',
      features: [
        'Advanced editing and post-production',
        'Color grading and correction',
        'Professional audio enhancement',
        'Motion graphics integration',
        'Multi-platform optimization'
      ],
      gradient: 'from-blue-500 via-blue-600 to-cyan-500',
      bgGradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      icon: FaImage,
      title: 'Graphic Design',
      description: 'Strategic visual design solutions that strengthen your brand identity and enhance market presence.',
      features: [
        'Brand identity development',
        'Marketing collateral design',
        'Digital asset creation',
        'Print and web optimization',
        'Brand guideline documentation'
      ],
      gradient: 'from-cyan-500 via-blue-500 to-blue-600',
      bgGradient: 'from-cyan-500/20 to-blue-500/20'
    },
    {
      icon: FaCode,
      title: 'Web Development',
      description: 'Custom web applications built with modern frameworks, optimized for performance and user experience.',
      features: [
        'Responsive web applications',
        'Search engine optimization',
        'Performance optimization',
        'Custom backend solutions',
        'Content management integration'
      ],
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      bgGradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      icon: FaMobile,
      title: 'Mobile Solutions',
      description: 'Native and cross-platform mobile applications designed for optimal user engagement and business growth.',
      features: [
        'Cross-platform compatibility',
        'User-centered design approach',
        'API integration and development',
        'Real-time features and notifications',
        'App store optimization and deployment'
      ],
      gradient: 'from-green-500 via-teal-500 to-blue-500',
      bgGradient: 'from-green-500/20 to-teal-500/20'
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            My <span className="gradient-text">Services</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto">
            Comprehensive digital solutions designed to accelerate your business growth. 
            Professional services tailored to meet your specific objectives and requirements.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-accent-400 mx-auto rounded-full mt-6" />
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          ref={servicesRef}
          initial="hidden"
          animate={servicesVisible ? "visible" : "hidden"}
          variants={scrollAnimationVariants.staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={scrollAnimationVariants.fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="glass-dark rounded-3xl overflow-hidden hover:bg-white/5 transition-colors group"
            >
              {/* Card Header */}
              <div className={`p-8 bg-gradient-to-br ${service.bgGradient} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 relative z-10`}>
                  <service.icon className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-2 relative z-10">{service.title}</h3>
                <p className="text-gray-300 relative z-10">{service.description}</p>
              </div>

              {/* Card Body */}
              <div className="p-8">
                <h4 className="text-lg font-semibold mb-4 text-primary-400">What's Included:</h4>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <FaCheck className="text-xs text-white" />
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Process Section */}
        <motion.div
          ref={processRef}
          initial="hidden"
          animate={processVisible ? "visible" : "hidden"}
          variants={scrollAnimationVariants.fadeInUp}
          className="mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            How It <span className="gradient-text">Works</span>
          </h2>
          <motion.div 
            initial="hidden"
            animate={processVisible ? "visible" : "hidden"}
            variants={scrollAnimationVariants.staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { step: '01', title: 'Consultation', description: 'Analyze your requirements and objectives' },
              { step: '02', title: 'Strategy', description: 'Develop comprehensive project roadmap' },
              { step: '03', title: 'Implementation', description: 'Execute with precision and quality' },
              { step: '04', title: 'Delivery', description: 'Deploy and provide ongoing support' }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={scrollAnimationVariants.fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-2xl text-center relative hover:bg-white/10 transition-colors"
              >
                <div className="text-5xl font-bold gradient-text mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
                {index < 3 && (
                  <FaArrowRight className="hidden lg:block absolute top-1/2 -right-8 text-primary-400 text-2xl" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          ref={ctaRef}
          initial="hidden"
          animate={ctaVisible ? "visible" : "hidden"}
          variants={scrollAnimationVariants.fadeInUp}
          className="glass-dark p-8 sm:p-12 rounded-3xl text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-accent-600/20 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Submit your project proposal today. Initial consultation and project assessment are complimentary. 
              Professional delivery timeline starts at 3 business days.
            </p>
            <Link
              to={authHelpers.isAuthenticated() ? "/apply" : "/register"}
              className="inline-block px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Request Consultation
            </Link>
            <p className="text-gray-400 text-sm mt-4">
              Flexible payment options available. Professional project delivery guaranteed.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
