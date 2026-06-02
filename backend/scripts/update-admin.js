const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.updateMany({
  where: { role: 'admin' },
  data: { name: 'Tharun Kumar', email: 'tharundondapati982@gmail.com', phone: '6305302510' }
}).then(r => {
  console.log('Updated admin user:', r);
  return p.$disconnect();
});
