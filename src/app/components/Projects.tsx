import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { ExternalLink, Github, Database, Globe, Gamepad2, LayoutDashboard } from 'lucide-react';

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const projects = [
    {
      title: 'SchoolHub',
      category: 'Plateforme de gestion',
      description: 'Système de gestion de présence intelligent avec API backend, dashboard interactif, génération de rapports PDF et notifications automatiques',
      problem: 'Gestion manuelle inefficace des présences scolaires',
      solution: 'Automatisation complète avec interface intuitive et rapports en temps réel',
      tech: ['Laravel', 'React', 'MySQL', 'API REST', 'PDF Generation'],
      icon: LayoutDashboard,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Applications Django',
      category: 'Backend & API',
      description: 'Développement d\'applications web robustes avec Django, incluant authentification JWT, gestion de bases de données et API RESTful',
      problem: 'Besoin de solutions backend scalables et sécurisées',
      solution: 'Architecture propre avec Django et bonnes pratiques de développement',
      tech: ['Django', 'Python', 'SQLite', 'JWT Auth', 'API REST'],
      icon: Database,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Applications Laravel',
      category: 'Full Stack',
      description: 'Création de plateformes web complètes avec Laravel, incluant authentification, gestion de contenu et dashboards administratifs',
      problem: 'Développement rapide d\'applications web professionnelles',
      solution: 'Framework Laravel pour un développement structuré et efficace',
      tech: ['Laravel', 'PHP', 'MySQL', 'Blade', 'MVC'],
      icon: Globe,
      gradient: 'from-red-500 to-orange-500',
    },
    {
      title: 'Projets Pygame',
      category: 'Développement de jeux',
      description: 'Création de jeux interactifs avec Pygame, implémentation de logique algorithmique et gestion d\'événements',
      problem: 'Apprentissage ludique de la programmation et de la logique',
      solution: 'Jeux engageants avec mécanique solide et interface intuitive',
      tech: ['Python', 'Pygame', 'Algorithmes', 'Game Design'],
      icon: Gamepad2,
      gradient: 'from-violet-500 to-purple-500',
    },
  ];

  return (
    <section id="projects" className="relative py-32 bg-black overflow-hidden">
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
            Projets réalisés
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-violet-500 mx-auto mb-6" />
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            De la théorie à la pratique : solutions concrètes pour des problèmes réels
          </p>
        </motion.div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group relative"
            >
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon & Category */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${project.gradient} bg-opacity-10`}>
                      <project.icon className={`w-6 h-6 text-white`} />
                    </div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{project.category}</span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-gray-400 mb-6">{project.description}</p>

                  {/* Problem & Solution */}
                  <div className="space-y-3 mb-6">
                    <div>
                      <span className="text-xs text-red-400 font-semibold uppercase">Problème</span>
                      <p className="text-sm text-gray-400 mt-1">{project.problem}</p>
                    </div>
                    <div>
                      <span className="text-xs text-green-400 font-semibold uppercase">Solution</span>
                      <p className="text-sm text-gray-400 mt-1">{project.solution}</p>
                    </div>
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      Détails
                    </button>
                    <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                      <Github className="w-4 h-4" />
                      Code
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-4">Plus de projets disponibles sur GitHub</p>
          <a
            href="https://github.com/NickHGA"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300 inline-flex items-center gap-2"
          >
            <Github className="w-5 h-5" />
            Voir tous les projets
          </a>
        </motion.div>
      </div>
    </section>
  );
}