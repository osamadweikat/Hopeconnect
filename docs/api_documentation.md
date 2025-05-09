📡 API Documentation – HopeConnect
This document provides an overview of the main RESTful API endpoints exposed by the HopeConnect backend. Each section includes the route, method, description, required roles, and expected input/output.

🧑‍💼 Authentication
🔹 POST /api/auth/login
Description: Authenticates a user and returns a JWT token.

Access: Public

Body:
{
  "email": "user@example.com",
  "password": "secret123"
}

👶 Orphans
🔹 GET /api/orphans
Description: Retrieve all orphan profiles.

Access: All roles

🔹 POST /api/orphans
Description: Add a new orphan profile.

Access: Orphanage Manager

💸 Donations
🔹 POST /api/donations
Description: Submit a new donation.

Access: Donor, Organization

Body:
{
  "amount": 50,
  "category": "education",
  "method": "paypal"
}

🔹 GET /api/donations/user
Description: View logged-in user's donations.

Access: Donor

🧾 Sponsorships
🔹 POST /api/sponsorships
Description: Sponsor a specific orphan.

Access: Donor

🔹 GET /api/sponsorships
Description: View all sponsorships (admin only).

Access: Admin

🧑‍⚕️ Volunteers
🔹 POST /api/volunteers/announce
Description: Create a volunteer availability post.

Access: Volunteer

🔹 GET /api/volunteers/requests
Description: View orphanage volunteer requests.

Access: Volunteer

🚨 Emergencies
🔹 POST /api/emergencies
Description: Create an emergency campaign.

Access: Admin, Orphanage Manager

🔹 GET /api/emergencies/active
Description: Get all active emergencies.

Access: Public

🛠️ Admin Reports
🔹 GET /api/admin/report
Description: Generate and download PDF report.

Access: Admin only

📬 Notifications
🔹 GET /api/notifications
Description: Get user's notifications.

Access: Authenticated Users

🏢 Organization
🔹 POST /api/organizations/contributions
Description: Submit a financial or project-based contribution.

Access: Organization

🔹 POST /api/organizations/withdrawal
Description: Request to withdraw partnership.

Access: Organization

🔐 Authentication & Headers
All protected routes require a valid JWT token in the header:
Authorization: Bearer <your-token>
Error responses follow consistent format:
{
  "error": "Unauthorized access"
}

👥 Role Access Matrix
Role	Access Examples
admin	Full control, report generation, user management
donor	View orphans, donate, track donations
volunteer	Announce availability, apply to requests
orphanage_manager	Manage orphans, emergencies, respond to sponsors
organization	Submit feedback, contribute, request withdrawal

This API is designed to be clean, secure, and extensible. All endpoints return standard JSON responses and support clear role-based access control for integrity and security. ✅

