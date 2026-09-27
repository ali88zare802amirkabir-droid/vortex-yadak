import type {
  Product,
  Vendor,
  Vehicle,
  Reservation,
  ReservationStatus,
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaClient = any;

let _prisma: PrismaClient | null = null;
let _attempted = false;

async function loadPrismaClient(): Promise<PrismaClient | null> {
  if (_attempted) return _prisma;
  _attempted = true;
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) return null;
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const clientModule = await import("@prisma/client");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const PC = (clientModule as any).PrismaClient ?? clientModule.default?.PrismaClient;
    const adapter = new PrismaPg({ connectionString } as never);
    _prisma = new PC({ adapter } as never);
    await _prisma.$connect();
    return _prisma;
  } catch (err) {
    console.error("Failed to initialize Prisma client:", err);
    _prisma = null;
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    brand: p.brand,
    price: p.price,
    stock: p.stock,
    description: p.description,
    technicalNo: p.technicalNo ?? undefined,
    imageUrl: p.imageUrl ?? undefined,
    vendorId: p.vendorId,
    vendorName: p.vendor?.name,
    vendorCity: p.vendor?.address?.split("،")[0],
    vehicleIds: (p.compatibilities ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (c: any) => c.vehicleId ?? c.vehicle?.id
    ),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapReservation(r: any): Reservation {
  const created =
    r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt);
  return {
    id: r.id,
    productId: r.productId,
    productName: r.product?.name ?? "",
    customerName: r.customerName,
    phone: r.phone,
    quantity: r.quantity,
    status: r.status as ReservationStatus,
    createdAt: created.toISOString(),
  };
}

const productInclude = {
  vendor: true,
  compatibilities: { include: { vehicle: true } },
} as const;

function needDb(db: PrismaClient | null): PrismaClient {
  if (!db) throw new Error("Database not available");
  return db;
}

export const prismaRepo = {
  getVehicles: async (): Promise<Vehicle[]> => {
    const db = needDb(await loadPrismaClient());
    return (await db.vehicle.findMany()) as Vehicle[];
  },
  getVendors: async (): Promise<Vendor[]> => {
    const db = needDb(await loadPrismaClient());
    return (await db.vendor.findMany()) as Vendor[];
  },
  getProducts: async (): Promise<Product[]> => {
    const db = needDb(await loadPrismaClient());
    const rows = await db.product.findMany({ include: productInclude });
    return rows.map(mapProduct);
  },
  getProductById: async (id: string): Promise<Product | null> => {
    const db = needDb(await loadPrismaClient());
    const row = await db.product.findUnique({
      where: { id },
      include: productInclude,
    });
    return row ? mapProduct(row) : null;
  },
  getReservations: async (): Promise<Reservation[]> => {
    const db = needDb(await loadPrismaClient());
    const rows = await db.reservation.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapReservation);
  },
  addReservation: async (
    data: Omit<Reservation, "id" | "createdAt">
  ): Promise<Reservation> => {
    const db = needDb(await loadPrismaClient());
    const product = await db.product.findUnique({
      where: { id: data.productId },
    });
    if (!product) throw new Error("Product not found");
    if (product.stock < data.quantity) throw new Error("Not enough stock");
    const row = await db.reservation.create({
      data: {
        productId: data.productId,
        customerName: data.customerName,
        phone: data.phone,
        quantity: data.quantity,
        status: "NEW",
      },
      include: { product: true },
    });
    await db.product.update({
      where: { id: data.productId },
      data: { stock: { decrement: data.quantity } },
    });
    return mapReservation(row);
  },
  updateReservationStatus: async (
    id: string,
    status: ReservationStatus
  ): Promise<Reservation> => {
    const db = needDb(await loadPrismaClient());
    const row = await db.reservation.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { status: status as never },
      include: { product: true },
    });
    return mapReservation(row);
  },
  addProduct: async (data: Omit<Product, "id">): Promise<Product> => {
    const db = needDb(await loadPrismaClient());
    const row = await db.product.create({
      data: {
        name: data.name,
        category: data.category,
        brand: data.brand,
        price: data.price,
        stock: data.stock,
        description: data.description,
        technicalNo: data.technicalNo,
        imageUrl: data.imageUrl,
        vendor: { connect: { id: data.vendorId } },
        compatibilities: {
          create: (data.vehicleIds ?? []).map((vid) => ({
            vehicle: { connect: { id: vid } },
          })),
        },
      },
      include: productInclude,
    });
    return mapProduct(row);
  },
  updateProduct: async (
    id: string,
    patch: Partial<Product>
  ): Promise<Product> => {
    const db = needDb(await loadPrismaClient());
    const updateData: Record<string, unknown> = {};
    if (patch.name !== undefined) updateData.name = patch.name;
    if (patch.category !== undefined) updateData.category = patch.category;
    if (patch.brand !== undefined) updateData.brand = patch.brand;
    if (patch.price !== undefined) updateData.price = patch.price;
    if (patch.stock !== undefined) updateData.stock = patch.stock;
    if (patch.description !== undefined)
      updateData.description = patch.description;
    if (patch.technicalNo !== undefined)
      updateData.technicalNo = patch.technicalNo;
    if (patch.imageUrl !== undefined) updateData.imageUrl = patch.imageUrl;
    if (patch.vendorId !== undefined)
      updateData.vendor = { connect: { id: patch.vendorId } };
    if (patch.vehicleIds !== undefined) {
      updateData.compatibilities = {
        deleteMany: {},
        create: patch.vehicleIds.map((vid) => ({
          vehicle: { connect: { id: vid } },
        })),
      };
    }
    const row = await db.product.update({
      where: { id },
      data: updateData as never, // eslint-disable-line @typescript-eslint/no-explicit-any
      include: productInclude,
    });
    return mapProduct(row);
  },
  deleteProduct: async (id: string): Promise<void> => {
    const db = needDb(await loadPrismaClient());
    await db.productCompatibility.deleteMany({ where: { productId: id } });
    await db.product.delete({ where: { id } });
  },
  searchProducts: async (q: string): Promise<Product[]> => {
    const db = needDb(await loadPrismaClient());
    const rows = await db.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { category: { contains: q } },
          { brand: { contains: q, mode: "insensitive" } },
          { technicalNo: { contains: q, mode: "insensitive" } },
        ],
      },
      include: productInclude,
    });
    return rows.map(mapProduct);
  },
  getDashboardStats: async () => {
    const db = needDb(await loadPrismaClient());
    const [totalProducts, totalVendors, totalReservations, lowStock] =
      await Promise.all([
        db.product.count(),
        db.vendor.count(),
        db.reservation.count(),
        db.product.count({ where: { stock: { lte: 5 } } }),
      ]);
    return {
      totalProducts,
      todayViews: 126,
      todayReservations: 8,
      lowStock,
      totalVendors,
      totalReservations,
      totalUsers: 0,
    };
  },
};