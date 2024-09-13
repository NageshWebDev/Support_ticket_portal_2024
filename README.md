# **Support Ticket Portal**

Welcome to the **Support Ticket Portal**, a system built using the MERN stack that streamlines the process of creating and managing support tickets. This platform allows employees to submit tickets and enables the support team to track and resolve them efficiently. The portal supports three distinct user roles: **User**, **Admin**, and **Super Admin**, each with specific permissions and responsibilities.

## **Table of Contents**

- [Features](#features)
- [Roles and Permissions](#roles-and-permissions)
  - [User](#user)
  - [Admin](#admin)
  - [Super Admin](#super-admin)
- [Installation](#installation)
- 
---

## **Features**

- **Ticket Management**: Create, update, and manage support tickets.
- **Role-Based Access Control**: Different users have access to different functionalities based on their roles.
- **Ticket Assignment**: Super Admins can assign tickets to Admins for resolution.
- **Status Tracking**: Update the status of support tickets (e.g., pending, resolved).
- **User Authentication**: Secure login and session management using JWT.

---

## **Roles and Permissions**

### **User**
**Description**: Regular employees who require support.

**Permissions**:
- Create new support tickets.
- Update their own tickets (e.g., add comments or status).

---

### **Admin**
**Description**: Support personnel responsible for managing tickets assigned to them.

**Permissions**:
- Create new support tickets.
- Manage and update the status of tickets assigned to them.

---

### **Super Admin**
**Description**: System administrators who oversee the ticketing process and manage ticket assignments.

**Permissions**:
- Create new support tickets.
- Manage and update the status of tickets assigned to them.
- Assign tickets to Admins.
- Delete tickets from the system.

---

## **Installation**

To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/NageshWebDev/Support_ticket_portal_2024.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd support-ticket-portal
   ```

3. **Install dependencies** for both the server and client:
   - For the backend (server):
     ```bash
     cd server
     npm install
     ```
   - For the frontend (client):
     ```bash
     cd ../client
     npm install
     ```

4. **Set up environment variables**:
   - Create a `.env` file in the `server` directory with the following fields:
     ```
     MONGO_URI=<your-mongodb-uri>
     JWT_SECRET=<your-secret-key>
     PORT=5000
     ```

5. **Run the application**:
   - Start the backend server:
     ```bash
     cd server
     npm run dev
     ```
   - Start the frontend:
     ```bash
     cd client
     npm start
     ```

6. **Open the application** in your browser:
   ```
   http://localhost:3000
   ```

---
This **README** covers all the essential aspects of your project in a formal, clear, and structured manner.
