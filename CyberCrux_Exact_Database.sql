-- =====================================================
-- CyberCrux Exact Database Schema
-- This file contains the EXACT tables that currently exist
-- =====================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS cybercrux;
USE cybercrux;

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    FullName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expires DATETIME,
    reset_token_expiry BIGINT,
    google_id VARCHAR(255) UNIQUE,
    profile_pic LONGTEXT,
    country VARCHAR(100),
    description TEXT,
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255)
);

-- =====================================================
-- BADGES TABLE
-- =====================================================
CREATE TABLE badges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(500),
    badge_type ENUM('streak', 'completion', 'category', 'score', 'special', 'time_based') NOT NULL,
    criteria JSON NOT NULL,
    points_reward INT DEFAULT 0,
    rarity ENUM('common', 'rare', 'epic', 'legendary') DEFAULT 'common',
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- USER BADGES TABLE
-- =====================================================
CREATE TABLE user_badges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress_data JSON,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
);

-- =====================================================
-- PRACTICE SCENARIOS TABLE
-- =====================================================
CREATE TABLE practice_scenarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    time_estimate VARCHAR(50) DEFAULT '15 min',
    questions_count INT DEFAULT 0,
    points INT DEFAULT 100,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    likes INT DEFAULT 0,
    views INT DEFAULT 0,
    description TEXT NOT NULL,
    is_featured TINYINT(1) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    file_url VARCHAR(500),
    short_description VARCHAR(500),
    tags JSON
);

-- =====================================================
-- PRACTICE QUESTIONS TABLE
-- =====================================================
CREATE TABLE practice_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    scenario_id INT NOT NULL,
    question_text TEXT NOT NULL,
    correct_answer VARCHAR(500) NOT NULL,
    points INT DEFAULT 10,
    explanation TEXT,
    question_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scenario_id) REFERENCES practice_scenarios(id) ON DELETE CASCADE
);

-- =====================================================
-- PRACTICE CATEGORIES TABLE
-- =====================================================
CREATE TABLE practice_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    key_name VARCHAR(50) UNIQUE NOT NULL,
    label VARCHAR(100) NOT NULL,
    description TEXT,
    color_gradient VARCHAR(100) DEFAULT 'from-blue-500 to-cyan-500',
    count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- USER PRACTICE PROGRESS TABLE
-- =====================================================
CREATE TABLE user_practice_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    scenario_id INT NOT NULL,
    score INT DEFAULT 0,
    max_score INT DEFAULT 0,
    time_taken INT DEFAULT 0,
    is_completed TINYINT(1) DEFAULT 0,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scenario_id) REFERENCES practice_scenarios(id) ON DELETE CASCADE
);

-- =====================================================
-- USER STREAKS TABLE
-- =====================================================
CREATE TABLE user_streaks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_login_date DATETIME,
    last_practice_date DATETIME,
    streak_start_date DATETIME,
    total_practice_questions INT DEFAULT 0,
    total_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- TOOLS TABLE
-- =====================================================
CREATE TABLE tools (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    type VARCHAR(100),
    author VARCHAR(100),
    rating FLOAT DEFAULT 0,
    downloads INT DEFAULT 0,
    featured TINYINT(1) DEFAULT 0,
    difficulty VARCHAR(50),
    license VARCHAR(100),
    website VARCHAR(255),
    commands JSON,
    platforms JSON,
    tutorials INT DEFAULT 0,
    practiceScenarios INT DEFAULT 0,
    icon VARCHAR(100),
    how_to_use TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TOOL PRACTICE SCENARIOS TABLE
-- =====================================================
CREATE TABLE tool_practice_scenarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tool_name VARCHAR(100) NOT NULL,
    scenario_title VARCHAR(255) NOT NULL,
    scenario_description TEXT NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Easy',
    correct_command VARCHAR(500) NOT NULL,
    command_pieces JSON NOT NULL,
    explanation TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- LEARNING RESOURCES TABLE
-- =====================================================
CREATE TABLE learning_resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    scenario_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    type ENUM('guide', 'course', 'tool', 'reference', 'practice') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scenario_id) REFERENCES practice_scenarios(id) ON DELETE CASCADE
);

-- =====================================================
-- BOOKS TABLE
-- =====================================================
CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    author VARCHAR(255) NOT NULL,
    cover VARCHAR(500),
    pdf VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0.00,
    downloads INT DEFAULT 0,
    read_time VARCHAR(50),
    pages INT,
    published VARCHAR(10),
    featured TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- BLOGS TABLE
-- =====================================================
CREATE TABLE blogs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    author_avatar VARCHAR(500),
    date DATE NOT NULL,
    read_time VARCHAR(20),
    category VARCHAR(100),
    tags TEXT,
    excerpt TEXT,
    content LONGTEXT,
    featured TINYINT(1) DEFAULT 0,
    views INT DEFAULT 0
);

-- =====================================================
-- USER NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE user_notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('badge', 'scenario', 'achievement', 'system') DEFAULT 'badge',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Badge Leaderboard View
CREATE VIEW badge_leaderboard AS
SELECT 
    u.username,
    ubs.total_badges,
    ubs.total_badge_points,
    RANK() OVER (ORDER BY ubs.total_badges DESC, ubs.total_badge_points DESC) AS badge_rank
FROM user_badge_summary ubs
JOIN users u ON ubs.user_id = u.id
WHERE ubs.total_badges > 0
ORDER BY badge_rank;

-- User Badge Summary View
CREATE VIEW user_badge_summary AS
SELECT 
    u.id AS user_id,
    u.username,
    COUNT(ub.badge_id) AS total_badges,
    COUNT(CASE WHEN b.rarity = 'common' THEN 1 END) AS common_badges,
    COUNT(CASE WHEN b.rarity = 'rare' THEN 1 END) AS rare_badges,
    COUNT(CASE WHEN b.rarity = 'epic' THEN 1 END) AS epic_badges,
    COUNT(CASE WHEN b.rarity = 'legendary' THEN 1 END) AS legendary_badges,
    SUM(b.points_reward) AS total_badge_points
FROM users u
LEFT JOIN user_badges ub ON u.id = ub.user_id
LEFT JOIN badges b ON ub.badge_id = b.id
GROUP BY u.id, u.username;

-- User Streak Summary View
CREATE VIEW user_streak_summary AS
SELECT 
    u.id AS user_id,
    u.username,
    u.email,
    us.current_streak,
    us.longest_streak,
    us.total_practice_questions,
    us.total_points,
    us.last_login_date,
    us.last_practice_date,
    us.streak_start_date,
    (TO_DAYS(CURDATE()) - TO_DAYS(CAST(us.last_login_date AS DATE))) AS days_since_last_login,
    (TO_DAYS(CURDATE()) - TO_DAYS(CAST(us.last_practice_date AS DATE))) AS days_since_last_practice
FROM users u
LEFT JOIN user_streaks us ON u.id = us.user_id;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);

-- Badge indexes
CREATE INDEX idx_badges_type ON badges(badge_type);
CREATE INDEX idx_badges_rarity ON badges(rarity);
CREATE INDEX idx_badges_active ON badges(is_active);

-- Practice scenario indexes
CREATE INDEX idx_scenarios_category ON practice_scenarios(category);
CREATE INDEX idx_scenarios_difficulty ON practice_scenarios(difficulty);
CREATE INDEX idx_scenarios_active ON practice_scenarios(is_active);
CREATE INDEX idx_scenarios_featured ON practice_scenarios(is_featured);
CREATE INDEX idx_scenarios_file_url ON practice_scenarios(file_url);
CREATE INDEX idx_scenarios_short_description ON practice_scenarios(short_description);

-- Tool indexes
CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_tools_rating ON tools(rating);
CREATE INDEX idx_tools_featured ON tools(featured);
CREATE INDEX idx_tools_downloads ON tools(downloads);

-- User progress indexes
CREATE INDEX idx_user_progress_user ON user_practice_progress(user_id);
CREATE INDEX idx_user_progress_scenario ON user_practice_progress(scenario_id);
CREATE INDEX idx_user_progress_completed ON user_practice_progress(is_completed);

-- Notification indexes
CREATE INDEX idx_notifications_user ON user_notifications(user_id);
CREATE INDEX idx_notifications_read ON user_notifications(is_read);
CREATE INDEX idx_notifications_created ON user_notifications(created_at);

-- Book indexes
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_rating ON books(rating);
CREATE INDEX idx_books_featured ON books(featured);
CREATE INDEX idx_books_downloads ON books(downloads);

-- =====================================================
-- ACTUAL DATA FROM CURRENT DATABASE
-- =====================================================

-- Insert actual users from the database
INSERT INTO users (id, username, FullName, email, country) VALUES
(18, 'shadowhacker18', 'Hassan Ali', 'hassan@gmail.com', NULL),
(19, 'uzair', 'Uzair Ahmad', 'uzairahm290@gmail.com', NULL);

-- Insert actual practice categories from the database
INSERT INTO practice_categories (id, key_name, label, description, color_gradient, count) VALUES
(1, 'web_security', 'Web Security', 'Web application security challenges', 'from-blue-500 to-cyan-500', 0),
(2, 'network_security', 'Network Security', 'Network penetration testing scenarios', 'from-green-500 to-emerald-500', 0),
(3, 'cryptography', 'Cryptography', 'Encryption and decryption challenges', 'from-yellow-500 to-orange-500', 0),
(4, 'forensics', 'Forensics', 'Digital forensics and investigation', 'from-red-500 to-pink-500', 0),
(5, 'reverse_engineering', 'Reverse Engineering', 'Binary analysis and malware analysis', 'from-purple-500 to-indigo-500', 0),
(6, 'malware_analysis', 'Malware Analysis', 'Malware reverse engineering and analysis', 'from-red-600 to-pink-600', 0),
(7, 'social_engineering', 'Social Engineering', 'Human psychology and manipulation techniques', 'from-orange-500 to-red-500', 0);

-- Insert actual badges from the database (18 badges total)
INSERT INTO badges (id, name, description, icon, badge_type, criteria, points_reward, rarity, is_active) VALUES
(1, 'First Steps', 'Complete your first practice scenario', NULL, 'completion', '{"scenarios_completed": 1}', 10, 'common', 1),
(2, 'Streak Master', 'Maintain a 7-day practice streak', NULL, 'streak', '{"streak_days": 7}', 50, 'rare', 1),
(3, 'Category Explorer', 'Complete scenarios in 5 different categories', NULL, 'category', '{"categories_completed": 5}', 100, 'epic', 1),
(4, 'Tool Master', 'Use 10 different cybersecurity tools', NULL, 'score', '{"tools_used": 10}', 75, 'rare', 1),
(5, 'Speed Demon', 'Lightning fast! Complete any scenario in under 5 minutes', NULL, 'time_based', '{"completion_time": 300}', 100, 'rare', 1),
(6, 'Night Owl', 'Complete scenarios between 10 PM and 6 AM', NULL, 'time_based', '{"night_hours": true}', 25, 'uncommon', 1),
(7, 'Weekend Warrior', 'Complete 5 scenarios in a single weekend', NULL, 'completion', '{"weekend_scenarios": 5}', 150, 'epic', 1),
(8, 'Early Bird', 'Complete scenarios between 6 AM and 10 AM', NULL, 'time_based', '{"morning_hours": true}', 25, 'uncommon', 1),
(9, 'Perfect Score', 'Get 100% on any scenario', NULL, 'score', '{"perfect_score": true}', 200, 'epic', 1),
(10, 'Quick Learner', 'Complete 3 scenarios in one day', NULL, 'completion', '{"daily_scenarios": 3}', 75, 'rare', 1),
(11, 'Persistent', 'Attempt a scenario 5 times before completing it', NULL, 'completion', '{"attempts_before_completion": 5}', 50, 'rare', 1),
(12, 'Explorer', 'Try scenarios from 3 different categories', NULL, 'category', '{"categories_tried": 3}', 60, 'uncommon', 1),
(13, 'Night Shift', 'Complete 3 scenarios after midnight', NULL, 'time_based', '{"midnight_scenarios": 3}', 100, 'rare', 1),
(14, 'Morning Person', 'Complete 3 scenarios before noon', NULL, 'time_based', '{"morning_scenarios": 3}', 100, 'rare', 1),
(15, 'Weekend Master', 'Complete 10 scenarios in a single weekend', NULL, 'completion', '{"weekend_scenarios": 10}', 300, 'legendary', 1),
(16, 'Speed Runner', 'Complete any scenario in under 2 minutes', NULL, 'time_based', '{"completion_time": 120}', 250, 'legendary', 1),
(17, 'Marathon Runner', 'Complete scenarios for 5 consecutive days', NULL, 'streak', '{"consecutive_days": 5}', 125, 'epic', 1),
(18, 'Ultimate Master', 'Complete 50 scenarios total', NULL, 'completion', '{"total_scenarios": 50}', 500, 'legendary', 1);

-- Insert actual tools from the database (10 tools total)
INSERT INTO tools (id, name, description, category, type, author, rating, downloads, featured, difficulty, license, website, icon, how_to_use) VALUES
(1, 'Nmap', 'Network discovery and security auditing tool', 'network_scanning', 'command_line', 'Gordon Lyon', 4.8, 1500, 1, 'intermediate', 'GPL', 'https://nmap.org', 'nmap-icon.png', 'Use for port scanning and network discovery'),
(2, 'Wireshark', 'Network protocol analyzer', 'network_analysis', 'desktop_app', 'Gerald Combs', 4.9, 2000, 1, 'advanced', 'GPL', 'https://wireshark.org', 'wireshark-icon.png', 'Capture and analyze network traffic'),
(3, 'Metasploit', 'Penetration testing framework', 'penetration_testing', 'command_line', 'Rapid7', 4.7, 1800, 1, 'advanced', 'BSD', 'https://metasploit.com', 'metasploit-icon.png', 'Exploit development and testing'),
(4, 'Burp Suite', 'Web application security testing', 'web_security', 'desktop_app', 'PortSwigger', 4.6, 1200, 1, 'intermediate', 'Commercial', 'https://portswigger.net', 'burp-icon.png', 'Web app vulnerability scanning'),
(5, 'John the Ripper', 'Password cracking tool', 'password_cracking', 'command_line', 'Openwall', 4.5, 900, 0, 'intermediate', 'GPL', 'https://openwall.com/john', 'john-icon.png', 'Password hash cracking'),
(6, 'Aircrack-ng', 'Wireless network security tool', 'wireless_security', 'command_line', 'Thomas d\'Otreppe', 4.4, 800, 0, 'advanced', 'GPL', 'https://aircrack-ng.org', 'aircrack-icon.png', 'WiFi security testing'),
(7, 'Hydra', 'Network login cracker', 'password_cracking', 'command_line', 'van Hauser', 4.3, 700, 0, 'intermediate', 'GPL', 'https://github.com/vanhauser-thc/thc-hydra', 'hydra-icon.png', 'Brute force login attacks'),
(8, 'SQLMap', 'SQL injection testing tool', 'web_security', 'command_line', 'Bernardo Damele', 4.6, 1100, 1, 'intermediate', 'GPL', 'https://sqlmap.org', 'sqlmap-icon.png', 'Automated SQL injection testing'),
(9, 'Nikto', 'Web server scanner', 'web_security', 'command_line', 'Chris Sullo', 4.2, 600, 0, 'beginner', 'GPL', 'https://cirt.net/nikto2', 'nikto-icon.png', 'Web server vulnerability scanning'),
(10, 'Hashcat', 'Advanced password recovery', 'password_cracking', 'command_line', 'Atom', 4.7, 1000, 0, 'advanced', 'MIT', 'https://hashcat.net', 'hashcat-icon.png', 'GPU-accelerated password cracking');

-- Insert sample books (common cybersecurity books)
INSERT INTO books (id, title, description, category, author, cover, pdf, rating, downloads, read_time, pages, published, featured) VALUES
(1, 'The Web Application Hacker\'s Handbook', 'Comprehensive guide to web application security testing', 'web_security', 'Dafydd Stuttard', 'web-hackers-handbook.jpg', 'web-hackers-handbook.pdf', 4.8, 500, '8 hours', 800, '2011', 1),
(2, 'Network Security Essentials', 'Fundamentals of network security and protocols', 'network_security', 'William Stallings', 'network-security.jpg', 'network-security.pdf', 4.6, 400, '6 hours', 600, '2017', 1),
(3, 'Practical Cryptography', 'Real-world cryptography implementation', 'cryptography', 'Niels Ferguson', 'practical-crypto.jpg', 'practical-crypto.pdf', 4.7, 350, '7 hours', 700, '2003', 0),
(4, 'Digital Forensics', 'Computer forensics and investigation techniques', 'forensics', 'John Sammons', 'digital-forensics.jpg', 'digital-forensics.pdf', 4.5, 300, '5 hours', 500, '2015', 0),
(5, 'Reverse Engineering', 'Software reverse engineering fundamentals', 'reverse_engineering', 'Eldad Eilam', 'reverse-engineering.jpg', 'reverse-engineering.pdf', 4.4, 250, '9 hours', 900, '2005', 0);

-- Insert sample blogs (cybersecurity topics)
INSERT INTO blogs (id, title, author, author_avatar, date, read_time, category, tags, excerpt, content, featured, views) VALUES
(1, 'Understanding SQL Injection Attacks', 'CyberCrux Team', 'team-avatar.jpg', '2025-01-15', '8 min', 'web_security', 'SQL injection, web security, OWASP', 'Learn how SQL injection attacks work and how to prevent them...', 'SQL injection is one of the most dangerous web vulnerabilities...', 1, 1200),
(2, 'Network Scanning with Nmap', 'Security Expert', 'expert-avatar.jpg', '2025-01-10', '12 min', 'network_security', 'Nmap, network scanning, penetration testing', 'Master the art of network discovery using Nmap...', 'Nmap is the go-to tool for network administrators and security professionals...', 1, 800),
(3, 'Cryptography Basics for Developers', 'Crypto Guru', 'guru-avatar.jpg', '2025-01-05', '15 min', 'cryptography', 'cryptography, encryption, security', 'Essential cryptography concepts every developer should know...', 'Cryptography is the foundation of modern digital security...', 0, 600);

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- Procedure to record practice question completion and update streaks
DELIMITER //
CREATE PROCEDURE RecordPracticeQuestion(
    IN p_user_id INT, 
    IN p_points_earned INT, 
    IN p_scenario_id INT
)
BEGIN
    DECLARE v_scenario_count INT DEFAULT 0;

    -- Check if user has already completed this scenario
    SELECT COUNT(*) INTO v_scenario_count
    FROM user_practice_progress
    WHERE user_id = p_user_id AND scenario_id = p_scenario_id AND is_completed = TRUE;

    -- Only update streaks if this is the first completion
    IF v_scenario_count = 0 THEN
        INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_practice_date, streak_start_date, total_practice_questions, total_points)
        VALUES (p_user_id, 1, 1, NOW(), NOW(), 1, p_points_earned)
        ON DUPLICATE KEY UPDATE
            last_practice_date = NOW(),
            total_practice_questions = total_practice_questions + 1,
            total_points = total_points + p_points_earned,
            updated_at = NOW();
    END IF;
END //
DELIMITER ;

-- Procedure to record user login and manage streaks
DELIMITER //
CREATE PROCEDURE RecordUserLogin(IN p_user_id INT)
BEGIN
    DECLARE v_current_streak INT DEFAULT 0;
    DECLARE v_longest_streak INT DEFAULT 0;
    DECLARE v_last_login_date DATETIME;
    DECLARE v_streak_start_date DATETIME;
    DECLARE v_now DATETIME DEFAULT NOW();
    DECLARE v_today DATE DEFAULT CURDATE();
    DECLARE v_last_login_date_only DATE;
    DECLARE v_days_since_last_login INT DEFAULT 0;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_current_streak = NULL;

    -- Get current streak information
    SELECT current_streak, longest_streak, last_login_date, streak_start_date
    INTO v_current_streak, v_longest_streak, v_last_login_date, v_streak_start_date
    FROM user_streaks
    WHERE user_id = p_user_id;

    -- If no streak record exists, create one
    IF v_current_streak IS NULL THEN
        INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_login_date, streak_start_date)
        VALUES (p_user_id, 1, 1, v_now, v_now);
    ELSE
        -- Calculate days since last login
        SET v_last_login_date_only = DATE(v_last_login_date);
        SET v_days_since_last_login = DATEDIFF(v_today, v_last_login_date_only);

        -- If more than 1 day gap, reset streak
        IF v_days_since_last_login > 1 THEN
            UPDATE user_streaks
            SET
                current_streak = 1,
                last_login_date = v_now,
                streak_start_date = v_now,
                updated_at = NOW()
            WHERE user_id = p_user_id;
        -- If exactly 1 day gap, continue streak
        ELSEIF v_days_since_last_login = 1 THEN
            SET v_current_streak = v_current_streak + 1;
            
            -- Update longest streak if current is longer
            IF v_current_streak > v_longest_streak THEN
                SET v_longest_streak = v_current_streak;
            END IF;

            UPDATE user_streaks
            SET 
                current_streak = v_current_streak,
                longest_streak = v_longest_streak,
                last_login_date = v_now,
                updated_at = NOW()
            WHERE user_id = p_user_id;
        -- If same day, just update login time
        ELSE
            UPDATE user_streaks
            SET 
                last_login_date = v_now,
                updated_at = NOW()
            WHERE user_id = p_user_id;
        END IF;
    END IF;
END //
DELIMITER ;

-- Procedure to reset streaks for inactive users
DELIMITER //
CREATE PROCEDURE ResetInactiveStreaks()
BEGIN
    DECLARE v_today DATE DEFAULT CURDATE();
    DECLARE v_yesterday DATE DEFAULT DATE_SUB(CURDATE(), INTERVAL 1 DAY);

    -- Reset streaks for users who haven't logged in for 2+ days
    UPDATE user_streaks
    SET
        current_streak = 0,
        updated_at = NOW()
    WHERE DATE(last_login_date) < v_yesterday
    AND current_streak > 0;

    -- Return count of streaks reset
    SELECT ROW_COUNT() AS streaks_reset;
END //
DELIMITER ;

-- =====================================================
-- COMMENTS
-- =====================================================

/*
This database schema represents the EXACT current implementation of CyberCrux.
It includes only the tables and features that actually exist and are being used.

Key Features:
1. User management with Google OAuth and password reset
2. Practice scenarios with questions and categories
3. Badge system with progress tracking
4. Tool library with practice scenarios
5. Learning resources linked to scenarios
6. User progress tracking and streaks
7. Blog system with author avatars
8. Book library with ratings and downloads
9. Notification system for achievements
10. Comprehensive views for leaderboards and statistics
11. Stored procedures for streak management and user activity tracking

All tables are designed to work together with proper foreign key relationships.
The structure matches exactly what is currently implemented in the application.

Stored Procedures:
- RecordPracticeQuestion: Updates streaks when users complete practice questions
- RecordUserLogin: Manages daily login streaks and streak calculations
- ResetInactiveStreaks: Automatically resets streaks for inactive users
*/
