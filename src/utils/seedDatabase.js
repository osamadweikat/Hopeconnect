const { sequelize } = require("../config/db");
const User = require("../models/User");
const Orphanage = require("../models/Orphanage");
const Orphan = require("../models/Orphan");
const Sponsorship = require("../models/Sponsorship");
const Donation = require("../models/Donation");
const Volunteer = require("../models/Volunteer");
const bcrypt = require("bcrypt"); 

async function seedDatabase() {
    try {
        console.log("🔄 Syncing database...");
        await sequelize.sync({ force: true }); 

        console.log("✅ Database synced successfully!");
        const adminPassword = await bcrypt.hash("admin123", 10);
        const userPassword = await bcrypt.hash("user123", 10);
        console.log("🔹 Seeding Users...");
        const admin = await User.create({
            full_name: "Admin User",
            email: "osamadweikat+admin@proton.me",
            password_hash: adminPassword, 
            role: "admin",
            phone: "+123456789",
            address: "Admin HQ"
        });

        const donor = await User.create({
            full_name: "Donor User",
            email: "osamadweikat+donor@proton.me",
            password_hash: userPassword,
            role: "donor",
            phone: "+987654321",
            address: "Donor City"
        });

        const orphanageManager = await User.create({
            full_name: "Orphanage Manager",
            email: "osamadweikat+manager@proton.me",
            password_hash: userPassword,
            role: "orphanage_manager",
            phone: "+111222333",
            address: "Orphanage Street"
        });

        const volunteer = await User.create({
            full_name: "Volunteer User",
            email: "osamadweikat+volunteer@proton.me",
            password_hash: userPassword,
            role: "volunteer",
            phone: "+555666777",
            address: "Volunteer Town"
        });

        console.log("🔹 Seeding Orphanages...");
        const orphanage = await Orphanage.create({
            name: "Hope Orphanage",
            location: "Gaza City",
            manager_id: orphanageManager.id
        });

        console.log("🔹 Seeding Orphans...");
        const orphan = await Orphan.create({
            name: "Ali Mohammad",
            age: 10,
            gender: "male",
            education_status: "Primary School",
            health_condition: "Good",
            orphanage_id: orphanage.id
        });

        console.log("🔹 Seeding Sponsorships...");
        await Sponsorship.create({
            sponsor_id: donor.id,
            orphan_id: orphan.id,
            amount: 50.00,
            currency: "USD",
            start_date: new Date(),
            end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        });

        console.log("🔹 Seeding Donations...");
        await Donation.create({
            donor_id: donor.id, 
            amount: 50.00,
            currency: "USD",
            category: "education",
            status: "completed",
            transaction_id: `txn_${Date.now()}` 
        });
        

        console.log("🔹 Seeding Volunteers...");
        await Volunteer.create({
            user_id: volunteer.id,
            skills: "Teaching, First Aid",
            availability: "Weekends"
        });

        console.log("Database seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seedDatabase();
