CREATE DATABASE HopeConnect;
USE HopeConnect;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('donor', 'volunteer', 'admin', 'orphanage_manager') NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Orphanages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES Users(id) ON DELETE SET NULL
);

CREATE TABLE Orphans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    education_status TEXT,
    health_condition TEXT,
    orphanage_id INT,
    FOREIGN KEY (orphanage_id) REFERENCES Orphanages(id) ON DELETE SET NULL
);

CREATE TABLE OrphanProgressUpdates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orphan_id INT,
    update_type ENUM('photo', 'progress_report', 'medical_report') NOT NULL,
    content TEXT NOT NULL,
    update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orphan_id) REFERENCES Orphans(id) ON DELETE CASCADE
);

CREATE TABLE Sponsorships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sponsor_id INT,
    orphan_id INT,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sponsor_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (orphan_id) REFERENCES Orphans(id) ON DELETE CASCADE
);

CREATE TABLE Donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT,
    amount DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',
    category ENUM('general', 'education', 'medical', 'food', 'clothing') NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES Users(id) ON DELETE SET NULL
);

CREATE TABLE DonationTracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donation_id INT,
    details TEXT NOT NULL,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES Donations(id) ON DELETE CASCADE
);

CREATE TABLE Volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    skills TEXT NOT NULL,
    availability TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE VolunteerRequests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orphanage_id INT,
    description TEXT NOT NULL,
    status ENUM('open', 'matched', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orphanage_id) REFERENCES Orphanages(id) ON DELETE CASCADE
);

CREATE TABLE EmergencySupport (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT NOT NULL,
    target_amount DECIMAL(10,2) NOT NULL,
    collected_amount DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'USD',
    status ENUM('active', 'closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Logistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donation_id INT,
    status ENUM('pending', 'in_transit', 'delivered') DEFAULT 'pending',
    delivery_date DATE,
    FOREIGN KEY (donation_id) REFERENCES Donations(id) ON DELETE CASCADE
);

CREATE TABLE Roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT,
    donation_id INT,
    amount DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (donation_id) REFERENCES Donations(id) ON DELETE CASCADE
);
