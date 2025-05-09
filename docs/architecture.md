🏗️ System Architecture – HopeConnect
This document explains the structural design and internal architecture of the HopeConnect platform, outlining the major layers, data flow, and external integrations that power the backend system.

🔄 Application Layers
HopeConnect is built using a modular, maintainable backend structure:

Controllers: Contain core logic for each feature (e.g., donations, orphans).

Routes: Define RESTful endpoints and route requests to their corresponding controllers.

Models: Sequelize models that represent the relational database schema (MySQL).

Middleware: Handles authentication, role-based access control, and error handling.

Utils: Tools like PDF generation, email integration, and data seeding.

Templates: Handlebars HTML templates used for rendering structured admin reports to PDF using Puppeteer.

👥 Role-Based Access Control
User access is controlled via role-based middleware:

admin: Full system control, can generate reports, review data.

donor: Can make donations, view orphans, receive updates.

volunteer: Can register skills, apply to orphanage needs.

orphanage_manager: Can manage orphans, respond to requests, track donations.

organization: Can contribute, submit feedback, download reports, withdraw partnership.

🧭 Sponsorship Flow Example
A sample flow for orphan sponsorship looks like this:

Donor logs in and browses available orphan profiles.

Sends a sponsorship request → saved in Sponsorship table.

Orphanage manager confirms or updates status.

Donor is notified via email and sees updates on their dashboard.

Sponsorship data appears in admin PDF reports.

🛠️ Tools and Technologies Used
Backend: Node.js (Express.js)

Database: MySQL with Sequelize ORM

Authentication: JWT (JSON Web Tokens) with custom role guards

PDF Report Generation: Handlebars.js templates + Puppeteer (Chrome rendering engine)

Email Service: Brevo (formerly Sendinblue)

Email Aliasing: ProtonMail (to simulate multiple users)

Chatbot Engine: Gemini AI (Google Generative AI)

Crisis Data API: ReliefWeb API

🌐 External Integrations
HopeConnect integrates with the following external services:

📨 Brevo (Sendinblue) – Sends real-time transactional emails (sponsorships, emergencies).

📧 ProtonMail Aliasing – Allows realistic testing using +admin, +donor, etc. email formats.

🤖 Gemini AI – Powers a responsive, conversational chatbot assistant within the donor flow.

🌍 ReliefWeb API – Provides real-time humanitarian data related to Gaza (used in emergency campaigns).

CLIENT (Postman)
   ↓
ROUTES (Express.js)
   ↓
CONTROLLERS (Business Logic)
   ↓
MODELS (Sequelize → MySQL DB)
   ↓                     ↘
TEMPLATES (Handlebars)   EMAIL SERVICE (Brevo)
   ↓                         ↘
PDF REPORT (Puppeteer)      USER
