const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateReceipt = async (donation) => {
    return new Promise((resolve, reject) => {
        const filePath = `./receipts/receipt_${donation.id}.pdf`;
        const doc = new PDFDocument();

        doc.pipe(fs.createWriteStream(filePath));
        doc.fontSize(20).text("Donation Receipt", { align: "center" });
        doc.fontSize(12).text(`Donation ID: ${donation.id}`);
        doc.text(`Donor ID: ${donation.donor_id}`);
        doc.text(`Amount: $${donation.amount}`);
        doc.text(`Category: ${donation.category}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);
        doc.end();

        doc.on('finish', () => resolve(filePath));
        doc.on('error', reject);
    });
};

module.exports = generateReceipt;
