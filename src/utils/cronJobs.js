const cron = require("node-cron");
const { sendRenewalReminders } = require("../controllers/subscriptionController");

function startCronJobs() {
    console.log("⏳ Starting cron jobs...");

    cron.schedule("0 20 * * 0", async () => {
        console.log("🔄 Running weekly subscription renewal reminders...");
        await sendRenewalReminders();
    });
}

module.exports = { start: startCronJobs };
