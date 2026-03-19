const { google } = require('googleapis');

let sheetsClient = null;
let SPREADSHEET_ID = null;

function normalizePrivateKey(raw) {
  if (!raw) return '';
  let key = String(raw);
  // dotenv on Windows can include \r; remove it
  key = key.replace(/\r/g, '');
  // If user pasted JSON value including surrounding quotes, strip them
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  // Support both escaped newlines and literal newlines
  key = key.replace(/\\n/g, '\n');
  return key.trim();
}

const SHEET_NAMES = {
  PRODUCTS: 'Products',
  NEW_ARRIVALS: 'NewArrivals',
  SPECIALS: 'Specials',
  SERVICES: 'Services',
  HOUSEHOLD: 'Household',
  SETTINGS: 'Settings',
};

async function getClient() {
  if (sheetsClient) return sheetsClient;

  SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY);

  if (!SPREADSHEET_ID) throw new Error('Missing GOOGLE_SHEET_ID in .env');
  if (!clientEmail) throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_EMAIL in .env');
  if (!privateKey || !privateKey.includes('BEGIN PRIVATE KEY')) {
    throw new Error(
      'Invalid GOOGLE_PRIVATE_KEY format. Paste the private_key from service account JSON into .env using \\n for newlines.'
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

async function getSheetData(sheetName) {
  const client = await getClient();
  const res = await client.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:Z`,
  });
  const rows = res.data.values || [];
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i] || ''; });
    return obj;
  });
}

async function setSheetData(sheetName, headers, dataRows) {
  const client = await getClient();
  const values = [headers, ...dataRows];
  await client.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A1`,
    valueInputOption: 'RAW',
    resource: { values },
  });
}

async function appendRow(sheetName, row) {
  const client = await getClient();
  await client.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:Z`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: { values: [row] },
  });
}

async function updateRow(sheetName, rowIndex, row) {
  const client = await getClient();
  const actualRow = rowIndex + 2;
  await client.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A${actualRow}:Z${actualRow}`,
    valueInputOption: 'RAW',
    resource: { values: [row] },
  });
}

async function deleteRow(sheetName, rowIndex) {
  const client = await getClient();
  const sheetMeta = await client.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });
  const sheet = sheetMeta.data.sheets.find(
    s => s.properties.title === sheetName
  );
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);
  const sheetId = sheet.properties.sheetId;
  const actualRow = rowIndex + 1;
  await client.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    resource: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId,
            dimension: 'ROWS',
            startIndex: actualRow,
            endIndex: actualRow + 1,
          },
        },
      }],
    },
  });
}

async function getProducts() {
  const raw = await getSheetData(SHEET_NAMES.PRODUCTS);
  const catMap = {};
  raw.forEach(r => {
    const catId = r.category_id || 'other';
    if (!catMap[catId]) {
      catMap[catId] = {
        id: catId,
        label: r.category_label || catId,
        items: [],
      };
    }
    catMap[catId].items.push({
      e: r.emoji || '📦',
      v: r.viet_name || '',
      n: r.name || '',
      p: parseFloat(r.price) || 0,
      img: r.image_url || '',
    });
  });
  return Object.values(catMap);
}

async function getNewArrivals() {
  const raw = await getSheetData(SHEET_NAMES.NEW_ARRIVALS);
  return raw.map(r => ({
    e: r.emoji || '📦',
    v: r.viet_name || '',
    n: r.name || '',
    p: parseFloat(r.price) || 0,
    img: r.image_url || '',
  }));
}

async function getSpecials() {
  const raw = await getSheetData(SHEET_NAMES.SPECIALS);
  return raw.map(r => ({
    v: r.viet_name || '',
    n: r.name || '',
    was: parseFloat(r.was_price) || 0,
    now: parseFloat(r.now_price) || 0,
    img: r.image_url || '',
  }));
}

async function getServices() {
  const raw = await getSheetData(SHEET_NAMES.SERVICES);
  return raw.map(r => ({
    icon: r.icon || '🔧',
    title: r.title || '',
    desc: r.description || '',
    badge: r.badge || '',
  }));
}

async function getHousehold() {
  const raw = await getSheetData(SHEET_NAMES.HOUSEHOLD);
  return raw.map(r => ({
    e: r.emoji || '📦',
    v: r.viet_name || '',
    n: r.name || '',
    p: parseFloat(r.price) || 0,
  }));
}

async function getSettings() {
  const raw = await getSheetData(SHEET_NAMES.SETTINGS);
  const settings = {};
  raw.forEach(r => { if (r.key) settings[r.key] = r.value || ''; });
  return settings;
}

module.exports = {
  SHEET_NAMES,
  getSheetData,
  setSheetData,
  appendRow,
  updateRow,
  deleteRow,
  getProducts,
  getNewArrivals,
  getSpecials,
  getServices,
  getHousehold,
  getSettings,
};
