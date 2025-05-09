🧾 Report Module – HopeConnect
This document explains the functionality, design, and implementation details of the dynamic PDF reporting system available to administrators.

🎯 Purpose
The report system was created to give administrators a clear and printable overview of:

Platform-wide metrics (users, donations, orphans, etc.)

Recent activity and data insights

Transparency for donors and partners

Organized summaries for internal records and reviews

📄 What’s Included in the Report?
Header: Admin email + date of generation

Stat Cards: Key metrics (users, orphans, volunteers, total donations, etc.)

Summary Section: Emergency count, read notifications, feedbacks

Filtered Data Tables: Up to 10 records per model (e.g. Orphans, Donations, Volunteers)

Formatted Layout: Bootstrap-based table layout + structured summary boxes

Note: Empty or unused models are excluded from the PDF automatically to avoid showing irrelevant content.

🛠️ How It Works (Behind the Scenes)
Data Gathering:

Aggregated from Sequelize models.

Metrics are calculated using count() and sum() functions.

Records are filtered and formatted (dates, nulls as N/A).

Template Engine:

Uses Handlebars.js to inject data into a pre-designed HTML template.

Bootstrap used for styling cards and tables.

PDF Generation:

The final HTML is passed to Puppeteer.

Puppeteer renders the HTML in a headless Chromium browser and exports it to PDF.

File saved under reports/ with a timestamped filename.

📁 Folder Structure

src/
├── templates/
│   └── admin_report_template.html   ← Handlebars template
├── utils/
│   └── generateHopeConnectHtmlReport.js ← Main logic
reports/
└── hopeconnect_html_report_<timestamp>.pdf ← Output file

🧩 Technologies Used
handlebars: For HTML templating

puppeteer: For generating high-quality PDFs from HTML

bootstrap: For consistent styling

fs, path: File system handling

✨ Features
Dynamic stat cards grid

Auto-skipping empty tables

Date formatting and N/A cleanup

Includes all active models and filters fields per model

Ready for extension (e.g., filter by date range, include charts)

✅ Usage Example
Admin triggers the following API:

GET /api/admin/report
Authorization: Bearer <admin_token>
This will:

Fetch all required data

Render the HTML with values

Export a PDF

Save it in the reports directory

