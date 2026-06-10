import { Product, Category, Testimonial, StatItem } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-thu-cung',
    name: 'Thú Cưng',
    slug: 'thu-cung',
    count: '24+ bé thuần chủng',
    description: 'Chó cảnh, mèo cảnh thuần chủng tuyển chọn, bảo hành sức khỏe & sổ tiêm đầy đủ',
    icon: 'Dog',
    bgColor: 'bg-[#FBECE6] hover:bg-[#F8DEC5]',
    accentColor: '#E65C38',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cat-thuc-an',
    name: 'Thức Ăn',
    slug: 'thuc-an',
    count: '58+ sản phẩm',
    description: 'Hạt sấy thăng hoa hữu cơ, pate dinh dưỡng cao cấp, súp thưởng và snack sạch',
    icon: 'Utensils',
    bgColor: 'bg-[#F4F1EA] hover:bg-[#EAE4D7]',
    accentColor: '#8C7A60',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cat-quan-ao',
    name: 'Quần Áo',
    slug: 'quan-ao',
    count: '42+ mẫu thiết kế',
    description: 'Áo len dệt kim ấm áp, áo mưa chống thấm, yếm thời trang công thái học',
    icon: 'Sparkles',
    bgColor: 'bg-[#F2EEF9] hover:bg-[#E5DDF5]',
    accentColor: '#7A62A8',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cat-nha-chuong',
    name: 'Nhà / Chuồng',
    slug: 'nha-chuong',
    count: '35+ mẫu decor',
    description: 'Nhà gỗ sồi Bắc Âu tối giản, chuồng quây gấp gọn thông minh, nệm mây memory foam',
    icon: 'Home',
    bgColor: 'bg-[#F7F2EB] hover:bg-[#EEE5D8]',
    accentColor: '#A68256',
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cat-phu-kien',
    name: 'Phụ Kiện',
    slug: 'phu-kien',
    count: '65+ phụ kiện',
    description: 'Vòng cổ tích hợp AirTag, dây dắt trợ lực rảnh tay, bát sứ công thái học & đồ chơi',
    icon: 'Package',
    bgColor: 'bg-[#EBF3ED] hover:bg-[#DCECE0]',
    accentColor: '#4A7C59',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=80',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Bát Sứ Công Thái Học Eco-Curve',
    category: 'Phụ kiện',
    categorySlug: 'phu-kien',
    price: 380000,
    originalPrice: 480000,
    rating: 4.9,
    reviewsCount: 142,
    badge: 'Bestseller 3D',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=700&auto=format&fit=crop&q=80',
    description: 'Bát sứ nung nhiệt độ cao 1300°C chống cằm đen, độ nghiêng 15 độ bảo vệ cột sống cổ và hệ tiêu hoá cho thú cưng.',
    tags: ['Gốm sứ cao cấp', 'Nghiêng 15°', 'Chống lật'],
    colors: [
      { name: 'Oatmeal Minimal', hex: '#EAE5D9' },
      { name: 'Sage Green', hex: '#A3B18A' },
      { name: 'Terracotta', hex: '#D68C72' },
      { name: 'Charcoal Black', hex: '#262626' },
    ],
    inStock: true,
    specs: {
      'Dung tích': '450ml',
      'Chất liệu': 'Gốm sứ tráng men mờ',
      'Độ nghiêng': '15 độ công thái học',
      'Vệ sinh': 'Dùng được máy rửa bát'
    }
  },
  {
    id: 'prod-2',
    name: 'Hạt Hữu Cơ Freeze-Dried Salmon & Venison',
    category: 'Thức ăn',
    categorySlug: 'thuc-an',
    price: 520000,
    originalPrice: 620000,
    rating: 5.0,
    reviewsCount: 219,
    badge: '100% Organic',
    isOrganic: true,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1582457601554-04df82173f4e?w=700&auto=format&fit=crop&q=80',
    description: 'Công nghệ sấy thăng hoa -40°C giữ trọn 98% dưỡng chất tươi sống từ cá hồi Nauy và thịt nai hữu cơ tự nhiên.',
    tags: ['Sấy lạnh -40°C', 'Không ngũ cốc', 'Omega 3 & 6'],
    inStock: true,
    specs: {
      'Khối lượng': '1.2 kg',
      'Nguồn gốc đạm': '85% Đạm động vật tươi sống',
      'Không chứa': 'Bắp, đậu nành, phụ gia nhân tạo'
    }
  },
  {
    id: 'prod-3',
    name: 'Vòng Cổ Da Sinh Học Luna Collar Pro',
    category: 'Phụ kiện',
    categorySlug: 'phu-kien',
    price: 320000,
    rating: 4.8,
    reviewsCount: 88,
    badge: 'Mới ra mắt',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=700&auto=format&fit=crop&q=80',
    description: 'Chất liệu da táo thuần chay siêu bền, tích hợp khoen AirTag ẩn chống rơi lạc và khóa nam châm Fidlock tháo mở 1 chạm.',
    tags: ['Da thuần chay', 'Khoang chứa AirTag', 'Khóa Fidlock'],
    colors: [
      { name: 'Amber Tan', hex: '#BF784E' },
      { name: 'Forest Green', hex: '#2D4A3E' },
      { name: 'Onyx Black', hex: '#1C1C1C' },
    ],
    inStock: true,
    specs: {
      'Kích cỡ': 'S (20-30cm), M (30-45cm), L (45-60cm)',
      'Khóa cài': 'Hợp kim nhôm hàng không & nam châm Neodymium'
    }
  },
  {
    id: 'prod-4',
    name: 'Bóng Thông Minh Tự Lăn RollPaws Orbit',
    category: 'Phụ kiện',
    categorySlug: 'phu-kien',
    price: 450000,
    originalPrice: 550000,
    rating: 4.9,
    reviewsCount: 164,
    badge: 'Smart Tech',
    image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=700&auto=format&fit=crop&q=80',
    description: 'Cảm biến chuyển động né chướng ngại vật thông minh, 3 chế độ vận động vui nhộn tự kích hoạt khi boss chạm vào.',
    tags: ['Tự động chuyển hướng', 'Sạc Type-C', 'Vỏ Silicon an toàn'],
    colors: [
      { name: 'Electric Lime', hex: '#D4F442' },
      { name: 'Neon Coral', hex: '#FF5E3A' },
      { name: 'Soft Blue', hex: '#89CFF0' },
    ],
    inStock: true,
    specs: {
      'Thời lượng pin': '6 giờ chơi liên tục',
      'Độ ồn': '< 25dB siêu êm',
      'Chống nước': 'Tiêu chuẩn IP54'
    }
  },
  {
    id: 'prod-5',
    name: 'Nệm Mây Công Thái Học CloudRest Memory Foam',
    category: 'Nhà / Chuồng',
    categorySlug: 'nha-chuong',
    price: 890000,
    originalPrice: 1050000,
    rating: 5.0,
    reviewsCount: 95,
    badge: 'Orthopedic',
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=700&auto=format&fit=crop&q=80',
    description: 'Lớp foam memory chỉnh hình nâng đỡ toàn diện khung xương và khớp cho cún mèo, vỏ bọc vải dệt chống cào giặt máy dễ dàng.',
    tags: ['Orthopedic Foam', 'Kháng nước', 'Vỏ tháo rời'],
    colors: [
      { name: 'Stone Gray', hex: '#9E9E9E' },
      { name: 'Warm Cream', hex: '#EBE5D8' },
    ],
    inStock: true,
    specs: {
      'Kích thước': 'M (70x50x18cm), L (90x70x20cm)',
      'Lõi đệm': 'High-density Memory Foam 3 lớp'
    }
  },
  {
    id: 'prod-6',
    name: 'Súp Thưởng Hữu Cơ PureBite Puree Pack (Hộp 12 tuýp)',
    category: 'Thức ăn',
    categorySlug: 'thuc-an',
    price: 195000,
    rating: 4.9,
    reviewsCount: 310,
    badge: 'Boss Yêu Thích',
    isOrganic: true,
    image: 'https://images.unsplash.com/photo-1582457601554-04df82173f4e?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=700&auto=format&fit=crop&q=80',
    description: 'Ức gà ta nuôi thả đồi kết hợp cỏ mèo hữu cơ và taurine thiết yếu, bổ sung nước và ngăn ngừa sỏi thận hiệu quả.',
    tags: ['100% Thịt tươi', 'Không chất làm đặc', 'Bổ sung Taurine'],
    inStock: true,
    specs: {
      'Quy cách': '14g x 12 tuýp',
      'Phù hợp': 'Mèo từ 2 tháng tuổi trở lên'
    }
  },
  {
    id: 'prod-7',
    name: 'Cây Cào Móng & Tháp Ngủ Silhouette Post',
    category: 'Nhà / Chuồng',
    categorySlug: 'nha-chuong',
    price: 640000,
    originalPrice: 780000,
    rating: 4.7,
    reviewsCount: 76,
    badge: 'Decor Style',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=700&auto=format&fit=crop&q=80',
    description: 'Thiết kế tối giản hòa vào không gian sống hiện đại, dây thừng đay tự nhiên không xử lý hóa chất an toàn cho móng vuốt.',
    tags: ['Gỗ tần bì tự nhiên', 'Dây đay hữu cơ', 'Chân đế đầm chắc'],
    inStock: true,
    specs: {
      'Chiều cao': '75cm',
      'Trọng lượng đế': '4.5kg chống đổ ngã'
    }
  },
  {
    id: 'prod-8',
    name: 'Máy Lọc Nước Tuần Hoàn Tĩnh Âm FlowPet Pure',
    category: 'Phụ kiện',
    categorySlug: 'phu-kien',
    price: 680000,
    originalPrice: 850000,
    rating: 5.0,
    reviewsCount: 188,
    badge: 'Siêu Tĩnh Âm',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=700&auto=format&fit=crop&q=80',
    description: 'Hệ thống lọc 4 tầng than hoạt tính gáo dừa và sợi trao đổi ion, bơm không chổi than 5V cách ly điện từ an toàn tuyệt đối.',
    tags: ['Độ ồn <20dB', 'Dung tích 2.5L', 'Cảnh báo mực nước LED'],
    colors: [
      { name: 'Pure White', hex: '#FAFAFA' },
      { name: 'Nordic Sage', hex: '#9CAF88' },
    ],
    inStock: true,
    specs: {
      'Dung tích': '2.5 Lít',
      'Điện áp': '5V USB Type-C an toàn'
    }
  },
  {
    id: 'prod-9',
    name: 'Bánh Quy Xương Gặm Sạch Răng DentBite Organic',
    category: 'Thức ăn',
    categorySlug: 'thuc-an',
    price: 145000,
    originalPrice: 180000,
    rating: 4.8,
    reviewsCount: 112,
    badge: 'Chăm Sóc Răng',
    isOrganic: true,
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=700&auto=format&fit=crop&q=80',
    description: 'Thành phần tảo xoắn Spirulina và bạc hà hữu cơ giúp đánh bay mảng bám, cho hơi thở cún cưng thơm mát tự nhiên.',
    tags: ['Sạch vôi răng', 'Tảo Spirulina', 'Thơm miệng'],
    inStock: true,
    specs: {
      'Trọng lượng': '350g',
      'Hạn sử dụng': '12 tháng'
    }
  },
  {
    id: 'prod-10',
    name: 'Dây Dắt Chống Giật Hands-Free TrailPaws',
    category: 'Phụ kiện',
    categorySlug: 'phu-kien',
    price: 390000,
    originalPrice: 460000,
    rating: 4.9,
    reviewsCount: 94,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=700&auto=format&fit=crop&q=80',
    description: 'Thiết kế đeo chéo qua vai hoặc thắt lưng giúp rảnh tay khi chạy bộ cùng cún cưng, lò xo giảm giật đàn hồi êm ái.',
    tags: ['Rảnh tay chạy bộ', 'Lò xo đàn hồi', 'Phản quang đêm'],
    colors: [
      { name: 'Onyx Black', hex: '#1C1C1C' },
      { name: 'Neon Lime', hex: '#D4F442' },
      { name: 'Terracotta', hex: '#D9654B' }
    ],
    inStock: true,
    specs: {
      'Chiều dài': '1.8m - 2.4m',
      'Tải trọng': 'Chịu lực lên đến 80kg'
    }
  },
  {
    id: 'prod-11',
    name: 'Nhà Gỗ Sồi Bắc Âu Tối Giản Nordic Pet Cabin',
    category: 'Nhà / Chuồng',
    categorySlug: 'nha-chuong',
    price: 1450000,
    originalPrice: 1850000,
    rating: 4.9,
    reviewsCount: 88,
    badge: 'Gỗ Sồi Bắc Âu',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=700&auto=format&fit=crop&q=80',
    description: 'Gia công từ 100% gỗ sồi Nga tự nhiên phủ dầu lau thảo mộc, thiết kế vòm tối giản mang lại cảm giác an tâm che chở cho boss.',
    tags: ['Gỗ sồi nhập khẩu', 'Dễ tháo lắp', 'Thoáng khí'],
    inStock: true,
    specs: {
      'Kích thước': '60 x 50 x 55 cm',
      'Chất liệu': 'Gỗ sồi tự nhiên, nệm vải linen tháo rời'
    }
  },
  {
    id: 'prod-12',
    name: 'Áo Len Dệt Kim Cổ Lọ CozyWarm Knitwear',
    category: 'Quần áo',
    categorySlug: 'quan-ao',
    price: 285000,
    originalPrice: 350000,
    rating: 4.9,
    reviewsCount: 145,
    badge: 'Len Hữu Cơ',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=700&auto=format&fit=crop&q=80',
    description: 'Sợi len lông cừu hữu cơ mềm mại không gây ngứa hay tĩnh điện, độ co giãn 4 chiều vừa vặn cơ thể khi chạy nhảy vận động.',
    tags: ['Len cừu tự nhiên', 'Không xơ rối', 'Giữ ấm tối đa'],
    colors: [
      { name: 'Oatmeal Milk', hex: '#EBE5D8' },
      { name: 'Mustard Yellow', hex: '#E5A93C' },
      { name: 'Forest Olive', hex: '#4A5B43' }
    ],
    inStock: true,
    specs: {
      'Size': 'XS, S, M, L, XL',
      'Chất liệu': '70% Wool, 30% Organic Cotton'
    }
  },
  {
    id: 'prod-13',
    name: 'Áo Mưa Phản Quang Chống Nước StormShield Pro',
    category: 'Quần áo',
    categorySlug: 'quan-ao',
    price: 340000,
    originalPrice: 420000,
    rating: 4.8,
    reviewsCount: 92,
    badge: 'Chống Thấm 100%',
    image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=700&auto=format&fit=crop&q=80',
    description: 'Chất liệu vải Gore-Tex mini chống nước tuyệt đối, dải phản quang 360 độ ban đêm an toàn, có lỗ luồn dây dắt tiện lợi.',
    tags: ['Kháng nước tuyệt đối', 'Dải phản quang', 'Mũ che tai tiện lợi'],
    colors: [
      { name: 'Neon Lime', hex: '#D4F442' },
      { name: 'Safety Orange', hex: '#FF5E3A' },
      { name: 'Deep Navy', hex: '#1E293B' }
    ],
    inStock: true,
    specs: {
      'Size': 'S, M, L, XL, XXL',
      'Chống nước': 'Áp lực nước 10.000mm'
    }
  },
  {
    id: 'prod-14',
    name: 'Yếm Dắt Dây Đeo Thêu Thủ Công Pastel Cloud',
    category: 'Quần áo',
    categorySlug: 'quan-ao',
    price: 295000,
    rating: 4.9,
    reviewsCount: 118,
    badge: 'Thiết Kế Độc Quyền',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=700&auto=format&fit=crop&q=80',
    description: 'Yếm thời trang kèm dây dắt đồng điệu, lót lưới tổ ong đệm khí chống cọ xát nách lông, họa tiết thêu tỉ mỉ phong cách Hàn Quốc.',
    tags: ['Lưới thoáng khí', 'Khóa bấm kim loại', 'Kèm dây dắt'],
    colors: [
      { name: 'Pastel Blue', hex: '#93C5FD' },
      { name: 'Blush Pink', hex: '#FBCFE8' }
    ],
    inStock: true,
    specs: {
      'Size': 'Vòng ngực 28 - 50cm',
      'Kèm theo': 'Dây dắt 1.5m đồng màu'
    }
  },
  {
    id: 'prod-15',
    name: 'Chuồng Quây Hợp Kim Gấp Gọn ModuPlay Foldable',
    category: 'Nhà / Chuồng',
    categorySlug: 'nha-chuong',
    price: 980000,
    originalPrice: 1250000,
    rating: 4.9,
    reviewsCount: 74,
    badge: 'Gấp Gọn 3 Giây',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=700&auto=format&fit=crop&q=80',
    description: 'Bộ quây 8 tấm hợp kim nhôm sơn tĩnh điện không rỉ sét, ghép hình đa giác linh hoạt tùy diện tích căn hộ, gấp siêu mỏng tiết kiệm chỗ.',
    tags: ['Sơn tĩnh điện an toàn', 'Gấp gọn phẳng', 'Khóa chốt kép'],
    inStock: true,
    specs: {
      'Chiều cao': '65cm / 80cm',
      'Gồm': '8 tấm ghép nối linh hoạt'
    }
  },
  {
    id: 'prod-16',
    name: 'Cún Corgi Pembroke Vàng Trắng Thuần Chủng',
    category: 'Thú cưng',
    categorySlug: 'thu-cung',
    price: 12500000,
    rating: 5.0,
    reviewsCount: 42,
    badge: 'Thuần Chủng VKA',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=700&auto=format&fit=crop&q=80',
    description: 'Bé cún Corgi 2.5 tháng tuổi mông trái tim siêu đáng yêu, nguồn gốc rõ ràng, đã tiêm phòng 2 mũi vắc-xin 7 bệnh và gắn microchip định danh.',
    tags: ['Gia phả VKA', 'Tiêm 2 mũi vắc-xin', 'Bảo hành 365 ngày'],
    inStock: true,
    specs: {
      'Tuổi': '2.5 tháng tuổi',
      'Giới tính': 'Đực & Cái',
      'Tẩy giun & Vắc-xin': 'Đầy đủ sổ theo dõi sức khỏe'
    }
  },
  {
    id: 'prod-17',
    name: 'Mèo Anh Lông Ngắn Silver Shaded Mắt Xanh',
    category: 'Thú cưng',
    categorySlug: 'thu-cung',
    price: 14800000,
    rating: 5.0,
    reviewsCount: 38,
    badge: 'Gia Phả TICA',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=700&auto=format&fit=crop&q=80',
    description: 'Bé mèo Aln Silver mã màu ns11 cực phẩm, đôi mắt xanh ngọc bích to tròn, tính cách quấn chủ, ăn hạt và đi vệ sinh đúng thau cát.',
    tags: ['TICA Registration', 'Bảo hành FIP & Giảm bạch cầu', 'Tặng kèm quà về nhà mới'],
    inStock: true,
    specs: {
      'Tuổi': '3 tháng tuổi',
      'Màu lông': 'Silver Shaded (ns11)',
      'Sức khỏe': 'Đã tiêm 2 mũi ngừa bệnh, triệt sản theo yêu cầu'
    }
  },
  {
    id: 'prod-18',
    name: 'Cún Poodle Tiny Nâu Đỏ Siêu Xinh',
    category: 'Thú cưng',
    categorySlug: 'thu-cung',
    price: 9200000,
    rating: 4.9,
    reviewsCount: 29,
    badge: 'Đã Tiêm 2 Mũi',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=700&auto=format&fit=crop&q=80',
    description: 'Bé Poodle dòng Tiny lông xoăn tít màu socola đỏ rực, mặt gấu xinh xắn, năng động thông minh, không rụng lông, rất hợp nuôi nhà chung cư.',
    tags: ['Dòng Tiny', 'Lông dày xoăn tít', 'Bảo hành sức khỏe'],
    inStock: true,
    specs: {
      'Tuổi': '2 tháng tuổi',
      'Cân nặng trưởng thành': '2.0 - 2.8 kg',
      'Bảo hành': '30 ngày đổi trả nếu bệnh truyền nhiễm'
    }
  },
  {
    id: 'prod-19',
    name: 'Túi Vận Chuyển Du Lịch Siêu Nhẹ AirCabin Expandable',
    category: 'Phụ kiện',
    categorySlug: 'phu-kien',
    price: 750000,
    originalPrice: 920000,
    rating: 5.0,
    reviewsCount: 167,
    badge: 'Đạt Chuẩn Hàng Không',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=700&auto=format&fit=crop&q=80',
    description: 'Có thể mở rộng thêm 2 bên tăng 80% không gian, lưới thông gió 4 chiều chống bí, đáy có đệm lông cừu mềm mại tháo rời.',
    tags: ['Chuẩn cabin máy bay', 'Mở rộng 2 bên', 'Khung chống bẹp'],
    colors: [
      { name: 'Slate Gray', hex: '#475569' },
      { name: 'Sand Khaki', hex: '#D7C4A8' }
    ],
    inStock: true,
    specs: {
      'Kích thước': '45 x 28 x 28 cm',
      'Tải trọng tối đa': '9kg'
    }
  },
  {
    id: 'prod-20',
    name: 'Bột Rau Củ Lên Men Tiêu Hóa VeggieBoost Enzyme',
    category: 'Thức ăn',
    categorySlug: 'thuc-an',
    price: 240000,
    rating: 4.8,
    reviewsCount: 79,
    badge: 'Probiotics',
    isOrganic: true,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1582457601554-04df82173f4e?w=700&auto=format&fit=crop&q=80',
    description: 'Hỗn hợp 12 loại củ quả hữu cơ bổ sung 5 tỷ lợi khuẩn Bacillus Clausii, giúp phân khuôn đẹp, giảm mùi hôi chất thải.',
    tags: ['5 Tỷ Lợi Khuẩn', '12 Loại Củ Quả', 'Giảm mùi hôi'],
    inStock: true,
    specs: {
      'Trọng lượng': '180g dạng bột',
      'Liều dùng': '1 muỗng/ngày trộn cùng hạt'
    }
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Trang Hoàng',
    petName: 'Bơ & Đậu',
    petBreed: 'Mèo Anh Lông Ngắn',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    petAvatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80',
    comment: 'Bát sứ nung Eco-Curve cứu rỗi chiếc cằm của 2 bé mèo nhà mình khỏi mụn đen. Độ dốc 15 độ thấy rõ các bé ăn thoải mái hơn nhiều, không còn bị nôn trớ sau khi ăn no. Đóng gói hộp rất cao cấp!',
    rating: 5,
    verified: true,
    date: '3 ngày trước'
  },
  {
    id: 'test-2',
    author: 'Minh Đăng',
    petName: 'Milo',
    petBreed: 'Corgi Pembroke 2 tuổi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    petAvatar: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=200&auto=format&fit=crop&q=80',
    comment: 'Vòng cổ Luna Collar Pro gắn AirTag cực kỳ an toàn mỗi khi dẫn Milo đi công viên. Chất da mềm êm không siết lông, khoá nam châm Fidlock bấm cái tách sướng tay. 10/10 xứng đáng!',
    rating: 5,
    verified: true,
    date: '1 tuần trước'
  },
  {
    id: 'test-3',
    author: 'Khánh Linh',
    petName: 'Mochi',
    petBreed: 'Poodle Toy',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    petAvatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&auto=format&fit=crop&q=80',
    comment: 'Hạt sấy thăng hoa cá hồi thơm nức mũi, Mochi kén ăn số 1 mà giờ cứ đến giờ ăn là ngoan ngoãn ngồi chờ. Đội ngũ bác sĩ tư vấn khẩu phần rất có tâm.',
    rating: 5,
    verified: true,
    date: '2 tuần trước'
  }
];

export const STATS: StatItem[] = [
  {
    value: '150,000+',
    label: 'Thú Cưng Đồng Hành',
    sublabel: 'Trên khắp các tỉnh thành cả nước',
    highlight: 'Hạnh phúc'
  },
  {
    value: '99.8%',
    label: 'Đánh Giá 5 Sao',
    sublabel: 'Dựa trên hơn 24,000 phản hồi thật',
    highlight: 'Tin cậy'
  },
  {
    value: '100%',
    label: 'Chuẩn Hữu Cơ',
    sublabel: 'Không phụ gia & an toàn sinh học',
    highlight: 'Chứng nhận'
  },
  {
    value: '60 Phút',
    label: 'Giao Nhanh Thần Tốc',
    sublabel: 'Đơn hoả tốc nội thành Hà Nội & TP.HCM',
    highlight: 'Hỏa tốc'
  }
];
