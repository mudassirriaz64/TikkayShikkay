import { CartProvider } from "@/context/CartContext";
import { AccountProvider } from "@/providers/AccountProvider";

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <AccountProvider>{children}</AccountProvider>
    </CartProvider>
  );
}
