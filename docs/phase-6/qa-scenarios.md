# QA Scenarios v1

- **Author:** QA Engineer
- **Status:** Draft

This document outlines the initial set of test scenarios for the FoodBiz-AI application, covering normal operation, boundary conditions, and error handling.

--- 

### Authentication & Authorization

**1. (Normal) Successful User Signup:**
   - **Steps:** New user provides a valid email and strong password. Clicks "Sign Up".
   - **Expected:** Receives a success message. Can now log in.

**2. (Error) Existing User Signup:**
   - **Steps:** User tries to sign up with an email that is already registered.
   - **Expected:** Receives an error message indicating the user already exists.

**3. (Normal) Successful Login/Logout:**
   - **Steps:** Existing user logs in with correct credentials. Navigates the app. Clicks "Log Out".
   - **Expected:** Login is successful, JWT is stored. Logout clears the session.

**4. (Error) Failed Login (Incorrect Password):**
   - **Steps:** User logs in with a correct email but incorrect password.
   - **Expected:** Receives a "401 Unauthorized" error.

**5. (Error) Accessing Protected Route without Token:**
   - **Steps:** A non-logged-in user attempts to access `/rag/query` via an API client.
   - **Expected:** Receives a "401 Unauthorized" error.

### RAG Chat & WebSocket

**6. (Normal) Successful Chat Query (Streaming):**
   - **Steps:** Logged-in user opens the chat widget, sends a valid query.
   - **Expected:** Receives a streamed response, starting with initial chunks and ending with a final message containing sources.

**7. (Boundary) Empty Chat Query:**
   - **Steps:** User sends an empty or whitespace-only message.
   - **Expected:** The message is not sent, and no API call is made. The UI may show a prompt to enter a message.

**8. (Error) WebSocket Disconnection:**
   - **Steps:** User is in the middle of a chat, and their network connection drops.
   - **Expected:** The chat UI shows a "Disconnected" or "Reconnecting" status. The connection is re-established when the network returns.

### Dashboard & SSE

**9. (Normal) Dashboard Data Display:**
   - **Steps:** User logs in and navigates to the Dashboard tab.
   - **Expected:** All KPI cards and charts are displayed with (mock) data.

**10. (Normal) Real-time Alert Notification:**
    - **Steps:** While the app is open, the backend triggers an SSE event.
    - **Expected:** A notification dot appears on the bell icon. Clicking the bell reveals the new alert message in the dropdown.

### Data Handling

**11. (Boundary) RAG Query with No Relevant Context:**
    - **Steps:** User asks a question for which there is no relevant information in the `guidelines.md` data source.
    - **Expected:** The RAG service responds with a message like "I do not have enough information to answer that question."

**12. (Normal) User Manages Chat Window:**
    - **Steps:** User opens the chat widget, interacts, and closes it using the 'X' button. User then re-opens it.
    - **Expected:** The chat window opens and closes correctly. State is preserved while the component is mounted.
