import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is required to run the seed. Set it in .env or pass it inline."
  );
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const vehicles = [
  { brand: "پژو", model: "206", year: 2005 },
  { brand: "پژو", model: "405", year: 1999 },
  { brand: "سمند", model: "SE", year: 2002 },
  { brand: "پراید", model: "پراید", year: 2010 },
  { brand: "دنا", model: "دنا", year: 2018 },
  { brand: "تیبا", model: "تیبا", year: 2020 },
];

const vendors = [
  { name: "یدک امیری", address: "بیرجند، خیابان امام خمینی", phone: "05832221111" },
  { name: "قطعه گاه پارس", address: "تهران، خیابان ولیعصر", phone: "02188823333" },
  { name: "معرف یدکی", address: "اصفهان، خیابان حقانی", phone: "03155512222" },
  { name: "تختی یدکی", address: "مشهد، خیابان آزادی", phone: "05135554444" },
  { name: "گلستان قطعات", address: "تبریز، خیابان جنگل", phone: "04138885555" },
];

const pairs: Array<[string, string, string]> = [
  ["لنت ترمز جلو پژو 206", "ترمز", "لنت"],
  ["لنت ترمز عقب پژو 206", "ترمز", "لنت"],
  ["دیسک ترمز جلو پژو 206", "ترمز", "فیبری"],
  ["کالبکس ترمز پژو 405", "ترمز", "آپتون"],
  ["لنت جلو پژو 405", "ترمز", "لنت"],
  ["لنت عقب سمند", "ترمز", "لنت"],
  ["دیسک ترمز تیبا", "ترمز", "فیبری"],
  ["بُرِش دیسک پراید", "ترمز", "آپتون"],
  ["مایع ترمز DOT4", "مصرفی", "آپتون"],
  ["بُرِش تلمبه پژو 206", "ترمز", "آپتون"],
  ["شمع موتور پژو 206", "موتور", "NGK"],
  ["شمع موتور پراید", "موتور", "Denso"],
  ["فیلتر روغن سمند", "موتور", "فیلتر"],
  ["فیلتر روغن پژو 206", "مصرفی", "فیلتر"],
  ["پمپ آب سمند", "موتور", "گلسن"],
  ["پمپ فرمان پراید", "موتور", "پمپ"],
  ["رادیاتور پژو 405", "موتور", "آلومینیومی"],
  ["رادیاتور موتور دنا", "موتور", "آلومینیومی"],
  ["روغن موتور ۱۰ ویژه", "موتور", "پارس"],
  ["روغن گیربکس سمند", "موتور", "پارس"],
  ["بَلت موتور سمند", "موتور", "گلسن"],
  ["بَلت سمت پراید", "موتور", "گلسن"],
  ["آلباتروس پراید", "برق", "فیات"],
  ["ژنراتور تیبا", "برق", "مابوچی"],
  ["سوئیچ پراید", "برق", "دلکی"],
  ["سیم آتش‌پاش سمند", "برق", "رادیاتور"],
  ["سیم روشنایی پژو 405", "برق", "رادیاتور"],
  ["رلی فرانت پژو 206", "برق", "هوندا"],
  ["فیوز اصلی پراید", "برق", "پارس"],
  ["آپن رادیاتور پژو 405", "برق", "گلسن"],
  ["آپن ژنراتور سمند", "برق", "گلسن"],
  ["آینه سدان سمند", "بدنه", "پلاستیکی"],
  ["آینه جانبی تیبا", "بدنه", "پلاستیکی"],
  ["آینه رویش پژو 206", "بدنه", "پلاستیکی"],
  ["دور سمند", "بدنه", "فولادی"],
  ["گلوب جلو پژو 206", "بدنه", "ژاپنی"],
  ["گلوب راهنما تیبا", "بدنه", "ژاپنی"],
  ["فرانت پراید", "بدنه", "پلاستیک"],
  ["جک هیدرولیک", "جلوبندی", "کرین"],
  ["جک لاستیکی کوچک", "جلوبندی", "کرین"],
  ["وند پشتی", "جلوبندی", "کاوشاکی"],
  ["لاستیک تابستانی پژو 206", "جلوبندی", "میشلان"],
  ["لاستیک زمستانی تیبا", "جلوبندی", "میشلان"],
  ["فیلتر هوا پژو 405", "مصرفی", "فیلتر"],
  ["فیلتر هوا دنا", "مصرفی", "فیلتر"],
  ["فیلتر سوخت دنا", "مصرفی", "دلکی"],
  ["فیلتر سوخت پژو 405", "مصرفی", "دلکی"],
  ["آنتی‌فریز زمستانی", "مصرفی", "پارس"],
  ["مایع سرامیک ترمز", "مصرفی", "آپتون"],
  ["کالبکس فرمان پژو 206", "ترمز", "آپتون"],
  ["چراغ جلو پژو 405", "برق", "ژاپنی"],
];

async function main() {
  await prisma.productCompatibility.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.vehicle.deleteMany();

  for (const v of vendors) {
    await prisma.vendor.create({ data: v });
  }
  for (const veh of vehicles) {
    await prisma.vehicle.create({ data: veh });
  }

  const allVendors = await prisma.vendor.findMany();
  const allVehicles = await prisma.vehicle.findMany();

  let i = 0;
  for (const [name, category, brand] of pairs) {
    const vendor = allVendors[i % allVendors.length];
    const price = 80_000 + ((i * 137_000) % 920_000);
    const stock = 1 + ((i * 7) % 20);
    await prisma.product.create({
      data: {
        name,
        category,
        brand,
        price,
        stock,
        description: `${name} — برند ${brand} — کیفیت بالا و قیمت مناسب`,
        technicalNo: `T${1000 + i}`,
        vendor: { connect: { id: vendor.id } },
        compatibilities: {
          create: allVehicles
            .slice(i % allVehicles.length, (i % allVehicles.length) + 2)
            .map((veh) => ({ vehicle: { connect: { id: veh.id } } })),
        },
      },
    });
    i++;
  }

  console.log(`Seed completed: ${pairs.length} products.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  void prisma.$disconnect();
  process.exit(1);
});