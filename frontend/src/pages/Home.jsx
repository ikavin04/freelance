import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaRocket, FaVideo, FaImage, FaCode, FaMobile, FaArrowRight } from 'react-icons/fa';
import { authHelpers } from '../services/api';
import { useScrollAnimation, scrollAnimationVariants } from '../hooks/useScrollAnimation';

const Home = () => {
  const [servicesRef, servicesVisible] = useScrollAnimation(0.1);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);
  
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const services = [
    {
      icon: FaVideo,
      title: 'Video Production',
      description: 'Professional video editing and post-production services',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: FaImage,
      title: 'Graphic Design',
      description: 'Strategic visual design solutions for your brand',
      color: 'from-purple-500 to-blue-500'
    },
    {
      icon: FaCode,
      title: 'Web Development',
      description: 'Custom websites optimized for performance and user experience',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaMobile,
      title: 'Mobile Solutions',
      description: 'Native and cross-platform mobile applications',
      color: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-600/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <FaRocket className="text-6xl sm:text-7xl mx-auto text-primary-400" />
            </motion.div>

            <motion.h1
              {...fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              Bringing Your Vision to{' '}
              <span className="gradient-text">Life</span>
            </motion.h1>

            <motion.p
              {...fadeInUp}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
            >
              Expert Digital Solutions for Modern Businesses & Creators
            </motion.p>

            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to={authHelpers.isAuthenticated() ? "/apply" : "/register"}
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Get Started
                <FaArrowRight />
              </Link>
              <Link
                to="/services"
                className="px-8 py-4 glass rounded-full font-semibold text-lg hover:bg-white/20 transition-colors"
              >
                View Services
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
            >
              {[
                { number: '100+', label: 'Projects' },
                { number: '50+', label: 'Happy Clients' },
                { number: '4+', label: 'Services' },
                { number: '24/7', label: 'Support' }
              ].map((stat, index) => (
                <div key={index} className="glass p-6 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm sm:text-base">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>


      </section>

      {/* Services Preview Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={servicesRef}
            initial="hidden"
            animate={servicesVisible ? "visible" : "hidden"}
            variants={scrollAnimationVariants.fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              What I <span className="gradient-text">Offer</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive digital solutions tailored to elevate your business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={servicesVisible ? "visible" : "hidden"}
                variants={scrollAnimationVariants.fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}>
                  <service.icon className="text-3xl text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full hover:bg-white/20 transition-colors"
            >
              View All Services
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ctaRef}
            initial="hidden"
            animate={ctaVisible ? "visible" : "hidden"}
            variants={scrollAnimationVariants.fadeInUp}
            className="glass-dark p-8 sm:p-12 rounded-3xl text-center max-w-4xl mx-auto relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-accent-600/20 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Partner with us to transform your ideas into exceptional digital experiences
              </p>
              <Link
                to={authHelpers.isAuthenticated() ? "/apply" : "/register"}
                className="inline-block px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Start Your Project
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
