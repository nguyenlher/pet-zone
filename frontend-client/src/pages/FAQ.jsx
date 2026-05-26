import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle, Search, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

const faqCategories = [
  { category: 'Purchasing & Returns', items: [
    { q: 'What is your return policy?', a: 'We offer a 7-day health guarantee for all pets. If your pet develops any health issues within 7 days of purchase, we will provide a full refund or replacement.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and VNPay. Cash payments are accepted for in-store purchases.' },
    { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 24 hours of placement. After that, please contact our support team for assistance.' },
  ]},
  { category: 'Delivery & Shipping', items: [
    { q: 'Do you offer delivery?', a: 'Yes! We offer safe and comfortable pet delivery to your doorstep. Delivery is free for orders over $500.' },
    { q: 'How long does delivery take?', a: 'Local delivery typically takes 1-2 business days. For longer distances, delivery can take 3-5 business days.' },
    { q: 'Can I track my delivery?', a: 'Yes, once your order is shipped, you will receive a tracking number via email and SMS.' },
  ]},
  { category: 'Pet Health & Care', items: [
    { q: 'Are all pets vaccinated?', a: 'Yes, all our dogs and cats come fully vaccinated with complete health certificates.' },
    { q: 'Do you provide health certificates?', a: 'Absolutely! Every pet comes with a comprehensive health certificate from our licensed veterinarians.' },
    { q: 'What if my pet gets sick after purchase?', a: 'We provide a 7-day health guarantee. We also offer lifetime support and can recommend trusted veterinarians.' },
  ]},
  { category: 'Store & Visits', items: [
    { q: 'Can I visit the pets before purchasing?', a: 'Absolutely! We encourage all customers to visit our store and interact with the pets before making a decision.' },
    { q: 'What are your store hours?', a: 'We are open Monday through Saturday, 9:00 AM to 6:00 PM.' },
    { q: 'Do you offer pet care advice?', a: 'Yes! Our experienced staff provides free consultation on pet care, nutrition, training, and general wellness.' },
  ]},
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleItem = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCategories = faqCategories
    .map((cat, catIdx) => ({ ...cat, originalIdx: catIdx, items: cat.items.filter(item => item.q.toLowerCase().includes(searchQuery.toLowerCase()) || item.a.toLowerCase().includes(searchQuery.toLowerCase())) }))
    .filter(cat => (activeCategory === null || cat.originalIdx === activeCategory) && cat.items.length > 0);

  const totalResults = filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Hero */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/30">
            <HelpCircle size={28} className="text-white" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-stone-900 mb-3">Frequently Asked Questions</h1>
          <p className="text-stone-500 text-lg">Find answers to common questions about our pets, services, and policies.</p>
        </motion.div>

        {/* Search */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={1} className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input type="text" className="input-field pl-12 py-4 text-base" placeholder="Search for questions..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </motion.div>

        {/* Category tabs */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={2} className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${activeCategory === null ? 'bg-primary text-white border-primary' : 'bg-white text-stone-600 border-stone-200 hover:border-primary hover:text-primary'}`}>
            All
          </button>
          {faqCategories.map((cat, i) => (
            <button key={i} onClick={() => setActiveCategory(activeCategory === i ? null : i)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${activeCategory === i ? 'bg-primary text-white border-primary' : 'bg-white text-stone-600 border-stone-200 hover:border-primary hover:text-primary'}`}>
              {cat.category}
            </button>
          ))}
        </motion.div>

        {searchQuery && (
          <p className="text-sm text-stone-500 mb-4">Found <strong>{totalResults}</strong> result{totalResults !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;</p>
        )}

        {/* FAQ list */}
        <div className="flex flex-col gap-8">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <HelpCircle size={48} strokeWidth={1} className="mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-stone-700 mb-2">No results found</h3>
              <p className="text-sm mb-5">Try a different search term or browse all categories.</p>
              <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setActiveCategory(null); }}>Clear Filters</button>
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <motion.div key={cat.originalIdx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <h2 className="font-heading text-xl font-bold text-stone-900 mb-4">{cat.category}</h2>
                <div className="flex flex-col gap-2">
                  {cat.items.map((item, itemIdx) => {
                    const key = `${cat.originalIdx}-${itemIdx}`;
                    const isOpen = openItems[key];
                    return (
                      <div key={itemIdx} className={`bg-white rounded-2xl border transition-all duration-200 ${isOpen ? 'border-primary/40 shadow-md' : 'border-stone-200'}`}>
                        <button className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left" onClick={() => toggleItem(cat.originalIdx, itemIdx)}>
                          <span className="font-medium text-stone-900 text-sm">{item.q}</span>
                          <ChevronDown size={17} className={`text-stone-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 animate-slide-down">
                            <div className="h-px bg-stone-100 mb-4" />
                            <p className="text-sm text-stone-600 leading-relaxed">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* CTA */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="mt-12 bg-gradient-to-r from-primary to-accent rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-white">
            <MessageSquare size={28} />
            <div>
              <h3 className="font-heading font-bold text-lg">Still have questions?</h3>
              <p className="text-amber-100 text-sm">Don't hesitate to reach out to our team.</p>
            </div>
          </div>
          <Link to="/contact" className="bg-white text-amber-600 font-semibold px-5 py-2.5 rounded-xl hover:shadow-md transition-all whitespace-nowrap">
            Contact Us
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
