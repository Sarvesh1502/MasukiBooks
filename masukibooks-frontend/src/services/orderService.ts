import type { Order, OrderItem, ShippingInfo, CartItem } from "../types/book";
import { isSupabaseConfigured, supabase } from "./supabase";

export async function createOrder(
  userId: string,
  cartItems: CartItem[],
  shipping: ShippingInfo,
  paymentMethod: string = "card",
  promoCode?: string,
  discount: number = 0
): Promise<Order> {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.book?.price ?? 0) * item.quantity,
    0
  );
  const total = Math.max(0, subtotal - discount);

  if (!isSupabaseConfigured) {
    const order: Order = {
      id: `order-${Date.now()}`,
      userId,
      status: "pending",
      total,
      currency: "INR",
      shippingName: shipping.name,
      shippingAddress: shipping.address,
      shippingCity: shipping.city,
      shippingZip: shipping.zip,
      shippingCountry: shipping.country,
      shippingPhone: shipping.phone,
      paymentMethod,
      paymentStatus: "paid",
      promoCode: promoCode ?? null,
      discount,
      notes: null,
      createdAt: new Date().toISOString(),
      items: cartItems.map((item) => ({
        id: `oi-${Date.now()}-${item.bookId}`,
        orderId: "",
        bookId: item.bookId,
        title: item.book?.title ?? "",
        author: item.book?.author ?? "",
        price: item.book?.price ?? 0,
        quantity: item.quantity,
      })),
    };
    return order;
  }

  // Insert order
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      status: "pending",
      total,
      currency: "INR",
      shipping_name: shipping.name,
      shipping_address: shipping.address,
      shipping_city: shipping.city,
      shipping_zip: shipping.zip,
      shipping_country: shipping.country,
      shipping_phone: shipping.phone,
      payment_method: paymentMethod,
      payment_status: "paid",
      promo_code: promoCode ?? null,
      discount,
    })
    .select()
    .single();

  if (orderError || !orderData) {
    throw new Error(orderError?.message ?? "Failed to create order");
  }

  const orderId = String(orderData.id);

  // Insert order items
  const orderItems = cartItems.map((item) => ({
    order_id: orderId,
    book_id: item.bookId,
    title: item.book?.title ?? "",
    author: item.book?.author ?? "",
    price: item.book?.price ?? 0,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.warn("Order items insert error:", itemsError.message);
  }

  return mapOrder(orderData);
}

export async function fetchOrders(userId: string): Promise<Order[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Orders fetch error:", error.message);
    return [];
  }

  return (data ?? []).map(mapOrder);
}

export async function fetchAllOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("All orders fetch error:", error.message);
    return [];
  }

  return (data ?? []).map(mapOrder);
}

export async function fetchOrderById(orderId: string): Promise<Order | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (error || !data) return null;
  return mapOrder(data);
}

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    throw new Error(error.message);
  }
}

function mapOrder(row: Record<string, unknown>): Order {
  const items = Array.isArray(row.order_items) ? row.order_items : [];
  return {
    id: String(row.id ?? ""),
    userId: String(row.user_id ?? ""),
    status: String(row.status ?? "pending"),
    total: Number(row.total ?? 0),
    currency: String(row.currency ?? "INR"),
    shippingName: String(row.shipping_name ?? ""),
    shippingAddress: String(row.shipping_address ?? ""),
    shippingCity: String(row.shipping_city ?? ""),
    shippingZip: String(row.shipping_zip ?? ""),
    shippingCountry: String(row.shipping_country ?? ""),
    shippingPhone: String(row.shipping_phone ?? ""),
    paymentMethod: String(row.payment_method ?? "card"),
    paymentStatus: String(row.payment_status ?? "pending"),
    promoCode: row.promo_code ? String(row.promo_code) : null,
    discount: Number(row.discount ?? 0),
    notes: row.notes ? String(row.notes) : null,
    createdAt: String(row.created_at ?? ""),
    items: (items as Record<string, unknown>[]).map(mapOrderItem),
  };
}

function mapOrderItem(row: Record<string, unknown>): OrderItem {
  return {
    id: String(row.id ?? ""),
    orderId: String(row.order_id ?? ""),
    bookId: String(row.book_id ?? ""),
    title: String(row.title ?? ""),
    author: String(row.author ?? ""),
    price: Number(row.price ?? 0),
    quantity: Number(row.quantity ?? 1),
  };
}
