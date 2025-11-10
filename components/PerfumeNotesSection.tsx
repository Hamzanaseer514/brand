'use client';

import { motion } from 'framer-motion';

interface PerfumeNotesSectionProps {
  notes: string[];
  fragranceType: string;
}

export default function PerfumeNotesSection({ notes, fragranceType }: PerfumeNotesSectionProps) {
  // Split notes into Top, Heart, Base (pyramid structure)
  const topNotes = notes.slice(0, Math.ceil(notes.length / 3));
  const heartNotes = notes.slice(Math.ceil(notes.length / 3), Math.ceil((notes.length * 2) / 3));
  const baseNotes = notes.slice(Math.ceil((notes.length * 2) / 3));

  const pyramidLevels = [
    { notes: topNotes, label: 'Top Notes', color: 'from-luxury-gold/20 to-luxury-gold/5' },
    { notes: heartNotes, label: 'Heart Notes', color: 'from-luxury-gold/30 to-luxury-gold/10' },
    { notes: baseNotes, label: 'Base Notes', color: 'from-luxury-gold/40 to-luxury-gold/15' },
  ];

  return (
    <div className="mt-12">
      <h3 className="font-serif text-2xl text-luxury-ivory mb-8 text-center">
        Fragrance Pyramid
      </h3>
      
      <div className="relative flex flex-col items-center gap-6">
        {/* Pyramid Levels */}
        {pyramidLevels.map((level, index) => (
          <motion.div
            key={level.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative"
            style={{
              width: `${100 - index * 15}%`,
            }}
          >
            {/* Level Container */}
            <div className={`bg-gradient-to-b ${level.color} rounded-lg p-6 border border-luxury-gold/20 backdrop-blur-sm`}>
              <h4 className="font-serif text-lg text-luxury-gold mb-4 text-center font-semibold tracking-wide">
                {level.label}
              </h4>
              <div className="flex flex-wrap justify-center gap-3">
                {level.notes.map((note, noteIndex) => (
                  <motion.span
                    key={note}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + noteIndex * 0.1 }}
                    className="px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-sm text-luxury-ivory hover:bg-luxury-gold/20 hover:border-luxury-gold transition-all cursor-default"
                  >
                    {note}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Connecting Line (except for last level) */}
            {index < pyramidLevels.length - 1 && (
              <div className="w-0.5 h-6 bg-gradient-to-b from-luxury-gold/30 to-transparent mx-auto" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Fragrance Type Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-8 text-center"
      >
        <span className="inline-block px-6 py-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-luxury-gold text-sm font-medium tracking-wide">
          {fragranceType}
        </span>
      </motion.div>
    </div>
  );
}
