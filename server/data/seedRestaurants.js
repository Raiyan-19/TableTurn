const seedRestaurants = [
  // 1. DHAKA DIVISION
  {
    name: 'The Grove Gulshan',
    tagline: 'Refined Pan-Asian & Charcoal Grills with botanical glasshouse dining',
    division: 'Dhaka',
    subDistrict: 'Gulshan 2',
    address: 'Road 54, Gulshan 2, Dhaka 1212',
    location: { type: 'Point', coordinates: [90.4125, 23.7925] },
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
    operationalHours: { opening: '12:30 PM', closing: '11:30 PM', days: 'Everyday' },
    features: ['Halal Certified', 'Valet Parking', 'Private Dining Room', 'Live Sushi Counter', 'Outdoor Garden'],
    seatingAreas: [
      { name: 'Glasshouse Dining', description: 'Sunlit conservatory dining with botanical plants', capacity: 4, premiumSurcharge: 0 },
      { name: 'Chef’s Omakase Counter', description: 'Front-row view of head chef grilling over charcoal', capacity: 2, premiumSurcharge: 500 },
      { name: 'VIP Garden Booth', description: 'Intimate secluded outdoor setting with climate misting', capacity: 6, premiumSurcharge: 0 }
    ],
    defaultSlots: [
      { time: '12:30 PM', type: 'Glasshouse Dining', available: true, maxPartySize: 6 },
      { time: '01:15 PM', type: 'Chef’s Omakase Counter', available: true, maxPartySize: 2 },
      { time: '07:00 PM', type: 'Glasshouse Dining', available: true, maxPartySize: 8 },
      { time: '07:45 PM', type: 'VIP Garden Booth', available: true, maxPartySize: 6 },
      { time: '08:30 PM', type: 'Chef’s Omakase Counter', available: true, maxPartySize: 2 },
      { time: '09:15 PM', type: 'Glasshouse Dining', available: true, maxPartySize: 10 }
    ],
    signatureDishes: [
      { name: 'Wagyu A5 Robata Skewers', priceBDT: 2400, description: 'Glazed with artisanal tare sauce and white sesame', photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', isChefSpecial: true },
      { name: 'Truffle Salmon Aburi Roll', priceBDT: 1350, description: 'Torched Norwegian salmon with black winter truffle aioli', photo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', isChefSpecial: true },
      { name: 'Matcha Fondant with Gold Leaf', priceBDT: 750, description: 'Molten ceremonial Kyoto matcha cake with vanilla bean gelato', photo: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80', isChefSpecial: false }
    ],
    dressCode: 'Smart Casual / Elegant',
    parkingInfo: 'Complimentary Valet at North Entrance',
    chefNote: 'Our culinary philosophy blends Japanese robatayaki precision with the finest imported ingredients, served in Dhaka’s premier green sanctuary.',
    isFeatured: true
  },
  {
    name: 'Kacchi Dynasty Heritage',
    tagline: 'Authentic Shahi Old Dhaka Dum Kacchi cooked in traditional copper deghs',
    division: 'Dhaka',
    subDistrict: 'Dhanmondi',
    address: 'House 32, Road 11/A, Dhanmondi, Dhaka 1209',
    location: { type: 'Point', coordinates: [90.3753, 23.7461] },
    cuisineTypes: ['Bengali', 'Biryani & Kacchi', 'Mughlai'],
    priceCategory: '৳৳',
    averageCostForTwo: 1400,
    photos: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.8,
    reviewsCount: 890,
    operationalHours: { opening: '11:45 AM', closing: '11:00 PM', days: 'Everyday' },
    features: ['Halal Certified', 'Family Friendly', 'Takeaway Counter', 'Air Conditioned'],
    seatingAreas: [
      { name: 'Royal Dawat Hall', description: 'Comfortable family banquet tables with heritage brass tableware', capacity: 6, premiumSurcharge: 0 },
      { name: 'Heritage Majlis', description: 'Low-cushioned traditional seating section for authentic feasting', capacity: 8, premiumSurcharge: 0 }
    ],
    defaultSlots: [
      { time: '12:00 PM', type: 'Royal Dawat Hall', available: true, maxPartySize: 8 },
      { time: '01:30 PM', type: 'Heritage Majlis', available: true, maxPartySize: 8 },
      { time: '07:00 PM', type: 'Royal Dawat Hall', available: true, maxPartySize: 12 },
      { time: '08:15 PM', type: 'Heritage Majlis', available: true, maxPartySize: 8 },
      { time: '09:30 PM', type: 'Royal Dawat Hall', available: true, maxPartySize: 10 }
    ],
    signatureDishes: [
      { name: 'Special Shahi Mutton Dum Kacchi', priceBDT: 590, description: 'Fragrant chinigura rice slow-cooked with tender Australian mutton and melt-in-mouth golden aloo', photo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', isChefSpecial: true },
      { name: 'Zafrani Borhani Pitcher', priceBDT: 180, description: 'Spiced curd beverage infused with saffron, roasted cumin, and black salt', photo: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', isChefSpecial: false },
      { name: 'Shahi Jorda with Baby Gulab Jamun', priceBDT: 160, description: 'Sweet aromatic rice topped with dried nuts, mawa, and mini sweets', photo: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80', isChefSpecial: false }
    ],
    dressCode: 'Casual',
    parkingInfo: 'Dedicated basement parking available',
    chefNote: 'We adhere to 100-year-old Puron Dhaka recipes using pure mustard oil, shahi ghee, and unadulterated ground spices.',
    isFeatured: true
  },
  {
    name: 'Skyline Terrace & Bistro',
    tagline: 'Panoramic 360° city skyline view with contemporary Mediterranean fare',
    division: 'Dhaka',
    subDistrict: 'Banani',
    address: 'Level 19, Tower 71, Kemal Ataturk Avenue, Banani, Dhaka 1213',
    location: { type: 'Point', coordinates: [90.4034, 23.7937] },
    cuisineTypes: ['Continental', 'Mediterranean', 'Rooftop', 'Cafés'],
    priceCategory: '৳৳৳',
    averageCostForTwo: 3200,
    photos: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.7,
    reviewsCount: 420,
    operationalHours: { opening: '04:00 PM', closing: '12:30 AM', days: 'Everyday' },
    features: ['Rooftop View', 'Outdoor Seating', 'Live Acoustic Music', 'Halal Certified', 'Mocktail Bar'],
    seatingAreas: [
      { name: 'Rooftop Rim Table', description: 'Direct edge seating with illuminated skyline views of Banani & Gulshan', capacity: 4, premiumSurcharge: 0 },
      { name: 'Sky Lounge Sofa', description: 'Cozy lounge seating under canopy lights with fire lamps', capacity: 6, premiumSurcharge: 0 }
    ],
    defaultSlots: [
      { time: '05:30 PM', type: 'Rooftop Rim Table', available: true, maxPartySize: 4 },
      { time: '07:00 PM', type: 'Sky Lounge Sofa', available: true, maxPartySize: 6 },
      { time: '08:30 PM', type: 'Rooftop Rim Table', available: true, maxPartySize: 4 },
      { time: '10:00 PM', type: 'Sky Lounge Sofa', available: true, maxPartySize: 8 }
    ],
    signatureDishes: [
      { name: 'Charred Mediterranean Sea Bass', priceBDT: 1850, description: 'Pan-seared sea bass with saffron butter sauce and grilled asparagus', photo: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80', isChefSpecial: true },
      { name: 'Artisan Burrata & Heirloom Salad', priceBDT: 1200, description: 'Fresh creamy burrata cheese, aged balsamic reduction, and basil oil', photo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', isChefSpecial: false }
    ],
    dressCode: 'Smart Casual',
    parkingInfo: 'Valet Service at Kemal Ataturk Entrance',
    chefNote: 'Dhaka looks magical from 19 floors above. Savor handcrafted mocktails and slow-grilled specialties as the sun sets over the metropolis.',
    isFeatured: true
  },

  // 2. CHATTOGRAM DIVISION
  {
    name: 'Mezban Haat Port Heritage',
    tagline: 'The pinnacle of authentic Chittagonian Mezban Beef & Chonadaal',
    division: 'Chattogram',
    subDistrict: 'GEC Circle',
    address: 'CDA Avenue, GEC Circle, Chattogram 4000',
    location: { type: 'Point', coordinates: [91.8225, 22.3585] },
    cuisineTypes: ['Bengali', 'Mezban', 'Traditional Curries'],
    priceCategory: '৳৳',
    averageCostForTwo: 1200,
    photos: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.9,
    reviewsCount: 750,
    operationalHours: { opening: '11:30 AM', closing: '11:00 PM', days: 'Everyday' },
    features: ['Authentic Recipe', 'Halal Certified', 'Air Conditioned', 'Family Dining'],
    seatingAreas: [
      { name: 'Heritage Hall', description: 'Air-conditioned dining with traditional copper platters', capacity: 4, premiumSurcharge: 0 },
      { name: 'Mezban Grand Table', description: 'Long banqueting table for family groups', capacity: 12, premiumSurcharge: 0 }
    ],
    defaultSlots: [
      { time: '12:00 PM', type: 'Heritage Hall', available: true, maxPartySize: 6 },
      { time: '01:30 PM', type: 'Mezban Grand Table', available: true, maxPartySize: 12 },
      { time: '07:30 PM', type: 'Heritage Hall', available: true, maxPartySize: 8 },
      { time: '09:00 PM', type: 'Mezban Grand Table', available: true, maxPartySize: 10 }
    ],
    signatureDishes: [
      { name: 'Royal Chittagong Mezban Gosht', priceBDT: 480, description: 'Slow-simmered prime beef infused with 24 secret Chittagonian spices and mustard oil', photo: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', isChefSpecial: true },
      { name: 'Chana Daal with Beef Bone Marrow', priceBDT: 280, description: 'Yellow split chickpeas slow cooked in rich beef broth with bone marrow', photo: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80', isChefSpecial: false },
      { name: 'Nolar Jhol (Spicy Marrow Soup)', priceBDT: 320, description: 'Aromatic spicy marrow stew served with steaming white atap rice', photo: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', isChefSpecial: true }
    ],
    dressCode: 'Casual',
    parkingInfo: 'Street Parking with Attendants',
    chefNote: 'Cooked by hereditary Mezban Radhuni chefs using century-old family recipes straight from Raozan and Hathazari.',
    isFeatured: true
  },
  {
    name: 'The Bayview Terrace & Grill',
    tagline: 'Coastal breezes, fresh Bay of Bengal catch and sunset cocktails',
    division: 'Chattogram',
    subDistrict: 'Nasirabad & Khulshi',
    address: 'Zakir Hossain Road, South Khulshi, Chattogram 4225',
    location: { type: 'Point', coordinates: [91.8012, 22.3644] },
    cuisineTypes: ['Seafood', 'Continental', 'Fine Dining', 'Rooftop'],
    priceCategory: '৳৳৳',
    averageCostForTwo: 2800,
    photos: [
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.8,
    reviewsCount: 310,
    operationalHours: { opening: '05:00 PM', closing: '12:00 AM', days: 'Everyday' },
    features: ['Rooftop View', 'Outdoor Seating', 'Live Grill Counter', 'Halal Certified', 'Valet Parking'],
    seatingAreas: [
      { name: 'Terrace Pergola', description: 'Canopy seating with scenic green hills of Khulshi', capacity: 4, premiumSurcharge: 0 },
      { name: 'Chef’s Seafood Grill Bar', description: 'Watch local lobsters and jumbo prawns grilled to perfection', capacity: 2, premiumSurcharge: 0 }
    ],
    defaultSlots: [
      { time: '06:00 PM', type: 'Terrace Pergola', available: true, maxPartySize: 4 },
      { time: '07:30 PM', type: 'Terrace Pergola', available: true, maxPartySize: 6 },
      { time: '09:00 PM', type: 'Chef’s Seafood Grill Bar', available: true, maxPartySize: 4 }
    ],
    signatureDishes: [
      { name: 'Grilled Jumbo Tiger Prawns in Garlic Butter', priceBDT: 1750, description: 'Wild-caught Cox’s Bazar prawns charred over coals with lemon herb glaze', photo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80', isChefSpecial: true },
      { name: 'Crispy Rupchanda in Lemon Butter', priceBDT: 1450, description: 'Fresh silver pomfret with crushed red peppercorns and garden greens', photo: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=600&q=80', isChefSpecial: false }
    ],
    dressCode: 'Smart Casual',
    parkingInfo: 'Valet Parking on Site',
    chefNote: 'Every morning our seafood is handpicked from the fishing docks of Sadarghat and Patenga to ensure peerless coastal freshness.',
    isFeatured: false
  },

  // 3. SYLHET DIVISION
  {
    name: 'Grand Sylhet Garden & Grill',
    tagline: 'Serene dining amidst tea estate greenery and artisanal local delights',
    division: 'Sylhet',
    subDistrict: 'Shahjalal Upashahar',
    address: 'Block D, Shahjalal Upashahar, Sylhet 3100',
    location: { type: 'Point', coordinates: [91.8841, 24.8872] },
    cuisineTypes: ['Fine Dining', 'Bengali', 'Continental', 'Cafés'],
    priceCategory: '৳৳৳',
    averageCostForTwo: 2600,
    photos: [
      'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.8,
    reviewsCount: 340,
    operationalHours: { opening: '12:00 PM', closing: '11:00 PM', days: 'Everyday' },
    features: ['Garden Seating', 'Tea Lounge', 'Halal Certified', 'Free WiFi', 'VIP Lounge'],
    seatingAreas: [
      { name: 'Tea Garden Gazebo', description: 'Outdoor private wooden gazebo surrounded by tea shrubs', capacity: 6, premiumSurcharge: 0 },
      { name: 'Sultan Hall', description: 'Regal indoor banquet area with crystal chandeliers', capacity: 8, premiumSurcharge: 0 }
    ],
    defaultSlots: [
      { time: '01:00 PM', type: 'Tea Garden Gazebo', available: true, maxPartySize: 6 },
      { time: '04:30 PM', type: 'Tea Garden Gazebo', available: true, maxPartySize: 4 },
      { time: '07:30 PM', type: 'Sultan Hall', available: true, maxPartySize: 8 },
      { time: '09:00 PM', type: 'Tea Garden Gazebo', available: true, maxPartySize: 6 }
    ],
    signatureDishes: [
      { name: 'Sylheti Beef Shatkora Gourmet Pot', priceBDT: 680, description: 'Tender prime beef slow-stewed with wild indigenous citrus Shatkora peel from Jaintiapur', photo: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', isChefSpecial: true },
      { name: 'Seven-Layer Artisanal Tea Taster', priceBDT: 250, description: 'Iconic Sreemangal spiced tea layers presented with fresh bakery cookies', photo: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', isChefSpecial: false }
    ],
    dressCode: 'Casual / Smart Casual',
    parkingInfo: 'Dedicated Parking Plaza',
    chefNote: 'Celebrating the citrus notes of organic Sylheti Shatkora and premium estate teas.',
    isFeatured: true
  },
  {
    name: 'Panshi Riverside Heritage',
    tagline: 'Sylhet’s legendary culinary house famous for 30+ varieties of fresh bhortas',
    division: 'Sylhet',
    subDistrict: 'Zindabazar',
    address: 'Jail Road, Zindabazar, Sylhet 3100',
    location: { type: 'Point', coordinates: [91.8687, 24.8968] },
    cuisineTypes: ['Bengali', 'Bhorta & Fish', 'Traditional Curries'],
    priceCategory: '৳',
    averageCostForTwo: 700,
    photos: [
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.9,
    reviewsCount: 1420,
    operationalHours: { opening: '06:00 AM', closing: '02:00 AM', days: '24/7 Service' },
    features: ['Legendary Bhortas', 'Halal Certified', 'Late Night Dining', 'Fast Service'],
    seatingAreas: [
      { name: 'Family Dining Floor', description: 'Air-conditioned spacious family dining', capacity: 6, premiumSurcharge: 0 }
    ],
    defaultSlots: [
      { time: '12:30 PM', type: 'Family Dining Floor', available: true, maxPartySize: 8 },
      { time: '01:30 PM', type: 'Family Dining Floor', available: true, maxPartySize: 8 },
      { time: '08:00 PM', type: 'Family Dining Floor', available: true, maxPartySize: 10 },
      { time: '10:00 PM', type: 'Family Dining Floor', available: true, maxPartySize: 8 }
    ],
    signatureDishes: [
      { name: 'Grand Bhorta Platter (12 Varieties)', priceBDT: 360, description: 'Mustard mashed dry fish, chepa shutki, roasted eggplant, korolla, and raw papaya bhorta', photo: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80', isChefSpecial: true },
      { name: 'Haor River Boal Fish Curry', priceBDT: 420, description: 'Fresh sweet water cat-fish simmered in thick onion-mustard gravy', photo: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', isChefSpecial: true }
    ],
    dressCode: 'Casual',
    parkingInfo: 'Valet Assistant on Jail Road',
    chefNote: 'Panshi is a cultural landmark in Sylhet. Taste true rustic flavors unchanged for decades.',
    isFeatured: false
  },

  // 4. RAJSHAHI DIVISION
  {
    name: 'Padma Breeze Riverside Retreat',
    tagline: 'Stunning sunset dining on the banks of the mighty Padma River',
    division: 'Rajshahi',
    subDistrict: 'Shaheb Bazar & Kazihata',
    address: 'T-Bandh Road, Padma Riverside, Rajshahi 6000',
    location: { type: 'Point', coordinates: [88.5985, 24.3636] },
    cuisineTypes: ['Bengali', 'Seafood', 'Rooftop', 'Continental'],
    priceCategory: '৳৳',
    averageCostForTwo: 1300,
    photos: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.7,
    reviewsCount: 290,
    operationalHours: { opening: '03:00 PM', closing: '11:30 PM', days: 'Everyday' },
    features: ['Riverfront View', 'Outdoor Deck', 'Live Char Grills', 'Halal Certified'],
    seatingAreas: [
      { name: 'Padma Deck Cabana', description: 'Open air riverfront deck facing the evening sunset waves', capacity: 4, premiumSurcharge: 0 },
      { name: 'Garden Pavilion', description: 'Lush greenery setting with ambient lantern lighting', capacity: 6, premiumSurcharge: 0 }
    ],
    defaultSlots: [
      { time: '05:00 PM', type: 'Padma Deck Cabana', available: true, maxPartySize: 4 },
      { time: '06:30 PM', type: 'Padma Deck Cabana', available: true, maxPartySize: 6 },
      { time: '08:00 PM', type: 'Garden Pavilion', available: true, maxPartySize: 8 },
      { time: '09:30 PM', type: 'Padma Deck Cabana', available: true, maxPartySize: 4 }
    ],
    signatureDishes: [
      { name: 'Padma River Fresh Ilish Jhol', priceBDT: 750, description: 'Wild Padma Hilsa cooked with green chilies, mustard paste, and kalijeera', photo: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', isChefSpecial: true },
      { name: 'Rajshahi Fazli Mango Glazed Chicken', priceBDT: 550, description: 'Grilled chicken skewers infused with seasonal sweet Rajshahi mango reduction', photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', isChefSpecial: true }
    ],
    dressCode: 'Casual',
    parkingInfo: 'Spacious Riverside Parking',
    chefNote: 'Nothing compares to an evening watching fishing boats on the Padma while enjoying fresh grilled catch.',
    isFeatured: true
  },
  {
    name: 'Chillies Gourmet Kazihata',
    tagline: 'Rajshahi’s premier destination for wood-fired pizzas and sizzling steaks',
    division: 'Rajshahi',
    subDistrict: 'Kazihata',
    address: 'VIP Road, Kazihata, Rajshahi 6000',
    location: { type: 'Point', coordinates: [88.6015, 24.3721] },
    cuisineTypes: ['Continental', 'Pan-Asian', 'Cafés'],
    priceCategory: '৳৳',
    averageCostForTwo: 1600,
    photos: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.6,
    reviewsCount: 220,
    operationalHours: { opening: '12:00 PM', closing: '11:00 PM', days: 'Everyday' },
    features: ['Wood-Fired Oven', 'Halal Certified', 'Dessert Counter', 'Cozy Booths'],
    seatingAreas: [
      { name: 'Main Lounge', description: 'Plush velvet booth seating with warm ambient spotlights', capacity: 4, premiumSurcharge: 0 }
    ],
    defaultSlots: [
      { time: '01:00 PM', type: 'Main Lounge', available: true, maxPartySize: 6 },
      { time: '07:30 PM', type: 'Main Lounge', available: true, maxPartySize: 6 },
      { time: '09:00 PM', type: 'Main Lounge', available: true, maxPartySize: 8 }
    ],
    signatureDishes: [
      { name: 'Artisan Smoked Beef Pizza', priceBDT: 850, description: 'Handcrafted sourdough crust topped with wood-smoked beef and fresh mozzarella', photo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', isChefSpecial: true }
    ],
    dressCode: 'Smart Casual',
    parkingInfo: 'Street Parking available',
    chefNote: 'Bringing global contemporary cooking styles to the Silk City of Rajshahi.',
    isFeatured: false
  },

  // 5. KHULNA DIVISION
  {
    name: 'Chui Jhal Heritage Royal',
    tagline: 'Authentic Southern Khulna specialty beef braised with pungent Piper Chaba stems',
    division: 'Khulna',
    subDistrict: 'Shib Bari More',
    address: 'KDA Avenue, Shib Bari More, Khulna 9100',
    location: { type: 'Point', coordinates: [89.5532, 22.8228] },
    cuisineTypes: ['Bengali', 'Traditional Curries', 'Chui Jhal'],
    priceCategory: '৳৳',
    averageCostForTwo: 1100,
    photos: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.9,
    reviewsCount: 510,
    operationalHours: { opening: '11:30 AM', closing: '11:00 PM', days: 'Everyday' },
    features: ['Chui Jhal Specialty', 'Halal Certified', 'Family Dining', 'Quick Service'],
    seatingAreas: [
      { name: 'Sunderban Hall', description: 'Airy dining space with traditional terracotta decor', capacity: 6, premiumSurcharge: 0 }
    ],
    defaultSlots: [
      { time: '12:30 PM', type: 'Sunderban Hall', available: true, maxPartySize: 8 },
      { time: '02:00 PM', type: 'Sunderban Hall', available: true, maxPartySize: 8 },
      { time: '08:00 PM', type: 'Sunderban Hall', available: true, maxPartySize: 10 },
      { time: '09:30 PM', type: 'Sunderban Hall', available: true, maxPartySize: 8 }
    ],
    signatureDishes: [
      { name: 'Chuknagar Special Chui Jhal Mutton', priceBDT: 520, description: 'Tender mutton cooked in mustard oil with infused chunks of aromatic Chui Jhal root stems', photo: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', isChefSpecial: true },
      { name: 'Bagda Chingri Malai Curry', priceBDT: 580, description: 'Fresh brackish-water tiger prawns simmered in thick spiced coconut cream', photo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80', isChefSpecial: true }
    ],
    dressCode: 'Casual',
    parkingInfo: 'Designated Front Parking',
    chefNote: 'Chui Jhal is the pride of southern Bengal. Our stems are hand-harvested from Dumuria and Bagerhat.',
    isFeatured: true
  },
  {
    name: 'Rupsha Castle Riverside',
    tagline: 'Picturesque bridge view dining with live Sundarbans honey mocktails',
    division: 'Khulna',
    subDistrict: 'Sonadanga',
    address: 'Sonadanga Main Road, Khulna 9000',
    location: { type: 'Point', coordinates: [89.5412, 22.8155] },
    cuisineTypes: ['Continental', 'Pan-Asian', 'Seafood'],
    priceCategory: '৳৳৳',
    averageCostForTwo: 2400,
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.6,
    reviewsCount: 195,
    operationalHours: { opening: '12:00 PM', closing: '11:30 PM', days: 'Everyday' },
    features: ['Waterfront View', 'Halal Certified', 'Banquet Space', 'Live Music'],
    seatingAreas: [
      { name: 'Riverside Veranda', description: 'Open veranda overlooking Rupsha River currents', capacity: 4, premiumSurcharge: 0 }
    ],
    defaultSlots: [
      { time: '01:00 PM', type: 'Riverside Veranda', available: true, maxPartySize: 6 },
      { time: '07:30 PM', type: 'Riverside Veranda', available: true, maxPartySize: 6 },
      { time: '09:00 PM', type: 'Riverside Veranda', available: true, maxPartySize: 8 }
    ],
    signatureDishes: [
      { name: 'Sundarbans Wild Honey Glazed Salmon', priceBDT: 1650, description: 'Grilled fillet drizzled with raw honey from mangrove blooms and lemon zest', photo: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80', isChefSpecial: true }
    ],
    dressCode: 'Smart Casual',
    parkingInfo: 'Valet Parking on Site',
    chefNote: 'An oasis of calm where river breezes meet world-class gastronomy in Khulna.',
    isFeatured: false
  },

  // 6. BARISHAL DIVISION
  {
    name: 'Kirtankhola Riverfront Pavilion',
    tagline: 'Venice of Bengal culinary gem famous for river Hilsa, lobster, and sweet coconut',
    division: 'Barishal',
    subDistrict: 'Band Road & Waterfront',
    address: 'Band Road, Waterfront Park, Barishal 8200',
    location: { type: 'Point', coordinates: [90.3705, 22.7010] },
    cuisineTypes: ['Bengali', 'Seafood', 'Rooftop', 'Buffet'],
    priceCategory: '৳৳',
    averageCostForTwo: 1400,
    photos: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.8,
    reviewsCount: 310,
    operationalHours: { opening: '12:00 PM', closing: '11:30 PM', days: 'Everyday' },
    features: ['Riverfront View', 'Halal Certified', 'Outdoor Deck', 'Fresh Catch Daily'],
    seatingAreas: [
      { name: 'River Pier Table', description: 'Table extending above the riverbank with breeze & launch views', capacity: 4, premiumSurcharge: 0 },
      { name: 'Palm Pavilion', description: 'Covered teakwood gazebo with traditional lighting', capacity: 8, premiumSurcharge: 0 }
    ],
    defaultSlots: [
      { time: '12:45 PM', type: 'River Pier Table', available: true, maxPartySize: 4 },
      { time: '01:45 PM', type: 'Palm Pavilion', available: true, maxPartySize: 8 },
      { time: '07:30 PM', type: 'River Pier Table', available: true, maxPartySize: 6 },
      { time: '09:00 PM', type: 'Palm Pavilion', available: true, maxPartySize: 8 }
    ],
    signatureDishes: [
      { name: 'Barishali Shorshe Ilish with Green Chilis', priceBDT: 820, description: 'Fresh Ilish from Meghna-Kirtankhola confluence bathed in sharp mustard paste', photo: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', isChefSpecial: true },
      { name: 'Narkel Diye Chingri (Coconut Prawn Curry)', priceBDT: 540, description: 'River prawns braised with freshly grated Barishali sweet coconut cream', photo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80', isChefSpecial: false }
    ],
    dressCode: 'Casual',
    parkingInfo: 'Waterfront Public & Private Parking',
    chefNote: 'Barishal is the heart of river delicacies. Every fish we serve was caught fresh on the day.',
    isFeatured: true
  },
  {
    name: 'Handi Biryani & Kebab Sadar',
    tagline: 'Fragrant clay-pot biryani and melt-in-mouth boti kebabs',
    division: 'Barishal',
    subDistrict: 'Sadar Road',
    address: 'Sadar Road, Bibir Pukur Par, Barishal 8200',
    location: { type: 'Point', coordinates: [90.3685, 22.7042] },
    cuisineTypes: ['Bengali', 'Biryani & Kacchi', 'Mughlai'],
    priceCategory: '৳',
    averageCostForTwo: 850,
    photos: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.7,
    reviewsCount: 280,
    operationalHours: { opening: '11:30 AM', closing: '11:00 PM', days: 'Everyday' },
    features: ['Clay Pot Cooking', 'Halal Certified', 'Family Friendly', 'Air Conditioned'],
    seatingAreas: [
      { name: 'Family Booth', description: 'Comfortable air-conditioned private family dining', capacity: 6, premiumSurcharge: 0 }
    ],
    defaultSlots: [
      { time: '01:00 PM', type: 'Family Booth', available: true, maxPartySize: 6 },
      { time: '07:30 PM', type: 'Family Booth', available: true, maxPartySize: 8 },
      { time: '09:00 PM', type: 'Family Booth', available: true, maxPartySize: 6 }
    ],
    signatureDishes: [
      { name: 'Clay Pot Mutton Dum Biryani', priceBDT: 450, description: 'Sealed with wheat dough and cooked over slow wood embers', photo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', isChefSpecial: true }
    ],
    dressCode: 'Casual',
    parkingInfo: 'Street Parking available',
    chefNote: 'Authentic clay pot dum cooking ensures every grain of rice absorbs the rich aromas of meat and spices.',
    isFeatured: false
  },

  // 7. RANGPUR DIVISION
  {
    name: 'North View Grand Palace',
    tagline: 'Regal dining in the Northern capital with traditional North Bengal grilled feasts',
    division: 'Rangpur',
    subDistrict: 'Jahaj Company More',
    address: 'Station Road, Jahaj Company More, Rangpur 5400',
    location: { type: 'Point', coordinates: [89.2467, 25.7439] },
    cuisineTypes: ['Continental', 'Bengali', 'Pan-Asian', 'Fine Dining'],
    priceCategory: '৳৳',
    averageCostForTwo: 1500,
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.7,
    reviewsCount: 230,
    operationalHours: { opening: '12:00 PM', closing: '11:00 PM', days: 'Everyday' },
    features: ['Fine Dining Ambiance', 'Halal Certified', 'Banquet Hall', 'Valet Parking'],
    seatingAreas: [
      { name: 'Royal Taj Dining', description: 'Spacious banquet hall with opulent decor', capacity: 6, premiumSurcharge: 0 }
    ],
    defaultSlots: [
      { time: '01:00 PM', type: 'Royal Taj Dining', available: true, maxPartySize: 8 },
      { time: '07:30 PM', type: 'Royal Taj Dining', available: true, maxPartySize: 8 },
      { time: '09:00 PM', type: 'Royal Taj Dining', available: true, maxPartySize: 10 }
    ],
    signatureDishes: [
      { name: 'Rangpuri Haribhanga Charcoal Gosht', priceBDT: 560, description: 'Prime beef infused with smoked whole spices and wild mustard', photo: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', isChefSpecial: true },
      { name: 'Teesta River Chitol Muitha Curry', priceBDT: 490, description: 'Spiced fish balls crafted from Teesta featherback fish in golden gravy', photo: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', isChefSpecial: true }
    ],
    dressCode: 'Smart Casual',
    parkingInfo: 'Spacious Hotel Parking',
    chefNote: 'Bringing royal culinary heritage to Rangpur with the finest farm produce of northern Bengal.',
    isFeatured: true
  },
  {
    name: 'Carmichael Cafés & Roastery',
    tagline: 'Artisanal coffee, wood-fired snacks, and student-heritage ambiance',
    division: 'Rangpur',
    subDistrict: 'Carmichael Area & Modern More',
    address: 'Carmichael College Road, Rangpur 5400',
    location: { type: 'Point', coordinates: [89.2612, 25.7315] },
    cuisineTypes: ['Cafés', 'Continental', 'Desserts'],
    priceCategory: '৳',
    averageCostForTwo: 650,
    photos: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.8,
    reviewsCount: 310,
    operationalHours: { opening: '10:00 AM', closing: '10:30 PM', days: 'Everyday' },
    features: ['Artisan Coffee', 'Free High Speed WiFi', 'Book Nook', 'Halal Certified'],
    seatingAreas: [
      { name: 'Study Garden Booth', description: 'Cozy outdoor seating shaded by mature mahogany trees', capacity: 4, premiumSurcharge: 0 }
    ],
    defaultSlots: [
      { time: '11:00 AM', type: 'Study Garden Booth', available: true, maxPartySize: 4 },
      { time: '04:30 PM', type: 'Study Garden Booth', available: true, maxPartySize: 4 },
      { time: '07:30 PM', type: 'Study Garden Booth', available: true, maxPartySize: 6 }
    ],
    signatureDishes: [
      { name: 'Signature Hazelnut Cortado', priceBDT: 240, description: 'Locally roasted specialty beans with silky micro-foam', photo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80', isChefSpecial: false }
    ],
    dressCode: 'Casual',
    parkingInfo: 'Bike and Car Parking Available',
    chefNote: 'A sanctuary for coffee lovers, thinkers, and foodies in Rangpur.',
    isFeatured: false
  },

  // 8. MYMENSINGH DIVISION
  {
    name: 'Brahmaputra River Heritage Lounge',
    tagline: 'Riverside dining with traditional Muktagacha Monda, fresh river fish & scenic tranquility',
    division: 'Mymensingh',
    subDistrict: 'Town Hall & Riverfront',
    address: 'Park Road, Riverfront Boulevard, Mymensingh 2200',
    location: { type: 'Point', coordinates: [90.4077, 24.7578] },
    cuisineTypes: ['Bengali', 'Seafood', 'Rooftop', 'Cafés'],
    priceCategory: '৳৳',
    averageCostForTwo: 1100,
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.8,
    reviewsCount: 260,
    operationalHours: { opening: '12:00 PM', closing: '11:00 PM', days: 'Everyday' },
    features: ['Brahmaputra View', 'Halal Certified', 'Heritage Desserts', 'Garden Seating'],
    seatingAreas: [
      { name: 'Riverbank Veranda', description: 'Open riverfront veranda with gentle breezes from the Brahmaputra', capacity: 4, premiumSurcharge: 0 },
      { name: 'Zamindar Hall', description: 'Heritage themed dining with colonial vintage portraits', capacity: 8, premiumSurcharge: 0 }
    ],
    defaultSlots: [
      { time: '01:00 PM', type: 'Riverbank Veranda', available: true, maxPartySize: 4 },
      { time: '05:00 PM', type: 'Riverbank Veranda', available: true, maxPartySize: 6 },
      { time: '07:30 PM', type: 'Zamindar Hall', available: true, maxPartySize: 8 },
      { time: '09:00 PM', type: 'Riverbank Veranda', available: true, maxPartySize: 6 }
    ],
    signatureDishes: [
      { name: 'Brahmaputra River Ayeer Fish Bhuna', priceBDT: 480, description: 'Fresh catfish cooked with roasted cumin and crushed green chilies', photo: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', isChefSpecial: true },
      { name: 'Authentic Muktagacha Monda Soufflé', priceBDT: 220, description: 'Classic 200-year-old curd dessert recipe served warm with pistachio garnish', photo: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80', isChefSpecial: true }
    ],
    dressCode: 'Casual',
    parkingInfo: 'Park Road Parking Area',
    chefNote: 'Inspired by the historic Zamindars of Muktagacha and the timeless flow of the Brahmaputra River.',
    isFeatured: true
  },
  {
    name: 'Ganginar Par Sizzler & Grill',
    tagline: 'Sizzling platters, tandoori grills, and lively family gatherings',
    division: 'Mymensingh',
    subDistrict: 'Ganginar Par & Choto Bazar',
    address: 'Station Road, Ganginar Par, Mymensingh 2200',
    location: { type: 'Point', coordinates: [90.4021, 24.7512] },
    cuisineTypes: ['Continental', 'Bengali', 'Biryani & Kacchi'],
    priceCategory: '৳',
    averageCostForTwo: 900,
    photos: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.6,
    reviewsCount: 180,
    operationalHours: { opening: '12:30 PM', closing: '10:30 PM', days: 'Everyday' },
    features: ['Live Sizzlers', 'Halal Certified', 'Family AC Hall', 'Takeout Available'],
    seatingAreas: [
      { name: 'Central Hall', description: 'Lively family seating area with fast table service', capacity: 6, premiumSurcharge: 0 }
    ],
    defaultSlots: [
      { time: '01:15 PM', type: 'Central Hall', available: true, maxPartySize: 6 },
      { time: '07:45 PM', type: 'Central Hall', available: true, maxPartySize: 8 },
      { time: '09:15 PM', type: 'Central Hall', available: true, maxPartySize: 6 }
    ],
    signatureDishes: [
      { name: 'Sizzling Garlic Pepper Steak', priceBDT: 590, description: 'Served on a hot iron skillet with buttered rice and sautéed vegetables', photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', isChefSpecial: true }
    ],
    dressCode: 'Casual',
    parkingInfo: 'Market Parking available',
    chefNote: 'A culinary staple in the commercial heart of Mymensingh.',
    isFeatured: false
  }
];

module.exports = seedRestaurants;
