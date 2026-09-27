export function formatNumber(n: number): string {
  return n.toLocaleString("fa-IR");
}

export function formatPrice(price: number): string {
  return `${formatNumber(price)} تومان`;
}

export function formatStatus(status: string): string {
  const map: Record<string, string> = {
    NEW: "جدید",
    CONFIRMED: "تایید شده",
    DELIVERED: "تحویل شده",
  };
  return map[status] || status;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    NEW: "bg-red-100 text-red-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-green-100 text-green-700",
  };
  return map[status] || "bg-gray-100 text-gray-700";
}

export function getStockColor(stock: number): string {
  if (stock <= 3) return "text-red-600 font-bold";
  if (stock <= 10) return "text-amber-600";
  return "text-green-600";
}
