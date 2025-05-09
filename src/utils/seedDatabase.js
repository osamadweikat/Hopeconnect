const { sequelize } = require("../config/db");
const bcrypt = require("bcrypt");
const {
  User, Volunteer, Orphanage, Orphan, Sponsorship,
  Donation, Emergency, SubscriptionPlan, Subscription,
  Notification, Review, VolunteerRequest, VolunteerAssignment,
  Organization, OrganizationFeedback, OrganizationContribution,
  DonationSpending, DonationTracking, donationUpdate,
  Logistics, OrganizationReport, PartnershipWithdrawal, Payment
} = require("../models");

function calculateNextBillingDate(startDate, duration) {
  const date = new Date(startDate);
  if (!duration || typeof duration !== "string") return date;
  const lower = duration.toLowerCase();
  if (lower.includes("month")) date.setMonth(date.getMonth() + 1);
  else if (lower.includes("quarter")) date.setMonth(date.getMonth() + 3);
  else if (lower.includes("year")) date.setFullYear(date.getFullYear() + 1);
  return date;
}

async function seedDatabase() {
  try {
    const SEED_MODE = "safe";
    console.log(`Syncing database in ${SEED_MODE} mode...`);
    await sequelize.sync(SEED_MODE === "force" ? { force: true } : {});
    console.log("Database synced successfully!");

    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    console.log("Seeding Users...");
    const [admin] = await User.findOrCreate({ where: { email: "osamadweikat+admin@proton.me" }, defaults: { full_name: "Admin User", password_hash: adminPassword, role: "admin" } });
    const [donor] = await User.findOrCreate({ where: { email: "osamadweikat+donor@proton.me" }, defaults: { full_name: "Donor User", password_hash: userPassword, role: "donor" } });
    const [donor2] = await User.findOrCreate({ where: { email: "osamadweikat+donor2@proton.me" }, defaults: { full_name: "Second Donor", password_hash: userPassword, role: "donor" } });
    const [volunteerUser] = await User.findOrCreate({ where: { email: "osamadweikat+volunteer@proton.me" }, defaults: { full_name: "Volunteer User", password_hash: userPassword, role: "volunteer" } });
    const [orphanageManager] = await User.findOrCreate({ where: { email: "osamadweikat+manager@proton.me" }, defaults: { full_name: "Orphanage Manager", password_hash: userPassword, role: "orphanage_manager" } });

    await User.findOrCreate({ where: { email: "osamadweikat+aya@proton.me" }, defaults: { full_name: "Aya Naser", password_hash: userPassword, role: "donor" } });
    await User.findOrCreate({ where: { email: "osamadweikat+yazan@proton.me" }, defaults: { full_name: "Yazan Kamal", password_hash: userPassword, role: "volunteer" } });

    console.log("Seeding Subscription Plans...");
    const plans = await SubscriptionPlan.bulkCreate([
      { name: "Basic Monthly", price: 10, duration: "monthly" },
      { name: "Premium Quarterly", price: 25, duration: "quarterly" },
      { name: "Ultimate Yearly", price: 90, duration: "yearly" }
    ], { ignoreDuplicates: true, returning: true });

    const selectedPlan = plans[0];
    const startDate = new Date();
    const nextBillingDate = calculateNextBillingDate(startDate, selectedPlan.duration);

    await Subscription.findOrCreate({
      where: { user_id: donor.id, plan_id: selectedPlan.id },
      defaults: { next_billing_date: nextBillingDate, status: "active" }
    });

    console.log("Seeding Orphanages...");
    const [orphanage1] = await Orphanage.findOrCreate({ where: { name: "Hope Orphanage" }, defaults: { location: "Gaza City", manager_id: orphanageManager.id } });
    const [orphanage2] = await Orphanage.findOrCreate({ where: { name: "Peace Shelter" }, defaults: { location: "Khan Younis", manager_id: orphanageManager.id } });

    console.log("Seeding Orphans...");
    const [orphan1] = await Orphan.findOrCreate({ where: { name: "Ali Mohammad" }, defaults: { age: 10, gender: "male", education_status: "Primary School", health_condition: "Good", orphanage_id: orphanage1.id } });

    console.log("Seeding Donations...");
    const [donation] = await Donation.findOrCreate({ where: { donor_id: donor.id, amount: 50 }, defaults: { category: "education", status: "pending" } });

    await DonationTracking.create({ donation_id: donation.id, status: "pending", details: "Received at Gaza office" });
    await donationUpdate.create({ donation_id: donation.id, status: "processing", details: "Packaging started successfully." });
    await DonationSpending.create({ donation_id: donation.id, amount_spent: 20, category: "education", description: "Bought school supplies" });

    console.log("Seeding Logistics...");
    await Logistics.bulkCreate([
      { donation_id: donation.id, status: "in_transit", updated_at: new Date() },
      { donation_id: donation.id, status: "delivered", updated_at: new Date() }
    ]);

    console.log("Seeding Payments...");
    await Payment.bulkCreate([
      {
        donor_id: donor.id,
        amount: 100,
        currency: "USD",
        transaction_id: `txn_${Date.now()}`,
        status: "completed"
      },
      {
        donor_id: donor2.id,
        amount: 80,
        currency: "USD",
        transaction_id: `txn_${Date.now() + 1}`,
        status: "pending"
      }
    ]);

    console.log("Seeding Reports & Withdrawals...");
    await OrganizationReport.create({
      organization_id: 1,
      title: "Q1 Impact Report",
      report_path: "/reports/q1_impact_report.pdf",
      sent_at: new Date()
    });

    await PartnershipWithdrawal.create({
      organization_id: 1,
      reason: "Program complete",
      status: "approved",
      withdrawal_date: new Date()
    });

    console.log("✅ All models seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedDatabase();
