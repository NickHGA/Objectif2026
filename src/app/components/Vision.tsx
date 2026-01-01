import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Lightbulb, Rocket, Globe2, TrendingUp } from 'lucide-react';

export function Vision() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const visionPoints = [
    {
      icon: Lightbulb,
      title: 'Intelligence Artificielle',
      description: 'Maîtriser les technologies IA de pointe et contribuer à leur développement pour résoudre des problèmes complexes du monde réel',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Rocket,
      title: 'Entrepreneuriat Tech',
      description: 'Créer des startups innovantes qui transforment des idées audacieuses en solutions concrètes à fort impact',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: Globe2,
      title: 'Solutions Africaines',
      description: 'Développer des solutions technologiques adaptées au contexte africain, créées en Afrique, pour l\'Afrique et le monde',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: TrendingUp,
      title: 'Innovation Utile',
      description: 'Construire des systèmes intelligents qui améliorent concrètement la vie quotidienne et créent de la valeur réelle',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <section id="vision" className="relative py-32 bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[128px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full filter blur-[128px]" />
      
      <div className="relative max-w-7xl mx-auto px-6" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Vision future
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-violet-500 mx-auto mb-6" />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Construire l'avenir de la tech, une innovation à la fois
          </p>
        </motion.div>

        {/* Main vision statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm">
            <blockquote className="text-2xl md:text-3xl text-white/90 italic mb-6">
              "L'excellence technologique n'a pas de frontières. Mon objectif est de prouver qu'on peut créer 
              des solutions de classe mondiale depuis l'Afrique, tout en formant la prochaine génération 
              d'innovateurs."
            </blockquote>
            <p className="text-gray-400">— Vision personnelle 2025</p>
          </div>
        </motion.div>

        {/* Vision points grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {visionPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index + 0.3 }}
              className="group"
            >
              <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 h-full">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${point.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${point.gradient} bg-opacity-10 mb-6`}>
                    <point.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4">{point.title}</h3>
                  <p className="text-gray-400">{point.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline/Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-12">Feuille de route</h3>
          
          <div className="space-y-6">
            {[
              { period: 'Court terme (2025)', goals: 'Approfondir mes compétences en ML/Deep Learning, multiplier les projets IA concrets' },
              { period: 'Moyen terme (2026-2027)', goals: 'Lancement de ma première startup tech, contribuer à des projets open source majeurs' },
              { period: 'Long terme (2028+)', goals: 'Leader dans l\'écosystème IA africain, mentor pour la nouvelle génération' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9 + 0.1 * index }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  {index < 2 && <div className="w-0.5 h-full bg-gradient-to-b from-blue-500/50 to-transparent mt-2" />}
                </div>
                <div className="flex-1 pb-8">
                  <h4 className="font-bold text-white mb-2">{item.period}</h4>
                  <p className="text-gray-400">{item.goals}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
