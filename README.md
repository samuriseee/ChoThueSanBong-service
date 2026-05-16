# Soccer Rental Service

Bản rút gọn, dễ học, được thiết kế để sinh viên có thể clone về và chạy nhanh với:

- **Neon** cho cơ sở dữ liệu PostgreSQL
- **Cloudinary** cho lưu trữ ảnh
- **Express + TypeScript + TypeORM** cho API

## Chức năng lõi

- Đăng ký / đăng nhập JWT
- Quản lý người dùng
- Quản lý sân bóng
- Đặt sân
- Đánh giá sân
- Upload ảnh sân lên Cloudinary

## Cài đặt nhanh

1. Tạo database trên Neon và lấy `DATABASE_URL`.
2. Tạo cloud trên Cloudinary và lấy `CLOUDINARY_*`.
3. Copy file môi trường mẫu:

```bash
copy .env.example .env
```

4. Cài dependency:

```bash
npm install
```

5. Chạy development:

```bash
npm run dev
```

## Biến môi trường

Xem file `.env.example`.

## Migration với Neon

Core schema được quản lý ở:

- `src/entities/*`: entity definitions
- `src/config/schema.ts`: tập hợp entity + migration globs cho DataSource

Lưu ý khi chạy migration trên Windows/Git Bash/PowerShell:

- Dự án đã dùng script Node để tránh lỗi biến môi trường shell khi truyền `--name`
- Chỉ cần dùng `npm run ... --name=...`

Chạy migration đã có sẵn:

```bash
npm run db:migrate
```

Tạo migration mới từ thay đổi entity:

```bash
npm run db:migrate:generate --name=init-courts
```

Tạo migration rỗng:

```bash
npm run db:migrate:create --name=add-index-booking-date
```

Hoàn tác migration gần nhất:

```bash
npm run db:migrate:revert
```

## Ghi chú cấu trúc

- `src/app.ts`: cấu hình middleware và routes
- `src/index.ts`: bootstrap server
- `src/config`: kết nối database và cloudinary
- `src/entities`: entity TypeORM
- `src/api`: route/controller/service theo domain
- `src/middlewares`: auth, upload, error handler
- `src/utils`: helper dùng chung

## Alias import

Dự án dùng alias `@/*` cho toàn bộ mã nguồn trong `src/*`.

Ví dụ:

```ts
import { env } from '@/config/env';
import { AuthController } from '@/api/auth/auth.controller';
```

Khi build, alias sẽ được rewrite tự động để `node dist/index.js` chạy bình thường.

## Định hướng tối giản

Phiên bản này bỏ các phần nặng như:

- VNPAY / cron job phức tạp
- module admin rườm rà
- cấu hình mailing bắt buộc

Mục tiêu là giữ lại phần đủ để học kiến trúc backend, auth, CRUD, upload và booking flow.
