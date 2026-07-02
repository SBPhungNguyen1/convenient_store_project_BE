# convenient_store_project_BE

Backend API cho hệ thống **Convenient Store Management**, được xây dựng bằng **NestJS** và **TypeScript**. Dự án cung cấp các REST API phục vụ quản lý cửa hàng tiện lợi với các chức năng CRUD cơ bản như quản lý người dùng, danh mục sản phẩm, sản phẩm và nhập/xuất kho.

## Tổng quan

| Thành phần        | Công nghệ             |
| ----------------- | --------------------- |
| Framework         | NestJS                |
| Language          | TypeScript            |
| Database          | PostgreSQL + TypeORM  |
| Cache             | Redis                 |
| Authentication    | JWT                   |
| Validation        | class-validator       |
| API Documentation | Swagger (`/api-docs`) |
| Package Manager   | pnpm                  |

## Chức năng

- Đăng nhập và xác thực bằng JWT.
- Quản lý người dùng.
- Quản lý danh mục sản phẩm.
- Quản lý sản phẩm.
- Quản lý phiếu nhập kho.
- Quản lý phiếu xuất kho.
- Theo dõi tồn kho.

## Yêu cầu

- Node.js 22 LTS (khuyến nghị).
- pnpm.
- PostgreSQL.
- Redis.

## Cài đặt

```bash
pnpm install
cp .env.example .env
```

Sau đó cập nhật các biến môi trường phù hợp với máy của bạn.

## Biến môi trường

```env
NODE_ENV=development

HOST=localhost
PORT=3001
TZ=Asia/Ho_Chi_Minh

DB_HOST=postgres
DB_PORT=5434
DB_USERNAME=postgres
DB_PASSWORD=
DB_DATABASE=learn_pj2_v1

REDIS_HOST=redis
REDIS_PORT=6379

JWT_ACCESS_SECRET=your_jwt_access_secret
```

## Chạy dự án

```bash
pnpm start:dev
```

Mặc định ứng dụng chạy tại:

- API: http://localhost:3001
- Swagger: http://localhost:3001/api-docs

## Build

```bash
pnpm build
```

## Kiểm tra

```bash
pnpm lint
pnpm test
```

## Cấu trúc thư mục

```text
src/
├── common/              # Common utilities, decorators, guards...
├── config/              # Application configuration
├── modules/
│   ├── auth/
│   ├── user/
│   ├── category/
│   ├── product/
│   ├── import/
│   ├── export/
│   └── ...
├── app.module.ts
└── main.ts
```

## Database

Dự án sử dụng **PostgreSQL** cùng **TypeORM** để quản lý dữ liệu.

Trong môi trường phát triển có thể bật `synchronize` để tự động đồng bộ schema. Đối với môi trường production nên sử dụng migration để quản lý thay đổi cơ sở dữ liệu.

## API Documentation

Swagger được tích hợp sẵn tại:

```
http://localhost:3001/api-docs
```

## Quy ước phát triển

Mỗi module được tổ chức theo cấu trúc:

- `*.module.ts`
- `*.controller.ts`
- `*.service.ts`
- `dto/`
- `entities/`

Business logic được xử lý trong **Service**, Controller chỉ tiếp nhận và trả về dữ liệu. Dữ liệu đầu vào được validate bằng `class-validator`.

## Công nghệ sử dụng

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Redis
- JWT Authentication
- Swagger
- class-validator
- pnpm
