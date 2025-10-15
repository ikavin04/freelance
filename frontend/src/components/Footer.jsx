import { motion } from 'framer-motion';
import { FaInstagram, FaYoutube, FaGithub, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { 
      icon: FaInstagram, 
      href: 'https://instagram.com', 
      label: 'Instagram',
      color: 'hover:text-white'
    },
    { 
      icon: FaYoutube, 
      href: 'https://youtube.com', 
      label: 'YouTube',
      color: 'hover:text-white'
    },
    { 
      icon: FaGithub, 
      href: 'https://github.com', 
      label: 'GitHub',
      color: 'hover:text-white'
    },
  ];

  return (
    <footer className="bg-black border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center space-y-8">
          {/* Logo with Golden Accent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-serif font-bold tracking-tight gradient-text-golden"
          >
            KAVIN
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex space-x-6"
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"

                className={`p-3 border border-white/20 hover:border-white transition-all ${social.color}`}
                aria-label={social.label}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-center max-w-md text-sm sm:text-base"
          >
            Professional Video Editing, Poster Design, Web & App Development.
            Turning your ideas into reality with creativity and modern technology.
          </motion.p>

          {/* Divider */}
          <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-400 text-sm"
          >
            <p className="flex items-center gap-1">
              © 2025 Kavin Creative Hub. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
