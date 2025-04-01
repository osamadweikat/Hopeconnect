const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http"); 
process.removeAllListeners("warning");

const { verifyToken, verifyAdmin } = require("./src/middleware/authMiddleware");
const { sequelize } = require("./src/config/db");
const cronJobs = require("./src/utils/cronJobs"); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app); 

app.use(cors());
app.use(bodyParser.json());

const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const orphanRoutes = require("./src/routes/orphanRoutes");
const sponsorshipRoutes = require("./src/routes/sponsorshipRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const orphanageRoutes = require("./src/routes/orphanageRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const logisticsRoutes = require("./src/routes/logisticsRoutes");
const externalApiRoutes = require("./src/routes/externalApiRoutes");
const volunteerRoutes = require("./src/routes/volunteerRoutes");
const emergencyRoutes = require("./src/routes/emergencyRoutes");
const subscriptionRoutes = require("./src/routes/subscriptionRoutes");
const donationTrackingRoutes = require("./src/routes/donationTrackingRoutes");
const donationSummaryRoutes = require("./src/routes/donationSummaryRoutes");
const chatbotRoutes = require("./src/routes/chatbotRoutes");
const adminDashboardRoutes = require("./src/routes/adminDashboardRoutes");

const errorHandler = require("./src/middleware/errorHandler");

app.use("/api/users", userRoutes);
app.use("/api/admin", verifyToken, verifyAdmin, adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/orphans", orphanRoutes);
app.use("/api/sponsorship", sponsorshipRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orphanages", verifyToken, verifyAdmin, orphanageRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/logistics", logisticsRoutes);
app.use("/api/external", externalApiRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/donation-tracking", donationTrackingRoutes);
app.use("/api/donation-summary", donationSummaryRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

app.use(errorHandler);

app.get("/", (req, res) => res.send("HopeConnect API is running..."));

sequelize.sync({ force: false }) 
    .then(() => {
        console.log("Database synchronized successfully.");

        cronJobs.start();

        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error("Sequelize sync error:", err);
        process.exit(1);
    });

process.on("SIGINT", async () => {
    console.log("Shutting down server...");
    await sequelize.close();
    server.close(() => {
        console.log("Server shutdown complete.");
        process.exit(0);
    });
});
