import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ShoppingCart, X } from 'lucide-react';
import { useAuth } from '@/shared/context/AuthContext';
import { cinemaApi } from '@/shared/api/cinemaApi';
import type { Cart } from '@/shared/api/cinemaApi';
import type { Movie } from '@/features/auth/pages/Home/data/movieData';

const GUEST_CART_OWNER = 'guest';

interface CartContextValue {
  cart: Cart | null;
  addMovieToCart: (movie: Movie, time: string) => Promise<void>;
  noticeVersion: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const owner = user?.email ?? GUEST_CART_OWNER;
  const [cart, setCart] = useState<Cart | null>(null);
  const [noticeVersion, setNoticeVersion] = useState(0);

  useEffect(() => {
    let active = true;

    // Actualiza el carrito al cambiar de usuario o montar el componente
    const refreshCart = () => {
      cinemaApi.getCart(owner).then((value) => {
        if (active) setCart(value);
      });
    };

    refreshCart();

    // Sincroniza el carrito cuando hay eventos de almacenamiento en otra pestana
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `cinema_cart_${owner}`) {
        refreshCart();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      active = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [owner, noticeVersion]);

  const addMovieToCart = async (movie: Movie, time: string) => {
    const currentCart = await cinemaApi.getCart(owner);
    const price = Number.parseFloat((movie.prices?.[0] ?? '$0').replace(/[^0-9.]/g, '')) || 0;
    const ticketId = `ticket-${movie.id}-${time}`;
    const existingItems = currentCart?.items ?? [];
    const existingTicket = existingItems.find((item) => item.id === ticketId);
    const nextItems = existingTicket
      ? existingItems.map((item) => item.id === ticketId ? { ...item, quantity: item.quantity + 1 } : item)
      : [...existingItems, { id: ticketId, type: 'ticket' as const, name: `Entrada · ${movie.title}`, quantity: 1, unitPrice: price, movieId: movie.id, showtime: time }];
    const nextCart: Cart = {
      id: currentCart?.id ?? `cart-${Date.now()}`,
      userEmail: owner,
      movieId: movie.id,
      functionId: `pending-${movie.id}-${time}`,
      movieTitle: movie.title,
      theater: currentCart?.theater ?? 'Multicine Viva Barranquilla',
      date: currentCart?.date ?? 'Hoy',
      time,
      items: nextItems,
      membershipDiscount: currentCart?.membershipDiscount ?? 0,
      giftCardDiscount: currentCart?.giftCardDiscount ?? 0,
      expiresAt: new Date(Date.now() + 600000).toISOString(),
    };
    const savedCart = currentCart ? await cinemaApi.updateCart(nextCart) : await cinemaApi.createCart(nextCart);
    setCart(savedCart);
    setNoticeVersion((version) => version + 1);
  };

  return <CartContext.Provider value={{ cart, addMovieToCart, noticeVersion }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const FloatingCart = () => {
  const location = useLocation();
  const { cart, noticeVersion } = useCart();
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isCheckout = location.pathname.includes('/seats');
  const isCartPage = location.pathname === '/cart';
  const ticketCount = cart?.items.reduce((total, item) => item.type === 'ticket' ? total + item.quantity : total, 0) ?? 0;

  // El stepper controla su propio resumen; se oculta el flotante durante asientos, snacks y pago.
  useEffect(() => {
    if (ticketCount === 0) return;
    setNoticeVisible(true);
    const timer = window.setTimeout(() => setNoticeVisible(false), 3500);
    return () => window.clearTimeout(timer);
  }, [ticketCount, cart?.movieId, noticeVersion]);

  if (isCheckout || isCartPage || !cart || ticketCount === 0) return null;

  return <>
    <AnimatePresence>
      {noticeVisible && <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="fixed right-4 top-20 z-80 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-neutral-900 px-3 py-2 text-xs text-emerald-300 shadow-xl"><Check className="h-4 w-4" /> Ticket agregado al carrito <button onClick={() => setNoticeVisible(false)} aria-label="Cerrar alerta" className="ml-1 text-neutral-500 hover:text-neutral-200"><X className="h-3 w-3" /></button></motion.div>}
    </AnimatePresence>
    <Link to="/cart" className="fixed right-4 top-4 z-79 flex items-center gap-2 rounded-xl border border-yellow-500/40 bg-neutral-900/95 px-3 py-2 text-xs font-bold text-yellow-400 shadow-xl backdrop-blur-md transition hover:bg-neutral-800"><ShoppingCart className="h-4 w-4" /><span>Carrito</span><span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-500 px-1 text-[10px] text-neutral-950">{ticketCount}</span></Link>
  </>;
};