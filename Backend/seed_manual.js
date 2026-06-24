const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { id: 18, username: 'shadowhacker18', FullName: 'Hassan Ali', email: 'hassan@gmail.com', password_hash: '$2a$10$X7hN3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3' },
      { id: 19, username: 'uzair', FullName: 'Uzair Ahmad', email: 'uzairahm290@gmail.com', password_hash: '$2a$10$X7hN3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3ZcZ3' }
    ],
    skipDuplicates: true
  });

  await prisma.practiceCategory.createMany({
    data: [
      { id: 1, key_name: 'web_security', label: 'Web Security', description: 'Web application security challenges', color_gradient: 'from-blue-500 to-cyan-500', count: 0 },
      { id: 2, key_name: 'network_security', label: 'Network Security', description: 'Network penetration testing scenarios', color_gradient: 'from-green-500 to-emerald-500', count: 0 },
      { id: 3, key_name: 'cryptography', label: 'Cryptography', description: 'Encryption and decryption challenges', color_gradient: 'from-yellow-500 to-orange-500', count: 0 },
      { id: 4, key_name: 'forensics', label: 'Forensics', description: 'Digital forensics and investigation', color_gradient: 'from-red-500 to-pink-500', count: 0 },
      { id: 5, key_name: 'reverse_engineering', label: 'Reverse Engineering', description: 'Binary analysis and malware analysis', color_gradient: 'from-purple-500 to-indigo-500', count: 0 },
      { id: 6, key_name: 'malware_analysis', label: 'Malware Analysis', description: 'Malware reverse engineering and analysis', color_gradient: 'from-red-600 to-pink-600', count: 0 },
      { id: 7, key_name: 'social_engineering', label: 'Social Engineering', description: 'Human psychology and manipulation techniques', color_gradient: 'from-orange-500 to-red-500', count: 0 }
    ],
    skipDuplicates: true
  });

  await prisma.badge.createMany({
    data: [
      { id: 1, name: 'First Steps', description: 'Complete your first practice scenario', badge_type: 'completion', criteria: {scenarios_completed: 1}, points_reward: 10, rarity: 'common', is_active: true },
      { id: 2, name: 'Streak Master', description: 'Maintain a 7-day practice streak', badge_type: 'streak', criteria: {streak_days: 7}, points_reward: 50, rarity: 'rare', is_active: true },
      { id: 3, name: 'Category Explorer', description: 'Complete scenarios in 5 different categories', badge_type: 'category', criteria: {categories_completed: 5}, points_reward: 100, rarity: 'epic', is_active: true },
      { id: 4, name: 'Tool Master', description: 'Use 10 different cybersecurity tools', badge_type: 'score', criteria: {tools_used: 10}, points_reward: 75, rarity: 'rare', is_active: true },
      { id: 5, name: 'Speed Demon', description: 'Lightning fast! Complete any scenario in under 5 minutes', badge_type: 'time_based', criteria: {completion_time: 300}, points_reward: 100, rarity: 'rare', is_active: true },
      { id: 6, name: 'Night Owl', description: 'Complete scenarios between 10 PM and 6 AM', badge_type: 'time_based', criteria: {night_hours: true}, points_reward: 25, rarity: 'uncommon', is_active: true },
      { id: 7, name: 'Weekend Warrior', description: 'Complete 5 scenarios in a single weekend', badge_type: 'completion', criteria: {weekend_scenarios: 5}, points_reward: 150, rarity: 'epic', is_active: true },
      { id: 8, name: 'Early Bird', description: 'Complete scenarios between 6 AM and 10 AM', badge_type: 'time_based', criteria: {morning_hours: true}, points_reward: 25, rarity: 'uncommon', is_active: true },
      { id: 9, name: 'Perfect Score', description: 'Get 100% on any scenario', badge_type: 'score', criteria: {perfect_score: true}, points_reward: 200, rarity: 'epic', is_active: true },
      { id: 10, name: 'Quick Learner', description: 'Complete 3 scenarios in one day', badge_type: 'completion', criteria: {daily_scenarios: 3}, points_reward: 75, rarity: 'rare', is_active: true },
      { id: 11, name: 'Persistent', description: 'Attempt a scenario 5 times before completing it', badge_type: 'completion', criteria: {attempts_before_completion: 5}, points_reward: 50, rarity: 'rare', is_active: true },
      { id: 12, name: 'Explorer', description: 'Try scenarios from 3 different categories', badge_type: 'category', criteria: {categories_tried: 3}, points_reward: 60, rarity: 'uncommon', is_active: true },
      { id: 13, name: 'Night Shift', description: 'Complete 3 scenarios after midnight', badge_type: 'time_based', criteria: {midnight_scenarios: 3}, points_reward: 100, rarity: 'rare', is_active: true },
      { id: 14, name: 'Morning Person', description: 'Complete 3 scenarios before noon', badge_type: 'time_based', criteria: {morning_scenarios: 3}, points_reward: 100, rarity: 'rare', is_active: true },
      { id: 15, name: 'Weekend Master', description: 'Complete 10 scenarios in a single weekend', badge_type: 'completion', criteria: {weekend_scenarios: 10}, points_reward: 300, rarity: 'legendary', is_active: true },
      { id: 16, name: 'Speed Runner', description: 'Complete any scenario in under 2 minutes', badge_type: 'time_based', criteria: {completion_time: 120}, points_reward: 250, rarity: 'legendary', is_active: true },
      { id: 17, name: 'Marathon Runner', description: 'Complete scenarios for 5 consecutive days', badge_type: 'streak', criteria: {consecutive_days: 5}, points_reward: 125, rarity: 'epic', is_active: true },
      { id: 18, name: 'Ultimate Master', description: 'Complete 50 scenarios total', badge_type: 'completion', criteria: {total_scenarios: 50}, points_reward: 500, rarity: 'legendary', is_active: true }
    ],
    skipDuplicates: true
  });

  await prisma.tool.createMany({
    data: [
      { id: 1, name: 'Nmap', description: 'Network discovery and security auditing tool', category: 'network_scanning', type: 'command_line', author: 'Gordon Lyon', rating: 4.8, downloads: 1500, featured: true, difficulty: 'intermediate', license: 'GPL', website: 'https://nmap.org', icon: 'nmap-icon.png', how_to_use: 'Use for port scanning and network discovery' },
      { id: 2, name: 'Wireshark', description: 'Network protocol analyzer', category: 'network_analysis', type: 'desktop_app', author: 'Gerald Combs', rating: 4.9, downloads: 2000, featured: true, difficulty: 'advanced', license: 'GPL', website: 'https://wireshark.org', icon: 'wireshark-icon.png', how_to_use: 'Capture and analyze network traffic' },
      { id: 3, name: 'Metasploit', description: 'Penetration testing framework', category: 'penetration_testing', type: 'command_line', author: 'Rapid7', rating: 4.7, downloads: 1800, featured: true, difficulty: 'advanced', license: 'BSD', website: 'https://metasploit.com', icon: 'metasploit-icon.png', how_to_use: 'Exploit development and testing' },
      { id: 4, name: 'Burp Suite', description: 'Web application security testing', category: 'web_security', type: 'desktop_app', author: 'PortSwigger', rating: 4.6, downloads: 1200, featured: true, difficulty: 'intermediate', license: 'Commercial', website: 'https://portswigger.net', icon: 'burp-icon.png', how_to_use: 'Web app vulnerability scanning' },
      { id: 5, name: 'John the Ripper', description: 'Password cracking tool', category: 'password_cracking', type: 'command_line', author: 'Openwall', rating: 4.5, downloads: 900, featured: false, difficulty: 'intermediate', license: 'GPL', website: 'https://openwall.com/john', icon: 'john-icon.png', how_to_use: 'Password hash cracking' },
      { id: 6, name: 'Aircrack-ng', description: 'Wireless network security tool', category: 'wireless_security', type: 'command_line', author: "Thomas d'Otreppe", rating: 4.4, downloads: 800, featured: false, difficulty: 'advanced', license: 'GPL', website: 'https://aircrack-ng.org', icon: 'aircrack-icon.png', how_to_use: 'WiFi security testing' },
      { id: 7, name: 'Hydra', description: 'Network login cracker', category: 'password_cracking', type: 'command_line', author: 'van Hauser', rating: 4.3, downloads: 700, featured: false, difficulty: 'intermediate', license: 'GPL', website: 'https://github.com/vanhauser-thc/thc-hydra', icon: 'hydra-icon.png', how_to_use: 'Brute force login attacks' },
      { id: 8, name: 'SQLMap', description: 'SQL injection testing tool', category: 'web_security', type: 'command_line', author: 'Bernardo Damele', rating: 4.6, downloads: 1100, featured: true, difficulty: 'intermediate', license: 'GPL', website: 'https://sqlmap.org', icon: 'sqlmap-icon.png', how_to_use: 'Automated SQL injection testing' },
      { id: 9, name: 'Nikto', description: 'Web server scanner', category: 'web_security', type: 'command_line', author: 'Chris Sullo', rating: 4.2, downloads: 600, featured: false, difficulty: 'beginner', license: 'GPL', website: 'https://cirt.net/nikto2', icon: 'nikto-icon.png', how_to_use: 'Web server vulnerability scanning' },
      { id: 10, name: 'Hashcat', description: 'Advanced password recovery', category: 'password_cracking', type: 'command_line', author: 'Atom', rating: 4.7, downloads: 1000, featured: false, difficulty: 'advanced', license: 'MIT', website: 'https://hashcat.net', icon: 'hashcat-icon.png', how_to_use: 'GPU-accelerated password cracking' }
    ],
    skipDuplicates: true
  });

  await prisma.book.createMany({
    data: [
      { id: 1, title: "The Web Application Hacker's Handbook", description: 'Comprehensive guide to web application security testing', category: 'web_security', author: 'Dafydd Stuttard', cover: 'web-hackers-handbook.jpg', pdf: 'web-hackers-handbook.pdf', rating: 4.8, downloads: 500, read_time: '8 hours', pages: 800, published: '2011', featured: true },
      { id: 2, title: 'Network Security Essentials', description: 'Fundamentals of network security and protocols', category: 'network_security', author: 'William Stallings', cover: 'network-security.jpg', pdf: 'network-security.pdf', rating: 4.6, downloads: 400, read_time: '6 hours', pages: 600, published: '2017', featured: true },
      { id: 3, title: 'Practical Cryptography', description: 'Real-world cryptography implementation', category: 'cryptography', author: 'Niels Ferguson', cover: 'practical-crypto.jpg', pdf: 'practical-crypto.pdf', rating: 4.7, downloads: 350, read_time: '7 hours', pages: 700, published: '2003', featured: false },
      { id: 4, title: 'Digital Forensics', description: 'Computer forensics and investigation techniques', category: 'forensics', author: 'John Sammons', cover: 'digital-forensics.jpg', pdf: 'digital-forensics.pdf', rating: 4.5, downloads: 300, read_time: '5 hours', pages: 500, published: '2015', featured: false },
      { id: 5, title: 'Reverse Engineering', description: 'Software reverse engineering fundamentals', category: 'reverse_engineering', author: 'Eldad Eilam', cover: 'reverse-engineering.jpg', pdf: 'reverse-engineering.pdf', rating: 4.4, downloads: 250, read_time: '9 hours', pages: 900, published: '2005', featured: false }
    ],
    skipDuplicates: true
  });

  await prisma.blog.createMany({
    data: [
      { id: 1, title: 'Understanding SQL Injection Attacks', author: 'CyberCrux Team', author_avatar: 'team-avatar.jpg', date: new Date('2025-01-15'), read_time: '8 min', category: 'web_security', tags: 'SQL injection, web security, OWASP', excerpt: 'Learn how SQL injection attacks work and how to prevent them...', content: 'SQL injection is one of the most dangerous web vulnerabilities...', featured: true, views: 1200 },
      { id: 2, title: 'Network Scanning with Nmap', author: 'Security Expert', author_avatar: 'expert-avatar.jpg', date: new Date('2025-01-10'), read_time: '12 min', category: 'network_security', tags: 'Nmap, network scanning, penetration testing', excerpt: 'Master the art of network discovery using Nmap...', content: 'Nmap is the go-to tool for network administrators and security professionals...', featured: true, views: 800 },
      { id: 3, title: 'Cryptography Basics for Developers', author: 'Crypto Guru', author_avatar: 'guru-avatar.jpg', date: new Date('2025-01-05'), read_time: '15 min', category: 'cryptography', tags: 'cryptography, encryption, security', excerpt: 'Essential cryptography concepts every developer should know...', content: 'Cryptography is the foundation of modern digital security...', featured: false, views: 600 }
    ],
    skipDuplicates: true
  });
  
  console.log('Seed completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
