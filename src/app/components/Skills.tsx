import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Code2, Server, Database, Brain, Wrench, GitBranch } from 'lucide-react';

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const skillCategories = [
    {
      title: 'Langages',
      icon: Code2,
      skills: [
        { name: 'Python', level: 90 },
        { name: 'PHP', level: 55 },
        { name: 'JavaScript', level: 60 },
      ],
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Frameworks',
      icon: Server,
      skills: [
        { name: 'Laravel', level: 85 },
        { name: 'Django', level: 85 },
        { name: 'React', level: 30 },
      ],
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Bases de données',
      icon: Database,
      skills: [
        { name: 'MySQL', level: 85 },
        { name: 'SQLite', level: 80 },
        { name: 'PostgreSQL', level: 45 },
      ],
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Intelligence Artificielle',
      icon: Brain,
      skills: [
        { name: 'Machine Learning', level: 75 },
        { name: 'Logique IA', level: 80 },
        { name: 'Algorithmes', level: 85 },
      ],
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      title: 'Outils & DevOps',
      icon: Wrench,
      skills: [
        { name: 'Git/GitHub', level: 90 },
        { name: 'API REST', level: 85 },
        { name: 'Auth JWT', level: 80 },
      ],
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      title: 'Autres compétences',
      icon: GitBranch,
      skills: [
        { name: 'Architecture MVC', level: 85 },
        { name: 'Pygame', level: 80 },
        { name: 'PDF Generation', level: 75 },
      ],
      gradient: 'from-yellow-500 to-amber-500',
    },
  ];

  return (
    <section id="skills" className="relative py-32 bg-gradient-to-b from-gray-950 to-black overflow-hidden">
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
            Compétences techniques
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-violet-500 mx-auto mb-6" />
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Stack technique diversifié pour construire des solutions complètes
          </p>
        </motion.div>

        {/* Skills grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * categoryIndex }}
              className="group"
            >
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                {/* Category header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient} bg-opacity-10`}>
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white">{category.title}</h3>
                </div>

                {/* Skills list */}
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">{skill.name}</span>
                        <span className="text-xs text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : {}}
                          transition={{ duration: 1, delay: 0.2 * categoryIndex + 0.1 * skillIndex }}
                          className={`h-full bg-gradient-to-r ${category.gradient} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">En apprentissage continu</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
