const { prisma } = require('./config/db');

async function main() {
  let user = await prisma.user.findFirst({ where: { username: 'uzair' } });
  if (!user) {
    user = await prisma.user.findFirst();
  }
  if (!user) {
    console.log('No user found. Please register a user first!');
    return;
  }

  const userId = user.id;
  console.log(`Seeding mock data for user: ${user.username} (ID: ${userId})`);

  // Update user profile
  await prisma.user.update({
    where: { id: userId },
    data: {
      FullName: 'Uzair Ahmad',
      country: 'Pakistan',
      description: 'Cybersecurity enthusiast and CTF player. Passionate about web security, network pentesting, and cryptography.',
      linkedin_url: 'https://linkedin.com/in/uzairahm290',
      github_url: 'https://github.com/uzairahm290',
      is_verified: true,
    }
  });

  // ── Practice Scenarios ───────────────────────────────────────────────────────
  const scenarios = [
    { id: 1001, title: 'Basic SQL Injection', category: 'web_security', difficulty: 'Easy', points: 100, time_estimate: '10 min', questions_count: 5, completion_rate: 78.5, likes: 245, views: 1800, is_featured: true, description: 'Learn the basics of SQL injection attacks, how they work, and how to exploit vulnerable login forms.', short_description: 'Intro to SQL injection exploitation', tags: JSON.stringify(['SQL', 'OWASP', 'web', 'beginner']) },
    { id: 1002, title: 'Advanced XSS Attacks', category: 'web_security', difficulty: 'Hard', points: 250, time_estimate: '30 min', questions_count: 10, completion_rate: 42.3, likes: 189, views: 2100, is_featured: true, description: 'Explore stored, reflected, and DOM-based XSS vulnerabilities including filter bypasses and CSP evasion.', short_description: 'XSS techniques and CSP bypasses', tags: JSON.stringify(['XSS', 'JavaScript', 'DOM', 'advanced']) },
    { id: 1003, title: 'CSRF & Session Hijacking', category: 'web_security', difficulty: 'Medium', points: 150, time_estimate: '20 min', questions_count: 7, completion_rate: 61.0, likes: 132, views: 980, is_featured: false, description: 'Understand cross-site request forgery and session hijacking through practical hands-on exercises.', short_description: 'CSRF tokens and session attacks', tags: JSON.stringify(['CSRF', 'sessions', 'cookies']) },
    { id: 1004, title: 'Nmap Network Recon', category: 'network_security', difficulty: 'Easy', points: 100, time_estimate: '15 min', questions_count: 6, completion_rate: 83.2, likes: 310, views: 2400, is_featured: true, description: 'Master network reconnaissance using Nmap: port scanning, OS detection, and service version enumeration.', short_description: 'Network discovery with Nmap', tags: JSON.stringify(['Nmap', 'scanning', 'network', 'recon']) },
    { id: 1005, title: 'Firewall Evasion Techniques', category: 'network_security', difficulty: 'Hard', points: 300, time_estimate: '45 min', questions_count: 12, completion_rate: 28.7, likes: 97, views: 760, is_featured: false, description: 'Learn advanced techniques to evade firewalls and IDS systems during penetration testing engagements.', short_description: 'Evading firewalls and IDS', tags: JSON.stringify(['firewall', 'IDS', 'evasion', 'advanced']) },
    { id: 1006, title: 'Caesar Cipher & Substitution', category: 'cryptography', difficulty: 'Easy', points: 80, time_estimate: '10 min', questions_count: 5, completion_rate: 91.4, likes: 420, views: 3100, is_featured: false, description: 'Break classic Caesar and substitution ciphers through frequency analysis and pattern recognition.', short_description: 'Classic cipher cracking fundamentals', tags: JSON.stringify(['cryptography', 'cipher', 'beginner', 'CTF']) },
    { id: 1007, title: 'RSA Encryption & Attacks', category: 'cryptography', difficulty: 'Hard', points: 350, time_estimate: '60 min', questions_count: 14, completion_rate: 19.8, likes: 76, views: 540, is_featured: true, description: 'Deep dive into RSA encryption mathematics and common attack vectors including small exponent and padding oracle attacks.', short_description: 'RSA internals and attack methods', tags: JSON.stringify(['RSA', 'public-key', 'math', 'advanced']) },
    { id: 1008, title: 'Digital Forensics Basics', category: 'forensics', difficulty: 'Medium', points: 175, time_estimate: '25 min', questions_count: 8, completion_rate: 55.6, likes: 158, views: 1150, is_featured: false, description: 'Learn to recover deleted files, analyze disk images, and extract metadata from digital evidence.', short_description: 'Disk analysis and file recovery', tags: JSON.stringify(['forensics', 'disk', 'metadata', 'recovery']) },
    { id: 1009, title: 'Memory Forensics with Volatility', category: 'forensics', difficulty: 'Hard', points: 300, time_estimate: '50 min', questions_count: 11, completion_rate: 31.2, likes: 88, views: 690, is_featured: true, description: 'Analyze RAM dumps using Volatility to extract process lists, network connections, and hidden malware artifacts.', short_description: 'RAM dump analysis with Volatility', tags: JSON.stringify(['Volatility', 'memory', 'forensics', 'malware']) },
    { id: 1010, title: 'Reverse Engineering a Crackme', category: 'reverse_engineering', difficulty: 'Medium', points: 200, time_estimate: '35 min', questions_count: 9, completion_rate: 47.9, likes: 213, views: 1600, is_featured: true, description: 'Use Ghidra and GDB to reverse engineer a simple crackme binary and find the hidden password.', short_description: 'Binary analysis with Ghidra and GDB', tags: JSON.stringify(['Ghidra', 'GDB', 'binary', 'crackme']) },
    { id: 1011, title: 'Malware Static Analysis', category: 'malware_analysis', difficulty: 'Hard', points: 275, time_estimate: '40 min', questions_count: 10, completion_rate: 24.1, likes: 104, views: 820, is_featured: false, description: 'Perform static analysis on malware samples using YARA rules, strings extraction, and PE header inspection.', short_description: 'Static malware analysis techniques', tags: JSON.stringify(['YARA', 'malware', 'PE', 'static-analysis']) },
    { id: 1012, title: 'Phishing Awareness & Detection', category: 'social_engineering', difficulty: 'Easy', points: 90, time_estimate: '12 min', questions_count: 6, completion_rate: 88.0, likes: 375, views: 2800, is_featured: false, description: 'Identify phishing emails, spoofed domains, and social engineering tactics through realistic simulations.', short_description: 'Spot and report phishing attacks', tags: JSON.stringify(['phishing', 'email', 'awareness', 'beginner']) },
  ];

  for (const s of scenarios) {
    await prisma.practiceScenario.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }

  // ── Learning Resources ────────────────────────────────────────────────────────
  await prisma.learningResource.deleteMany({ where: { scenario_id: { in: scenarios.map(s => s.id) } } });
  await prisma.learningResource.createMany({
    data: [
      { scenario_id: 1001, title: 'OWASP SQL Injection Guide', url: 'https://owasp.org/www-community/attacks/SQL_Injection', type: 'article', description: 'Official OWASP guide on SQL injection' },
      { scenario_id: 1001, title: 'SQLMap Tutorial', url: 'https://github.com/sqlmapproject/sqlmap/wiki', type: 'docs', description: 'SQLMap documentation and usage' },
      { scenario_id: 1002, title: 'XSS Game by Google', url: 'https://xss-game.appspot.com', type: 'interactive', description: 'Practice XSS in a safe sandbox' },
      { scenario_id: 1004, title: 'Nmap Official Docs', url: 'https://nmap.org/docs.html', type: 'docs', description: 'Complete Nmap reference' },
      { scenario_id: 1006, title: 'Cryptopalz Challenges', url: 'https://cryptopals.com', type: 'challenge', description: 'Famous cryptography challenges' },
      { scenario_id: 1007, title: 'RSA Mathematics Explained', url: 'https://brilliant.org/wiki/rsa-encryption', type: 'article', description: 'Deep dive into RSA math' },
      { scenario_id: 1010, title: 'Ghidra NSA Tool Docs', url: 'https://ghidra-sre.org', type: 'docs', description: 'Official Ghidra documentation' },
      { scenario_id: 1009, title: 'Volatility Framework Wiki', url: 'https://github.com/volatilityfoundation/volatility/wiki', type: 'docs', description: 'Volatility memory forensics guide' },
    ]
  });

  // ── Clear old user-specific data ─────────────────────────────────────────────
  await prisma.userPracticeProgress.deleteMany({ where: { user_id: userId } });
  await prisma.userBadge.deleteMany({ where: { user_id: userId } });
  await prisma.userNotification.deleteMany({ where: { user_id: userId } });

  // ── Practice Progress ─────────────────────────────────────────────────────────
  const daysAgo = (n) => new Date(Date.now() - n * 86400000);

  await prisma.userPracticeProgress.createMany({
    data: [
      { user_id: userId, scenario_id: 1001, score: 100, max_score: 100, time_taken: 480,  is_completed: true, completed_at: daysAgo(20) },
      { user_id: userId, scenario_id: 1002, score: 230, max_score: 250, time_taken: 1720, is_completed: true, completed_at: daysAgo(18) },
      { user_id: userId, scenario_id: 1003, score: 142, max_score: 150, time_taken: 1100, is_completed: true, completed_at: daysAgo(16) },
      { user_id: userId, scenario_id: 1004, score: 100, max_score: 100, time_taken: 590,  is_completed: true, completed_at: daysAgo(14) },
      { user_id: userId, scenario_id: 1006, score: 80,  max_score: 80,  time_taken: 420,  is_completed: true, completed_at: daysAgo(12) },
      { user_id: userId, scenario_id: 1008, score: 160, max_score: 175, time_taken: 1350, is_completed: true, completed_at: daysAgo(10) },
      { user_id: userId, scenario_id: 1010, score: 185, max_score: 200, time_taken: 1980, is_completed: true, completed_at: daysAgo(8)  },
      { user_id: userId, scenario_id: 1012, score: 90,  max_score: 90,  time_taken: 510,  is_completed: true, completed_at: daysAgo(6)  },
      { user_id: userId, scenario_id: 1009, score: 210, max_score: 300, time_taken: 2800, is_completed: true, completed_at: daysAgo(4)  },
      { user_id: userId, scenario_id: 1007, score: 280, max_score: 350, time_taken: 3200, is_completed: true, completed_at: daysAgo(2)  },
      { user_id: userId, scenario_id: 1005, score: 90,  max_score: 300, time_taken: 900,  is_completed: false, completed_at: null },
      { user_id: userId, scenario_id: 1011, score: 50,  max_score: 275, time_taken: 600,  is_completed: false, completed_at: null },
    ]
  });

  // ── Streak ────────────────────────────────────────────────────────────────────
  await prisma.userStreak.upsert({
    where: { user_id: userId },
    update: {
      current_streak: 14,
      longest_streak: 21,
      total_points: 1677,
      total_practice_questions: 78,
      last_practice_date: daysAgo(0),
      last_login_date: daysAgo(0),
      streak_start_date: daysAgo(14),
    },
    create: {
      user_id: userId,
      current_streak: 14,
      longest_streak: 21,
      total_points: 1677,
      total_practice_questions: 78,
      last_practice_date: daysAgo(0),
      last_login_date: daysAgo(0),
      streak_start_date: daysAgo(14),
    }
  });

  // ── Badges ────────────────────────────────────────────────────────────────────
  const availableBadges = await prisma.badge.findMany({
    where: { id: { in: [1, 2, 3, 5, 6, 9, 10, 12, 17] } }
  });

  if (availableBadges.length > 0) {
    const earnedDates = { 1: daysAgo(20), 2: daysAgo(14), 3: daysAgo(8), 5: daysAgo(12), 6: daysAgo(10), 9: daysAgo(20), 10: daysAgo(12), 12: daysAgo(8), 17: daysAgo(4) };
    await prisma.userBadge.createMany({
      data: availableBadges.map(b => ({
        user_id: userId,
        badge_id: b.id,
        earned_at: earnedDates[b.id] || daysAgo(5),
        progress_data: { triggered_by: 'seed', points_at_earn: b.points_reward }
      }))
    });
  }

  // ── Notifications ─────────────────────────────────────────────────────────────
  await prisma.userNotification.createMany({
    data: [
      { user_id: userId, type: 'badge',     title: 'Badge Earned: First Steps',       message: 'You completed your first practice scenario and earned the First Steps badge!',                         is_read: true,  created_at: daysAgo(20) },
      { user_id: userId, type: 'badge',     title: 'Badge Earned: Perfect Score',      message: 'Amazing! You scored 100% on Basic SQL Injection and earned the Perfect Score badge!',               is_read: true,  created_at: daysAgo(20) },
      { user_id: userId, type: 'streak',    title: '7-Day Streak!',                    message: 'You\'ve been practicing every day for 7 days. Keep it up!',                                          is_read: true,  created_at: daysAgo(13) },
      { user_id: userId, type: 'badge',     title: 'Badge Earned: Streak Master',      message: 'You maintained a 7-day streak and earned the Streak Master badge. Impressive dedication!',          is_read: true,  created_at: daysAgo(13) },
      { user_id: userId, type: 'badge',     title: 'Badge Earned: Category Explorer',  message: 'You\'ve completed scenarios in 5 different categories. You\'re a true explorer!',                  is_read: false, created_at: daysAgo(8)  },
      { user_id: userId, type: 'streak',    title: '14-Day Streak!',                   message: 'Two solid weeks of practice! You\'re on a 14-day streak. The Persistent Hacker achievement awaits.', is_read: false, created_at: daysAgo(0)  },
      { user_id: userId, type: 'system',    title: 'New Scenario Available',           message: 'A new Hard-level scenario "Firewall Evasion Techniques" has been added. Ready for the challenge?',  is_read: false, created_at: daysAgo(3)  },
    ]
  });

  console.log('Mock data seeded successfully!');
  console.log(`  Scenarios upserted : ${scenarios.length}`);
  console.log(`  Progress entries   : 12 (10 completed, 2 in-progress)`);
  console.log(`  Badges earned      : ${availableBadges.length}`);
  console.log(`  Notifications      : 7`);
  console.log(`  Streak             : 14 days current / 21 days longest`);
  console.log(`  Total points       : 1677`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
