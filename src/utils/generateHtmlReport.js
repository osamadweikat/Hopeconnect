const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const db = require("../models");

handlebars.registerHelper("getKeys", obj => obj ? Object.keys(obj) : []);
handlebars.registerHelper("shorten", (str, len) =>
  typeof str === "string" && str.length > len ? str.slice(0, len) + "..." : str
);
handlebars.registerHelper("formatDate", val => {
  const d = new Date(val);
  return isNaN(d) || d.getTime() === 0 ? "N/A" : d.toLocaleDateString();
});
handlebars.registerHelper("isDate", val => !isNaN(Date.parse(val)));
handlebars.registerHelper("safe", val => {
  if (typeof val !== "string") return val;
  return val.replace(/</g, "&lt;").replace(/>/g, "&gt;");
});
handlebars.registerHelper("hasData", arr => Array.isArray(arr) && arr.length > 0);
handlebars.registerHelper("prettyKey", key => key.replace(/([A-Z])/g, ' $1'));

const filteredFieldsMap = {
  User: ["full_name", "email", "role"],
  Volunteer: ["user_id", "skills", "preferred_location"],
  Organization: ["organization_name", "contact_email", "phone_number"],
  Orphanage: ["name", "location", "manager_id"],
  Donation: ["donor_id", "amount", "category"],
  DonationTracking: ["donation_id", "status", "details"],
  Payment: ["donor_id", "amount", "currency", "status"],
  Sponsorship: ["sponsor_id", "orphan_id", "amount"],
  Subscription: ["user_id", "plan_id", "status"],
  SubscriptionPlan: ["name", "amount", "renewal_period"],
  VolunteerAssignment: ["volunteer_id", "volunteer_request_id", "status"],
  VolunteerRequest: ["orphanage_id", "description", "status"],
  Review: ["user_id", "orphanage_id", "rating", "comment"],
  Notification: ["user_id", "message", "status"],
  Emergency: ["description", "status"],
  OrganizationReport: ["organization_id", "title"],
  OrganizationContribution: ["organization_id", "title", "type", "amount", "description"],
  OrganizationFeedback: ["reviewer_type", "target_type", "rating", "comment"],
  Orphan: ["name", "age", "gender", "education_status", "health_condition"],
  Logistics: ["status", "updated_at"],
  PartnershipWithdrawal: ["organization_id", "reason", "status"],
  DonationSpending: ["donation_id", "amount_spent", "description"]
};

const generateHopeConnectHtmlReport = async (adminId) => {
  try {
    const modelEntries = Object.entries(db).filter(
      ([name, model]) => typeof model.findAll === "function" && name !== "donationUpdate"
    );

    const allModels = {};
    const stats = {};

    for (const [name, model] of modelEntries) {
      const records = await model.findAll({ raw: true });
      if (!records.length) continue;

      const fields = filteredFieldsMap[name] || Object.keys(records[0]);
      const filteredRecords = records.map(record => {
        const filtered = {};
        fields.forEach(field => {
          const value = record[field];
          if (value === null || value === undefined || value === "") {
            filtered[field] = "N/A";
          } else if (
            typeof value === "string" &&
            !isNaN(Date.parse(value)) &&
            !field.toLowerCase().includes("rating")
          ) {
            const date = new Date(value);
            filtered[field] = isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
          } else if (value instanceof Date) {
            filtered[field] = value.getTime() === 0 ? "N/A" : value.toLocaleDateString();
          } else if (typeof value === "object") {
            filtered[field] = Array.isArray(value)
              ? value.join(", ")
              : Object.values(value).join(", ");
          } else {
            filtered[field] = value;
          }
        });
        return filtered;
      });

      const valid = filteredRecords.filter(r =>
        Object.values(r).some(v => v !== "N/A")
      );

      if (valid.length) {
        allModels[name] = valid;
        stats[name.toLowerCase()] = valid.length;
      }
    }

    const admin = await db.User.findByPk(adminId);
    const donorDonations = await db.Donation?.sum("amount") || 0;
    const orgDonations = await db.OrganizationContribution?.sum("amount") || 0;
    const totalDonations = donorDonations + orgDonations;
    const totalPayments = await db.Payment?.sum("amount") || 0;
    const totalSpending = await db.DonationSpending?.sum("amount_spent") || 0;

    const totalAdmins = await db.User.count({ where: { role: "admin" } });
    const totalOrphans = await db.Orphan.count();
    const totalOrganizations = await db.Organization.count();

    const sponsorships = await db.Sponsorship?.count() || 0;
    const orphans = await db.Orphan?.count() || 0;
    const feedbackCount = await db.OrganizationFeedback?.count() || 0;
    const emergencyCount = await db.Emergency?.count() || 0;
    const notifications = await db.Notification?.findAll({ raw: true }) || [];
    const totalNotifications = notifications.length;
    const readNotifications = notifications.filter(n => n.status === "read").length;

    const data = {
      admin: admin?.email || "Unknown Admin",
      date: new Date().toLocaleString(),
      year: new Date().getFullYear(),
      stats: {
        users: stats.user || 0,
        volunteers: stats.volunteer || 0,
        orphanages: stats.orphanage || 0,
        totalDonations: totalDonations.toFixed(2),
        totalPayments: totalPayments.toFixed(2),
        totalSpending: totalSpending.toFixed(2),
        sponsorships,
        orphans,
        feedbackCount,
        emergencyCount,
        totalNotifications,
        readNotifications,
        totalAdmins,
        totalOrphans,
        totalOrganizations
      },
      allModels
    };

    const templatePath = path.join(__dirname, "..", "templates", "admin_report_template.html");
    const templateSrc = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(templateSrc);
    const html = template(data);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const outputPath = path.join(__dirname, "..", "..", "reports", `hopeconnect_html_report_${Date.now()}.pdf`);
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "10mm", right: "10mm" }
    });

    await browser.close();
    return outputPath;

  } catch (err) {
    console.error("Report generation failed:", err);
    throw err;
  }
};

module.exports = generateHopeConnectHtmlReport;
