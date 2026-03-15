export const categories = [
  { id: 1, name: 'Dogs', slug: 'dogs', icon: 'dog', count: 24, image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop' },
  { id: 2, name: 'Cats', slug: 'cats', icon: 'cat', count: 18, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop' },
  { id: 3, name: 'Birds', slug: 'birds', icon: 'bird', count: 12, image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop' },
  { id: 4, name: 'Fish', slug: 'fish', icon: 'fish', count: 15, image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400&h=300&fit=crop' },
  { id: 5, name: 'Small Pets', slug: 'small-pets', icon: 'rabbit', count: 9, image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop' },
];

export const pets = [
  {
    id: 1, name: 'Buddy', breed: 'Golden Retriever', category: 'dogs', age: '2 years',
    price: 850, originalPrice: 950, gender: 'Male', weight: '30 kg', color: 'Golden',
    modelUrl: '/models/dog.glb',
    description: 'Buddy is a friendly and energetic Golden Retriever who loves to play fetch and swim. He is great with children and other pets. Fully vaccinated and trained.',
    images: [
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=500&fit=crop',
      'https://images.unsplash.com/photo-1612774412771-005ed8e861d2?w=600&h=500&fit=crop',
    ],
    vaccinated: true, neutered: true, rating: 4.8, reviews: 24, featured: true,
  },
  {
    id: 2, name: 'Luna', breed: 'Siberian Husky', category: 'dogs', age: '1 year',
    price: 1200, gender: 'Female', weight: '22 kg', color: 'Black & White',
    modelUrl: '/models/dog.glb',
    description: 'Luna is a beautiful Siberian Husky with striking blue eyes. She is playful, loyal, and loves outdoor activities.',
    images: [
      'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600&h=500&fit=crop',
      'https://images.unsplash.com/photo-1547407139-3c921a66005c?w=600&h=500&fit=crop',
    ],
    vaccinated: true, neutered: false, rating: 4.9, reviews: 31, featured: true,
  },
  {
    id: 3, name: 'Whiskers', breed: 'Persian Cat', category: 'cats', age: '3 years',
    price: 600, originalPrice: 700, gender: 'Male', weight: '5 kg', color: 'White',
    modelUrl: '/models/cat.glb',
    description: 'Whiskers is a calm and affectionate Persian cat with luxurious white fur. Perfect for a loving indoor home.',
    images: [
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=500&fit=crop',
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=500&fit=crop',
    ],
    vaccinated: true, neutered: true, rating: 4.7, reviews: 19, featured: true,
  },
  {
    id: 4, name: 'Milo', breed: 'Maine Coon', category: 'cats', age: '1.5 years',
    price: 950, gender: 'Male', weight: '7 kg', color: 'Tabby',
    description: 'Milo is a gentle giant Maine Coon with a playful personality. He loves to be around people and is very social.',
    images: [
      'https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?w=600&h=500&fit=crop',
      'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=600&h=500&fit=crop',
    ],
    vaccinated: true, neutered: false, rating: 4.6, reviews: 14, featured: false,
  },
  {
    id: 5, name: 'Kiwi', breed: 'Cockatiel', category: 'birds', age: '6 months',
    price: 150, gender: 'Female', weight: '0.1 kg', color: 'Yellow & Grey',
    description: 'Kiwi is a cheerful Cockatiel who loves to whistle and sing. She is hand-tamed and very friendly.',
    images: [
      'https://images.unsplash.com/photo-1591198936750-16d8e15edb9e?w=600&h=500&fit=crop',
      'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=600&h=500&fit=crop',
    ],
    vaccinated: true, neutered: false, rating: 4.5, reviews: 8, featured: true,
  },
  {
    id: 6, name: 'Nemo', breed: 'Clownfish', category: 'fish', age: '1 year',
    price: 35, gender: 'Male', weight: '0.02 kg', color: 'Orange & White',
    description: 'Nemo is a vibrant Clownfish perfect for your saltwater aquarium. Very active and fun to watch.',
    images: [
      'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=600&h=500&fit=crop',
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&h=500&fit=crop',
    ],
    vaccinated: false, neutered: false, rating: 4.4, reviews: 12, featured: false,
  },
  {
    id: 7, name: 'Max', breed: 'German Shepherd', category: 'dogs', age: '3 years',
    price: 1100, gender: 'Male', weight: '35 kg', color: 'Black & Tan',
    description: 'Max is a highly intelligent and loyal German Shepherd. Well-trained and perfect for families seeking a protective companion.',
    images: [
      'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&h=500&fit=crop',
      'https://images.unsplash.com/photo-1568572933382-74d440642117?w=600&h=500&fit=crop',
    ],
    vaccinated: true, neutered: true, rating: 4.9, reviews: 42, featured: true,
  },
  {
    id: 8, name: 'Cleo', breed: 'Siamese Cat', category: 'cats', age: '2 years',
    price: 550, gender: 'Female', weight: '4 kg', color: 'Cream & Brown',
    description: 'Cleo is an elegant Siamese cat with beautiful blue eyes. She is vocal, affectionate, and loves attention.',
    images: [
      'https://images.unsplash.com/photo-1596854273338-cbf078ec7071?w=600&h=500&fit=crop',
      'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600&h=500&fit=crop',
    ],
    vaccinated: true, neutered: true, rating: 4.7, reviews: 16, featured: false,
  },
  {
    id: 9, name: 'Rio', breed: 'Macaw', category: 'birds', age: '2 years',
    price: 2500, gender: 'Male', weight: '1.2 kg', color: 'Blue & Yellow',
    description: 'Rio is a stunning Blue-and-Yellow Macaw with a vibrant personality. He can learn to talk and loves interaction.',
    images: [
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&h=500&fit=crop',
      'https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=600&h=500&fit=crop',
    ],
    vaccinated: true, neutered: false, rating: 4.8, reviews: 7, featured: false,
  },
  {
    id: 10, name: 'Bubbles', breed: 'Betta Fish', category: 'fish', age: '8 months',
    price: 25, gender: 'Male', weight: '0.01 kg', color: 'Royal Blue',
    description: 'Bubbles is a magnificent Betta fish with flowing fins and a stunning royal blue color. Low maintenance and mesmerizing.',
    images: [
      'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=600&h=500&fit=crop',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=500&fit=crop',
    ],
    vaccinated: false, neutered: false, rating: 4.3, reviews: 9, featured: true,
  },
  {
    id: 11, name: 'Thumper', breed: 'Holland Lop', category: 'small-pets', age: '6 months',
    price: 120, gender: 'Male', weight: '1.8 kg', color: 'Brown & White',
    modelUrl: '/models/fox.glb',
    description: 'Thumper is an adorable Holland Lop rabbit with floppy ears and a gentle temperament. Perfect for families.',
    images: [
      'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=500&fit=crop',
      'https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=600&h=500&fit=crop',
    ],
    vaccinated: true, neutered: false, rating: 4.6, reviews: 11, featured: false,
  },
  {
    id: 12, name: 'Daisy', breed: 'French Bulldog', category: 'dogs', age: '1 year',
    price: 2800, gender: 'Female', weight: '10 kg', color: 'Fawn',
    description: 'Daisy is a charming French Bulldog with a playful and laid-back personality. She is perfect for apartment living.',
    images: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=500&fit=crop',
      'https://images.unsplash.com/photo-1585559700398-1385b3a8aeb6?w=600&h=500&fit=crop',
    ],
    vaccinated: true, neutered: true, rating: 4.9, reviews: 38, featured: true,
  },
];

export const testimonials = [
  {
    id: 1, name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/100?img=1',
    text: 'Found my perfect companion here! The staff was incredibly helpful, and Buddy has been the best addition to our family.',
    rating: 5, pet: 'Buddy - Golden Retriever',
  },
  {
    id: 2, name: 'Michael Chen', avatar: 'https://i.pravatar.cc/100?img=3',
    text: 'Amazing selection and the pets are so well taken care of. The adoption process was smooth and transparent.',
    rating: 5, pet: 'Luna - Siberian Husky',
  },
  {
    id: 3, name: 'Emily Davis', avatar: 'https://i.pravatar.cc/100?img=5',
    text: 'I love my new kitten Whiskers! The team helped me choose the perfect breed for my lifestyle. Highly recommended!',
    rating: 4, pet: 'Whiskers - Persian Cat',
  },
];

export const sampleOrders = [
  {
    id: 'ORD-2024-001', date: '2024-12-15', status: 'Delivered', total: 885,
    items: [
      { id: 1, name: 'Buddy - Golden Retriever', price: 850, quantity: 1, image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=100&h=100&fit=crop' },
      { id: 101, name: 'Premium Dog Food (5kg)', price: 35, quantity: 1, image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=100&h=100&fit=crop' },
    ],
    shipping: { name: 'Sarah Johnson', address: '123 Pet Street, New York, NY 10001', phone: '+1 234 567 8900' },
    payment: 'Credit Card (**** 4242)',
  },
  {
    id: 'ORD-2024-002', date: '2025-01-05', status: 'Shipped', total: 600,
    items: [
      { id: 3, name: 'Whiskers - Persian Cat', price: 600, quantity: 1, image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=100&h=100&fit=crop' },
    ],
    shipping: { name: 'Sarah Johnson', address: '123 Pet Street, New York, NY 10001', phone: '+1 234 567 8900' },
    payment: 'PayPal',
  },
  {
    id: 'ORD-2025-003', date: '2025-02-10', status: 'Processing', total: 2800,
    items: [
      { id: 12, name: 'Daisy - French Bulldog', price: 2800, quantity: 1, image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=100&h=100&fit=crop' },
    ],
    shipping: { name: 'Sarah Johnson', address: '123 Pet Street, New York, NY 10001', phone: '+1 234 567 8900' },
    payment: 'Credit Card (**** 1234)',
  },
  {
    id: 'ORD-2025-004', date: '2025-02-12', status: 'Pending', total: 150,
    items: [
      { id: 5, name: 'Kiwi - Cockatiel', price: 150, quantity: 1, image: 'https://images.unsplash.com/photo-1591198936750-16d8e15edb9e?w=100&h=100&fit=crop' },
    ],
    shipping: { name: 'Sarah Johnson', address: '123 Pet Street, New York, NY 10001', phone: '+1 234 567 8900' },
    payment: 'Cash on Delivery',
  },
];

export const currentUser = {
  id: 1,
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  phone: '+1 234 567 8900',
  avatar: 'https://i.pravatar.cc/200?img=1',
  address: '123 Pet Street, New York, NY 10001',
  joinDate: '2024-06-15',
};
