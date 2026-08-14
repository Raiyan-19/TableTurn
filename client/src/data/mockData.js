export const BANGLADESH_DIVISIONS = [
  'Dhaka',
  'Chattogram',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
];

export const DIVISION_SUBZONES = {
  Dhaka: ['Gulshan 1 & 2', 'Banani', 'Dhanmondi', 'Uttara', 'Old Dhaka', 'Bailey Road', 'Mirpur'],
  Chattogram: ['GEC Circle', 'Nasirabad & Khulshi', 'Agrabad', 'Patenga Coastal', 'Halishahar'],
  Rajshahi: ['Shaheb Bazar & Kazihata', 'Padma Riverside', 'Upashahar', 'Motihar'],
  Khulna: ['Shib Bari More', 'Sonadanga', 'Rupsha Riverside', 'Boyra & Khalishpur'],
  Barishal: ['Band Road & Waterfront', 'Sadar Road', 'Bibir Pukur Par', 'Rupatali'],
  Sylhet: ['Shahjalal Upashahar', 'Zindabazar', 'Amberkhana', 'Subidbazar', 'Sreemangal Road'],
  Rangpur: ['Jahaj Company More', 'Carmichael Area & Modern More', 'Radhaballav', 'Dhap'],
  Mymensingh: ['Town Hall & Riverfront', 'Ganginar Par & Choto Bazar', 'Kachijhuli', 'Charpara'],
};

export const CUISINE_CATEGORIES = [
  'All Cuisines',
  'Bengali',
  'Biryani & Kacchi',
  'Pan-Asian',
  'Continental',
  'Seafood',
  'Rooftop',
  'Fine Dining',
  'Cafés',
  'Mezban',
  'Chui Jhal',
];

export const PRICE_TIERS = [
  { label: 'All', value: 'All' },
  { label: '৳ (Under 1000)', value: '৳' },
  { label: '৳৳ (1000 - 2500)', value: '৳৳' },
  { label: '৳৳৳ (2500 - 4500)', value: '৳৳৳' },
  { label: '৳৳৳৳ (Fine Dining 4500+)', value: '৳৳৳৳' },
];

export const MEAL_WINDOWS = [
  { id: 'all', label: 'Any Time', timeRange: '12:00 PM - 11:30 PM' },
  { id: 'breakfast', label: 'Breakfast', timeRange: '08:00 AM - 11:30 AM' },
  { id: 'lunch', label: 'Lunch', timeRange: '12:00 PM - 03:30 PM' },
  { id: 'hightea', label: 'High Tea', timeRange: '04:00 PM - 06:30 PM' },
  { id: 'dinner', label: 'Dinner', timeRange: '07:00 PM - 10:30 PM' },
  { id: 'latenight', label: 'Late Night', timeRange: '10:30 PM - 01:00 AM' },
];

export const HERO_EXPERIENCES = [
  { division: 'Dhaka', tag: 'Fine Dining & Robata', text: 'Book exclusive botanical glasshouse dining in Gulshan & Banani', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80' },
  { division: 'Chattogram', tag: 'Port City Heritage', text: 'Savor legendary authentic Mezban beef in CDA Avenue & GEC', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80' },
  { division: 'Sylhet', tag: 'Tea Estate Retreats', text: 'Experience riverside gazebos & Shatkora pots in Upashahar', image: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1200&q=80' },
  { division: 'Rajshahi', tag: 'Padma Riverside', text: 'Catch golden sunset waves over fresh Ilish & grills on the Padma', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80' },
  { division: 'Khulna', tag: 'Chui Jhal Delicacies', text: 'Taste fire-braised Chuknagar beef root stews in Shib Bari', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80' },
  { division: 'Barishal', tag: 'Venice of Bengal', text: 'Enjoy river pier dining & fresh Kirtankhola Hilsa', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80' },
  { division: 'Rangpur', tag: 'Northern Feasts', text: 'Discover Haribhanga charcoal grills & heritage coffee roasteries', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80' },
  { division: 'Mymensingh', tag: 'Zamindar Heritage', text: 'Dine by the Brahmaputra with royal Muktagacha Monda soufflé', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80' },
];

export const INITIAL_RESTAURANTS = [
  // 1. DHAKA DIVISION
  {
    _id: 'res_bd_1',
    id: 'res_bd_1',
    name: 'The Grove Gulshan',
    tagline: 'Refined Pan-Asian & Charcoal Grills with botanical glasshouse dining',
    division: 'Dhaka',
    subDistrict: 'Gulshan 2',
    address: 'Road 54, Gulshan 2, Dhaka 1212',
    cuisineTypes: ['Pan-Asian', 'Fine Dining', 'Steakhouse'],
    priceCategory: '৳৳৳৳',
    averageCostForTwo: 4500,
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.9,
    reviewsCount: 384,
    features: ['Halal Certified', 'Valet Parking', 'Private Dining Room', 'Live Sushi Counter', 'Outdoor Garden'],
    seatingAreas: [
      { name: 'Glasshouse Dining', description: 'Sunlit conservatory with botanical flora', capacity: 4 },
      { name: 'Chef’s Omakase Counter', description: 'Front-row view of charcoal grilling', capacity: 2 },
      { name: 'VIP Garden Booth', description: 'Secluded outdoor booth with climate misting', capacity: 6 }
    ],
    defaultSlots: [
      { time: '12:30 PM', type: 'Glasshouse Dining', available: true },
      { time: '01:15 PM', type: 'Chef’s Omakase', available: true },
      { time: '07:00 PM', type: 'Glasshouse Dining', available: true },
      { time: '07:45 PM', type: 'VIP Garden Booth', available: true },
      { time: '08:30 PM', type: 'Chef’s Omakase', available: true },
      { time: '09:15 PM', type: 'Glasshouse Dining', available: true }
    ],
    signatureDishes: [
      { name: 'Wagyu A5 Robata Skewers', priceBDT: 2400, description: 'Glazed with artisanal tare sauce and white sesame', isChefSpecial: true },
      { name: 'Truffle Salmon Aburi Roll', priceBDT: 1350, description: 'Torched Norwegian salmon with black winter truffle aioli', isChefSpecial: true },
      { name: 'Matcha Fondant with Gold Leaf', priceBDT: 750, description: 'Molten ceremonial Kyoto matcha cake with vanilla bean gelato', isChefSpecial: false }
    ],
    chefNote: 'Our culinary philosophy blends Japanese robatayaki precision with Dhaka’s finest green sanctuary.',
    isFeatured: true
  },
  {
    _id: 'res_bd_2',
    id: 'res_bd_2',
    name: 'Kacchi Dynasty Heritage',
    tagline: 'Authentic Shahi Old Dhaka Dum Kacchi cooked in traditional copper deghs',
    division: 'Dhaka',
    subDistrict: 'Dhanmondi',
    address: 'House 32, Road 11/A, Dhanmondi, Dhaka 1209',
    cuisineTypes: ['Bengali', 'Biryani & Kacchi', 'Mughlai'],
    priceCategory: '৳৳',
    averageCostForTwo: 1400,
    photos: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.8,
    reviewsCount: 890,
    features: ['Halal Certified', 'Family Friendly', 'Takeaway Counter', 'Air Conditioned'],
    seatingAreas: [
      { name: 'Royal Dawat Hall', description: 'Comfortable family banquet tables', capacity: 6 },
      { name: 'Heritage Majlis', description: 'Low-cushioned traditional seating section', capacity: 8 }
    ],
    defaultSlots: [
      { time: '12:00 PM', type: 'Royal Dawat Hall', available: true },
      { time: '01:30 PM', type: 'Heritage Majlis', available: true },
      { time: '07:00 PM', type: 'Royal Dawat Hall', available: true },
      { time: '08:15 PM', type: 'Heritage Majlis', available: true }
    ],
    signatureDishes: [
      { name: 'Special Shahi Mutton Dum Kacchi', priceBDT: 590, description: 'Fragrant chinigura rice slow-cooked with tender Australian mutton and golden aloo', isChefSpecial: true },
      { name: 'Zafrani Borhani Pitcher', priceBDT: 180, description: 'Spiced curd beverage infused with saffron and roasted cumin', isChefSpecial: false }
    ],
    chefNote: 'Puron Dhaka century-old recipes using pure mustard oil, shahi ghee, and hand-ground spices.',
    isFeatured: true
  },
  {
    _id: 'res_bd_3',
    id: 'res_bd_3',
    name: 'Skyline Terrace & Bistro',
    tagline: 'Panoramic 360° city skyline view with contemporary Mediterranean fare',
    division: 'Dhaka',
    subDistrict: 'Banani',
    address: 'Level 19, Tower 71, Kemal Ataturk Avenue, Banani, Dhaka 1213',
    cuisineTypes: ['Continental', 'Mediterranean', 'Rooftop', 'Cafés'],
    priceCategory: '৳৳৳',
    averageCostForTwo: 3200,
    photos: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.7,
    reviewsCount: 420,
    features: ['Rooftop View', 'Outdoor Seating', 'Live Acoustic Music', 'Halal Certified'],
    defaultSlots: [
      { time: '05:30 PM', type: 'Rooftop Rim Table', available: true },
      { time: '07:00 PM', type: 'Sky Lounge Sofa', available: true },
      { time: '08:30 PM', type: 'Rooftop Rim Table', available: true },
      { time: '10:00 PM', type: 'Sky Lounge Sofa', available: true }
    ],
    isFeatured: true
  },

  // 2. CHATTOGRAM DIVISION
  {
    _id: 'res_bd_4',
    id: 'res_bd_4',
    name: 'Mezban Haat Port Heritage',
    tagline: 'The pinnacle of authentic Chittagonian Mezban Beef & Chonadaal',
    division: 'Chattogram',
    subDistrict: 'GEC Circle',
    address: 'CDA Avenue, GEC Circle, Chattogram 4000',
    cuisineTypes: ['Bengali', 'Mezban', 'Traditional Curries'],
    priceCategory: '৳৳',
    averageCostForTwo: 1200,
    photos: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.9,
    reviewsCount: 750,
    features: ['Authentic Recipe', 'Halal Certified', 'Air Conditioned', 'Family Dining'],
    defaultSlots: [
      { time: '12:00 PM', type: 'Heritage Hall', available: true },
      { time: '01:30 PM', type: 'Mezban Grand Table', available: true },
      { time: '07:30 PM', type: 'Heritage Hall', available: true },
      { time: '09:00 PM', type: 'Mezban Grand Table', available: true }
    ],
    signatureDishes: [
      { name: 'Royal Chittagong Mezban Gosht', priceBDT: 480, description: 'Slow-simmered prime beef infused with 24 secret Chittagonian spices', isChefSpecial: true },
      { name: 'Chana Daal with Beef Bone Marrow', priceBDT: 280, description: 'Yellow split chickpeas slow cooked in rich beef broth', isChefSpecial: false }
    ],
    isFeatured: true
  },
  {
    _id: 'res_bd_5',
    id: 'res_bd_5',
    name: 'The Bayview Terrace & Grill',
    tagline: 'Coastal breezes, fresh Bay of Bengal catch and sunset dining',
    division: 'Chattogram',
    subDistrict: 'Nasirabad & Khulshi',
    address: 'Zakir Hossain Road, South Khulshi, Chattogram 4225',
    cuisineTypes: ['Seafood', 'Continental', 'Fine Dining', 'Rooftop'],
    priceCategory: '৳৳৳',
    averageCostForTwo: 2800,
    photos: [
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.8,
    reviewsCount: 310,
    features: ['Rooftop View', 'Outdoor Seating', 'Live Grill Counter', 'Halal Certified'],
    defaultSlots: [
      { time: '06:00 PM', type: 'Terrace Pergola', available: true },
      { time: '07:30 PM', type: 'Terrace Pergola', available: true },
      { time: '09:00 PM', type: 'Chef’s Seafood Grill Bar', available: true }
    ],
    isFeatured: false
  },

  // 3. SYLHET DIVISION
  {
    _id: 'res_bd_6',
    id: 'res_bd_6',
    name: 'Grand Sylhet Garden & Grill',
    tagline: 'Serene dining amidst tea estate greenery and artisanal local delights',
    division: 'Sylhet',
    subDistrict: 'Shahjalal Upashahar',
    address: 'Block D, Shahjalal Upashahar, Sylhet 3100',
    cuisineTypes: ['Fine Dining', 'Bengali', 'Continental', 'Cafés'],
    priceCategory: '৳৳৳',
    averageCostForTwo: 2600,
    photos: [
      'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.8,
    reviewsCount: 340,
    features: ['Garden Seating', 'Tea Lounge', 'Halal Certified', 'Free WiFi'],
    defaultSlots: [
      { time: '01:00 PM', type: 'Tea Garden Gazebo', available: true },
      { time: '04:30 PM', type: 'Tea Garden Gazebo', available: true },
      { time: '07:30 PM', type: 'Sultan Hall', available: true },
      { time: '09:00 PM', type: 'Tea Garden Gazebo', available: true }
    ],
    signatureDishes: [
      { name: 'Sylheti Beef Shatkora Gourmet Pot', priceBDT: 680, description: 'Prime beef slow-stewed with wild indigenous citrus Shatkora peel', isChefSpecial: true },
      { name: 'Seven-Layer Artisanal Tea Taster', priceBDT: 250, description: 'Iconic Sreemangal spiced tea layers presented with fresh cookies', isChefSpecial: false }
    ],
    isFeatured: true
  },
  {
    _id: 'res_bd_7',
    id: 'res_bd_7',
    name: 'Panshi Riverside Heritage',
    tagline: 'Sylhet’s legendary culinary house famous for 30+ varieties of fresh bhortas',
    division: 'Sylhet',
    subDistrict: 'Zindabazar',
    address: 'Jail Road, Zindabazar, Sylhet 3100',
    cuisineTypes: ['Bengali', 'Bhorta & Fish', 'Traditional Curries'],
    priceCategory: '৳',
    averageCostForTwo: 700,
    photos: [
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.9,
    reviewsCount: 1420,
    features: ['Legendary Bhortas', 'Halal Certified', 'Late Night Dining'],
    defaultSlots: [
      { time: '12:30 PM', type: 'Family Dining Floor', available: true },
      { time: '01:30 PM', type: 'Family Dining Floor', available: true },
      { time: '08:00 PM', type: 'Family Dining Floor', available: true }
    ],
    isFeatured: false
  },

  // 4. RAJSHAHI DIVISION
  {
    _id: 'res_bd_8',
    id: 'res_bd_8',
    name: 'Padma Breeze Riverside Retreat',
    tagline: 'Stunning sunset dining on the banks of the mighty Padma River',
    division: 'Rajshahi',
    subDistrict: 'Shaheb Bazar & Kazihata',
    address: 'T-Bandh Road, Padma Riverside, Rajshahi 6000',
    cuisineTypes: ['Bengali', 'Seafood', 'Rooftop', 'Continental'],
    priceCategory: '৳৳',
    averageCostForTwo: 1300,
    photos: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.7,
    reviewsCount: 290,
    features: ['Riverfront View', 'Outdoor Deck', 'Live Char Grills', 'Halal Certified'],
    defaultSlots: [
      { time: '05:00 PM', type: 'Padma Deck Cabana', available: true },
      { time: '06:30 PM', type: 'Padma Deck Cabana', available: true },
      { time: '08:00 PM', type: 'Garden Pavilion', available: true }
    ],
    signatureDishes: [
      { name: 'Padma River Fresh Ilish Jhol', priceBDT: 750, description: 'Wild Padma Hilsa cooked with green chilies and mustard paste', isChefSpecial: true },
      { name: 'Rajshahi Fazli Mango Glazed Chicken', priceBDT: 550, description: 'Grilled chicken skewers infused with seasonal Fazli mango glaze', isChefSpecial: true }
    ],
    isFeatured: true
  },
  {
    _id: 'res_bd_9',
    id: 'res_bd_9',
    name: 'Chillies Gourmet Kazihata',
    tagline: 'Rajshahi’s premier destination for wood-fired pizzas and sizzling steaks',
    division: 'Rajshahi',
    subDistrict: 'Kazihata',
    address: 'VIP Road, Kazihata, Rajshahi 6000',
    cuisineTypes: ['Continental', 'Pan-Asian', 'Cafés'],
    priceCategory: '৳৳',
    averageCostForTwo: 1600,
    photos: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.6,
    reviewsCount: 220,
    features: ['Wood-Fired Oven', 'Halal Certified', 'Dessert Counter'],
    defaultSlots: [
      { time: '01:00 PM', type: 'Main Lounge', available: true },
      { time: '07:30 PM', type: 'Main Lounge', available: true },
      { time: '09:00 PM', type: 'Main Lounge', available: true }
    ],
    isFeatured: false
  },

  // 5. KHULNA DIVISION
  {
    _id: 'res_bd_10',
    id: 'res_bd_10',
    name: 'Chui Jhal Heritage Royal',
    tagline: 'Authentic Southern Khulna specialty beef braised with pungent Piper Chaba stems',
    division: 'Khulna',
    subDistrict: 'Shib Bari More',
    address: 'KDA Avenue, Shib Bari More, Khulna 9100',
    cuisineTypes: ['Bengali', 'Traditional Curries', 'Chui Jhal'],
    priceCategory: '৳৳',
    averageCostForTwo: 1100,
    photos: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.9,
    reviewsCount: 510,
    features: ['Chui Jhal Specialty', 'Halal Certified', 'Family Dining'],
    defaultSlots: [
      { time: '12:30 PM', type: 'Sunderban Hall', available: true },
      { time: '02:00 PM', type: 'Sunderban Hall', available: true },
      { time: '08:00 PM', type: 'Sunderban Hall', available: true }
    ],
    signatureDishes: [
      { name: 'Chuknagar Special Chui Jhal Mutton', priceBDT: 520, description: 'Tender mutton with infused chunks of aromatic Chui Jhal root stems', isChefSpecial: true },
      { name: 'Bagda Chingri Malai Curry', priceBDT: 580, description: 'Tiger prawns simmered in spiced coconut cream', isChefSpecial: true }
    ],
    isFeatured: true
  },
  {
    _id: 'res_bd_11',
    id: 'res_bd_11',
    name: 'Rupsha Castle Riverside',
    tagline: 'Picturesque bridge view dining with live Sundarbans honey mocktails',
    division: 'Khulna',
    subDistrict: 'Sonadanga',
    address: 'Sonadanga Main Road, Khulna 9000',
    cuisineTypes: ['Continental', 'Pan-Asian', 'Seafood'],
    priceCategory: '৳৳৳',
    averageCostForTwo: 2400,
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.6,
    reviewsCount: 195,
    features: ['Waterfront View', 'Halal Certified', 'Banquet Space'],
    defaultSlots: [
      { time: '01:00 PM', type: 'Riverside Veranda', available: true },
      { time: '07:30 PM', type: 'Riverside Veranda', available: true }
    ],
    isFeatured: false
  },

  // 6. BARISHAL DIVISION
  {
    _id: 'res_bd_12',
    id: 'res_bd_12',
    name: 'Kirtankhola Riverfront Pavilion',
    tagline: 'Venice of Bengal culinary gem famous for river Hilsa, lobster, and sweet coconut',
    division: 'Barishal',
    subDistrict: 'Band Road & Waterfront',
    address: 'Band Road, Waterfront Park, Barishal 8200',
    cuisineTypes: ['Bengali', 'Seafood', 'Rooftop', 'Buffet'],
    priceCategory: '৳৳',
    averageCostForTwo: 1400,
    photos: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.8,
    reviewsCount: 310,
    features: ['Riverfront View', 'Halal Certified', 'Outdoor Deck'],
    defaultSlots: [
      { time: '12:45 PM', type: 'River Pier Table', available: true },
      { time: '07:30 PM', type: 'River Pier Table', available: true },
      { time: '09:00 PM', type: 'Palm Pavilion', available: true }
    ],
    signatureDishes: [
      { name: 'Barishali Shorshe Ilish with Green Chilis', priceBDT: 820, description: 'Fresh Ilish from Meghna-Kirtankhola confluence in mustard paste', isChefSpecial: true }
    ],
    isFeatured: true
  },
  {
    _id: 'res_bd_13',
    id: 'res_bd_13',
    name: 'Handi Biryani & Kebab Sadar',
    tagline: 'Fragrant clay-pot biryani and melt-in-mouth boti kebabs',
    division: 'Barishal',
    subDistrict: 'Sadar Road',
    address: 'Sadar Road, Bibir Pukur Par, Barishal 8200',
    cuisineTypes: ['Bengali', 'Biryani & Kacchi', 'Mughlai'],
    priceCategory: '৳',
    averageCostForTwo: 850,
    photos: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.7,
    reviewsCount: 280,
    features: ['Clay Pot Cooking', 'Halal Certified', 'Family Friendly'],
    defaultSlots: [
      { time: '01:00 PM', type: 'Family Booth', available: true },
      { time: '07:30 PM', type: 'Family Booth', available: true }
    ],
    isFeatured: false
  },

  // 7. RANGPUR DIVISION
  {
    _id: 'res_bd_14',
    id: 'res_bd_14',
    name: 'North View Grand Palace',
    tagline: 'Regal dining in the Northern capital with traditional North Bengal grilled feasts',
    division: 'Rangpur',
    subDistrict: 'Jahaj Company More',
    address: 'Station Road, Jahaj Company More, Rangpur 5400',
    cuisineTypes: ['Continental', 'Bengali', 'Pan-Asian', 'Fine Dining'],
    priceCategory: '৳৳',
    averageCostForTwo: 1500,
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.7,
    reviewsCount: 230,
    features: ['Fine Dining Ambiance', 'Halal Certified', 'Banquet Hall'],
    defaultSlots: [
      { time: '01:00 PM', type: 'Royal Taj Dining', available: true },
      { time: '07:30 PM', type: 'Royal Taj Dining', available: true },
      { time: '09:00 PM', type: 'Royal Taj Dining', available: true }
    ],
    signatureDishes: [
      { name: 'Rangpuri Haribhanga Charcoal Gosht', priceBDT: 560, description: 'Prime beef infused with smoked whole spices and wild mustard', isChefSpecial: true },
      { name: 'Teesta River Chitol Muitha Curry', priceBDT: 490, description: 'Spiced fish balls from Teesta featherback fish in golden gravy', isChefSpecial: true }
    ],
    isFeatured: true
  },
  {
    _id: 'res_bd_15',
    id: 'res_bd_15',
    name: 'Carmichael Cafés & Roastery',
    tagline: 'Artisanal coffee, wood-fired snacks, and student-heritage ambiance',
    division: 'Rangpur',
    subDistrict: 'Carmichael Area & Modern More',
    address: 'Carmichael College Road, Rangpur 5400',
    cuisineTypes: ['Cafés', 'Continental', 'Desserts'],
    priceCategory: '৳',
    averageCostForTwo: 650,
    photos: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.8,
    reviewsCount: 310,
    features: ['Artisan Coffee', 'Free WiFi', 'Book Nook'],
    defaultSlots: [
      { time: '11:00 AM', type: 'Study Garden Booth', available: true },
      { time: '04:30 PM', type: 'Study Garden Booth', available: true }
    ],
    isFeatured: false
  },

  // 8. MYMENSINGH DIVISION
  {
    _id: 'res_bd_16',
    id: 'res_bd_16',
    name: 'Brahmaputra River Heritage Lounge',
    tagline: 'Riverside dining with traditional Muktagacha Monda, fresh river fish & scenic tranquility',
    division: 'Mymensingh',
    subDistrict: 'Town Hall & Riverfront',
    address: 'Park Road, Riverfront Boulevard, Mymensingh 2200',
    cuisineTypes: ['Bengali', 'Seafood', 'Rooftop', 'Cafés'],
    priceCategory: '৳৳',
    averageCostForTwo: 1100,
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.8,
    reviewsCount: 260,
    features: ['Brahmaputra View', 'Halal Certified', 'Heritage Desserts'],
    defaultSlots: [
      { time: '01:00 PM', type: 'Riverbank Veranda', available: true },
      { time: '05:00 PM', type: 'Riverbank Veranda', available: true },
      { time: '07:30 PM', type: 'Zamindar Hall', available: true }
    ],
    signatureDishes: [
      { name: 'Brahmaputra River Ayeer Fish Bhuna', priceBDT: 480, description: 'Fresh catfish cooked with roasted cumin and crushed green chilies', isChefSpecial: true },
      { name: 'Authentic Muktagacha Monda Soufflé', priceBDT: 220, description: 'Classic 200-year-old curd dessert recipe served warm', isChefSpecial: true }
    ],
    isFeatured: true
  },
  {
    _id: 'res_bd_17',
    id: 'res_bd_17',
    name: 'Ganginar Par Sizzler & Grill',
    tagline: 'Sizzling platters, tandoori grills, and lively family gatherings',
    division: 'Mymensingh',
    subDistrict: 'Ganginar Par & Choto Bazar',
    address: 'Station Road, Ganginar Par, Mymensingh 2200',
    cuisineTypes: ['Continental', 'Bengali', 'Biryani & Kacchi'],
    priceCategory: '৳',
    averageCostForTwo: 900,
    photos: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.6,
    reviewsCount: 180,
    features: ['Live Sizzlers', 'Halal Certified', 'Family AC Hall'],
    defaultSlots: [
      { time: '01:15 PM', type: 'Central Hall', available: true },
      { time: '07:45 PM', type: 'Central Hall', available: true }
    ],
    isFeatured: false
  }
];
