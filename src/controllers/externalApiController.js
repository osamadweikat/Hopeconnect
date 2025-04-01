const axios = require("axios");

exports.fetchHumanitarianData = async (req, res) => {
    try {
        const response = await axios.get("https://api.reliefweb.int/v1/reports?appname=apidoc");

        const reports = response.data.data.map(report => ({
            id: report.id,
            title: report.fields.title,
            date: report.fields.date.created,
            summary: report.fields.body ? report.fields.body.slice(0, 200) + "..." : "No summary available.",
            link: report.fields.url
        }));

        res.json({ success: true, reports });
    } catch (error) {
        console.error("Error fetching humanitarian data:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch data from external API" });
    }
};
