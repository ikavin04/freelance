import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaVideo, FaImage, FaCode, FaMobile, FaArrowRight, FaCheck } from 'react-icons/fa';
import { authHelpers } from '../services/api';
import { useScrollAnimation, scrollAnimationVariants } from '../hooks/useScrollAnimation';

const Services = () => {
  const [servicesRef, servicesVisible] = useScrollAnimation(0.1);
  const [processRef, processVisible] = useScrollAnimation(0.1);
  
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
      ]
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
      ]
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
      ]
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
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Golden Accents */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-block px-4 py-1 border border-golden-glow rounded-full mb-6">
            <span className="text-xs uppercase tracking-widest gradient-text-golden">Services</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold mb-8">
            Professional <span className="gradient-text-golden">Services</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Comprehensive digital solutions designed to accelerate your business growth. 
            Professional services tailored to meet your specific objectives and requirements.
          </p>
          <div className="w-32 h-px mx-auto mt-8 divider-golden" />
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
              <div className="p-8 border-b-2 border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                <div className="w-16 h-16 rounded-2xl border-2 border-white flex items-center justify-center mb-4 relative z-10">
                  <service.icon className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-2 relative z-10">{service.title}</h3>
                <p className="text-gray-300 relative z-10">{service.description}</p>
              </div>

              {/* Card Body */}
              <div className="p-8">
                <h4 className="text-lg font-semibold mb-4 text-white">What's Included:</h4>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0 mt-0.5">
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
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 font-serif">
            How It <span className="text-white">Works</span>
          </h2>
          <div className="w-24 h-1 bg-white mx-auto mb-12" />
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
                className="glass border-2 border-white/20 p-6 rounded-2xl text-center relative hover:border-white transition-colors"
              >
                <div className="text-5xl font-bold text-white mb-4 font-serif">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
                {index < 3 && (
                  <FaArrowRight className="hidden lg:block absolute top-1/2 -right-8 text-white text-2xl" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

export default Services;
