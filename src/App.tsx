import { motion } from 'framer-motion';
import { FileText, Linkedin, Github, Globe } from 'lucide-react';
import './index.css';
import { Spotlight } from './components/ui/spotlight-new.tsx';
import { ContainerTextFlip } from './components/ui/container-text-flip.tsx';
import { projectList } from './lib/projects.ts';
import { CardSpotlight } from './components/ui/card-spotlight.tsx';
import { SplitText } from './components/ui/split-text.tsx';
import profileImg from '../assets/1744746336984.jpg';
import { TerminalToggle } from './components/TerminalToggle.tsx';
import { TerminalEffect } from './components/TerminalEffect.tsx';
import { InteractiveTerminal } from './components/InteractiveTerminal.tsx';
import { useState } from 'react';


// Animation variants
const containerVariant = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.4,
    },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const projects = projectList

function App() {
  const [isTerminalMode, setIsTerminalMode] = useState(false);

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${isTerminalMode ? 'terminal-mode bg-black text-[#00ff00]' : 'bg-[#0a0a0a] text-white'}`}>
      <TerminalToggle isTerminalMode={isTerminalMode} onToggle={() => setIsTerminalMode(!isTerminalMode)} />
      
      {isTerminalMode && <TerminalEffect />}
      
      {isTerminalMode ? (
        <div className="relative z-10 pt-20">
          <InteractiveTerminal onExit={() => setIsTerminalMode(false)} />
        </div>
      ) : (
        <>
      <Spotlight />


      <div className="max-w-4xl mx-auto px-8 py-8 relative z-10">
        {/* Header Section */}
        <motion.div
          variants={containerVariant}
          initial="hidden"
          animate="show"
          className="mb-1"
        >
          <motion.div variants={fadeUpVariant} className="flex items-start gap-4 mb-6">
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              src={profileImg}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <SplitText
                text="Raghav Seth"
                className="text-2xl font-bold mb-1"
                delay={100}
                duration={0.9}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="left"
              />
              <motion.p className="text-gray-400 mb-3">Varanasi, India</motion.p>
              <motion.a
                href="https://drive.google.com/file/d/151oAoBHSpVQNqTowkGbEjBHu3tWTYkWH/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-gray-600 px-4 py-2 rounded-full text-sm hover:bg-gray-800/50 transition-colors duration-200"
              >
                <FileText size={16} />
                View Resume
              </motion.a>
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="space-y-4 mb-6">
            <div className="text-gray-300 text-base sm:text-lg leading-relaxed">
              A Backend Engineer, deeply passionate about{' '}
              <span className="inline">
                <ContainerTextFlip
                  words={["GenAI", "APIs", "AI-Agents", "Containerization"]}
                  textClassName="text-white"
                  interval={2000}
                  animationDuration={600}
                />
              </span>
            </div>
            <p className="text-gray-400">
              Wrote my first line of code in 2023, recently did an internship at <br />
              <span className="text-white">"The Benares Club Limited"</span>
            </p>

            <div className="flex items-center gap-2 text-gray-400 flex-wrap">
              <span>You can find me on</span>
              <a
                href="https://www.linkedin.com/in/raghav-seth-a49902205"
                className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
              >
                <Linkedin size={16} />
              </a>
              <span className="text-gray-500">and</span>
              <a
                href="https://github.com/Raghav1428"
                className="text-gray-300 hover:text-white inline-flex items-center gap-1"
              >
                <Github size={16} />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Projects Section */}
        <motion.div variants={containerVariant} initial="hidden" animate="show">
          <motion.div variants={fadeUpVariant}>
            <motion.div variants={fadeUpVariant} className="flex items-center mb-8">
              <div className="flex-1 h-px bg-gray-800"></div>
              <h2 className="text-xl font-small px-5 text-white">I've built</h2>
              <div className="flex-1 h-px bg-gray-800"></div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              variants={containerVariant}
              initial="hidden"
              animate="show"
            >
              {projects.map((project, idx) => (
                <motion.div key={idx} variants={fadeUpVariant} className="h-full">
                  <CardSpotlight
                    radius={195}
                    color="transparent"
                    className="rounded-xl border border-gray-700 bg-transparent h-full"
                  >
                    <div className="p-0 flex flex-col justify-between h-full relative z-20">
                      {/* Top: Title + Users */}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-medium text-lg leading-tight max-w-[70%]">
                          {project.name}
                        </h3>
                        {project.users && (
                          <span className="text-gray-400 text-sm whitespace-nowrap ml-2">
                            {project.users}
                          </span>
                        )}
                      </div>

                      {/* Middle: Description */}
                      <p className="text-gray-400 text-sm leading-relaxed mb-3 flex-1">
                        {project.description}
                      </p>

                      {/* Bottom: Buttons */}
                      <div className="flex gap-3 flex-wrap mt-auto">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full backdrop-blur-lg border border-white/10 bg-gradient-to-tr from-black/60 to-black/40 shadow-lg hover:shadow-2xl hover:shadow-white/20 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-white/30 hover:bg-gradient-to-tr hover:from-white/10 hover:to-blue/40 group relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                            <div className="relative z-10">
                              <Globe size={16} className="text-white group-hover:text-white/90 transition-colors duration-300" />
                            </div>
                          </a>
                        )}
                        {project.gitlink && (
                          <a
                            href={project.gitlink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full backdrop-blur-lg border border-gray-500/20 bg-gradient-to-tr from-black/60 to-black/40 shadow-lg hover:shadow-2xl hover:shadow-gray-500/30 hover:scale-110 hover:rotate-2 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-gray-500/50 hover:bg-gradient-to-tr hover:from-gray-500/10 hover:to-black/40 group relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                            <div className="relative z-10">
                              <Github size={16} className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300" />
                            </div>
                          </a>
                        )}
                      </div>
                    </div>
                  </CardSpotlight>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
        </>
      )}
    </div>
  );
}


export default App;
