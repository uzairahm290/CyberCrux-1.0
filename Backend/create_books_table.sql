-- Create books table with enhanced structure
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  author VARCHAR(255) NOT NULL,
  cover VARCHAR(500),
  pdf VARCHAR(500),
  rating DECIMAL(3,2) DEFAULT 0.0,
  downloads INT DEFAULT 0,
  read_time VARCHAR(50),
  pages INT,
  published VARCHAR(10),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO books (title, description, category, author, cover, pdf, rating, downloads, read_time, pages, published, featured) VALUES
('Cybersecurity Essentials', 'A comprehensive guide for beginners in cybersecurity covering fundamental concepts, threats, and defense strategies.', 'beginner', 'Sarah Chen', 'https://i.postimg.cc/wMTyrVT0/48992298.jpg', '#', 4.8, 1247, '6-8 hours', 320, '2024', TRUE),
('Advanced Penetration Testing', 'Deep dive into advanced pentesting techniques, methodologies, and real-world scenarios for experienced security professionals.', 'advanced', 'Mike Rodriguez', 'https://img.icons8.com/ios-filled/100/000000/book.png', '#', 4.9, 892, '10-12 hours', 450, '2024', TRUE),
('Digital Forensics Handbook', 'Learn the basics of digital forensics, evidence collection, and analysis techniques for cyber investigations.', 'forensics', 'Dr. Emily Watson', 'https://img.icons8.com/ios-filled/100/000000/book.png', '#', 4.7, 567, '8-10 hours', 380, '2023', FALSE),
('Hacking Tools Explained', 'Comprehensive overview of popular cybersecurity tools, their usage, and best practices for ethical hacking.', 'tools', 'Alex Thompson', 'https://img.icons8.com/ios-filled/100/000000/book.png', '#', 4.6, 734, '5-7 hours', 280, '2024', FALSE),
('Network Security Fundamentals', 'Essential concepts and practices for securing network infrastructure and protecting against cyber threats.', 'intermediate', 'David Kim', 'https://img.icons8.com/ios-filled/100/000000/book.png', '#', 4.5, 445, '7-9 hours', 350, '2023', FALSE),
('Web Application Security', 'Comprehensive guide to securing web applications, covering OWASP Top 10 and modern security practices.', 'intermediate', 'Lisa Wang', 'https://img.icons8.com/ios-filled/100/000000/book.png', '#', 4.7, 623, '8-10 hours', 400, '2024', FALSE),
('Malware Analysis Techniques', 'Advanced techniques for analyzing malware, reverse engineering, and threat intelligence gathering.', 'advanced', 'Dr. James Wilson', 'https://img.icons8.com/ios-filled/100/000000/book.png', '#', 4.8, 456, '12-15 hours', 520, '2023', FALSE),
('Cloud Security Best Practices', 'Complete guide to securing cloud environments including AWS, Azure, and GCP security implementations.', 'intermediate', 'Maria Garcia', 'https://img.icons8.com/ios-filled/100/000000/book.png', '#', 4.6, 789, '9-11 hours', 380, '2024', FALSE),
('Incident Response Guide', 'Step-by-step guide to handling cybersecurity incidents, from detection to recovery and lessons learned.', 'intermediate', 'Robert Johnson', 'https://img.icons8.com/ios-filled/100/000000/book.png', '#', 4.5, 567, '7-9 hours', 320, '2023', FALSE),
('Cryptography Fundamentals', 'Introduction to cryptographic principles, algorithms, and their applications in cybersecurity.', 'beginner', 'Dr. Amanda Lee', 'https://img.icons8.com/ios-filled/100/000000/book.png', '#', 4.4, 345, '6-8 hours', 280, '2024', FALSE),
('IoT Security Handbook', 'Security considerations and best practices for Internet of Things devices and networks.', 'intermediate', 'Kevin Chen', 'https://img.icons8.com/ios-filled/100/000000/book.png', '#', 4.3, 234, '5-7 hours', 250, '2023', FALSE),
('Mobile Security Essentials', 'Comprehensive guide to mobile application security, covering Android and iOS security practices.', 'intermediate', 'Jennifer Smith', 'https://img.icons8.com/ios-filled/100/000000/book.png', '#', 4.6, 456, '8-10 hours', 340, '2024', FALSE);

-- Create index for better performance
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_featured ON books(featured);
CREATE INDEX idx_books_rating ON books(rating);
CREATE INDEX idx_books_downloads ON books(downloads); 