import { motion } from 'motion/react';
import { ChevronDown, Sparkles } from 'lucide-react';

export function Hero() {
  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full filter blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-300">Étudiant en Intelligence Artificielle</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="block text-5xl md:text-7xl font-bold text-white mb-4">
            Créateur de
          </span>
          <span className="block text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
            Solutions Intelligentes
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12"
        >
          Transformer les problèmes complexes en systèmes automatisés. 
          Construire l'avenir de l'IA en Afrique, une ligne de code à la fois.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={scrollToAbout}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
          >
            Découvrir mon parcours
          </button>
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
          >
            Voir mes projets
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="cursor-pointer"
            onClick={scrollToAbout}
          >
            <ChevronDown className="w-6 h-6 text-gray-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
