const { prisma } = require('./config/db.js');

async function main() {
  const categories = await prisma.practiceCategory.findMany();
  console.log("Categories found:", categories.length);
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
