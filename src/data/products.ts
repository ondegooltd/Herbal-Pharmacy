import { Product, Category } from '../types';

export const categories: Category[] = [
  // Original categories (maintained in order)
  {
    id: 'herbal-supplements',
    name: 'Herbal Supplements',
    icon: 'leaf',
    description: 'Natural herbal remedies and supplements',
    productCount: 24
  },
  {
    id: 'test-kits',
    name: 'Test Kits',
    icon: 'microscope',
    description: 'Home health testing solutions',
    productCount: 12
  },
  {
    id: 'womens-health',
    name: "Women's Health",
    icon: 'heart',
    description: 'Specialized care for women',
    productCount: 18
  },
  {
    id: 'mens-health',
    name: "Men's Health",
    icon: 'shield',
    description: 'Targeted health solutions for men',
    productCount: 15
  },
  {
    id: 'digestive-health',
    name: 'Digestive Health',
    icon: 'apple',
    description: 'Gut health and digestion support',
    productCount: 20
  },
  {
    id: 'immune-support',
    name: 'Immune Support',
    icon: 'shield-check',
    description: 'Boost your natural defenses',
    productCount: 16
  },
  {
    id: 'hair-care',
    name: 'Hair & Beard Care',
    icon: 'leaf',
    description: 'Natural oils for hair and beard care',
    productCount: 14
  },
  // New categories appended below
  {
    id: 'acne',
    name: 'Acne Treatment',
    icon: 'droplets',
    description: 'Natural acne treatment solutions',
    productCount: 8
  },
  {
    id: 'black-soap',
    name: 'Black Soap',
    icon: 'soap',
    description: 'Authentic African black soap',
    productCount: 6
  },
  {
    id: 'detox',
    name: 'Detox Products',
    icon: 'recycle',
    description: 'Body cleansing & detox products',
    productCount: 12
  },
  {
    id: 'herbal-tea',
    name: 'Herbal Tea',
    icon: 'coffee',
    description: 'Premium herbal tea blends',
    productCount: 15
  },
  {
    id: 'vitamins',
    name: 'Vitamins',
    icon: 'pill',
    description: 'Essential vitamins & minerals',
    productCount: 22
  },
  {
    id: 'arthritis',
    name: 'Arthritis Care',
    icon: 'bone',
    description: 'Joint pain relief solutions',
    productCount: 10
  },
  {
    id: 'shea-butter',
    name: 'Shea Butter',
    icon: 'heart',
    description: 'Pure African shea butter',
    productCount: 7
  },
  {
    id: 'diabetes',
    name: 'Diabetes Support',
    icon: 'activity',
    description: 'Blood sugar management',
    productCount: 9
  },
  {
    id: 'tree-bark-roots',
    name: 'Tree Bark & Roots',
    icon: 'tree-pine',
    description: 'Traditional medicinal plants',
    productCount: 18
  },
  {
    id: 'rheumatoid-arthritis',
    name: 'Rheumatoid Arthritis',
    icon: 'shield',
    description: 'Specialized arthritis care',
    productCount: 6
  },
  {
    id: 'weight-loss',
    name: 'Weight Loss',
    icon: 'trending-down',
    description: 'Natural weight management',
    productCount: 14
  },
  {
    id: 'candidiasis',
    name: 'Candidiasis Treatment',
    icon: 'zap',
    description: 'Antifungal treatment options',
    productCount: 5
  },
  {
    id: 'herbal-tonic-mixture',
    name: 'Herbal Tonic Mixture',
    icon: 'beaker',
    description: 'Comprehensive health tonics',
    productCount: 11
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Organic Moringa Powder',
    description: 'Premium quality moringa powder packed with essential vitamins and minerals.',
    benefits: ['Rich in iron and antioxidants', 'Supports immune system', 'Natural energy booster', 'Anti-inflammatory properties'],
    usage: 'Mix 1 teaspoon in water, juice, or smoothie daily. Best taken on empty stomach.',
    ingredients: ['100% Organic Moringa Oleifera Leaf Powder'],
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.8,
    reviews: 127,
    category: 'herbal-supplements',
    image: 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg',
    inStock: true,
    requiresPrescription: false,
    tags: ['organic', 'superfood', 'vitamin-rich'],
    weight: 0.5
  },
  {
    id: '2',
    name: 'Turmeric Curcumin Complex',
    description: 'High-potency turmeric with black pepper extract for maximum absorption.',
    benefits: ['Powerful anti-inflammatory', 'Joint health support', 'Antioxidant protection', 'Brain health support'],
    usage: 'Take 2 capsules daily with meals or as directed by healthcare provider.',
    ingredients: ['Turmeric Root Extract (95% Curcuminoids)', 'Black Pepper Extract (Piperine)', 'Vegetable Capsule'],
    price: 32.99,
    rating: 4.9,
    reviews: 203,
    category: 'herbal-supplements',
    image: 'https://images.pexels.com/photos/2406181/pexels-photo-2406181.jpeg',
    inStock: true,
    requiresPrescription: false,
    tags: ['anti-inflammatory', 'joint-health', 'organic'],
    weight: 0.3
  },
  {
    id: '3',
    name: 'Ashwagandha Root Extract',
    description: 'Adaptogenic herb traditionally used to help manage stress and support energy levels.',
    benefits: ['Stress management', 'Energy and vitality', 'Sleep quality support', 'Cognitive function'],
    usage: 'Take 1-2 capsules daily, preferably with meals. Consult healthcare provider for long-term use.',
    ingredients: ['Ashwagandha Root Extract (Withania somnifera)', 'Vegetable Capsule', 'Rice Flour'],
    price: 28.99,
    rating: 4.7,
    reviews: 156,
    category: 'herbal-supplements',
    image: 'https://images.pexels.com/photos/6620777/pexels-photo-6620777.jpeg',
    inStock: true,
    requiresPrescription: false,
    tags: ['adaptogen', 'stress-relief', 'energy'],
    weight: 0.25
  },
  {
    id: '4',
    name: 'Complete Vitamin D Test Kit',
    description: 'At-home vitamin D level testing with lab-quality results.',
    benefits: ['Quick and accurate results', 'Lab-certified testing', 'Easy sample collection', 'Detailed health report'],
    usage: 'Follow included instructions for sample collection. Results available in 3-5 business days.',
    price: 49.99,
    rating: 4.6,
    reviews: 89,
    category: 'test-kits',
    image: 'https://images.pexels.com/photos/3786252/pexels-photo-3786252.jpeg',
    inStock: true,
    requiresPrescription: false,
    tags: ['home-testing', 'vitamin-d', 'health-monitoring'],
    weight: 0.1
  },
  {
    id: '5',
    name: 'Women\'s Hormonal Balance Support',
    description: 'Natural blend designed to support women\'s hormonal health and menstrual wellness.',
    benefits: ['Hormonal balance support', 'Menstrual comfort', 'Mood stability', 'Energy support'],
    usage: 'Take 2 capsules daily with food. Best results with consistent use for 2-3 months.',
    ingredients: ['Chasteberry Extract', 'Evening Primrose Oil', 'Dong Quai Root', 'Wild Yam Extract'],
    price: 39.99,
    rating: 4.5,
    reviews: 174,
    category: 'womens-health',
    image: 'https://images.pexels.com/photos/3738073/pexels-photo-3738073.jpeg',
    inStock: true,
    requiresPrescription: false,
    tags: ['hormonal-health', 'womens-wellness', 'natural'],
    weight: 0.2
  },
  {
    id: '6',
    name: 'Digestive Enzyme Complex',
    description: 'Comprehensive enzyme blend to support healthy digestion and nutrient absorption.',
    benefits: ['Improved digestion', 'Reduced bloating', 'Better nutrient absorption', 'Digestive comfort'],
    usage: 'Take 1-2 capsules with each meal or as directed by healthcare provider.',
    ingredients: ['Amylase', 'Protease', 'Lipase', 'Cellulase', 'Lactase', 'Bromelain', 'Papain'],
    price: 26.99,
    rating: 4.4,
    reviews: 92,
    category: 'digestive-health',
    image: 'https://images.pexels.com/photos/6956441/pexels-photo-6956441.jpeg',
    inStock: true,
    requiresPrescription: false,
    tags: ['digestive-health', 'enzymes', 'bloating-relief'],
    weight: 0.15
  },
  {
    id: '7',
    name: 'Elderberry Immune Support',
    description: 'Concentrated elderberry extract with vitamin C and zinc for immune system support.',
    benefits: ['Immune system boost', 'Antioxidant protection', 'Seasonal wellness', 'Natural vitamin C'],
    usage: 'Take 1 tablespoon daily or as needed. Can be mixed with water or taken directly.',
    ingredients: ['Elderberry Extract', 'Vitamin C', 'Zinc', 'Honey', 'Natural Flavors'],
    price: 22.99,
    rating: 4.7,
    reviews: 145,
    category: 'immune-support',
    image: 'https://images.pexels.com/photos/2649403/pexels-photo-2649403.jpeg',
    inStock: true,
    requiresPrescription: false,
    tags: ['immune-support', 'elderberry', 'vitamin-c'],
    weight: 0.4
  },
  {
    id: '8',
    name: 'Men\'s Vitality Complex',
    description: 'Comprehensive formula designed to support men\'s energy, stamina, and overall wellness.',
    benefits: ['Energy and stamina', 'Hormonal support', 'Physical performance', 'Overall vitality'],
    usage: 'Take 3 capsules daily with breakfast or as directed by healthcare provider.',
    ingredients: ['Tribulus Terrestris', 'Maca Root', 'Ginseng Extract', 'Zinc', 'Vitamin D3', 'Fenugreek'],
    price: 44.99,
    rating: 4.6,
    reviews: 118,
    category: 'mens-health',
    image: 'https://images.pexels.com/photos/3683053/pexels-photo-3683053.jpeg',
    inStock: true,
    requiresPrescription: false,
    tags: ['mens-health', 'vitality', 'energy'],
    weight: 0.3
  },
  {
    id: '9',
    name: 'Organic Argan Hair Oil',
    description: 'Pure Moroccan argan oil for nourishing and strengthening hair.',
    benefits: ['Deep hair nourishment', 'Reduces frizz', 'Adds natural shine', 'Strengthens hair follicles'],
    usage: 'Apply a few drops to damp or dry hair. Can be used daily as a leave-in treatment.',
    ingredients: ['100% Pure Organic Argan Oil (Argania Spinosa)'],
    price: 18.99,
    rating: 4.8,
    reviews: 89,
    category: 'hair-care',
    image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg',
    inStock: true,
    requiresPrescription: false,
    tags: ['hair-care', 'organic', 'argan-oil'],
    weight: 0.1
  },
  {
    id: '10',
    name: 'Beard Growth & Conditioning Oil',
    description: 'Premium blend of natural oils to promote beard growth and maintain healthy facial hair.',
    benefits: ['Promotes beard growth', 'Softens and conditions', 'Reduces itchiness', 'Natural shine'],
    usage: 'Apply 3-5 drops to clean beard and massage into skin. Use daily for best results.',
    ingredients: ['Jojoba Oil', 'Argan Oil', 'Castor Oil', 'Vitamin E', 'Cedarwood Essential Oil', 'Sandalwood Essential Oil'],
    price: 24.99,
    rating: 4.7,
    reviews: 156,
    category: 'hair-care',
    image: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg',
    inStock: true,
    requiresPrescription: false,
    tags: ['beard-care', 'hair-growth', 'natural-oils'],
    weight: 0.08
  },
  {
    id: '11',
    name: 'Rosemary Hair Growth Serum',
    description: 'Concentrated rosemary extract serum to stimulate hair growth and improve scalp health.',
    benefits: ['Stimulates hair growth', 'Improves scalp circulation', 'Strengthens hair roots', 'Prevents hair loss'],
    usage: 'Apply to scalp and massage gently. Leave on for at least 30 minutes or overnight. Use 2-3 times per week.',
    ingredients: ['Rosemary Extract', 'Peppermint Oil', 'Biotin', 'Caffeine', 'Niacinamide'],
    price: 29.99,
    rating: 4.6,
    reviews: 203,
    category: 'hair-care',
    image: 'https://images.pexels.com/photos/7262800/pexels-photo-7262800.jpeg',
    inStock: true,
    requiresPrescription: false,
    tags: ['hair-growth', 'rosemary', 'scalp-health'],
    weight: 0.12
  }
];

export const featuredProducts = products.slice(0, 4);