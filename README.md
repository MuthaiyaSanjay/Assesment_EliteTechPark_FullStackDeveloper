# E-commerce API

## Project Title
E-commerce RESTful API

## Project Goal
The goal of this project is to develop a robust and scalable backend for an e-commerce platform. This backend handles core functionalities like user authentication, product management, and role-based access control for admins, staff, vendors, and buyers.

---

## Tech Stack
- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Environment Management**: dotenv
- **HTTP Client**: Postman (for testing)

---

## Project Structure

```
ecommerce-api/
├── src/
│   ├── config/             # Configuration files (e.g., database, environment)
│   ├── controllers/        # Controllers for handling requests
│   ├── models/             # Database schemas/models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication and error handling middlewares
│   ├── utils/              # Utility functions (e.g., token generation)
│   ├── app.js              # Main application entry point
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
├── README.md               # Project documentation
```

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MuthaiyaSanjay/nodejs_assesment_for_fullstackdeveloper.git
   cd ecommerce-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     PORT=3000
     MONGODB_URI=<your-mongodb-uri>
     JWT_SECRET=<your-secret-key>
     ```

4. Start the development server:
   ```bash
   npm start
   ```

---

## Features
1. **User Authentication**:
   - Sign Up, Log In, Token Verification, Password Change
2. **Product Management**:
   - Add, Update, Retrieve, and Delete Products
3. **User Management**:
   - Role-based Access (Admin, Vendor, Buyer)
4. **Error Handling**:
   - Standardized HTTP error codes

---

## Screenshots
### Example API Response for Product Retrieval
![Product API Example](https://github.com/MuthaiyaSanjay/nodejs_assesment_for_fullstackdeveloper/blob/main/ecommerce-api/product_response.png)

### Database Schema Overview
![Database Schema](https://raw.githubusercontent.com/MuthaiyaSanjay/nodejs_assesment_for_fullstackdeveloper/main/ecommerce-api/dbcollection_screenshot.png)

---

## API Endpoints

### Authentication
| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| POST   | `/api/auth/signup`      | Register a new user      |
| POST   | `/api/auth/login`       | Log in and get a token   |
| POST   | `/api/auth/change-password/:id` | Change user password |

### Products

| Method | Endpoint                          | Description                                                                |
|--------|-----------------------------------|----------------------------------------------------------------------------|
| **GET**  | `/api/products`                   | Retrieve all products with optional filters for search, category, pagination, etc. |
| **GET**  | `/api/products/:id`               | Retrieve detailed information about a specific product by its ID.          |
| **GET**  | `/api/products/category/:category`| Retrieve products filtered by category.                                    |
| **GET**  | `/api/products/search?query=<term>`| Search for products by name, description, or other attributes.             |
| **GET**  | `/api/products/vendor/:vendorId`  | Retrieve all products associated with a specific vendor.                   |
| **POST** | `/api/products`                   | Add a new product (Accessible to Admin and Vendor roles only).             |
| **PUT**  | `/api/products/:id`               | Update an existing product by its ID (Accessible to Admin, Vendor, and Staff roles). |
| **DELETE** | `/api/products/:id`             | Delete a product by its ID (Accessible to Admin role only).                |
| **POST** | `/api/products/upload`            | Upload product images (Accessible to Admin and Vendor roles only).         |

### Users
| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| GET    | `/api/users`            | Retrieve all users (Admin, Self only) |
| GET    | `/api/users/:id`        | Retrieve user by ID  (Admin, Self only)) |
| PUT    | `/api/users/:id`        | Update user details  (Admin, Self only)) |
| DELETE | `/api/users/:id`        | Delete a user      (Admin, Self only)) |

---


## Contact
For inquiries or collaboration, contact me at:
- **Email**: [muthaiya3152@gmail.com](mailto:muthaiya3152@gmail.com)
- **GitHub**: [MuthaiyaSanjay](https://github.com/MuthaiyaSanjay)

---
