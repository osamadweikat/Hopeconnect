🔐 Security & Privacy – HopeConnect
This document outlines the security model, role-based access control, data protection mechanisms, and privacy considerations adopted in the HopeConnect backend API platform.

👥 Role-Based Access Control (RBAC)
HopeConnect uses a strict role-based permission system:

Role	Capabilities
admin	Full access: manage all data, generate reports, view all
donor	Donate, view orphans, track donations
volunteer	Post availability, apply to requests
orphanage_manager	Manage orphans, emergencies, respond to volunteers
organization	Contribute, leave feedback, withdraw

Each API route checks the user's role via JWT middleware before allowing access.

🔑 Authentication
JWT (JSON Web Token) is used for stateless authentication.

Tokens are signed and returned at login and must be attached to each secured request.

Token includes:

id, role, email, and expiration

🧪 Input Validation & Sanitization
All request bodies are validated using custom middleware.

Missing fields, invalid types, or unauthorized access return structured error messages.

Critical inputs (e.g., donations, profile creation) are escaped and sanitized to prevent injection.

🧂 Password Security
Passwords are hashed with bcrypt before being saved in the database.

Passwords are never returned in any response.

Reset/recovery flows rely on secure identity verification (e.g., OTP via email).

✉️ Email Privacy
Brevo (Sendinblue) used for sending emails securely (e.g., donation confirmations, alerts).

ProtonMail Aliasing used during testing to avoid exposing real email addresses.

e.g., osamadweikat+donor@proton.me

📃 Logging & Error Handling
All unexpected errors are caught by centralized middleware.

Errors are logged (e.g., console or future file-based logging).

Admins can audit failure logs through future dashboards or system exports.

📜 Data Privacy Principles
Users can only access their own data unless they are admin.

Orphan profiles are visible publicly only with limited non-sensitive data.

Donation and sponsorship details are never exposed to other users.

No sensitive information (e.g., hashed passwords, emails) is leaked through any API.
