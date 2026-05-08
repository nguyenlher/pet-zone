import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePets, usePetTypes } from '../hooks/usePets';
import PetCard from '../components/PetCard';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const testimonials = [
  { id: 1, name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/100?img=1', text: 'Found my perfect companion here! The staff was incredibly helpful, and Buddy has been the best addition to our family.', rating: 5, pet: 'Golden Retriever' },
  { id: 2, name: 'Michael Chen', avatar: 'https://i.pravatar.cc/100?img=3', text: 'Amazing selection and the pets are so well taken care of. The adoption process was smooth and transparent.', rating: 5, pet: 'Siberian Husky' },
  { id: 3, name: 'Emily Davis', avatar: 'https://i.pravatar.cc/100?img=5', text: 'I love my new kitten! The team helped me choose the perfect breed for my lifestyle. Highly recommended!', rating: 4, pet: 'Persian Cat' },
];

export default function Home() {
  const { pets: featuredPets, loading: petsLoading } = usePets('AVAILABLE', 0, 8);
  const { petTypes, loading: typesLoading } = usePetTypes();

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="min-h-[90vh] flex items-center bg-gradient-to-br from-amber-50 via-white to-teal-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Star size={14} className="fill-amber-500 text-amber-500" /> #1 Pet Store in Town
            </span>
            <h1 className="font-heading text-5xl lg:text-6xl font-extrabold text-stone-900 leading-tight mb-5">
              Find Your Perfect <span className="gradient-text">Furry Friend</span> Today
            </h1>
            <p className="text-lg text-stone-600 max-w-xl mb-8 leading-relaxed">
              Discover adorable pets looking for a loving home. From playful puppies to curious kittens, your new best friend is waiting.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/pets" className="btn btn-primary btn-lg">Browse Pets <ArrowRight size={18} /></Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">Contact Us</Link>
            </div>
            <div className="flex items-center gap-8">
              {[['500+', 'Happy Pets'], ['1.2k+', 'Customers'], ['4.9', 'Rating']].map(([num, label], i) => (
                <div key={i} className={`text-center ${i > 0 ? 'pl-8 border-l border-stone-200' : ''}`}>
                  <strong className="block font-heading text-2xl font-bold text-stone-900">{num}</strong>
                  <span className="text-sm text-stone-500">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-amber-200/50">
              <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=700&fit=crop" alt="Happy dog" className="w-full h-[480px] object-cover" />
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-2 shadow-lg">
                <Heart size={18} className="text-red-500 fill-red-500 animate-heart-pulse" />
                <span className="font-semibold text-stone-800 text-sm">Adopt Me!</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-10">
            <h2 className="font-heading text-4xl font-bold text-stone-900 mb-3">Browse by Category</h2>
            <p className="text-stone-500 text-lg max-w-xl">Find your perfect companion from our wide selection of pet categories</p>
          </motion.div>
          {typesLoading ? (
            <div className="flex justify-center py-12"><div className="spinner" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {petTypes.map((type, i) => (
                <motion.div key={type.id} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeInUp}>
                  <Link to={`/pets?type=${type.id}`} className="group block rounded-2xl overflow-hidden border border-stone-100 hover:shadow-xl hover:border-amber-200 transition-all duration-300">
                    <div className="h-36 overflow-hidden">
                      <img src={type.iconUrl || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop'} alt={type.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="p-4 bg-white">
                      <h3 className="font-heading font-bold text-stone-900 group-hover:text-primary transition-colors">{type.name}</h3>
                      <span className="text-xs text-stone-500">{type.description || 'View pets'}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Pets */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-heading text-4xl font-bold text-stone-900 mb-2">Featured Pets</h2>
              <p className="text-stone-500 text-lg">Meet our most popular and lovable companions</p>
            </div>
            <Link to="/pets" className="btn btn-outline hidden md:flex">View All <ArrowRight size={16} /></Link>
          </motion.div>
          {petsLoading ? (
            <div className="flex justify-center py-12"><div className="spinner" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPets.map((pet, i) => (
                <motion.div key={pet.id} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeInUp}>
                  <PetCard pet={pet} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-stone-900 mb-3">Why Choose PawShop</h2>
            <p className="text-stone-500 text-lg max-w-xl mx-auto">We make finding and welcoming your new pet a seamless experience</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield size={28} />, title: 'Health Guaranteed', desc: 'All pets come with health certificates and vaccination records.' },
              { icon: <Truck size={28} />, title: 'Safe Delivery', desc: 'Careful and comfortable transportation to your doorstep.' },
              { icon: <Heart size={28} />, title: 'Lifetime Support', desc: "Free consultation and care guidance for your pet's lifetime." },
              { icon: <Star size={28} />, title: 'Top Quality', desc: 'Only the healthiest and happiest pets from trusted breeders.' },
            ].map((b, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeInUp}
                className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-primary flex items-center justify-center mb-4">{b.icon}</div>
                <h3 className="font-heading font-bold text-stone-900 mb-2">{b.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-stone-900 mb-3">What Our Customers Say</h2>
            <p className="text-stone-500 text-lg max-w-xl mx-auto">Hear from happy pet parents who found their perfect match</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.id} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeInUp}
                className="bg-white p-6 rounded-2xl border border-stone-100 hover:shadow-lg transition-all duration-300">
                <div className="flex gap-0.5 mb-3">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={15} className="star-filled" />)}</div>
                <p className="text-stone-600 text-sm leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <strong className="block text-sm font-semibold text-stone-900">{t.name}</strong>
                    <span className="text-xs text-stone-500">{t.pet}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center text-white">
            <h2 className="font-heading text-4xl font-bold mb-4">Ready to Meet Your New Best Friend?</h2>
            <p className="text-amber-100 text-lg mb-8 max-w-xl mx-auto">Browse our collection of adorable pets and find the perfect companion for your family.</p>
            <Link to="/pets" className="inline-flex items-center gap-2 bg-white text-amber-600 font-bold px-8 py-4 rounded-xl hover:shadow-xl transition-all hover:-translate-y-0.5">
              Start Browsing <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
