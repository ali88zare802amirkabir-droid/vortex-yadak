import { memoryStore } from "./memory";
import { prismaRepo } from "./prisma";
import type {
  Product,
  Vendor,
  Vehicle,
  Reservation,
  ReservationStatus,
} from "./types";

type Repo = typeof memoryStore | typeof prismaRepo;

let _repo: Repo | null = null;

export async function getRepo(): Promise<Repo> {
  if (_repo) return _repo;
  if (process.env.DATABASE_URL) {
    try {
      _repo = prismaRepo;
      console.log("DATABASE_URL detected, using Prisma/PostgreSQL.");
      return _repo;
    } catch (err) {
      console.error("Prisma init failed, falling back to memory:", err);
    }
  }
  console.log("Using in-memory repository (Demo mode).");
  _repo = memoryStore;
  return _repo;
}

export async function getVehicles(): Promise<Vehicle[]> {
  const repo = await getRepo();
  return repo.getVehicles();
}

export async function getVendors(): Promise<Vendor[]> {
  const repo = await getRepo();
  return repo.getVendors();
}

export async function getProducts(): Promise<Product[]> {
  const repo = await getRepo();
  return repo.getProducts();
}

export async function getProductById(id: string): Promise<Product | null> {
  const repo = await getRepo();
  return repo.getProductById(id);
}

export async function getReservations(): Promise<Reservation[]> {
  const repo = await getRepo();
  return repo.getReservations();
}

export async function addReservation(
  data: Omit<Reservation, "id" | "createdAt">
): Promise<Reservation> {
  const repo = await getRepo();
  const result = await repo.addReservation(data);
  return result as Reservation;
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus
): Promise<Reservation> {
  const repo = await getRepo();
  return repo.updateReservationStatus(id, status) as Reservation;
}

export async function addProduct(data: Omit<Product, "id">): Promise<Product> {
  const repo = await getRepo();
  return repo.addProduct(data);
}

export async function updateProduct(
  id: string,
  patch: Partial<Product>
): Promise<Product> {
  const repo = await getRepo();
  return repo.updateProduct(id, patch);
}

export async function deleteProduct(id: string): Promise<void> {
  const repo = await getRepo();
  return repo.deleteProduct(id);
}

export async function searchProducts(q: string): Promise<Product[]> {
  const repo = await getRepo();
  return repo.searchProducts(q);
}

export async function getDashboardStats() {
  const repo = await getRepo();
  return repo.getDashboardStats();
}
