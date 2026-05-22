# Backend Architecture Guide (Dành cho 3 bạn Fullstack Newbies)

Chào các bạn, đây là cấu trúc thư mục chuẩn (Clean Architecture cơ bản) cho hệ thống Backend của chúng ta. 
Hãy tuân thủ các quy định dưới đây để code gọn gàng, dễ bảo trì và không conflict với nhau nhé.

## 📂 Cấu trúc thư mục (`/src`)

- `api/` (Controllers & Routes): Nơi nhận request từ Client, gọi tới `services` để xử lý logic, và trả về response.
  - **Quy tắc:** KHÔNG viết business logic ở đây. Chỉ parse req.body, req.query, req.params và gọi Service tương ứng.
- `services/` (Business Logic): Nơi chứa toàn bộ logic xử lý chính (tính toán, xử lý nghiệp vụ).
  - **Quy tắc:** Các Service gọi các Entities hoặc Repositories để lấy/lưu dữ liệu.
- `entities/` (Database Models): Định nghĩa các bảng trong Database (TypeORM/Mongoose).
- `middlewares/`: Chứa các hàm chặn giữa request và controller (ví dụ: `auth.middleware.ts`, `error.middleware.ts`).
- `validations/` (Schemas): Nơi khai báo Joi / Zod schema để validate input từ phía Client trước khi chạy vào Controller.
- `constants/`: Các hằng số dùng chung (ví dụ: `roles.constant.ts`, `status-codes.constant.ts`, `error-messages.constant.ts`).
- `types/`: Chứa các Interface / Type định nghĩa kiểu dữ liệu trong TypeScript.
- `utils/`: Các hàm tiện ích dùng chung (ví dụ: hàm format ngày, hash mật khẩu, response wrapper).

## 🚀 Luồng xử lý một Request chuẩn (Data Flow)
`Client` ➡️ `Router` ➡️ `Middleware (Auth/Validate)` ➡️ `Controller (api/)` ➡️ `Service` ➡️ `Entity/DB`

---
**Chúc các bạn code vui vẻ, có lỗi khó cứ mạnh dạn hỏi Tech Lead nhé!**
