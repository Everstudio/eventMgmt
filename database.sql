--mysql query


-- events table
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `location` varchar(255) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `is_recurring` tinyint(1) DEFAULT '0',
  `recurrence_pattern` enum('daily','weekly','monthly') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- event_categories table
CREATE TABLE event_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT
);


-- event_category_map table
CREATE TABLE event_category_map (
    event_id INT,
    category_id INT,
    PRIMARY KEY (event_id, category_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE, -- If an event is deleted, delete all its mappings
    FOREIGN KEY (category_id) REFERENCES event_categories(id) ON DELETE CASCADE -- If a category is deleted, delete all its mappings
);

-- event_schedules table
CREATE TABLE event_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    agenda TEXT, -- A brief description of the session or agenda
    info TEXT, -- Additional information about the schedule
    host_id INT, -- Foreign key to the hosts table
    order INT, -- Order of the schedule in the event
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE, -- If an event is deleted, delete all its schedules
    FOREIGN KEY (host_id) REFERENCES hosts(id) ON DELETE SET NULL -- If a host is deleted, set to NULL
);

--event_hosts table
CREATE TABLE hosts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    organization VARCHAR(255),
    bio TEXT
);

-- event_tags table
CREATE TABLE event_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tag VARCHAR(50) NOT NULL UNIQUE
);

-- event_tag_map table
CREATE TABLE event_tag_map (
    event_id INT,
    tag_id INT,
    PRIMARY KEY (event_id, tag_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES event_tags(id) ON DELETE CASCADE
);





-- event_reminders table
CREATE TABLE event_reminders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT,
    reminder_time DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- registrations table
CREATE TABLE registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT,
    user_id INT, -- user making the purchase, if applicable
    qr_code VARCHAR(255), -- QR code for the entire registration (order-based) e.g., registration:1234
    sub_total DECIMAL(10, 2), -- sub-total amount for the registration
    discount DECIMAL(10, 2), -- discount applied to the registration
    tax DECIMAL(10, 2), -- tax applied to the registration
    total_amount DECIMAL(10, 2), -- total amount paid for the registration
    status ENUM('pending', 'confirmed', 'canceled', 'refunded') DEFAULT 'pending',
    items TEXT, -- JSON array of items in the registration, e.g., [{ticket_id: 1, name: 'General Admission', quantity: 2, price: 20.00}]
    info TEXT, -- additional information for the registration, like special requests / free gifts etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- tickets table
CREATE TABLE tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT,
    name VARCHAR(50), -- General, VIP, Student
    price DECIMAL(10, 2),
    quantity INT, -- default quantity of the ticket (orginal stock)
    stock INT, -- total stock of the ticket
    attendee_limit INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- attendees table
CREATE TABLE attendees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registration_id INT,
    ticket_id INT, -- specific ticket linked to this attendee
    tikent_info TEXT, -- JSON object with ticket information, e.g., {ticket_id: 1, name: 'General Admission', price: 20.00}, to capture ticket details at the time of registration
    name VARCHAR(100), -- name of the attendee
    email VARCHAR(100), -- email for attendee if applicable
    phone VARCHAR(15), -- phone number for attendee if applicable
    qr_code VARCHAR(255), -- unique QR code for individual check-in, e.g., attendee:5678:1234:9999 (attendee_id:registration_id:ticket_id)  
    checked_in BOOLEAN DEFAULT FALSE,
    unique_code VARCHAR(45), -- unique code for eticket verification
    status -- pending, confirmed or failed. based on registration status.
    FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- event_notifications table
CREATE TABLE event_notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT,
    message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);


-- event_analytics table
CREATE TABLE event_analytics (
    event_id INT PRIMARY KEY,
    registration_count INT DEFAULT 0,
    revenue DECIMAL(10, 2) DEFAULT 0.0,
    attendance_count INT DEFAULT 0,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- event_venues table
CREATE TABLE event_venues (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT,
    venue_name VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);



-- event_feedback table
CREATE TABLE event_feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT,
    user_id INT,
    feedback TEXT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);


-- event_certificates table
CREATE TABLE event_certificates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT,
    attendee_id INT,
    certificate_url VARCHAR(255),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (attendee_id) REFERENCES attendees(id) ON DELETE CASCADE
);


-- redis config
--127.0.0.1:6379