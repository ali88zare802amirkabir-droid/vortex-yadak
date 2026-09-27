import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(2, "نام حداقل ۲ کاراکتر است"),
  category: z.string().min(1, "دسته‌بندی الزامی است"),
  brand: z.string().min(1, "برند الزامی است"),
  vehicleIds: z.array(z.string()).min(1, "حداقل یک خودرو سازگار انتخاب شود"),
  price: z.number().int().min(1000, "قیمت باید بیشتر از ۱۰۰۰ تومان باشد"),
  stock: z.number().int().min(0, "موجودی نمی‌تواند منفی باشد"),
  description: z.string().min(10, "توضیحات حداقل ۱۰ کاراکتر"),
  technicalNo: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export const reservationSchema = z.object({
  productId: z.string().min(1),
  customerName: z.string().min(2, "نام حداقل ۲ کاراکتر"),
  phone: z.string().min(8, "شماره تماس حداقل ۸ رقم"),
  quantity: z.number().int().min(1).max(50, "حداکثر ۵۰ عدد"),
  note: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
export type ReservationFormData = z.infer<typeof reservationSchema>;
