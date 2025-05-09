📘 Project Overview – HopeConnect

HopeConnect is a humanitarian backend API developed to support orphaned children in Gaza after war. The platform bridges the gap between donors, volunteers, organizations, and orphanages by providing transparent, structured, and secure interactions.

🌍 Motivation

The idea for HopeConnect emerged in response to the devastating impact of war on children in Gaza. We aimed to build a digital system that enables real-time donation tracking, orphan sponsorship, volunteer coordination, and emergency response – all while ensuring transparency and data security.

🎯 Core Objectives

Simplify and secure sponsorship for orphaned children.

Enable trusted donations with real-time tracking.

Match volunteers with relevant opportunities posted by orphanages.

Deliver automated PDF reports for system transparency.

Provide a scalable API for potential future integrations.

🏗️ Design Principles

Transparency: Every transaction and sponsorship is tracked.

Modularity: Models are separated cleanly (donations, orphans, emergencies...)

Role-based Access: Different user roles see only what they're authorized to access.

Extensibility: Built to scale with minimal restructuring (add new modules easily).

🧩 Technologies Used

Component

Tech

Backend Framework

Node.js (Express.js)

Database

MySQL (Sequelize ORM)

Authentication

JWT + role-based guards

Reporting

Handlebars + Puppeteer (PDF export)

Email Alerts

Brevo (previously Sendinblue)

Smart Chatbot

Google Gemini for AI assistant logic

🌐 External Tools & APIs

Brevo (Sendinblue) – Used for sending real-time transactional emails (e.g., emergency alerts, sponsorship updates).

Proton Mail Aliasing – Used to simulate multiple email identities from one inbox (e.g., +admin, +volunteer versions).

Gemini AI – Used to power chatbot responses and interaction templates.

ReliefWeb API – Real-time crisis and humanitarian data.

📝 Summary

HopeConnect provides the backend foundation for a humanitarian digital platform. Its main strengths lie in its transparency, modularity, and readiness to expand — making it a powerful and responsible tool for post-conflict recovery support.