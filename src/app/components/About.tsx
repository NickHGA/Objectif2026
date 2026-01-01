import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { GraduationCap, Target, Zap } from 'lucide-react';

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const highlights = [
    {
      icon: GraduationCap,
      title: 'Formation d\'excellence',
      description: 'IFRI – Université d\'Abomey-Calavi, spécialisation Intelligence Artificielle',
    },
    {
      icon: Zap,
      title: 'Apprentissage rapide',
      description: 'Capacité à maîtriser rapidement de nouvelles technologies et à les appliquer sur des projets concrets',
    },
    {
      icon: Target,
      title: 'Orientation impact',
      description: 'Développement de solutions qui résolvent de vrais problèmes, pas juste de la théorie',
    },
  ];

  return (
    <section id="about" className="relative py-32 bg-gradient-to-b from-black to-gray-950 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <div className="relative max-w-7xl mx-auto px-6" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            À propos
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-violet-500 mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Left: Main description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-white mb-6">
              Ingénieur IA en devenir,<br />
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Créateur dès aujourd'hui
              </span>
            </h3>
            <div className="space-y-4 text-gray-300">
              <p>
                Étudiant en Intelligence Artificielle à l'Institut de Recherche et de Formation en Informatique (IFRI), 
                je ne me contente pas d'apprendre — je construis.
              </p>
              <p>
                Chaque projet que je développe est une opportunité d'explorer comment l'IA et l'automatisation 
                peuvent résoudre des problèmes réels. De la gestion de présence intelligente aux dashboards 
                interactifs, je transforme la théorie en impact concret.
              </p>
              <p>
                Ma vision : contribuer à l'émergence de solutions technologiques africaines innovantes, 
                construire des systèmes qui améliorent la vie quotidienne, et prouver que l'excellence 
                tech n'a pas de frontières.
              </p>
            </div>
          </motion.div>

          {/* Right: Stats/Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 * index + 0.4 }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20">
                    <item.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '10+', label: 'Projets réalisés' },
            { value: '5+', label: 'Technologies maîtrisées' },
            { value: '100%', label: 'Engagement' },
            { value: '∞', label: 'Ambition' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
