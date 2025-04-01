const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const generateReceipt = (donation) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const filePath = path.join(__dirname, `receipt_${donation.id}.pdf`);
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        doc.fontSize(20).text('Donation Receipt', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Donor ID: ${donation.donor_id}`);
        doc.text(`Amount: $${donation.amount}`);
        doc.text(`Category: ${donation.category}`);
        doc.text(`Transaction ID: ${donation.transaction_id}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);
        doc.end();

        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
};

module.exports = generateReceipt;
