-- Insert actual users from the database
INSERT INTO users (id, username, "FullName", email, password_hash) VALUES
(18, 'shadowhacker18', 'Hassan Ali', 'hassan@gmail.com', '$2a$10$X7hN3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3'),
(19, 'uzair', 'Uzair Ahmad', 'uzairahm290@gmail.com', '$2a$10$X7hN3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3')
ON CONFLICT DO NOTHING;

-- Insert actual practice categories from the database
INSERT INTO practice_categories (id, key_name, label, description, color_gradient, count) VALUES
(1, 'web_security', 'Web Security', 'Web application security challenges', 'from-blue-500 to-cyan-500', 0),
(2, 'network_security', 'Network Security', 'Network penetration testing scenarios', 'from-green-500 to-emerald-500', 0),
(3, 'cryptography', 'Cryptography', 'Encryption and decryption challenges', 'from-yellow-500 to-orange-500', 0),
(4, 'forensics', 'Forensics', 'Digital forensics and investigation', 'from-red-500 to-pink-500', 0),
(5, 'reverse_engineering', 'Reverse Engineering', 'Binary analysis and malware analysis', 'from-purple-500 to-indigo-500', 0),
(6, 'malware_analysis', 'Malware Analysis', 'Malware reverse engineering and analysis', 'from-red-600 to-pink-600', 0),
(7, 'social_engineering', 'Social Engineering', 'Human psychology and manipulation techniques', 'from-orange-500 to-red-500', 0)
ON CONFLICT DO NOTHING;

-- Insert actual tools from the database (10 tools total)
INSERT INTO tools (id, name, description, category, type, author, rating, downloads, featured, difficulty, license, website, icon, how_to_use) VALUES
(1, 'Nmap', 'Network discovery and security auditing tool', 'network_scanning', 'command_line', 'Gordon Lyon', 4.8, 1500, true, 'intermediate', 'GPL', 'https://nmap.org', 'nmap-icon.png', 'Use for port scanning and network discovery'),
(2, 'Wireshark', 'Network protocol analyzer', 'network_analysis', 'desktop_app', 'Gerald Combs', 4.9, 2000, true, 'advanced', 'GPL', 'https://wireshark.org', 'wireshark-icon.png', 'Capture and analyze network traffic'),
(3, 'Metasploit', 'Penetration testing framework', 'penetration_testing', 'command_line', 'Rapid7', 4.7, 1800, true, 'advanced', 'BSD', 'https://metasploit.com', 'metasploit-icon.png', 'Exploit development and testing'),
(4, 'Burp Suite', 'Web application security testing', 'web_security', 'desktop_app', 'PortSwigger', 4.6, 1200, true, 'intermediate', 'Commercial', 'https://portswigger.net', 'burp-icon.png', 'Web app vulnerability scanning'),
(5, 'John the Ripper', 'Password cracking tool', 'password_cracking', 'command_line', 'Openwall', 4.5, 900, false, 'intermediate', 'GPL', 'https://openwall.com/john', 'john-icon.png', 'Password hash cracking'),
(6, 'Aircrack-ng', 'Wireless network security tool', 'wireless_security', 'command_line', 'Thomas d''Otreppe', 4.4, 800, false, 'advanced', 'GPL', 'https://aircrack-ng.org', 'aircrack-icon.png', 'WiFi security testing'),
(7, 'Hydra', 'Network login cracker', 'password_cracking', 'command_line', 'van Hauser', 4.3, 700, false, 'intermediate', 'GPL', 'https://github.com/vanhauser-thc/thc-hydra', 'hydra-icon.png', 'Brute force login attacks'),
(8, 'SQLMap', 'SQL injection testing tool', 'web_security', 'command_line', 'Bernardo Damele', 4.6, 1100, true, 'intermediate', 'GPL', 'https://sqlmap.org', 'sqlmap-icon.png', 'Automated SQL injection testing'),
(9, 'Nikto', 'Web server scanner', 'web_security', 'command_line', 'Chris Sullo', 4.2, 600, false, 'beginner', 'GPL', 'https://cirt.net/nikto2', 'nikto-icon.png', 'Web server vulnerability scanning'),
(10, 'Hashcat', 'Advanced password recovery', 'password_cracking', 'command_line', 'Atom', 4.7, 1000, false, 'advanced', 'MIT', 'https://hashcat.net', 'hashcat-icon.png', 'GPU-accelerated password cracking')
ON CONFLICT DO NOTHING;

-- Insert sample blogs (cybersecurity topics)
INSERT INTO blogs (id, title, author, author_avatar, date, read_time, category, tags, excerpt, content, featured, views) VALUES
(1, 'Understanding SQL Injection Attacks', 'CyberCrux Team', 'team-avatar.jpg', '2025-01-15', '8 min', 'web_security', 'SQL injection, web security, OWASP', 'Learn how SQL injection attacks work and how to prevent them...', 'SQL injection is one of the most dangerous web vulnerabilities...', true, 1200),
(2, 'Network Scanning with Nmap', 'Security Expert', 'expert-avatar.jpg', '2025-01-10', '12 min', 'network_security', 'Nmap, network scanning, penetration testing', 'Master the art of network discovery using Nmap...', 'Nmap is the go-to tool for network administrators and security professionals...', true, 800),
(3, 'Cryptography Basics for Developers', 'Crypto Guru', 'guru-avatar.jpg', '2025-01-05', '15 min', 'cryptography', 'cryptography, encryption, security', 'Essential cryptography concepts every developer should know...', 'Cryptography is the foundation of modern digital security...', false, 600)
ON CONFLICT DO NOTHING;
