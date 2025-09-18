# Phase 4: In-App Alert Specification

## 1. Overview

This document defines the specification for the in-app alert system. It covers the types of alerts, the mechanism for triggering and delivering them, and the user interface components.

## 2. Alert Types

| Alert Type          | Trigger                                     | Priority | UI Component      |
| ------------------- | ------------------------------------------- | -------- | ----------------- |
| **New Policy**      | A new relevant government policy is added.  | Medium   | Badge on Bell Icon, List Item |
| **Signal Change**   | A key business metric changes its signal.   | High     | Toast, List Item  |
| **Settlement Delay**| A payment settlement is detected as delayed.| High     | Toast, List Item  |
| **System Message**  | General announcements or system updates.    | Low      | List Item         |

## 3. Delivery Mechanism

We will use **Server-Sent Events (SSE)** for delivering real-time alerts to the client. This is a lightweight and efficient alternative to WebSockets for one-way communication from server to client.

- **Endpoint**: `/alerts/sse`
- **Authentication**: The SSE endpoint will be protected and require a valid JWT.
- **Event Format**:
  ```
  event: new_alert
  data: {"id": "alert-123", "type": "Signal Change", "message": "Your cost-to-sales ratio has entered the 'warning' zone.", "createdAt": "2025-09-08T10:00:00Z"}
  ```

If SSE proves difficult to implement with the current infrastructure, a fallback polling mechanism will be used, querying an `/alerts` endpoint every 30 seconds.

## 4. User Interface

1.  **Bell Icon**: Located in the main navigation bar. It will display a badge with the number of unread alerts.
2.  **Alerts Drawer**: Clicking the bell icon opens a drawer from the side.
3.  **Alert List**: The drawer contains a list of recent alerts, with unread ones highlighted.
4.  **Mark as Read**: Users can mark individual alerts as read or clear all alerts.
5.  **Toast Notifications**: High-priority alerts will also appear as temporary toast messages at the top of the screen.
