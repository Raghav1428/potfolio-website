import { Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

interface TerminalToggleProps {
  isTerminalMode: boolean;
  onToggle: () => void;
}

export function TerminalToggle({ isTerminalMode, onToggle }: TerminalToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={`fixed top-6 right-6 z-50 p-2 rounded-full border transition-all duration-300 group ${
        isTerminalMode
          ? 'bg-black border-[#00ff00] text-[#00ff00] shadow-[0_0_10px_#00ff00]'
          : 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={isTerminalMode ? "Exit Terminal Mode" : "Enter Terminal Mode"}
    >
      <div className="flex items-center gap-2 px-2">
        <Terminal size={20} />
        <span className={`font-mono text-sm font-bold whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out hidden sm:block opacity-100 max-w-[200px]`}>
          {isTerminalMode ? 'EXIT_TERMINAL' : 'TERMINAL'}
        </span>
      </div>
    </motion.button>
  );
}
