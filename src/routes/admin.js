const express = require('express');
const router = express.Router();
const sheets = require('../services/sheets');

function authMiddleware(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ ok: true, token: process.env.ADMIN_PASSWORD });
  } else {
    res.status(401).json({ error: 'Mật khẩu không đúng' });
  }
});

// ── Products CRUD ──

router.post('/products', authMiddleware, async (req, res) => {
  try {
    const { category_id, category_label, emoji, viet_name, name, price, image_url } = req.body;
    await sheets.appendRow(sheets.SHEET_NAMES.PRODUCTS, [
      category_id, category_label, emoji || '📦', viet_name, name,
      String(price), image_url || '',
    ]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/products/:index', authMiddleware, async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    const { category_id, category_label, emoji, viet_name, name, price, image_url } = req.body;
    await sheets.updateRow(sheets.SHEET_NAMES.PRODUCTS, idx, [
      category_id, category_label, emoji || '📦', viet_name, name,
      String(price), image_url || '',
    ]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/products/:index', authMiddleware, async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    await sheets.deleteRow(sheets.SHEET_NAMES.PRODUCTS, idx);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── New Arrivals CRUD ──

router.post('/new-arrivals', authMiddleware, async (req, res) => {
  try {
    const { emoji, viet_name, name, price, image_url } = req.body;
    await sheets.appendRow(sheets.SHEET_NAMES.NEW_ARRIVALS, [
      emoji || '📦', viet_name, name, String(price), image_url || '',
    ]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/new-arrivals/:index', authMiddleware, async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    const { emoji, viet_name, name, price, image_url } = req.body;
    await sheets.updateRow(sheets.SHEET_NAMES.NEW_ARRIVALS, idx, [
      emoji || '📦', viet_name, name, String(price), image_url || '',
    ]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/new-arrivals/:index', authMiddleware, async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    await sheets.deleteRow(sheets.SHEET_NAMES.NEW_ARRIVALS, idx);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Specials CRUD ──

router.post('/specials', authMiddleware, async (req, res) => {
  try {
    const { viet_name, name, was_price, now_price, image_url } = req.body;
    await sheets.appendRow(sheets.SHEET_NAMES.SPECIALS, [
      viet_name, name, String(was_price), String(now_price), image_url || '',
    ]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/specials/:index', authMiddleware, async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    const { viet_name, name, was_price, now_price, image_url } = req.body;
    await sheets.updateRow(sheets.SHEET_NAMES.SPECIALS, idx, [
      viet_name, name, String(was_price), String(now_price), image_url || '',
    ]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/specials/:index', authMiddleware, async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    await sheets.deleteRow(sheets.SHEET_NAMES.SPECIALS, idx);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Services CRUD ──

router.post('/services', authMiddleware, async (req, res) => {
  try {
    const { icon, title, description, badge } = req.body;
    await sheets.appendRow(sheets.SHEET_NAMES.SERVICES, [
      icon || '🔧', title, description, badge || '',
    ]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/services/:index', authMiddleware, async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    const { icon, title, description, badge } = req.body;
    await sheets.updateRow(sheets.SHEET_NAMES.SERVICES, idx, [
      icon || '🔧', title, description, badge || '',
    ]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/services/:index', authMiddleware, async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    await sheets.deleteRow(sheets.SHEET_NAMES.SERVICES, idx);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Household CRUD ──

router.post('/household', authMiddleware, async (req, res) => {
  try {
    const { emoji, viet_name, name, price } = req.body;
    await sheets.appendRow(sheets.SHEET_NAMES.HOUSEHOLD, [
      emoji || '📦', viet_name, name, String(price),
    ]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/household/:index', authMiddleware, async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    const { emoji, viet_name, name, price } = req.body;
    await sheets.updateRow(sheets.SHEET_NAMES.HOUSEHOLD, idx, [
      emoji || '📦', viet_name, name, String(price),
    ]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/household/:index', authMiddleware, async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    await sheets.deleteRow(sheets.SHEET_NAMES.HOUSEHOLD, idx);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Settings ──

router.put('/settings', authMiddleware, async (req, res) => {
  try {
    const settings = req.body;
    const headers = ['key', 'value'];
    const rows = Object.entries(settings).map(([k, v]) => [k, v]);
    await sheets.setSheetData(sheets.SHEET_NAMES.SETTINGS, headers, rows);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Seed: populate Google Sheet with default data ──

router.post('/seed', authMiddleware, async (req, res) => {
  try {
    // Products
    const prodHeaders = ['category_id', 'category_label', 'emoji', 'viet_name', 'name', 'price', 'image_url'];
    const prodRows = [];
    const defaultCats = getDefaultProducts();
    defaultCats.forEach(cat => {
      cat.items.forEach(it => {
        prodRows.push([cat.id, cat.label, it.e, it.v, it.n, String(it.p), it.img || '']);
      });
    });
    await sheets.setSheetData(sheets.SHEET_NAMES.PRODUCTS, prodHeaders, prodRows);

    // New Arrivals
    const arrHeaders = ['emoji', 'viet_name', 'name', 'price', 'image_url'];
    const arrRows = getDefaultArrivals().map(it => [it.e, it.v, it.n, String(it.p), it.img || '']);
    await sheets.setSheetData(sheets.SHEET_NAMES.NEW_ARRIVALS, arrHeaders, arrRows);

    // Specials
    const specHeaders = ['viet_name', 'name', 'was_price', 'now_price', 'image_url'];
    const specRows = getDefaultSpecials().map(it => [it.v, it.n, String(it.was), String(it.now), it.img || '']);
    await sheets.setSheetData(sheets.SHEET_NAMES.SPECIALS, specHeaders, specRows);

    // Services
    const svcHeaders = ['icon', 'title', 'description', 'badge'];
    const svcRows = getDefaultServices().map(it => [it.icon, it.title, it.desc, it.badge]);
    await sheets.setSheetData(sheets.SHEET_NAMES.SERVICES, svcHeaders, svcRows);

    // Household
    const hhHeaders = ['emoji', 'viet_name', 'name', 'price'];
    const hhRows = getDefaultHousehold().map(it => [it.e, it.v, it.n, String(it.p)]);
    await sheets.setSheetData(sheets.SHEET_NAMES.HOUSEHOLD, hhHeaders, hhRows);

    // Settings
    const setHeaders = ['key', 'value'];
    const setRows = Object.entries(getDefaultSettings()).map(([k, v]) => [k, v]);
    await sheets.setSheetData(sheets.SHEET_NAMES.SETTINGS, setHeaders, setRows);

    res.json({ ok: true, message: 'Đã import dữ liệu mẫu thành công!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function getDefaultProducts() {
  return [
    { id:'fruits', label:'🍎 Fresh Fruits & Veg', items:[
      {e:'🥬',v:'Cải Thìa',n:'Bok Choy – Bunch',p:2.50},{e:'🌿',v:'Húng Quế',n:'Thai Basil – Bunch',p:1.80},
      {e:'🧅',v:'Hành Tím',n:'Shallots – 500g',p:3.20},{e:'🌶️',v:'Ớt Hiểm',n:"Bird's Eye Chilli 100g",p:2.20},
      {e:'🫚',v:'Gừng Tươi',n:'Fresh Ginger Root',p:1.90},{e:'🥒',v:'Dưa Leo Nhật',n:'Japanese Cucumber',p:2.90},
      {e:'🌾',v:'Sả Tươi',n:'Lemongrass – Bunch',p:1.50},{e:'🥭',v:'Xoài Tươi',n:'Fresh Mango – each',p:2.50},
      {e:'🥦',v:'Bông Cải Xanh',n:'Broccoli – each',p:3.50},{e:'🍠',v:'Khoai Lang',n:'Sweet Potato – 500g',p:2.80},
      {e:'🫑',v:'Ớt Chuông',n:'Capsicum – each',p:1.20},{e:'🌽',v:'Ngô Nếp',n:'Sticky Corn – each',p:1.50},
      {e:'🧄',v:'Tỏi Tươi',n:'Garlic Bulb – 3 pack',p:2.00},{e:'🍃',v:'Rau Muống',n:'Water Spinach – Bunch',p:1.80},
      {e:'🥕',v:'Cà Rốt',n:'Carrot – 1kg bag',p:2.50},{e:'🫚',v:'Nghệ Tươi',n:'Fresh Turmeric Root',p:2.20},
    ]},
    { id:'noodles', label:'🍜 Instant Noodles', items:[
      {e:'🍜',v:'Mì Hảo Hảo',n:'Hao Hao Noodles 5pk',p:4.50},{e:'🍜',v:'Mì Shin Ramyun',n:'Shin Ramyun 5pk',p:6.90},
      {e:'🍲',v:'Phở Bò Ăn Liền',n:'Pho Bo Instant 2srv',p:3.80},{e:'🍜',v:'Mì Udon Nhật',n:'Udon Noodles 3pk',p:5.20},
      {e:'🍜',v:'Mì Khoai Tây',n:'Potato Noodle 4pk',p:5.50},{e:'🍜',v:'Bún Bò Huế',n:'Bun Bo Hue Kit',p:4.20},
      {e:'🍜',v:'Mì Soba Nhật',n:'Soba Noodles 300g',p:4.80},{e:'🍜',v:'Mì Trứng Khô',n:'Egg Noodles Dry 500g',p:3.20},
      {e:'🍜',v:'Mì Samyang',n:'Samyang Fire Noodle',p:3.50},{e:'🍜',v:'Bún Tươi',n:'Fresh Rice Vermicelli',p:2.50},
    ]},
    { id:'snacks', label:'🍿 Snacks & Drinks', items:[
      {e:'🧋',v:'Trà Sữa Khoai Môn',n:'Taro Milk Tea 500ml',p:4.20},{e:'🍪',v:'Bánh Pocky',n:'Pocky Strawberry 2pk',p:3.50},
      {e:'🍵',v:'Trà Xanh',n:'Ito En Green Tea 500ml',p:3.20},{e:'🍫',v:'Bánh Meiji',n:'Meiji Mushroom Choc',p:2.80},
      {e:'🥤',v:'Nước Dừa',n:'Coconut Water 330ml',p:2.50},{e:'🍬',v:'Kẹo Dừa Bến Tre',n:'Ben Tre Coconut Candy',p:3.90},
      {e:'🍘',v:'Bánh Gạo',n:'Rice Crackers Mix 150g',p:4.50},{e:'🥛',v:'Sữa Đậu Nành',n:'Soy Milk 1L',p:3.20},
      {e:'🧃',v:'Nước Ép Vải',n:'Lychee Juice 330ml',p:2.20},{e:'🍿',v:'Chips Cay Hàn Quốc',n:'Korean Spicy Chips 85g',p:2.90},
    ]},
    { id:'frozen', label:'🧊 Frozen Foods', items:[
      {e:'🥟',v:'Há Cảo Đông Lạnh',n:'Dim Sum 40pc',p:14.99},{e:'🥟',v:'Bánh Bao Đông Lạnh',n:'Frozen Steamed Buns 6pc',p:8.50},
      {e:'🍤',v:'Chả Giò Đông Lạnh',n:'Spring Rolls 20pc',p:9.99},{e:'🦐',v:'Tôm Đông Lạnh',n:'Frozen Prawns 500g',p:13.99},
      {e:'🐟',v:'Cá Viên',n:'Fish Balls 500g',p:6.50},{e:'🥩',v:'Thịt Viên',n:'Meat Balls 500g',p:7.50},
      {e:'🥟',v:'Sủi Cảo Đông Lạnh',n:'Frozen Dumplings 500g',p:10.50},{e:'🦑',v:'Mực Đông Lạnh',n:'Frozen Squid 500g',p:11.99},
      {e:'🍢',v:'Chả Cá',n:'Fish Cake Sliced 200g',p:5.50},{e:'🫕',v:'Rau Củ Đông Lạnh',n:'Mixed Veg Frozen 500g',p:4.50},
    ]},
    { id:'sauces', label:'🫙 Sauces & Condiments', items:[
      {e:'🫙',v:'Tương Hoisin',n:'Hoisin Sauce 240ml',p:4.50},{e:'🫙',v:'Nước Mắm Phú Quốc',n:'Phu Quoc Fish Sauce 500ml',p:5.90},
      {e:'🌶️',v:'Tương Ớt Sriracha',n:'Sriracha Sauce 482ml',p:6.80},{e:'🫙',v:'Tương Đậu Nành',n:'Soy Sauce Dark 600ml',p:3.80},
      {e:'🫙',v:'Dầu Hào',n:'Oyster Sauce 600g',p:5.20},{e:'🫙',v:'Miso Trắng',n:'White Miso Paste 500g',p:7.50},
      {e:'🌿',v:'Dầu Mè',n:'Sesame Oil 250ml',p:6.20},{e:'🫙',v:'Tương Cà Chua',n:'Tomato Paste 140g',p:1.80},
      {e:'🌶️',v:'Tương Ớt Gochujang',n:'Gochujang Paste 500g',p:8.90},{e:'🫙',v:'Giấm Gạo',n:'Rice Vinegar 500ml',p:3.50},
    ]},
    { id:'rice', label:'🍚 Rice & Noodles', items:[
      {e:'🍚',v:'Gạo Lài Thái 5kg',n:'Thai Jasmine Rice 5kg',p:12.50},{e:'🍚',v:'Gạo Nếp 2kg',n:'Glutinous Rice 2kg',p:8.50},
      {e:'🍚',v:'Gạo Lài 10kg',n:'Jasmine Rice 10kg',p:22.00},{e:'🍜',v:'Bún Khô 500g',n:'Dry Rice Vermicelli 500g',p:3.50},
      {e:'🍜',v:'Bánh Phở Khô',n:'Pho Noodle Dry 400g',p:4.20},{e:'🍜',v:'Miến Đông 200g',n:'Glass Noodles 200g',p:2.80},
      {e:'🍚',v:'Gạo Nhật Koshi',n:'Koshihikari Rice 2kg',p:14.50},{e:'🍜',v:'Mì Trứng 500g',n:'Egg Noodle 500g',p:3.20},
    ]},
    { id:'vietnamese', label:'🇻🇳 Vietnamese', items:[
      {e:'🇻🇳',v:'Phở Bò',n:'Pho Bo Spice Kit',p:5.50},{e:'🇻🇳',v:'Nước Mắm Nam Ngư',n:'Nam Ngu Fish Sauce 500ml',p:4.50},
      {e:'🇻🇳',v:'Bánh Tráng',n:'Rice Paper Rounds 22cm',p:3.20},{e:'🇻🇳',v:'Tương Hoisin Lee Kum',n:'Hoisin Sauce Lee Kum Kee',p:4.80},
      {e:'🇻🇳',v:'Mì Quảng',n:'Quang Noodle Dry 400g',p:4.20},{e:'🇻🇳',v:'Chả Lụa',n:'Vietnamese Pork Roll',p:6.50},
      {e:'🇻🇳',v:'Bột Năng',n:'Tapioca Starch 400g',p:2.50},{e:'🇻🇳',v:'Muối Tôm',n:'Shrimp Salt Seasoning',p:2.80},
    ]},
    { id:'korean', label:'🇰🇷 Korean', items:[
      {e:'🇰🇷',v:'Kimchi Baechu',n:'Baechu Kimchi 500g',p:7.90},{e:'🇰🇷',v:'Gochugaru',n:'Korean Chilli Flakes 200g',p:6.50},
      {e:'🇰🇷',v:'Doenjang',n:'Korean Soybean Paste 500g',p:8.90},{e:'🇰🇷',v:'Tteok',n:'Rice Cake Sticks 500g',p:5.80},
      {e:'🇰🇷',v:'Rong Biển Nướng',n:'Roasted Seaweed Snack',p:3.50},{e:'🇰🇷',v:'Sốt Bibimbap',n:'Bibimbap Sauce 250g',p:5.50},
      {e:'🇰🇷',v:'Mì Chapagetti',n:'Chapagetti Black Bean',p:2.80},{e:'🇰🇷',v:'Dầu Mè Hàn',n:'Korean Sesame Oil 160ml',p:7.20},
    ]},
    { id:'japanese', label:'🇯🇵 Japanese', items:[
      {e:'🇯🇵',v:'Tương Teriyaki',n:'Teriyaki Sauce 200ml',p:5.50},{e:'🇯🇵',v:'Nước Tương Kikkoman',n:'Kikkoman Soy Sauce 150ml',p:4.20},
      {e:'🇯🇵',v:'Mì Soba',n:'Soba Noodles 300g',p:4.80},{e:'🇯🇵',v:'Bột Wasabi',n:'Wasabi Powder 25g',p:3.20},
      {e:'🇯🇵',v:'Gừng Muối Nhật',n:'Pickled Ginger 190g',p:3.80},{e:'🇯🇵',v:'Tảo Biển Nori',n:'Nori Sheets 10pk',p:4.50},
      {e:'🇯🇵',v:'Dashi Bột',n:'Dashi Stock Powder 60g',p:5.90},{e:'🇯🇵',v:'Giấm Sushi',n:'Sushi Seasoned Vinegar',p:3.50},
    ]},
    { id:'philippine', label:'🇵🇭 Philippine', items:[
      {e:'🇵🇭',v:'Sinigang Mix',n:'Sinigang Soup Mix 44g',p:2.50},{e:'🇵🇭',v:'Adobo Seasoning',n:'Adobo All Purpose Seasoning',p:3.20},
      {e:'🇵🇭',v:'Bagoong',n:'Shrimp Paste Bagoong 250g',p:4.80},{e:'🇵🇭',v:'Pancit Canton',n:'Pancit Canton Noodle 60g',p:1.80},
      {e:'🇵🇭',v:'Silver Swan Soy',n:'Silver Swan Soy 385ml',p:3.50},{e:'🇵🇭',v:'Coconut Cream',n:'Coconut Cream 400ml',p:2.80},
    ]},
    { id:'chinese', label:'🇨🇳 Chinese', items:[
      {e:'🇨🇳',v:'Dầu Hào Lee Kum',n:'Oyster Sauce Lee Kum Kee',p:5.50},{e:'🇨🇳',v:'Mì Trứng Khô',n:'Dried Egg Noodles 500g',p:3.20},
      {e:'🇨🇳',v:'Dim Sum Sủi Cảo',n:'Har Gow Dumplings 20pc',p:9.50},{e:'🇨🇳',v:'Nước Tương Đen',n:'Dark Soy Sauce 500ml',p:3.80},
      {e:'🇨🇳',v:'Tứ Xuyên Ớt',n:'Sichuan Chilli Oil 200ml',p:7.90},{e:'🇨🇳',v:'Xốt Char Siu',n:'Char Siu Sauce 250g',p:4.50},
    ]},
    { id:'thai', label:'🇹🇭 Thai', items:[
      {e:'🇹🇭',v:'Cà Ri Xanh Thái',n:'Thai Green Curry Paste',p:3.50},{e:'🇹🇭',v:'Cà Ri Đỏ Thái',n:'Thai Red Curry Paste',p:3.50},
      {e:'🇹🇭',v:'Nước Mắm Thái',n:'Thai Fish Sauce Tiparos',p:4.20},{e:'🇹🇭',v:'Nước Cốt Dừa Aroy-D',n:'Coconut Milk Aroy-D 400ml',p:2.50},
      {e:'🇹🇭',v:'Tương Ớt Mae Ploy',n:'Sweet Chilli Sauce Mae Ploy',p:5.80},{e:'🇹🇭',v:'Bún Tươi Thái',n:'Thai Rice Noodle Flat',p:3.20},
    ]},
  ];
}

function getDefaultArrivals() {
  return [
    {e:'🫙',v:'Tương Đen Miso Đỏ',n:'Red Miso Paste 750g',p:9.90,img:'https://images.pexels.com/photos/1050765/pexels-photo-1050765.jpeg?auto=compress&cs=tinysrgb&w=300&h=180&fit=crop'},
    {e:'🧋',v:'Trà Boba Kit',n:'DIY Bubble Tea Kit',p:12.50,img:'https://images.pexels.com/photos/3887985/pexels-photo-3887985.jpeg?auto=compress&cs=tinysrgb&w=300&h=180&fit=crop'},
    {e:'🌿',v:'Rau Ngổ Tươi',n:'Vietnamese Coriander',p:2.20,img:'https://images.pexels.com/photos/6157060/pexels-photo-6157060.jpeg?auto=compress&cs=tinysrgb&w=300&h=180&fit=crop'},
    {e:'🍫',v:'Bánh Chocopie Orion',n:'Orion Choco Pie 12pc',p:8.90},
    {e:'🥫',v:'Cá Ngừ Óe Tuna',n:'Tuna in Chilli Oil 185g',p:4.50},
    {e:'🍵',v:'Matcha Latte Bột',n:'Matcha Latte Powder 200g',p:11.90},
    {e:'🫙',v:'Tương Sambal Oelek',n:'Sambal Oelek 250g',p:5.20},
    {e:'🧆',v:'Chả Giò Tôm Cua',n:'Prawn & Crab Rolls 10pc',p:9.50},
    {e:'🍪',v:'Bánh Mochi Mix',n:'Mochi Ice Cream Mix 6pc',p:7.80},
    {e:'🥤',v:'Nước Ổi Ép',n:'Guava Juice Drink 330ml',p:2.20},
    {e:'🍡',v:'Thạch Rau Câu Dừa',n:'Coconut Jelly 6pc',p:3.50},
    {e:'🌶️',v:'Ớt Khô Mì Cay',n:'Extra Spicy Ramen 5pk',p:7.50},
  ];
}

function getDefaultSpecials() {
  return [
    {v:'Gạo Lài Thái',n:'Jasmine Rice 10kg',was:22.00,now:17.99,img:'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'},
    {v:'Cải Thìa',n:'Bok Choy 3-pack',was:7.50,now:5.99,img:'https://images.pexels.com/photos/6157088/pexels-photo-6157088.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'},
    {v:'Há Cảo Đông Lạnh',n:'Dim Sum 40pc',was:14.99,now:11.99,img:'https://images.pexels.com/photos/3772069/pexels-photo-3772069.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'},
    {v:'Mì Shin Ramyun',n:'Shin Ramen 5-pack',was:8.90,now:6.50,img:'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'},
    {v:'Nước Cốt Dừa',n:'Coconut Milk 3-pack',was:6.90,now:4.99,img:'https://images.pexels.com/photos/2909887/pexels-photo-2909887.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'},
    {v:'Trà Xanh Itoen',n:'Ito En Green Tea 6-pack',was:18.00,now:13.99,img:'https://images.pexels.com/photos/1537635/pexels-photo-1537635.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'},
    {v:'Kimchi Baechu',n:'Baechu Kimchi 1kg',was:14.00,now:10.99},
    {v:'Gạo Nhật',n:'Japanese Rice 5kg',was:32.00,now:26.99},
    {v:'Bánh Bao Đông Lạnh',n:'Frozen Bao Buns 8pc',was:12.00,now:8.99},
    {v:'Nước Tương Kikkoman',n:'Kikkoman Soy 600ml',was:9.50,now:6.99},
  ];
}

function getDefaultServices() {
  return [
    {icon:'🔑',title:'Key Cutting',desc:'Duplicate your house, car, or office keys while you shop. Fast, accurate and affordable — no appointment needed.',badge:'Walk-in · No Booking'},
    {icon:'👔',title:'Dry Cleaning',desc:'Drop off your garments and collect them fresh and pressed. Trusted local dry-cleaning partner for quality results.',badge:'Drop & Collect'},
    {icon:'💸',title:'Money Transfer',desc:'Send money internationally to Vietnam, Korea, Philippines and more. Competitive rates, fast and secure transfers.',badge:'Same Day Available'},
    {icon:'☕',title:'Self-Serve Coffee',desc:'Fresh espresso, flat white, latte and more — brewed by you using our in-store machine anytime during trading hours.',badge:'In-Store · Any Time'},
  ];
}

function getDefaultHousehold() {
  return [
    {e:'🥢',v:'Đũa Tre',n:'Bamboo Chopsticks 10pk',p:2.50},{e:'🍳',v:'Chảo Chống Dính',n:'Non-Stick Wok 32cm',p:24.99},
    {e:'🧴',v:'Nước Rửa Chén',n:'Dishwashing Liquid 1L',p:4.20},{e:'🥣',v:'Tô Sứ Trắng',n:'Ceramic Soup Bowl 4pk',p:14.99},
    {e:'🧹',v:'Túi Rác Thân Thiện',n:'Biodegradable Bin Bags',p:5.90},{e:'🔪',v:'Dao Bếp Thái',n:'Asian Chef Knife 20cm',p:18.50},
    {e:'🫙',v:'Lọ Thuỷ Tinh',n:'Glass Jar Set 3pk',p:9.90},{e:'🧽',v:'Miếng Rửa Chén',n:'Sponge Scourer 3pk',p:3.50},
    {e:'🍱',v:'Hộp Bento',n:'Bento Box Lunch Set',p:12.90},{e:'🧺',v:'Nước Giặt',n:'Laundry Liquid 2L',p:11.50},
    {e:'🍶',v:'Bình Trà Nhật',n:'Japanese Teapot 600ml',p:19.90},{e:'🫧',v:'Nước Vệ Sinh',n:'All-Purpose Cleaner 1L',p:5.50},
  ];
}

function getDefaultSettings() {
  return {
    phone: '0480 179 941',
    email: 'info@newcho.com.au',
    website: 'www.newcho.com.au',
    facebook: 'facebook.com/newcho',
    address_line1: 'The Avenue Shopping Centre',
    address_line2: 'Shop 9 – 136 The Avenue',
    address_line3: 'Sunshine West VIC 3020',
    hours_mon_fri: '9:00am – 6:30pm',
    hours_sat: '9:00am – 6:00pm',
    hours_sun: '9:00am – 6:00pm',
    maps_url: 'https://maps.google.com/?q=136+The+Avenue+Sunshine+West+VIC+3020',
    topbar_text: 'Open 7 Days · Mon–Fri 9am–6:30pm | Sat–Sun 9am–6pm · 📞 0480 179 941',
    hero_title: 'Fresh.',
    hero_title_em: 'Asian. Local.',
    hero_subtitle: "Everything from vibrant produce and pantry staples to hot coffee and everyday services — all under one roof at NEW CHỢ, Sunshine West.",
  };
}

module.exports = router;
