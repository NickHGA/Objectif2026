import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Mail, Github, Linkedin, Send, MessageSquare, Phone } from 'lucide-react';

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: 'primelhouaga22@gmail.com',
      link: 'mailto:primelhouaga22@gmail.com',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Phone,
      label: 'Téléphone',
      value: '+229 01 53 93 47 04',
      link: 'tel:+22901539347 04',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'github.com/NickHGA',
      link: 'https://github.com/NickHGA',
      gradient: 'from-gray-500 to-gray-700',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/prim-hga',
      link: 'https://linkedin.com/in/prim-hga',
      gradient: 'from-blue-600 to-blue-800',
    },
  ];

  return (
    <section id="contact" className="relative py-32 bg-gradient-to-b from-black to-gray-950 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full filter blur-[128px]" />
      
      <div className="relative max-w-7xl mx-auto px-6" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Restons connectés
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-violet-500 mx-auto mb-6" />
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Un projet en tête ? Une opportunité à discuter ? Ou simplement envie d'échanger sur la tech ?
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: CTA */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Créons quelque chose<br />
                  <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                    d'extraordinaire
                  </span>
                </h3>
                <p className="text-gray-400 mb-6">
                  Je suis toujours ouvert aux opportunités qui me permettent d'apprendre, 
                  de créer et d'avoir un impact. Que vous soyez recruteur, entrepreneur, 
                  ou simplement passionné de tech, n'hésitez pas à me contacter.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-green-400">Disponible pour opportunités</span>
                  </div>
                </div>
              </div>

              {/* Contact methods */}
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <motion.a
                    key={index}
                    href={method.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 + 0.1 * index }}
                    className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${method.gradient} bg-opacity-10`}>
                      <method.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">{method.label}</div>
                      <div className="text-white group-hover:text-blue-400 transition-colors">{method.value}</div>
                    </div>
                    <Send className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Right: Quick message form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Message rapide</h3>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nom</label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Parlez-moi de votre projet..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Envoyer le message
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                Je réponds généralement sous 24-48h
              </p>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-24 pt-8 border-t border-white/10 text-center"
        >
          <p className="text-gray-500 mb-4">
            Conçu et développé avec passion par HOUAGA Primel
          </p>
          <p className="text-sm text-gray-600">
            © 2025 HOUAGA Primel • Étudiant en Intelligence Artificielle - IFRI
          </p>
        </motion.div>
      </div>
    </section>
  );
}