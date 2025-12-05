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
      description: 'Cinematic storytelling through professional editing, color grading, and post-production excellence'
    },
    {
      icon: FaImage,
      title: 'Graphic Design',
      description: 'Strategic visual identity and brand design crafted with meticulous attention to detail'
    },
    {
      icon: FaCode,
      title: 'Web Development',
      description: 'Custom web solutions engineered for performance, scalability, and exceptional user experience'
    },
    {
      icon: FaMobile,
      title: 'Mobile Solutions',
      description: 'Native and cross-platform applications designed for seamless mobile experiences'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Professional Background with Golden Accents */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-30 bg-golden-radial" />
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-20 bg-golden-radial-soft" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Professional Banner with Golden Touch */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 inline-block"
            >
              <div className="px-6 py-2 border border-golden-glow rounded-full backdrop-blur-sm">
                <span className="text-sm font-medium tracking-wider uppercase gradient-text-golden">
                  Premium Digital Services
                </span>
              </div>
            </motion.div>

            <motion.h1
              {...fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 leading-tight"
            >
              Crafting Excellence in{' '}
              <span className="gradient-text-golden">Digital Design</span>
            </motion.h1>

            <motion.p
              {...fadeInUp}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto font-light"
            >
              Elevating brands through sophisticated design, strategic development, 
              and innovative digital solutions
            </motion.p>

            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                to={authHelpers.isAuthenticated() ? "/apply" : "/register"}
                className="group px-10 py-4 bg-white text-black rounded-none font-semibold text-lg hover:bg-transparent hover:text-white border-2 border-white transition-all duration-300 flex items-center gap-3 uppercase tracking-wider glow-golden"
              >
                Start a Project
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="px-10 py-4 bg-transparent text-white border-2 border-golden-glow rounded-none font-semibold text-lg hover:border-white transition-all duration-300 uppercase tracking-wider"
              >
                Explore Services
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Professional Services Section */}
      <section className="py-32 relative bg-white/[0.02]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            ref={servicesRef}
            initial="hidden"
            animate={servicesVisible ? "visible" : "hidden"}
            variants={scrollAnimationVariants.fadeInUp}
            className="text-center mb-20"
          >
            <div className="inline-block px-4 py-1 border border-white/20 rounded-full mb-6">
              <span className="text-xs uppercase tracking-widest text-gray-400">Services</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6">
              Expertise & <span className="gradient-text">Specialization</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
              Premium digital services crafted with precision and delivered with excellence
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 border border-white/10">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={servicesVisible ? "visible" : "hidden"}
                variants={scrollAnimationVariants.fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="group p-12 border border-white/10 hover:bg-white/[0.02] transition-all duration-500 cursor-pointer"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 border-2 border-white/20 flex items-center justify-center group-hover:border-white transition-colors">
                    <service.icon className="text-3xl text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-white transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/20 hover:border-white transition-all duration-300 uppercase tracking-wider text-sm font-semibold"
            >
              View Complete Portfolio
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Professional CTA Section with Golden Accents */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
        {/* Golden ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 bg-golden-radial-medium" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            ref={ctaRef}
            initial="hidden"
            animate={ctaVisible ? "visible" : "hidden"}
            variants={scrollAnimationVariants.fadeInUp}
            className="max-w-5xl mx-auto"
          >
            {/* Elegant Border Frame with Golden Corners */}
            <div className="border-2 border-white/10 p-16 relative glow-golden-strong">
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-golden" />
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-golden" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-golden" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-golden" />
              
              <div className="text-center">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6">
                  Let's Create Something
                  <br />
                  <span className="gradient-text-golden">Extraordinary</span>
                </h2>
                <p className="text-gray-500 text-lg sm:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                  Transform your vision into reality with meticulous craftsmanship 
                  and innovative solutions tailored to your unique needs
                </p>
                <Link
                  to={authHelpers.isAuthenticated() ? "/apply" : "/register"}
                  className="inline-block px-12 py-5 bg-white text-black hover:bg-transparent hover:text-white border-2 border-white transition-all duration-300 uppercase tracking-widest text-sm font-bold glow-golden-strong"
                >
                  Initiate Collaboration
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
