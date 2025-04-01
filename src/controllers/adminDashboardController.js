const generateReport = require("../utils/reportGenerator");

exports.downloadAdminReport = async (req, res) => {
    try {
        const filePath = await generateReport();
        res.download(filePath, "HopeConnect_Admin_Report.pdf");
    } catch (error) {
        console.error("Error generating admin report:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
