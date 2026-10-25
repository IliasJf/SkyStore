// SkyStore catalogue. Sample products and prices for the demo, in Moroccan dirhams.
const CATEGORIES = {
  tshirts: 'T-shirts',
  outerwear: 'Jackets',
  pants: 'Pants',
  shoes: 'Shoes',
  accessories: 'Accessories',
};

const CLOTHING_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const SHOE_SIZES = ['40', '41', '42', '43', '44', '45'];

const PRODUCTS = [
  {
    id: 'vneck-tee',
    name: 'V-neck cotton tee',
    category: 'tshirts',
    price: 149,
    sizes: CLOTHING_SIZES,
    colors: [
      { id: 'red', name: 'Brick red', swatch: '#b8473f', images: ['img/vneck-red-1.webp', 'img/vneck-red-2.webp', 'img/vneck-red-3.webp'] },
      { id: 'navy', name: 'Navy', swatch: '#1f2a44', images: ['img/vneck-navy-1.webp', 'img/vneck-navy-2.webp'] },
    ],
    description: 'A soft, light tee for the gym and the street. Heathered cotton that keeps its shape wash after wash.',
    details: ['100% combed cotton, 160 g/m²', 'Regular fit, V-neck', 'Machine wash at 30°C'],
    tags: ['bestseller'],
  },
  {
    id: 'crew-tee',
    name: 'Crew-neck cotton tee',
    category: 'tshirts',
    price: 139,
    sizes: CLOTHING_SIZES,
    colors: [
      { id: 'green', name: 'Forest green', swatch: '#2f5d46', images: ['img/crew-green-1.webp', 'img/crew-green-2.webp'] },
      { id: 'grey', name: 'Light grey', swatch: '#c9cbcd', images: ['img/crew-grey-1.webp', 'img/crew-grey-2.webp'] },
    ],
    description: 'The everyday tee: a classic crew neck, a straight cut and cotton that breathes in the heat.',
    details: ['100% cotton jersey', 'Regular fit, crew neck', 'Machine wash at 30°C'],
    tags: [],
  },
  {
    id: 'chevron-tee',
    name: 'Chevron training tee',
    category: 'tshirts',
    price: 179,
    sizes: CLOTHING_SIZES,
    images: ['img/chevron-tee.webp'],
    description: 'A fitted training tee with a bold chevron print. Quick-drying fabric for hard sessions.',
    details: ['Cotton and polyester blend', 'Slim fit', 'Quick-drying'],
    tags: ['new'],
  },
  {
    id: 'knit-blazer',
    name: 'Knit blazer, heather grey',
    category: 'outerwear',
    price: 549,
    sizes: CLOTHING_SIZES,
    images: ['img/blazer-1.webp', 'img/blazer-2.webp', 'img/blazer-3.webp'],
    description: 'A soft knit blazer that dresses up a tee. Unlined, so it stays comfortable all day.',
    details: ['Knitted cotton blend', 'Two buttons, two front pockets', 'Dry clean or hand wash'],
    tags: [],
  },
  {
    id: 'zip-hoodie',
    name: 'Hooded zip jacket',
    category: 'outerwear',
    price: 399,
    sizes: CLOTHING_SIZES,
    images: ['img/zip-jacket.webp'],
    description: 'A warm zip jacket for early runs and cold evenings, with a lined hood and deep pockets.',
    details: ['Brushed fleece inside', 'Full zip, lined hood', 'Machine wash at 30°C'],
    tags: ['bestseller'],
  },
  {
    id: 'joggers',
    name: 'Cuffed joggers',
    category: 'pants',
    price: 229,
    sizes: CLOTHING_SIZES,
    images: ['img/joggers.webp'],
    description: 'Tapered joggers with ribbed cuffs and a drawstring waist, for training or the sofa.',
    details: ['Cotton fleece', 'Elastic waist with drawstring', 'Two side pockets'],
    tags: [],
  },
  {
    id: 'hightop-sneakers',
    name: 'High-top sneakers, light grey',
    category: 'shoes',
    price: 449,
    sizes: SHOE_SIZES,
    images: ['img/hightop.webp'],
    description: 'Light high-tops with a breathable mesh upper and a cushioned sole for all-day wear.',
    details: ['Mesh and synthetic upper', 'Rubber outsole', 'Lace-up'],
    tags: ['new'],
  },
  {
    id: 'running-shoes',
    name: 'Running shoes, black and red',
    category: 'shoes',
    price: 499,
    sizes: SHOE_SIZES,
    images: ['img/runner.webp'],
    description: 'Responsive running shoes with a grippy sole, built for road runs and the treadmill.',
    details: ['Knit upper', 'Cushioned midsole', 'Reflective details'],
    tags: ['bestseller'],
  },
  {
    id: 'slip-on-sneakers',
    name: 'Slip-on knit sneakers',
    category: 'shoes',
    price: 379,
    sizes: SHOE_SIZES,
    images: ['img/slipon.webp'],
    description: 'No laces, no fuss: a stretch knit sneaker that slips on in a second.',
    details: ['Stretch knit upper', 'Light foam sole', 'Pull tab at the heel'],
    tags: [],
  },
  {
    id: 'ankle-socks',
    name: 'Ankle socks, 3 pairs',
    category: 'accessories',
    price: 79,
    sizes: ['39–42', '43–46'],
    images: ['img/socks.webp'],
    description: 'Three pairs of cushioned ankle socks in black, white and grey.',
    details: ['Cotton blend', 'Cushioned sole', 'Pack of 3'],
    tags: [],
  },
  {
    id: 'fitness-band',
    name: 'Fitness band',
    category: 'accessories',
    price: 299,
    images: ['img/band.webp'],
    description: 'Counts steps, heart rate and sleep, and shows your messages. Up to 14 days on one charge.',
    details: ['AMOLED colour screen', 'Water resistant to 50 m', 'Up to 14 days of battery'],
    tags: ['new'],
  },
  {
    id: 'steel-watch',
    name: 'Steel bracelet watch',
    category: 'accessories',
    price: 899,
    images: ['img/watch-steel.webp'],
    description: 'A clean black dial on a matching steel bracelet. Smart enough for the office.',
    details: ['Stainless steel, black finish', 'Quartz movement', 'Water resistant to 50 m'],
    tags: [],
  },
  {
    id: 'field-watch',
    name: 'Field watch, leather strap',
    category: 'accessories',
    price: 649,
    images: ['img/watch-field.webp'],
    description: 'An easy-to-read field watch with a date window and a black leather strap.',
    details: ['Leather strap', 'Date window', 'Water resistant to 30 m'],
    tags: [],
  },
];

const FREE_DELIVERY_FROM = 500;
const DELIVERY_FEE = 30;
// Demo promo code shown on the cart page
const PROMO_CODES = { SKY10: 0.1 };
const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Ben Slimane', 'Other city'];

function productById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function productImages(product, colorId) {
  if (product.colors) {
    const color = product.colors.find((c) => c.id === colorId) || product.colors[0];
    return color.images;
  }
  return product.images;
}
