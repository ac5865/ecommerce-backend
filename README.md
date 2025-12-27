# Thrift Shop Backend API

A RESTful API built with Node.js, Express, and MongoDB for managing an e-commerce thrift shop.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Environment:** dotenv for configuration

## Installation

```bash
npm install
```

## Database Setup

1. **Start MongoDB:**

   ```bash
   mongod
   ```

2. **Seed Database:**

   ```bash
   npm run seed
   ```

3. **Configure Environment:**
   Create `.env` file:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/thrift-shop
   ```

## Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `GET /api/auth/user/:userId` - Get user by ID
- `POST /api/auth/update-profile` - Update user profile (name, password, profileImage)

### Products

- `GET /api/products` - Get all products (optional: `?category=Clothing`)
- `GET /api/products/:id` - Get product by ID with full details

### Cart

- `POST /api/cart/add` - Add item to cart (requires: productId, quantity, userId)
- `GET /api/cart/:userId` - Get user's cart with enriched product details
- `DELETE /api/cart/remove` - Remove item from cart (requires: productId, userId)
- `DELETE /api/cart/clear/:userId` - Clear user's entire cart

## Database Models

### User

```javascript
{
  userId, email, password, name, profileImage;
}
```

### Product

```javascript
{
  id, name, price, imgUrl, category, description, condition, stock;
}
```

### Cart

```javascript
{ userId, items: [{ productId, quantity, addedAt, updatedAt }] }
```

## Demo Credentials

```
Email: abc@xyz.com | Password: password123
Email: def@xyz.com | Password: mypassword
```

## Example Usage

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"abc@xyz.com","password":"password123"}'

# Get products by category
curl http://localhost:3000/api/products?category=Clothing

# Add to cart
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2,"userId":1}'

# Get cart
curl http://localhost:3000/api/cart/1
```
