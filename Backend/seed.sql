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

-- STORED PROCEDURES (Needs manual translation to PL/pgSQL)

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
