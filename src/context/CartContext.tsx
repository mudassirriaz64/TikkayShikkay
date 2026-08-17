"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { MenuItem } from "@/types";
import {
  ordersService,
  CreateOrderInput,
  OrderItemInput,
  ClientApiError,
} from "@/lib/api";
import { AccountOrder } from "@/types";

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface PlaceOrderInput
  extends Omit<CreateOrderInput, "items" | "subtotal" | "total" | "user_id"> {
  user_id?: string;
  deliveryFee?: number;
  order_notes?: string;
}

interface PlaceOrderResult {
  success: boolean;
  order?: AccountOrder;
  error?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  incrementItem: (itemId: string) => void;
  setItemQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  cartItemCount: number;
  cartSubtotal: number;
  cartTotal: number;
  deliveryFee: number;
  placeOrder: (info: PlaceOrderInput) => Promise<PlaceOrderResult>;
  orderStatus: "idle" | "placing" | "placed" | "error";
  lastOrderError: string | null;
  clearOrderStatus: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderStatus, setOrderStatus] =
    useState<"idle" | "placing" | "placed" | "error">("idle");
  const [lastOrderError, setLastOrderError] = useState<string | null>(null);

  const addToCart = useCallback((item: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  }, []);

  const decrementItem = useCallback((itemId: string) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.item.id === itemId ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((i) => i.item.id !== itemId));
  }, []);

  const incrementItem = useCallback((itemId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.item.id === itemId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    );
  }, []);

  const setItemQuantity = useCallback((itemId: string, qty: number) => {
    const quantity = Math.max(0, Math.floor(qty || 0));
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.item.id !== itemId);
      const existing = prev.find((i) => i.item.id === itemId);
      if (existing) {
        return prev.map((i) =>
          i.item.id === itemId ? { ...i, quantity } : i,
        );
      }
      return prev;
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const cartItemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = items.reduce(
    (sum, i) => sum + i.item.price * i.quantity,
    0,
  );
  const deliveryFee = 0;
  const cartTotal = cartSubtotal + deliveryFee;

  const clearOrderStatus = useCallback(() => {
    setOrderStatus("idle");
    setLastOrderError(null);
  }, []);

  const placeOrder = useCallback(
    async (info: PlaceOrderInput): Promise<PlaceOrderResult> => {
      if (items.length === 0) {
        const errMsg = "Your cart is empty";
        setOrderStatus("error");
        setLastOrderError(errMsg);
        return { success: false, error: errMsg };
      }

      setOrderStatus("placing");
      setLastOrderError(null);

      try {
        const orderItems: OrderItemInput[] = items.map((cart) => ({
          itemId: cart.item.id,
          title: cart.item.title,
          quantity: cart.quantity,
          price: cart.item.price,
          image_url: cart.item.image_url,
        }));

        const subtotal = Number(cartSubtotal.toFixed(2));
        const fee = Number((info.deliveryFee ?? deliveryFee).toFixed(2));
        const total = Number((subtotal + fee).toFixed(2));

        const payload: CreateOrderInput = {
          user_id: info.user_id,
          customer_name: info.customer_name,
          customer_email: info.customer_email,
          customer_phone: info.customer_phone,
          customer_address: info.customer_address,
          items: orderItems,
          subtotal,
          deliveryFee: fee,
          total,
          payment_method: info.payment_method || "cash",
          order_notes: info.order_notes,
        };

        const order = await ordersService.create(payload);
        setOrderStatus("placed");
        clearCart();
        setTimeout(() => setOrderStatus("idle"), 3000);
        return { success: true, order };
      } catch (err) {
        const msg =
          err instanceof ClientApiError
            ? err.message
            : (err as Error)?.message || "Failed to place order";
        setOrderStatus("error");
        setLastOrderError(msg);
        return { success: false, error: msg };
      }
    },
    [items, cartSubtotal, deliveryFee, clearCart],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        decrementItem,
        incrementItem,
        setItemQuantity,
        clearCart,
        cartItemCount,
        cartSubtotal,
        cartTotal,
        deliveryFee,
        placeOrder,
        orderStatus,
        lastOrderError,
        clearOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
