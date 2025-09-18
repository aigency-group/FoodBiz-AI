# Environment Variables & Security Policy

This document outlines the environment variables required for the project and the security policies to be followed.

## Environment Variables

Environment variables are managed using `.env` files in the `backend` and `frontend` directories. Use the `.env.example` files as templates.

### Backend (`backend/.env`)

- `SUPABASE_URL`: The URL of your Supabase project.
- `SUPABASE_KEY`: The `anon` key for your Supabase project.
- `SUPABASE_JWT_SECRET`: The JWT secret from your Supabase project settings (Authentication > JWT Settings). This is crucial for verifying token signatures.
- `OPENAI_API_KEY`: Your API key for OpenAI services, used by the RAG pipeline.

### Frontend (`frontend/.env`)

- `VITE_API_URL`: The URL of the backend server. For local development, this is typically `http://localhost:8000`.

## Security Policy

1.  **NEVER commit `.env` files** or any files containing secrets to the Git repository. The `.gitignore` file is already configured to ignore these.
2.  **Do not log sensitive information.** This includes API keys, passwords, JWT tokens, and any Personally Identifiable Information (PII). The backend logging should be configured to mask or omit such data.
3.  **Use separate, strong secrets** for development, staging, and production environments.
4.  **Principle of Least Privilege:** API keys and database credentials should only have the permissions necessary for their function. For example, a read-only user should be used if only data retrieval is required.
5.  **Token Handling:** JWTs should be stored securely on the client-side (e.g., in an HttpOnly cookie or secure storage) and transmitted via Authorization headers.
