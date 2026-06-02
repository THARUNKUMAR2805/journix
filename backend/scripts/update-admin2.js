const { PrismaClient } = require('../node_modules/@prisma/client');
const p = new PrismaClient();
async function main() {
  const result = await p.user.updateMany({
    where: { role: 'admin' },
    data: { name: 'Tharun Kumar', email: 'tharundondapati982@gmail.com', phone: '6305302510' }
  });
  console.log('Updated rows:', result.count);
  const admin = await p.user.findFirst({ where: { role: 'admin' }, select: { name: true, email: true, phone: true } });
  console.log('Admin now:', admin);
}
main().finally(() => p.$disconnect());
