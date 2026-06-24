const { prisma } = require('./config/db');
const bcrypt = require('bcryptjs'); // Assuming bcryptjs or bcrypt is installed

async function main() {
  const username = 'uzair';
  const newPassword = 'password123';
  
  const user = await prisma.user.findFirst({ where: { username } });
  
  if (!user) {
    console.log(`User ${username} not found!`);
    return;
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await prisma.user.update({
    where: { id: user.id },
    data: { password_hash: hashedPassword }
  });
  
  console.log(`Successfully updated password for ${username}.`);
  console.log(`Username: ${username}`);
  console.log(`Password: ${newPassword}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
