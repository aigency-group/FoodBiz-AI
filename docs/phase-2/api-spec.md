# API Specification v1

This document defines the API endpoints and data contracts for the FoodBiz-AI service.

**Base URL:** `/`

---

## Authentication

### `POST /auth/signup`

Registers a new user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "a_strong_password"
}
```

**Response (200 OK):**

```json
{
  "message": "User created successfully"
}
```

**Errors:**

- `400 Bad Request`: Invalid input or user already exists.

### `POST /auth/token`

Logs a user in by providing a JWT.

**Request Body (form data):**

```
username=user@example.com&password=a_strong_password
```

**Response (200 OK):**

```json
{
  "access_token": "your.jwt.token",
  "token_type": "bearer"
}
```

**Errors:**

- `401 Unauthorized`: Incorrect credentials.

---

## RAG Chat

*Authentication: Required (Bearer Token)*

### `POST /rag/query`

Submits a query to the RAG pipeline.

**Request Body:**

```json
{
  "query": "지난달 매출이 왜 떨어졌나요?"
}
```

**Response (200 OK):**

```json
{
  "response": "지난달 매출은 15% 감소했습니다. 주요 원인은 A제품의 판매 부진으로 보입니다.",
  "sources": [
    {
      "source_name": "weekly_sales_report_2024_W3.pdf",
      "page_number": 3,
      "snippet": "... A제품의 주간 판매량이 전주 대비 40% 감소하여..."
    }
  ]
}
```

### `WS /ws/chat`

Initiates a WebSocket connection for real-time chat.

**Messages (Client to Server):**

- A JSON string representing the user's message.

```json
{
  "text": "매출 하락에 대한 해결책을 알려줘"
}
```

**Messages (Server to Client):**

- A JSON string with the bot's response, potentially streamed.

```json
{
  "text": "매출 증대를 위해 다음과 같은 프로모션을 제안합니다...",
  "is_final": true
}
```

---

## Health Check

### `GET /health`

Checks the operational status of the service.

**Response (200 OK):**

```json
{
  "status": "ok"
}
```
