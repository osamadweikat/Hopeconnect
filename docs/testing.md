🧪 Testing Strategy – HopeConnect
This document outlines how the HopeConnect platform was tested to ensure reliability, correctness, and security of all core backend functionalities.

🎯 Testing Goals
Validate core features like donations, sponsorships, and emergency creation.

Ensure role-based access is respected across all routes.

Confirm all sensitive actions (e.g. login, report generation) are secure.

Simulate real-world usage (volunteer/donor workflows).

Verify data is stored, updated, and retrieved correctly in the MySQL database.

🧪 Manual Testing Process
Given the humanitarian nature and complexity of flows, most testing was done manually through Postman, realistic workflows, and actual seeded data.

🔹 Login & Role Access
✅ Tested login as admin, donor, volunteer, manager, and organization.

✅ Verified that each role could only access permitted endpoints.

✅ Invalid tokens or missing roles returned 403 Forbidden.

🔹 Donations & Sponsorships
✅ Created donations via /api/donations (manual + seed).

✅ Verified donor sees donation history.

✅ Sponsorship creation tested from both donor and orphanage manager perspectives.

🔹 Emergency Alerts
✅ Created active emergencies as admin.

✅ Checked automatic email sending using Brevo console logs.

✅ Confirmed emergency visibility for all users.

🔹 Volunteers
✅ Volunteer creates availability post → visible to managers.

✅ Manager posts request → visible to volunteers.

✅ Confirmed correct matching.

🔹 Report Generation
✅ Admin triggered /api/admin/report.

✅ Generated PDF includes real-time stats and dynamic data.

✅ Ensured no empty tables, all values parsed (no N/A if real data exists).

🧪 Automated Test Examples (Partial)
Due to time constraints, full unit testing was not implemented. Below are samples that can be extended.

const request = require("supertest");
const app = require("../app");

describe("GET /api/orphans", () => {
  it("should return orphan list", async () => {
    const res = await request(app).get("/api/orphans");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});

🛠️ Testing Tools Used
✅ Postman – For testing all routes and verifying authorization.

✅ MailTrap / Brevo Console – To inspect email dispatches.

✅ PDF viewer – For inspecting layout and data in generated reports.

✅ MySQL Workbench – For validating database state after operations.


✅ Summary
HopeConnect was thoroughly tested using real-world data, user role simulation, and endpoint validation. While automated testing was limited, the entire platform was used end-to-end in both seeded and realistic flows to confirm integrity and reliability.