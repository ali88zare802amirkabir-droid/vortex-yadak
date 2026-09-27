import { Product, Vendor, Vehicle, Reservation, ReservationStatus } from "./types";

const vehicles: Vehicle[] = [
  { id: "v1", brand: "پژو", model: "206", year: 2005 },
  { id: "v2", brand: "پژو", model: "405", year: 1999 },
  { id: "v3", brand: "سمند", model: "SE/LE", year: 2002 },
  { id: "v4", brand: "پراید", model: "پراید", year: 2010 },
  { id: "v5", brand: "دنا", model: "دنا", year: 2018 },
  { id: "v6", brand: "تیبا", model: "تیبا", year: 2020 },
];

const vendors: Vendor[] = [
  { id: "vendor1", name: "یدک امیری", address: "بیرجند، خیابان امام خمینی", phone: "05832221111" },
  { id: "vendor2", name: "قطعه گاه پارس", address: "تهران، خیابان ولیعصر", phone: "02188823333" },
  { id: "vendor3", name: "معرف یدکی", address: "اصفهان، خیابان حقانی", phone: "03155512222" },
  { id: "vendor4", name: "تختی یدکی", address: "مشهد، خیابان آزادی", phone: "05135554444" },
  { id: "vendor5", name: "گلستان قطعات", address: "تبریز، خیابان جنگل", phone: "04138885555" },
];

const categories = ["موتور", "ترمز", "برق", "بدنه", "جلوبندی", "مصرفی"];
const brands = ["NGK", "فیلتر", "پمپ", "لنت", "آپتون", "گلسن", "فیات", "مابوچی", "پارس", "کرین", "میشلان", "دلکی", "Denso", "هوندا", "ژاپنی"];
const names = [
  "لنت ترمز جلو", "لنت ترمز عقب", "دیسک ترمز جلو", "کالبکس ترمز", "شمع موتور",
  "فیلتر روغن", "پمپ آب", "رادیاتور", "آلباتروس", "ژنراتور",
  "سوئیچ", "فیوز", "آینه", "دور", "گلوب", "فرانت",
  "جک هیدرولیک", "وند پشتی", "لاستیک تابستانی", "روغن موتور",
  "فیلتر هوا", "فیلتر سوخت", "مایع ترمز", "آنتی‌فریز", "بُرِش",
  "بَلت موتور", "رلی فرانت", "فیلتر سوخت", "پمپ فرمان", "آینه جانبی",
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const products: Product[] = [];
let pid = 1;
const rng = seededRandom(42);

for (const name of names) {
  const category = categories[Math.floor(rng() * categories.length)];
  const brand = brands[Math.floor(rng() * brands.length)];
  const vendor = vendors[Math.floor(rng() * vendors.length)];
  const count = 1 + Math.floor(rng() * 3);
  for (let i = 0; i < count; i++) {
    const vehicleSlice = vehicles.slice(Math.floor(rng() * vehicles.length), Math.floor(rng() * vehicles.length) + 1 + Math.floor(rng() * 2));
    products.push({
      id: `p${pid++}`,
      name: `${name}${i > 0 ? ` ${i + 1}` : ""}`,
      category,
      brand,
      price: 80_000 + Math.floor(rng() * 920_000),
      stock: 1 + Math.floor(rng() * 20),
      description: `${name} - برای ${brand} - کیفیت بالا و قیمت مناسب`,
      technicalNo: `T${1000 + Math.floor(rng() * 9000)}`,
      imageUrl: `/products/${pid}.jpg`,
      vendorId: vendor.id,
      vendorName: vendor.name,
      vendorCity: vendor.address.split("،")[0],
      vehicleIds: vehicleSlice.map((v) => v.id),
    });
  }
}

let reservationId = 1;
const reservations: Reservation[] = [];

export const memoryStore = {
  getVehicles: () => vehicles,
  getVendors: () => vendors,
  getProducts: () => products,
  getReservations: () => reservations,
  getProductById: (id: string) => products.find((p) => p.id === id) ?? null,
  getProductCompatibility: (productId: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return [];
    const vids = p.vehicleIds;
    return vehicles.filter((v) => vids.includes(v.id));
  },
  getProductsByVehicle: (vehicleId: string) =>
    products.filter((p) => p.vehicleIds.includes(vehicleId)),
  addReservation: (r: Omit<Reservation, "id" | "createdAt">) => {
    const res = { ...r, id: `res${reservationId++}`, createdAt: new Date().toISOString() };
    reservations.push(res);
    const product = products.find((p) => p.id === r.productId);
    if (product && product.stock >= r.quantity) product.stock -= r.quantity;
    return res;
  },
  updateReservationStatus: (id: string, status: ReservationStatus) => {
    const r = reservations.find((x) => x.id === id);
    if (r) r.status = status;
    return r;
  },
  addProduct: (p: Omit<Product, "id">) => {
    const product = { ...p, id: `p${pid++}` };
    products.push(product);
    return product;
  },
  updateProduct: (id: string, patch: Partial<Product>) => {
    const p = products.find((x) => x.id === id);
    if (!p) throw new Error("Product not found");
    Object.assign(p, patch);
    return p;
  },
  deleteProduct: (id: string) => {
    const idx = products.findIndex((x) => x.id === id);
    if (idx > -1) products.splice(idx, 1);
  },
  searchProducts: (q: string) => {
    const lower = q.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.category.includes(lower) ||
        p.brand.toLowerCase().includes(lower) ||
        p.technicalNo?.toLowerCase().includes(lower)
    );
  },
  getDashboardStats: () => ({
    totalProducts: products.length,
    todayViews: 126 + Math.floor(Math.random() * 50),
    todayReservations: 8 + Math.floor(Math.random() * 5),
    lowStock: products.filter((p) => p.stock <= 5).length,
    totalVendors: vendors.length,
    totalReservations: reservations.length,
    totalUsers: 0,
  }),
};
