const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const {
    User,
    Volunteer,
    Orphanage,
    Donation,
    Payment,
    Sponsorship,
} = require("../models/index.js");

const generateReport = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const timestamp = Date.now();
            const filePath = path.join(__dirname, "..", "..", "reports", `admin_report_${timestamp}.pdf`);

            const doc = new PDFDocument({ margin: 30 });
            const writeStream = fs.createWriteStream(filePath);

            doc.pipe(writeStream);

            doc.fontSize(20).text("HopeConnect - Admin Report", { align: "center" });
            doc.moveDown(2);

            const users = await User.findAll({
                attributes: ["id", "full_name", "email", "role", "createdAt"],
            });
            const volunteers = await Volunteer.findAll();
            const orphanages = await Orphanage.findAll();
            const donations = await Donation.findAll();
            const payments = await Payment.findAll();
            const sponsorships = await Sponsorship.findAll();

            const totalFundsRaised = (await Donation.sum("amount")) || 0;
            const totalPaymentsReceived = (await Payment.sum("amount")) || 0;

            doc.fontSize(16).text("General Summary", { underline: true });
            doc.fontSize(14).text(`Total Users: ${users.length}`);
            doc.fontSize(14).text(`Total Volunteers: ${volunteers.length}`);
            doc.fontSize(14).text(`Total Orphanages: ${orphanages.length}`);
            doc.fontSize(14).text(`Total Donations: ${donations.length}`);
            doc.fontSize(14).text(`Total Payments: ${payments.length}`);
            doc.fontSize(14).text(`Total Sponsorships: ${sponsorships.length}`);
            doc.fontSize(14).text(`Total Funds Raised: $${totalFundsRaised}`);
            doc.fontSize(14).text(`Total Payments Received: $${totalPaymentsReceived}`);
            doc.moveDown(2);

            doc.fontSize(16).text("User Details", { underline: true });
            users.forEach((user) => {
                doc.fontSize(12).text(`- ${user.full_name} (${user.email}) - Role: ${user.role}`);
            });
            doc.moveDown(2);

            doc.fontSize(16).text("Donor Movements", { underline: true });
            donations.forEach((donation) => {
                doc
                    .fontSize(12)
                    .text(`- Donor ID: ${donation.donor_id}, Amount: $${donation.amount}, Category: ${donation.category}, Date: ${donation.created_at}`);
            });
            doc.moveDown(2);

            doc.fontSize(16).text("Orphanages", { underline: true });
            orphanages.forEach((orphanage) => {
                doc
                    .fontSize(12)
                    .text(`- ${orphanage.name}, Location: ${orphanage.location}, Manager ID: ${orphanage.manager_id}`);
            });
            doc.moveDown(2);

            doc.fontSize(16).text("Sponsorships", { underline: true });
            sponsorships.forEach((sponsorship) => {
                doc
                    .fontSize(12)
                    .text(`- Sponsor ID: ${sponsorship.sponsor_id}, Orphan ID: ${sponsorship.orphan_id}, Amount: $${sponsorship.amount}, Start: ${sponsorship.start_date}`);
            });

            doc.moveDown(3);
            doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`);
            doc.end();

            writeStream.on("finish", () => resolve(filePath));
            writeStream.on("error", reject);
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = generateReport;
