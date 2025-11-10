'use client';

import { motion } from 'framer-motion';
import { Award, Heart, Globe } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'We source only the finest ingredients from trusted suppliers around the world.',
    },
    {
      icon: Heart,
      title: 'Craftsmanship',
      description: 'Each ittar is carefully crafted using traditional methods passed down through generations.',
    },
    {
      icon: Globe,
      title: 'Heritage',
      description: 'We honor the rich cultural heritage of Arabic perfumery while embracing modern innovation.',
    },
  ];

  return (
    <div className="min-h-screen bg-luxury-black pt-24 md:pt-28 pb-12 md:pb-20">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-br from-luxury-gold/10 via-luxury-black to-luxury-emerald/10 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M50 50 L70 30 L50 10 L30 30 Z\" fill=\"none\" stroke=\"%23C9A14A\" stroke-width=\"2\"/%3E%3C/svg%3E')",
              backgroundRepeat: 'repeat',
            }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-6xl md:text-8xl font-serif font-bold mb-4 text-luxury-ivory">
            Our Story
          </h1>
          <p className="text-2xl text-luxury-gold/80 max-w-2xl mx-auto">
            Crafting luxury fragrances with timeless elegance
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 py-20">
        {/* Brand Story */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-20"
        >
          <h2 className="text-5xl font-serif font-bold text-luxury-ivory mb-8">The Art of Ittar</h2>
          <div className="prose prose-lg text-luxury-ivory/80 space-y-6 leading-relaxed">
            <p>
              At Luxe Ittar, we believe that fragrance is more than just a scent—it&apos;s an
              experience, a memory, and an expression of individuality. Our journey began with a
              passion for preserving the ancient art of Arabic perfumery while bringing it to the
              modern world.
            </p>
            <p>
              Each bottle in our collection is a testament to centuries-old traditions,
              meticulously crafted using the finest natural ingredients. From the rare oud wood
              forests of Southeast Asia to the fragrant rose fields of Bulgaria, we source our
              ingredients from the most prestigious suppliers globally.
            </p>
            <p>
              Our master perfumers combine traditional techniques with contemporary artistry,
              creating fragrances that honor the past while embracing the future. Every ittar tells
              a story—of distant lands, ancient traditions, and timeless elegance.
            </p>
          </div>
        </motion.section>

        {/* Values */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center glass p-8 rounded-2xl border border-luxury-gold/20"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-luxury-gold/10 rounded-full mb-6 border border-luxury-gold/30">
                  <Icon size={40} className="text-luxury-gold" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-luxury-ivory mb-4">
                  {value.title}
                </h3>
                <p className="text-luxury-ivory/70 leading-relaxed">{value.description}</p>
              </motion.div>
            );
          })}
        </section>

        {/* Craftsmanship Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass p-12 rounded-2xl mb-20 border border-luxury-gold/20"
        >
          <h2 className="text-5xl font-serif font-bold text-luxury-ivory mb-8 text-center">
            Our Craftsmanship
          </h2>
          <div className="max-w-3xl mx-auto text-luxury-ivory/80 space-y-6">
            <p>
              The creation of each ittar is a labor of love, requiring patience, precision, and an
              intimate understanding of fragrance composition. Our artisans follow time-honored
              methods:
            </p>
            <ul className="list-none space-y-4">
              <li className="flex items-start gap-4">
                <span className="text-luxury-gold text-xl">▪</span>
                <div>
                  <strong className="text-luxury-gold">Ingredient Selection:</strong>{' '}
                  <span className="text-luxury-ivory/80">
                    We personally source every ingredient, ensuring the highest quality and
                    authenticity.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-luxury-gold text-xl">▪</span>
                <div>
                  <strong className="text-luxury-gold">Traditional Maceration:</strong>{' '}
                  <span className="text-luxury-ivory/80">
                    Ingredients are allowed to mature and blend naturally, developing depth and
                    complexity over time.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-luxury-gold text-xl">▪</span>
                <div>
                  <strong className="text-luxury-gold">Precision Blending:</strong>{' '}
                  <span className="text-luxury-ivory/80">
                    Our perfumers expertly blend notes to create harmonious compositions that evolve
                    beautifully on the skin.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-luxury-gold text-xl">▪</span>
                <div>
                  <strong className="text-luxury-gold">Quality Assurance:</strong>{' '}
                  <span className="text-luxury-ivory/80">
                    Every batch undergoes rigorous testing to ensure consistency and excellence.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* Inspiration Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-5xl font-serif font-bold text-luxury-ivory mb-8">Our Inspiration</h2>
          <div className="prose prose-lg text-luxury-ivory/80 space-y-6 leading-relaxed">
            <p>
              Inspired by the legendary perfumers of the Middle East and the aromatic traditions of
              the Silk Road, Luxe Ittar brings together the best of Eastern and Western
              perfumery. Our scents evoke the mystique of ancient bazaars, the tranquility of
              desert oases, and the opulence of royal courts.
            </p>
            <p>
              We are committed to sustainability and ethical sourcing, ensuring that our passion for
              fragrance contributes positively to the communities and ecosystems that provide our
              ingredients. When you choose Luxe Ittar, you&apos;re not just selecting a fragrance
              —you&apos;re becoming part of a legacy.
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
