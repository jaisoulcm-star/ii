import React from "react";
import { motion } from "motion/react";
import { Star, Shield, Users, Heart } from "lucide-react";
import { HERITAGE_IMAGES } from "../constants";

export const About: React.FC = () => {
  return (
    <div className="bg-heritage-cream">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src={HERITAGE_IMAGES.STORY_HERO}
          className="absolute inset-0 w-full h-full object-cover"
          alt="Tamil Nadu Organic Agriculture Farmland"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=2600";
          }}
        />
        <div className="absolute inset-0 bg-stone-900/35 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-heritage-cream via-transparent to-stone-900/20" />
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-7xl md:text-9xl font-serif mb-6 italic drop-shadow-2xl"
          >
            Our Story
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-2xl mx-auto text-xs md:text-sm text-stone-200 font-light leading-relaxed drop-shadow-md tracking-wide"
          >
            Jaigo Textiles curates authentic, pure-origin handlooms, pure silks, and artisanal creations from Tamil Nadu and Kerala. Our roots are deeply embedded in timeless weaving traditions passed down through generations.
          </motion.p>
        </div>
      </section>

      {/* Story Content */}
      <section className="max-w-4xl mx-auto px-4 py-24 space-y-16">
        <div className="space-y-6 text-center">
          <h2 className="text-4xl font-serif text-stone-900 italic">
            The Looms of Tradition
          </h2>
          <div className="w-16 h-1 bg-heritage-gold mx-auto" />
          <p className="text-xl text-stone-600 font-light leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-heritage-gold italic">
            True elegance cannot be rushed. By collaborating directly with
            traditional master weavers and artisan families in Kanchipuram, Chettinad, Madurai, and Kerala, we honor indigenous craft
            passed down through centuries. From yarn spinning to intricate
            zari jacquard weaving, we craft each piece by hand to preserve timeless splendor and enduring authenticity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl boutique-frame bg-stone-100">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop"
              alt="Traditional Handloom Weaver"
              className="w-full h-full object-cover opacity-90 scale-110"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop";
              }}
            />
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-heritage-maroon italic font-bold">
                Authentic Handloom Weaving
              </h3>
              <p className="text-stone-600 font-light leading-relaxed italic">
                Pure natural fibers and genuine zari hand-spun on traditional pit looms and shuttle frames with zero synthetic adulteration.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-heritage-maroon italic font-bold">
                Fair Artisan Prosperity
              </h3>
              <p className="text-stone-600 font-light leading-relaxed italic">
                By connecting artisan weaver clusters directly with discerning connoisseurs worldwide, we ensure dignified livelihoods and keep India's grand textile legacies thriving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-24 text-stone-600 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-heritage-gold border border-stone-100">
                <Star size={32} />
              </div>
              <h4 className="text-xl font-serif text-heritage-maroon italic font-bold">Silk Mark & Handloom</h4>
              <p className="text-sm font-light leading-relaxed text-stone-500">
                100% genuine pure silk, certified handloom cottons, tested zari, and direct weaver provenance.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-heritage-gold border border-stone-100">
                <Shield size={32} />
              </div>
              <h4 className="text-xl font-serif text-heritage-maroon italic font-bold">Craft Authenticity</h4>
              <p className="text-sm font-light leading-relaxed text-stone-500">
                Preserving regional geographical indications: Kanchipuram, Madurai Sungudi, and Kerala Kasavu.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-heritage-gold border border-stone-100">
                <Users size={32} />
              </div>
              <h4 className="text-xl font-serif text-heritage-maroon italic font-bold">Fair Weaver Trade</h4>
              <p className="text-sm font-light leading-relaxed text-stone-500">
                Direct loom procurement eliminating middlemen and empowering 200+ multi-generational weaver families.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-heritage-gold border border-stone-100">
                <Heart size={32} />
              </div>
              <h4 className="text-xl font-serif text-heritage-maroon italic font-bold">Heritage Preservation</h4>
              <p className="text-sm font-light leading-relaxed text-stone-500">
                Curating timeless sarees, traditional bridal wear, ayurvedic cosmetics, and hand-embellished accessories.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
