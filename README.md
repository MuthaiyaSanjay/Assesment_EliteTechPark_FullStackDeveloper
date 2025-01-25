**E-commerce Platform Backend API**

**Project Features**

1. **Environment Configuration (`dotenv`)**:
   - Manages environment variables securely.
   - Stores sensitive information in an `.env` file.

2. **Express Framework**:
   - Built using `express` for robust routing and middleware.

3. **Database Integration**:
   - Connects to MongoDB with a utility function.
   - Initializes default roles for role-based access control.

4. **Role-Based Access Control (RBAC)**:
   - Defines permissions for API access based on user roles.
   - Uses middleware to enforce access rules.

5. **Authentication & Authorization**:
   - Implements JWTs for secure authentication.
   - Protects routes with authentication middleware.

6. **Dynamic Routing**:
   - **`authRoutes`**: User authentication and staff creation.
   - **`productRoutes`**: Product CRUD operations and searches.
   - **`userRoutes`**: Admin user management and profile updates.

7. **Image Uploads**:
   - Securely handles product image uploads using `multer`.

**Code Overview**

1. **Server Initialization (`index.js`)**:
   - Connects to MongoDB and initializes role seeding.
   - Defines middleware and routes.

2. **Authentication Routes (`authRoutes.js`)**:
   - User signup/login, token verification, password management, and staff creation.

3. **Product Management (`productRoutes.js`)**:
   - Public access to view/search products.
   - Vendor/admin features for adding/updating products and images.

4. **User  Management (`userRoutes.js`)**:
   - Admin access to manage users and self-access for profile updates.

**Security Measures**

1. **JWT-Based Authentication**: Validates user sessions securely.
2. **Role-Based Middleware**: Restricts access based on user roles.
3. **Error Handling**: Manages server errors gracefully.
4. **Validation Middleware**: Ensures request data is sanitized.
5. **Image Upload Restrictions**: Limits uploads to specific roles.

**Scalability**

1. **Modular Design**: Promotes maintainability and easy feature addition.
2. **Database Seeding**: Ensures consistent role management.
3. **Extensible Role Management**: Allows easy addition of new roles.
