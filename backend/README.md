# MyBrand Backend API

Backend server for MyBrand Admin Panel built with Node.js and Express.

## Features

- RESTful API for Products, Categories, Reviews, Testimonials, and Orders
- JWT-based authentication
- JSON file-based database (easily upgradeable to MongoDB)
- CORS enabled for frontend integration

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the values:
     ```
     PORT=5000
     JWT_SECRET=your-secret-key-change-this-in-production
     ADMIN_EMAIL=admin@mybrand.com
     ADMIN_PASSWORD=admin123
     ```

3. **Start the Server**
   ```bash
   npm run dev
   ```
   Or for production:
   ```bash
   npm start
   ```

   Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register new admin (optional)
- `GET /api/auth/verify` - Verify token

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Add category (Admin only)
- `DELETE /api/categories/:name` - Delete category (Admin only)

### Reviews
- `GET /api/reviews` - Get all reviews (query: ?productId=xxx)
- `GET /api/reviews/:id` - Get single review
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review (Admin only)
- `DELETE /api/reviews/:id` - Delete review (Admin only)

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `GET /api/testimonials/:id` - Get single testimonial
- `POST /api/testimonials` - Create testimonial (Admin only)
- `PUT /api/testimonials/:id` - Update testimonial (Admin only)
- `DELETE /api/testimonials/:id` - Delete testimonial (Admin only)

### Orders
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/:id` - Get single order (Admin only)
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `DELETE /api/orders/:id` - Delete order (Admin only)

## Data Storage

Data is stored in JSON files in the `backend/data/` directory:
- `products.json`
- `categories.json`
- `reviews.json`
- `testimonials.json`
- `orders.json`
- `users.json`

These files are automatically created on first run.

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Default admin credentials:
- Email: `admin@mybrand.com`
- Password: `admin123`

## Notes

- The backend uses ES modules (type: "module" in package.json)
- Data is stored in JSON files for simplicity, but the structure is ready for MongoDB migration
- CORS is enabled for localhost:3000 (Next.js frontend)

