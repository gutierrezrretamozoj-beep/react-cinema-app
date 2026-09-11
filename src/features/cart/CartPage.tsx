import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowLeft, Minus, Plus, ShoppingCart, Trash2, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/shared/context/AuthContext';
import { cinemaApi } from '@/shared/api/cinemaApi';
import type { Cart } from '@/shared/api/cinemaApi';

const money = (value: number) => `$${value.toFixed(2)}`;
const GUEST_CART_OWNER = 'guest';

export const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const cartOwner = user?.email ?? GUEST_CART_OWNER;
  const [cart, setCart] = useState<Cart | null>(null);
  const [message, setMessage] = useState('');
  const [code, setCode] = useState('');
  const [expired, setExpired] = useState(false);

  const [loading, setLoading] = useState(true);

  // Carga el carrito del usuario o de la sesión invitada al entrar a la pantalla.
  useEffect(() => {
    cinemaApi.getCart(cartOwner).then((value) => {
      setCart(value);
      setExpired(Boolean(value && new Date(value.expiresAt).getTime() <= Date.now()));
      setLoading(false);
    });
  }, [cartOwner]);

  // Calculo de totales desde los items actuales para evitar valores desactualizados
  const subtotal = cart?.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) ?? 0;
  const discount = (cart?.membershipDiscount ?? 0) + (cart?.giftCardDiscount ?? 0);
  const tax = Math.max(0, subtotal - discount) * 0.19;
  const total = Math.max(0, subtotal - discount + tax);

  // Todas las modificaciones se guardan en la API y actualizan la vista con su respuesta.
  const save = async (next: Cart) => setCart(await cinemaApi.updateCart(next));
  const changeQuantity = async (id: string, delta: number) => {
    if (!cart) return;
    const items = cart.items.map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter((item) => item.quantity > 0);
    await save({ ...cart, items });
  };
  const removeItem = async (id: string) => {
    if (!cart) return;
    await save({ ...cart, items: cart.items.filter((item) => item.id !== id) });
  };
  // El tipo de código decide cuál de las integraciones de descuentos se invoca.
  const applyCode = async (kind: 'membership' | 'giftcard') => {
    if (!cart || !code.trim()) return;
    const updated = kind === 'membership' ? await cinemaApi.applyMembership(cart, code) : await cinemaApi.applyGiftcard(cart, code);
    setCart(updated);
    setMessage(updated.membershipDiscount || updated.giftCardDiscount ? 'Descuento aplicado.' : 'Código no válido.');
    setCode('');
  };

  // Mientras carga el carrito mostramos un indicador para no confundir al usuario con pantalla negra
  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-6 py-20 text-center text-neutral-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent" />
        <p className="text-sm text-neutral-400">Cargando tu carrito...</p>
      </div>
    );
  }

  // Si el carrito esta vacio o no existe, mostramos una pantalla amigable con colores explicitos
  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center text-neutral-100">
        <ShoppingCart className="mx-auto h-12 w-12 text-neutral-600" />
        <h1 className="mt-4 text-2xl font-bold text-neutral-100">Tu carrito esta vacio</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Aun no has agregado entradas ni productos. Visita la cartelera para elegir una funcion.
        </p>
        <button
          onClick={() => navigate('/home')}
          className="mt-6 rounded-xl bg-yellow-500 px-5 py-3 text-sm font-bold text-neutral-950 hover:bg-yellow-400 transition"
        >
          Ver cartelera
        </button>
      </div>
    );
  }

  // La pantalla permite revisar, modificar y confirmar el pedido sin duplicar la lógica de precios.
  return <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
    <button onClick={() => navigate(`/movies/${cart.movieId}/seats?time=${encodeURIComponent(cart.time)}`)} className="mb-6 flex items-center gap-2 text-sm text-neutral-400 hover:text-yellow-400"><ArrowLeft className="h-4 w-4" /> Editar asientos</button>
    <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-500">Revisión de compra</p><h1 className="mt-2 text-3xl font-black">Tu carrito</h1><p className="mt-2 text-sm text-neutral-400">{cart.movieTitle} · {cart.date} · {cart.time}</p></div>
    {expired && <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"><AlertTriangle className="h-5 w-5" />El tiempo de reserva terminó. Vuelve al mapa para elegir nuevos asientos.</div>}
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider"><Ticket className="h-4 w-4 text-yellow-500" /> Entradas y confitería</h2>
        <div className="space-y-3">{cart.items.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 border-b border-neutral-800 pb-3"><div><p className="text-sm font-semibold">{item.name}</p><p className="text-xs text-neutral-500">{money(item.unitPrice)} c/u</p></div><div className="flex items-center gap-2"><button onClick={() => changeQuantity(item.id, -1)} aria-label="Reducir cantidad" className="rounded-md border border-neutral-700 p-1 text-neutral-300"><Minus className="h-3 w-3" /></button><span className="w-5 text-center text-sm">{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} aria-label="Aumentar cantidad" className="rounded-md border border-neutral-700 p-1 text-neutral-300"><Plus className="h-3 w-3" /></button><button onClick={() => removeItem(item.id)} aria-label="Eliminar producto" className="ml-2 text-red-400"><Trash2 className="h-4 w-4" /></button></div></div>)}</div>
        <div className="mt-6 flex flex-wrap gap-2"><input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Código de descuento" className="min-w-0 flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm" /><button onClick={() => applyCode('membership')} className="rounded-lg border border-yellow-500/40 px-3 py-2 text-xs font-bold text-yellow-400">Membresía</button><button onClick={() => applyCode('giftcard')} className="rounded-lg border border-emerald-500/40 px-3 py-2 text-xs font-bold text-emerald-400">Gift card</button></div>
        {message && <p className="mt-3 text-xs text-neutral-400">{message} Prueba `NOVA10` o `REGALO25`.</p>}
      </section>
      <aside className="h-fit rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5"><h2 className="text-sm font-bold uppercase tracking-wider">Resumen de pago</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between text-neutral-400"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="flex justify-between text-emerald-400"><span>Descuentos</span><span>-{money(discount)}</span></div><div className="flex justify-between text-neutral-400"><span>Impuestos (19%)</span><span>{money(tax)}</span></div><div className="flex justify-between border-t border-neutral-800 pt-4 text-lg font-bold"><span>Total</span><span className="text-yellow-400">{money(total)}</span></div></div><p className="mt-5 text-xs text-neutral-500">Reserva activa hasta {new Date(cart.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.</p><button disabled={expired} onClick={() => navigate(`/movies/${cart.movieId}/seats?time=${encodeURIComponent(cart.time)}`)} className="mt-5 w-full rounded-xl bg-yellow-500 py-3 text-sm font-bold text-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-500">Continuar a la selección de asientos</button></aside>
    </div>
  </main>;
};