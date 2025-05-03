const { sequelize } = require("../config/db");
const User = require("../models/User");
const Orphanage = require("../models/Orphanage");
const Orphan = require("../models/Orphan");
const Sponsorship = require("../models/Sponsorship");
const Donation = require("../models/Donation");
const Volunteer = require("../models/Volunteer");
const Emergency = require("../models/Emergency");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const bcrypt = require("bcrypt");

async function seedDatabase() {
    try {
        console.log("Syncing database...");
        await sequelize.sync({ force: true });
        console.log("Database synced successfully!");

        const adminPassword = await bcrypt.hash("admin123", 10);
        const userPassword = await bcrypt.hash("user123", 10);

        console.log("Seeding Users...");
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

        const donor2 = await User.create({
            full_name: "Second Donor",
            email: "osamadweikat+donor2@proton.me",
            password_hash: userPassword,
            role: "donor",
            phone: "+222333444",
            address: "West Bank"
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

        const unapprovedUser1 = await User.create({
            full_name: "Aya Naser",
            email: "osamadweikat+aya@proton.me",
            password_hash: userPassword,
            role: "donor",
            phone: "+111000222",
            address: "Ramallah"
        });

        const unapprovedUser2 = await User.create({
            full_name: "Yazan Kamal",
            email: "osamadweikat+yazan@proton.me",
            password_hash: userPassword,
            role: "volunteer",
            phone: "+333444555",
            address: "Nablus"
        });

        console.log("Seeding Subscription Plans...");
        await SubscriptionPlan.bulkCreate([
            {
                name: "Basic Monthly",
                price: 10.0,
                renewal_period: "monthly",
                description: "Access to basic donation tracking and updates."
            },
            {
                name: "Premium Quarterly",
                price: 25.0,
                renewal_period: "quarterly",
                description: "Quarterly reports, updates, and email summaries."
            },
            {
                name: "Ultimate Yearly",
                price: 90.0,
                renewal_period: "yearly",
                description: "Full platform access with yearly impact reports."
            }
        ]);

        console.log("Seeding Orphanages...");
        const orphanage1 = await Orphanage.create({
            name: "Hope Orphanage",
            location: "Gaza City",
            manager_id: orphanageManager.id
        });

        const orphanage2 = await Orphanage.create({
            name: "Peace Shelter",
            location: "Khan Younis",
            manager_id: orphanageManager.id
        });

        const orphanage3 = await Orphanage.create({
            name: "دار الرعاية",
            location: "رفح",
            manager_id: orphanageManager.id,
            verified: false
        });

        console.log("Seeding Orphans...");
        const orphan1 = await Orphan.create({
            name: "Ali Mohammad",
            age: 10,
            gender: "male",
            education_status: "Primary School",
            health_condition: "Good",
            orphanage_id: orphanage1.id
        });

        const orphan2 = await Orphan.create({
            name: "Sara Ahmed",
            age: 12,
            gender: "female",
            education_status: "Middle School",
            health_condition: "Excellent",
            orphanage_id: orphanage1.id
        });

        const orphan3 = await Orphan.create({
            name: "Yousef Hani",
            age: 8,
            gender: "male",
            education_status: "Kindergarten",
            health_condition: "Weak Vision",
            orphanage_id: orphanage2.id
        });

        console.log("Seeding Subscription Plans...");
        await SubscriptionPlan.bulkCreate([
            {
                name: "Basic Monthly",
                amount: 10.00,
                renewal_period: "monthly",
                description: "Access to basic donation tracking and updates."
            },
            {
                name: "Premium Quarterly",
                amount: 25.00,
                renewal_period: "quarterly",
                description: "Quarterly reports, updates, and email summaries."
            },
            {
                name: "Ultimate Yearly",
                amount: 90.00,
                renewal_period: "yearly",
                description: "Full platform access with yearly impact reports."
            }
        ]);
        


        console.log("Seeding Donations...");
        await Donation.create({
            donor_id: donor.id,
            amount: 50.00,
            currency: "USD",
            category: "education",
            status: "pending",
            transaction_id: `txn_${Date.now()}`
        });

        await Donation.create({
            donor_id: donor2.id,
            amount: 30.00,
            currency: "USD",
            category: "medical",
            status: "pending",
            transaction_id: `txn_${Date.now() + 1}`
        });

        console.log("Seeding Volunteers...");
        await Volunteer.create({
            user_id: volunteer.id,
            skills: "Teaching, First Aid",
            availability: "Weekends"
        });

        console.log("Seeding Emergencies...");
        if (Emergency) {
            await Emergency.create({
                title: "Medical Emergency for Ali",
                description: "High fever and needs immediate attention.",
                status: "active",
                orphan_id: orphan1.id,
                created_by: admin.id,
                target_amount: 200.0
            });

            await Emergency.create({
                title: "Food Supplies Shortage",
                description: "Shelter is low on essential food supplies.",
                status: "completed",
                orphanage_id: orphanage2.id,
                created_by: orphanageManager.id,
                target_amount: 500.0
            });
        }

        console.log("Database seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seedDatabase();