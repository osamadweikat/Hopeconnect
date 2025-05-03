const generateReport = require("../utils/reportGenerator");
const path = require("path");

exports.downloadAdminReport = async (req, res) => {
    try {
        const filePath = await generateReport();
        const absolutePath = path.resolve(filePath);

        res.download(absolutePath, "HopeConnect_Admin_Report.pdf", (err) => {
            if (err) {
                console.error("Download error:", err);
                res.status(500).send("Failed to download report");
            }
        });
    } catch (error) {
        console.error("Report generation failed:", error);
        res.status(500).send("Internal Server Error");
    }
};
