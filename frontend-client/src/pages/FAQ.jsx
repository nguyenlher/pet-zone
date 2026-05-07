import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle, Search, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/pages/FAQ.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

const faqCategories = [
  {
    category: 'Purchasing & Returns',
    items: [
      { q: 'What is your return policy?', a: 'We offer a 7-day health guarantee for all pets. If your pet develops any health issues within 7 days of purchase, we will provide a full refund or replacement.' },
      { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. Cash payments are accepted for in-store purchases.' },
      { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 24 hours of placement. After that, please contact our support team for assistance.' },
    ],
  },
  {
    category: 'Delivery & Shipping',
    items: [
      { q: 'Do you offer delivery?', a: 'Yes! We offer safe and comfortable pet delivery to your doorstep. Delivery is free for orders over $500.' },
      { q: 'How long does delivery take?', a: 'Local delivery typically takes 1-2 business days. For longer distances, delivery can take 3-5 business days. We ensure all pets travel in comfort and safety.' },
      { q: 'Can I track my delivery?', a: 'Yes, once your order is shipped, you will receive a tracking number via email and SMS to monitor your delivery in real-time.' },
    ],
  },
  {
    category: 'Pet Health & Care',
    items: [
      { q: 'Are all pets vaccinated?', a: 'Yes, all our dogs and cats come fully vaccinated with complete health certificates. Fish and birds also receive appropriate health checks.' },
      { q: 'Do you provide health certificates?', a: 'Absolutely! Every pet comes with a comprehensive health certificate from our licensed veterinarians, including vaccination records and general health assessments.' },
      { q: 'What if my pet gets sick after purchase?', a: 'We provide a 7-day health guarantee. Additionally, we offer lifetime support and can recommend trusted veterinarians in your area.' },
    ],
  },
  {
    category: 'Store & Visits',
    items: [
      { q: 'Can I visit the pets before purchasing?', a: 'Absolutely! We encourage all customers to visit our store and interact with the pets before making a decision. Our staff will be happy to assist you.' },
      { q: 'What are your store hours?', a: 'We are open Monday through Saturday, 9:00 AM to 6:00 PM. We are closed on Sundays and public holidays.' },
      { q: 'Do you offer pet care advice?', a: 'Yes! Our experienced staff provides free consultation on pet care, nutrition, training, and general wellness for the lifetime of your pet.' },
    ],
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleItem = (categoryIdx, itemIdx) => {
    const key = `${categoryIdx}-${itemIdx}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCategories = faqCategories
    .map((cat, catIdx) => ({
      ...cat,
      originalIdx: catIdx,
      items: cat.items.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => {
      if (activeCategory !== null && cat.originalIdx !== activeCategory) return false;
      return cat.items.length > 0;
    });

  const totalResults = filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="faq-page">
      <div className="container">
        {/* Hero */}
        <motion.div className="faq-hero" initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="faq-hero-icon"><HelpCircle size={32} /></div>
          <h1 className="page-title">Frequently Asked Questions</h1>
          <p className="page-subtitle">Find answers to common questions about our pets, services, and policies.</p>
        </motion.div>

        {/* Search */}
        <motion.div className="faq-search-wrap" initial="hidden" animate="visible" variants={fadeInUp} custom={1}>
          <div className="faq-search">
            <Search size={20} className="faq-search-icon" />
            <input
              type="text"
              className="input-field"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Category tabs */}
        <motion.div className="faq-tabs" initial="hidden" animate="visible" variants={fadeInUp} custom={2}>
          <button
            className={`faq-tab ${activeCategory === null ? 'active' : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {faqCategories.map((cat, i) => (
            <button
              key={i}
              className={`faq-tab ${activeCategory === i ? 'active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === i ? null : i)}
            >
              <span>{cat.icon}</span> {cat.category}
            </button>
          ))}
        </motion.div>

        {/* Results count */}
        {searchQuery && (
          <div className="faq-results-count">
            Found <strong>{totalResults}</strong> result{totalResults !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
          </div>
        )}

        {/* FAQ list */}
        <div className="faq-categories">
          {filteredCategories.length === 0 ? (
            <motion.div className="faq-empty" initial="hidden" animate="visible" variants={fadeInUp}>
              <HelpCircle size={48} />
              <h3>No results found</h3>
              <p>Try a different search term or browse all categories.</p>
              <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setActiveCategory(null); }}>
                Clear Filters
              </button>
            </motion.div>
          ) : (
            filteredCategories.map((cat) => (
              <motion.div
                key={cat.originalIdx}
                className="faq-category-block"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="faq-category-title">
                  <span className="faq-category-emoji">{cat.icon}</span>
                  {cat.category}
                </h2>
                <div className="faq-list">
                  {cat.items.map((item, itemIdx) => {
                    const key = `${cat.originalIdx}-${itemIdx}`;
                    const isOpen = openItems[key];
                    return (
                      <div key={itemIdx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                        <button className="faq-question" onClick={() => toggleItem(cat.originalIdx, itemIdx)}>
                          <span>{item.q}</span>
                          <ChevronDown size={18} className={`faq-chevron ${isOpen ? 'rotated' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="faq-answer animate-slide-down">
                            <p>{item.a}</p>
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
        <motion.div className="faq-cta" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <div className="faq-cta-card">
            <MessageSquare size={28} />
            <div>
              <h3>Still have questions?</h3>
              <p>Can't find the answer you're looking for? Don't hesitate to reach out to our team.</p>
            </div>
            <Link to="/contact" className="btn btn-primary">Contact Us</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
