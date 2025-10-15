import { motion } from 'framer-motion';
import { FaLightbulb, FaCode, FaPalette, FaRocket } from 'react-icons/fa';
import { useScrollAnimation, scrollAnimationVariants } from '../hooks/useScrollAnimation';

const About = () => {
  const [skillsRef, skillsVisible] = useScrollAnimation(0.1);
  const [missionRef, missionVisible] = useScrollAnimation(0.1);
  
  const skills = [
    { icon: FaCode, title: 'Technical Excellence', description: 'Full-stack development with modern frameworks' },
    { icon: FaPalette, title: 'Creative Solutions', description: 'Strategic visual design and brand identity' },
    { icon: FaLightbulb, title: 'Strategic Consulting', description: 'Data-driven project planning and execution' },
    { icon: FaRocket, title: 'Innovation Focus', description: 'Leveraging emerging technologies for competitive advantage' }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Golden Accent */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 border border-golden-glow rounded-full mb-6">
            <span className="text-xs uppercase tracking-widest gradient-text-golden">About</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold mb-6">
            The <span className="gradient-text-golden">Professional</span>
          </h1>
          <div className="w-32 h-px mx-auto divider-golden" />
        </motion.div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Profile Card with Golden Accent */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="border-2 border-golden-glow p-12 sm:p-16 mb-12 relative"
          >
            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                className="w-32 h-32 border-2 border-golden flex items-center justify-center text-5xl font-serif font-bold mb-6 gradient-text-golden"
              >
                K
              </motion.div>
              <h2 className="text-4xl font-serif font-bold mb-2 gradient-text-golden">KAVIN</h2>
              <p className="text-gray-400 text-lg uppercase tracking-widest text-sm">Creative Developer & Designer</p>
            </div>

            <motion.div
              ref={skillsRef}
              initial="hidden"
              animate={skillsVisible ? "visible" : "hidden"}
              variants={scrollAnimationVariants.fadeInUp}
              className="text-center space-y-4"
            >
              <p className="text-gray-300 text-lg leading-relaxed">
                Hi, I'm <span className="text-white font-semibold">Kavin</span> — a passionate creator and developer 
                helping brands, creators, and startups design visuals, build websites, and bring projects to life with 
                modern technology and creativity.
              </p>
              <p className="text-gray-400 leading-relaxed">
                With expertise in video editing, graphic design, web development, and mobile app creation, I transform 
                ideas into stunning digital experiences. Every project is an opportunity to push boundaries and deliver 
                excellence.
              </p>
            </motion.div>
          </motion.div>

          {/* Skills Grid */}
          <motion.div
            initial="hidden"
            animate={skillsVisible ? "visible" : "hidden"}
            variants={scrollAnimationVariants.staggerContainer}
            className="mb-12"
          >
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-12">
              Core <span className="gradient-text">Expertise</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 border border-white/10">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  variants={scrollAnimationVariants.fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="border border-white/10 p-8 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 border-2 border-white/20 flex items-center justify-center flex-shrink-0">
                      <skill.icon className="text-2xl" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">{skill.title}</h4>
                      <p className="text-gray-500 text-sm">{skill.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            ref={missionRef}
            initial="hidden"
            animate={missionVisible ? "visible" : "hidden"}
            variants={scrollAnimationVariants.fadeInUp}
            className="border-2 border-white/10 p-12 sm:p-16 mb-12 text-center"
          >
            <h3 className="text-3xl sm:text-4xl font-serif font-bold mb-6">
              Professional <span className="gradient-text">Commitment</span>
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              To deliver exceptional digital solutions that drive business growth and enhance user engagement. 
              I combine technical expertise with creative vision to create impactful digital experiences that 
              achieve measurable results for my clients.
            </p>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {[
              { title: 'Quality Assurance', description: 'Rigorous testing and attention to detail' },
              { title: 'Innovation', description: 'Cutting-edge solutions and best practices' },
              { title: 'Client Success', description: 'Dedicated support throughout project lifecycle' }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-2xl text-center hover:bg-white/10 transition-colors"
              >
                <h4 className="text-xl font-semibold mb-2">{value.title}</h4>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
