# Authentication Flow (JWT)

This document describes the JWT-based authentication flow for the FoodBiz-AI service.

## 1. User Signup

1.  **Client Request:** The user enters their email and password on the frontend.
2.  **API Call:** The client sends a `POST /auth/signup` request to the backend with the user's credentials.
3.  **Backend Logic:**
    - The backend validates the input (e.g., password strength, valid email format).
    - It checks if a user with that email already exists.
    - It hashes the password using a strong algorithm (e.g., bcrypt).
    - It calls the `SupabaseService` to create a new user in the `auth.users` table.
4.  **API Response:** The backend returns a success message or an error (e.g., "User already exists").

## 2. User Login (Token Generation)

1.  **Client Request:** The user enters their email and password.
2.  **API Call:** The client sends a `POST /auth/token` request with the credentials.
3.  **Backend Logic:**
    - The backend retrieves the user from the database by email.
    - It securely compares the provided password with the stored hash.
    - If the credentials are valid, it generates a JWT (JSON Web Token).
4.  **JWT Payload:** The token payload will contain:
    - `sub`: User ID
    - `exp`: Expiration time
    - `iat`: Issued at time
    - Other relevant user roles or permissions.
5.  **API Response:** The backend returns the JWT to the client.

## 3. Accessing Protected Resources

1.  **Client Action:** For any request that requires authentication (e.g., `POST /rag/query`), the client must include the JWT.
2.  **Attaching Token:** The client attaches the token in the `Authorization` header with the `Bearer` scheme:
    ```
    Authorization: Bearer <your_jwt_token>
    ```
3.  **Backend Verification:**
    - The API endpoint will have a security dependency that checks for the `Authorization` header.
    - It decodes and verifies the JWT's signature using the `SUPABASE_JWT_SECRET`.
    - It checks if the token has expired.
    - It extracts the user ID (`sub`) from the token payload.
4.  **Access Granted:** If the token is valid, the backend processes the request. The user's identity is now known.
5.  **Access Denied:** If the token is missing, invalid, or expired, the backend returns a `401 Unauthorized` error.
