# NEW CHỢ – Fullstack Website

Website fullstack cho cửa hàng tạp hoá châu Á **NEW CHỢ** (Sunshine West, Melbourne).

## Công nghệ

- **Backend**: Node.js + Express
- **Frontend**: HTML/CSS/JS (responsive, modern design)
- **Database**: Google Sheets (dễ update trực tiếp trên Sheets)
- **Admin**: Web-based panel tại `/admin`

## Cấu trúc thư mục

```
newcho-website/
├── server.js              # Express server
├── package.json
├── .env                   # Config (Google Sheets, admin password)
├── public/
│   ├── index.html         # Frontend chính
│   ├── admin.html         # Admin panel
│   ├── css/style.css      # Styles
│   └── js/app.js          # Frontend logic
└── src/
    ├── routes/
    │   ├── api.js         # API routes (public)
    │   └── admin.js       # Admin API routes (protected)
    └── services/
        └── sheets.js      # Google Sheets service
```

## Hướng dẫn cài đặt

### Bước 1: Cài dependencies

```bash
cd newcho-website
npm install
```

### Bước 2: Tạo Google Sheets Database

1. **Tạo Google Sheet mới** tại [sheets.google.com](https://sheets.google.com)
2. **Tạo 6 tab (sheet)** với tên chính xác:
   - `Products`
   - `NewArrivals`
   - `Specials`
   - `Services`
   - `Household`
   - `Settings`
3. **Copy Sheet ID** từ URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_Ở_ĐÂY/edit
   ```

### Bước 3: Tạo Google Service Account

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Enable **Google Sheets API**:
   - Menu → APIs & Services → Library → Search "Google Sheets API" → Enable
4. Tạo Service Account:
   - Menu → APIs & Services → Credentials → Create Credentials → Service Account
   - Đặt tên bất kỳ → Create → Done
5. Tạo Key:
   - Click vào service account vừa tạo → Keys → Add Key → Create new key → JSON → Create
   - File JSON sẽ được tải về
6. **Share Google Sheet** với email của service account:
   - Mở Google Sheet → Share → Paste email service account (có dạng `xxx@xxx.iam.gserviceaccount.com`) → Editor

### Bước 4: Cấu hình .env

Mở file `.env` và điền thông tin:

```env
GOOGLE_SHEET_ID=paste_sheet_id_ở_đây
GOOGLE_SERVICE_ACCOUNT_EMAIL=paste_email_service_account
GOOGLE_PRIVATE_KEY="paste_private_key_từ_file_json"

ADMIN_PASSWORD=newcho2026
PORT=3000
```

**Lưu ý**: `GOOGLE_PRIVATE_KEY` lấy từ field `private_key` trong file JSON (bao gồm `-----BEGIN PRIVATE KEY-----` và `-----END PRIVATE KEY-----`).

### Bước 5: Chạy server

```bash
npm start
```

Server sẽ chạy tại:
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

### Bước 6: Import dữ liệu mẫu

1. Mở Admin Panel: http://localhost:3000/admin
2. Đăng nhập với mật khẩu: `newcho2026`
3. Click nút **"📥 Import dữ liệu mẫu"** để tự động điền data vào Google Sheets
4. Xong! Website sẽ hiển thị dữ liệu từ Google Sheets

## Cách sử dụng

### Quản lý qua Admin Panel (`/admin`)

- **Sản phẩm**: Thêm/sửa/xoá sản phẩm theo từng danh mục
- **Hàng mới**: Quản lý sản phẩm mới (New Arrivals)
- **Khuyến mãi**: Quản lý Specials & Promotions
- **Dịch vụ**: Quản lý các dịch vụ (Key Cutting, Dry Cleaning, etc.)
- **Gia dụng**: Quản lý Household Items
- **Cài đặt**: Cập nhật thông tin cửa hàng (số điện thoại, giờ mở cửa, etc.)

### Quản lý trực tiếp trên Google Sheets

Bạn có thể **edit trực tiếp trên Google Sheets** — website sẽ tự động cập nhật (cache 60 giây).

#### Cấu trúc các tab:

**Products** (Sản phẩm):
| category_id | category_label | emoji | viet_name | name | price | image_url |
|---|---|---|---|---|---|---|
| fruits | 🍎 Fresh Fruits & Veg | 🥬 | Cải Thìa | Bok Choy – Bunch | 2.50 | |

**NewArrivals** (Hàng mới):
| emoji | viet_name | name | price | image_url |
|---|---|---|---|---|

**Specials** (Khuyến mãi):
| viet_name | name | was_price | now_price | image_url |
|---|---|---|---|---|

**Services** (Dịch vụ):
| icon | title | description | badge |
|---|---|---|---|

**Household** (Gia dụng):
| emoji | viet_name | name | price |
|---|---|---|---|

**Settings** (Cài đặt):
| key | value |
|---|---|

## API Endpoints

### Public
- `GET /api/products` – Lấy tất cả sản phẩm
- `GET /api/new-arrivals` – Lấy hàng mới
- `GET /api/specials` – Lấy khuyến mãi
- `GET /api/services` – Lấy dịch vụ
- `GET /api/household` – Lấy gia dụng
- `GET /api/settings` – Lấy cài đặt

### Admin (cần header `x-admin-token`)
- `POST /api/admin/login` – Đăng nhập
- `POST /api/admin/products` – Thêm sản phẩm
- `PUT /api/admin/products/:index` – Sửa sản phẩm
- `DELETE /api/admin/products/:index` – Xoá sản phẩm
- `POST /api/admin/seed` – Import dữ liệu mẫu
- *(Tương tự cho new-arrivals, specials, services, household, settings)*

## Thay đổi mật khẩu Admin

Mở file `.env` và sửa `ADMIN_PASSWORD`, sau đó restart server.
