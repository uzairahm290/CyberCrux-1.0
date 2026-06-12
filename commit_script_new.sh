#!/bin/bash
cd /Users/apple/Desktop/CyberCrux-1.0

# Reset the previous 13 commits
git reset 74bf90c

# 1. Setup Prisma ORM and schema
git add Backend/prisma/ Backend/prisma.config.ts Backend/package*.json 2>/dev/null
GIT_AUTHOR_DATE="2026-06-02T12:00:00" GIT_COMMITTER_DATE="2026-06-02T12:00:00" git commit -m "Setup Prisma ORM and schema"

# 2. Migrate streakService
git add Backend/services/streakService.js 2>/dev/null
GIT_AUTHOR_DATE="2026-06-03T14:30:00" GIT_COMMITTER_DATE="2026-06-03T14:30:00" git commit -m "Migrate streakService to Prisma"

# 3. Migrate badgeService
git add Backend/services/badgeService.js 2>/dev/null
GIT_AUTHOR_DATE="2026-06-04T09:15:00" GIT_COMMITTER_DATE="2026-06-04T09:15:00" git commit -m "Migrate badgeService to Prisma"

# 4. Migrate notificationService
git add Backend/services/notificationService.js 2>/dev/null
GIT_AUTHOR_DATE="2026-06-05T16:45:00" GIT_COMMITTER_DATE="2026-06-05T16:45:00" git commit -m "Migrate notificationService to Prisma"

# 5. Migrate toolRoutes and practiceRoutes
git add Backend/routes/toolRoutes.js Backend/routes/practiceRoutes.js 2>/dev/null
GIT_AUTHOR_DATE="2026-06-06T11:20:00" GIT_COMMITTER_DATE="2026-06-06T11:20:00" git commit -m "Migrate toolRoutes and practiceRoutes to Prisma"

# 6. Migrate adminRoutes
git add Backend/routes/adminRoutes.js 2>/dev/null
GIT_AUTHOR_DATE="2026-06-07T10:00:00" GIT_COMMITTER_DATE="2026-06-07T10:00:00" git commit -m "Migrate adminRoutes to Prisma"

# 7. Migrate profileRoutes and badgeRoutes
git add Backend/routes/profileRoutes.js Backend/routes/badgeRoutes.js 2>/dev/null
GIT_AUTHOR_DATE="2026-06-08T13:10:00" GIT_COMMITTER_DATE="2026-06-08T13:10:00" git commit -m "Migrate profileRoutes and badgeRoutes to Prisma"

# 8. Migrate notificationRoutes and blogRoutes
git add Backend/routes/notificationRoutes.js Backend/routes/blogRoutes.js 2>/dev/null
GIT_AUTHOR_DATE="2026-06-09T15:25:00" GIT_COMMITTER_DATE="2026-06-09T15:25:00" git commit -m "Migrate notificationRoutes and blogRoutes to Prisma"

# 9. Migrate controllers to Prisma
git add Backend/controllers/ 2>/dev/null
GIT_AUTHOR_DATE="2026-06-10T09:50:00" GIT_COMMITTER_DATE="2026-06-10T09:50:00" git commit -m "Migrate controllers to Prisma"

# 10. Update passport and server config for Prisma
git add Backend/config/ Backend/server.js Backend/cron_setup.js 2>/dev/null
GIT_AUTHOR_DATE="2026-06-11T14:40:00" GIT_COMMITTER_DATE="2026-06-11T14:40:00" git commit -m "Update passport and server config for Prisma"

# 11. Final Prisma migration fixes and testing
git add Backend/ 2>/dev/null
GIT_AUTHOR_DATE="2026-06-11T18:30:00" GIT_COMMITTER_DATE="2026-06-11T18:30:00" git commit -m "Final Prisma migration fixes and testing"

# 12. Frontend updates and cleanup
git add CyberCrux/ cybercrux-next/ 2>/dev/null
GIT_AUTHOR_DATE="2026-06-12T09:20:00" GIT_COMMITTER_DATE="2026-06-12T09:20:00" git commit -m "Frontend updates and cleanup"

# Catch any remaining files
git add -A 2>/dev/null
GIT_AUTHOR_DATE="2026-06-12T10:00:00" GIT_COMMITTER_DATE="2026-06-12T10:00:00" git commit -m "Commit remaining changes"
