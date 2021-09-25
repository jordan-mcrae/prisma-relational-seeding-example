const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const Users = require('./data/users');
const Posts = require('./data/Posts');

async function runSeeders() {
  // Users
  await Promise.all(
    Users.map(async (user) =>
      prisma.user.upsert({
        where : { id: user.id },
        update: {},
        create: user,
      })
    )
  );

  // Posts
  await Promise.all(
    Posts.map(async (post) =>
      prisma.post.upsert({
        where: { id: post.id },
        update: {},
        create: post,
      })
    )
  );
}

runSeeders()
  .catch((e) => {
    console.error(`There was an error while seeding: ${e}`);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Successfully seeded database. Closing connection.');
    await prisma.$disconnect();
  });
