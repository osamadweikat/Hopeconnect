const axios = require("axios");

exports.fetchHumanitarianData = async (req, res) => {
    try {
        const keyword = req.query.keyword && req.query.keyword.trim() !== "" ? req.query.keyword.trim() : "Gaza";

        const apiUrl = `https://api.reliefweb.int/v1/reports?appname=apidoc&filter[field]=body&filter[value]=${encodeURIComponent(keyword)}&filter[operator]=OR`;

        const response = await axios.get(apiUrl);

        const reports = response.data.data.map(report => ({
            id: report.id,
            title: report.fields.title || "No Title",
            date: report.fields.date?.created || "N/A",
            summary: report.fields.body ? report.fields.body.slice(0, 200) + "..." : "No summary available.",
            link: report.fields.url || "#"
        }));

        res.json({ success: true, reports });
    } catch (error) {
        console.error("Error fetching humanitarian data:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch data from external API" });
    }
};
