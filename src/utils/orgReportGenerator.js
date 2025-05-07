const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Organization = require("../models/Organization");
const OrganizationFeedback = require("../models/OrganizationFeedback");
const OrganizationContribution = require("../models/OrganizationContribution");

const generatePDFReport = async (organizationId, title) => {
  const org = await Organization.findByPk(organizationId);
  const feedbacks = await OrganizationFeedback.findAll({ where: { target_id: organizationId, target_type: "organization" } });
  const contributions = await OrganizationContribution.findAll({ where: { organization_id: organizationId } });

  const doc = new PDFDocument();
  const reportPath = path.join("reports", `org_${organizationId}_${Date.now()}.pdf`);
  const writeStream = fs.createWriteStream(reportPath);
  doc.pipe(writeStream);
  doc.fontSize(20).text("HopeConnect - Organization Summary Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(16).text(`Organization: ${org.organization_name}`);
  doc.text(`Email: ${org.contact_email}`);
  doc.text(`Phone: ${org.phone_number}`);
  doc.text(`Website: ${org.website}`);
  doc.text(`Status: ${org.status}`);
  doc.moveDown();

  doc.fontSize(18).text("Contributions:", { underline: true });
  if (contributions.length === 0) {
    doc.text("No contributions recorded.");
  } else {
    contributions.forEach((c, i) => {
      doc.text(`${i + 1}. ${c.type.toUpperCase()} - ${c.title} - $${c.amount || 0}`);
      if (c.description) doc.text(`    ▸ ${c.description}`);
      doc.moveDown(0.5);
    });
  }
  doc.moveDown();

  doc.fontSize(18).text("Feedback Received:", { underline: true });
  if (feedbacks.length === 0) {
    doc.text("No feedback received.");
  } else {
    feedbacks.forEach((f, i) => {
      doc.text(`${i + 1}. ${f.rating} - ${f.comment || "No comment"}`);
    });
  }

  doc.moveDown(2);
  doc.fontSize(10).text(`Report generated: ${new Date().toLocaleString()}`, { align: "center" });
  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(reportPath));
    writeStream.on("error", reject);
  });
};

module.exports = generatePDFReport;
