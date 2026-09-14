// ConfectioneryPage.tsx — Catalogo interactivo de confiteria y dulceria para CineApp
// Diseno moderno, dinamico y responsive con animaciones fluidas y cuenta unificada con asientos
// Se han eliminado todos los emojis de los comentarios conforme a la solicitud

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Sparkles,
  Film,
  X,
  Tag,
} from "lucide-react";
import { loadConcessions, removeSnack, updateSnack, addSnack } from "./services";
import type { CartSnack, Snack, SnackCategory } from "./types";

// Funcion para formatear valores monetarios en dolares con dos decimales
const formatMoney = (value: number): string => `$${value.toFixed(2)}`;

// Interfaz para definir la estructura de la reserva de pelicula activa
interface ActiveCinemaBooking {
  movieId: string;
  movieTitle?: string;
  selectedSeatIds: string[];
  selectedDate: string;
  selectedTheater: string;
  selectedFormat: string;
  selectedLanguage: string;
  selectedTime: string;
  ticketCode: string;
  timeLeft?: number;
}

export const ConfectioneryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Recupera la reserva activa desde location.state o sessionStorage para persistencia
  const [activeBooking] = useState<ActiveCinemaBooking | null>(() => {
    const stateBooking = (location.state as { booking?: ActiveCinemaBooking })?.booking;
    if (stateBooking) return stateBooking;
    try {
      const saved = sessionStorage.getItem("cinema_active_booking");
      return saved ? (JSON.parse(saved) as ActiveCinemaBooking) : null;
    } catch {
      return null;
    }
  });

  // Estados del catalogo de confiteria
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [categories, setCategories] = useState<SnackCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Inicializacion del carrito de snacks desde sessionStorage para persistencia
  const [cart, setCart] = useState<CartSnack[]>(() => {
    try {
      const saved = sessionStorage.getItem("cinema_active_snacks");
      return saved ? (JSON.parse(saved) as CartSnack[]) : [];
    } catch {
      return [];
    }
  });

  // Carga inicial del catalogo de snacks
  useEffect(() => {
    let isMounted = true;
    loadConcessions().then(({ snacks: loadedSnacks, categories: loadedCategories }) => {
      if (isMounted) {
        setSnacks(loadedSnacks);
        setCategories(loadedCategories);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sincroniza el carrito en sessionStorage ante cualquier modificacion
  useEffect(() => {
    sessionStorage.setItem("cinema_active_snacks", JSON.stringify(cart));
  }, [cart]);

  // Filtrado reactivo de productos por categoria y texto de busqueda
  const filteredSnacks = useMemo(() => {
    return snacks.filter((snack) => {
      const matchesCategory =
        activeCategory === "all" || snack.categoryId === activeCategory;
      const searchContent = `${snack.name} ${snack.description}`.toLowerCase();
      const matchesQuery = searchContent.includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, snacks]);

  // Calculo del monto total de confiteria
  const snacksTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  // Cantidad total de productos agregados al carrito
  const totalItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Modifica la cantidad de un producto en el carrito
  const handleQuantityChange = (snack: Snack, delta: number) => {
    const existing = cart.find((item) => item.id === snack.id);
    const currentQty = existing ? existing.quantity : 0;
    const nextQty = currentQty + delta;

    if (nextQty <= 0) {
      setCart((current) => current.filter((item) => item.id !== snack.id));
      void removeSnack(snack.id);
      return;
    }

    const updatedItem: CartSnack = { ...snack, quantity: nextQty };
    if (existing) {
      setCart((current) =>
        current.map((item) => (item.id === snack.id ? updatedItem : item))
      );
      void updateSnack(updatedItem);
    } else {
      setCart((current) => [...current, updatedItem]);
      void addSnack(snack, nextQty);
    }
  };

  // Elimina un producto por completo del carrito
  const handleRemoveItem = (snackId: string) => {
    setCart((current) => current.filter((item) => item.id !== snackId));
    void removeSnack(snackId);
  };

  // Limpia todo el carrito de snacks
  const handleClearCart = () => {
    setCart([]);
    sessionStorage.removeItem("cinema_active_snacks");
  };

  // Navegacion hacia atras: regresa al paso de asientos si hay reserva o historial previo
  const handleBackNavigation = () => {
    if (activeBooking && activeBooking.movieId) {
      navigate(`/movies/${activeBooking.movieId}/seats?step=2`);
    } else {
      navigate(-1);
    }
  };

  // Navegacion directa al pago simulado con cuenta consolidada
  const handleProceedToPayment = () => {
    sessionStorage.setItem("cinema_active_snacks", JSON.stringify(cart));

    if (activeBooking && activeBooking.movieId) {
      navigate(`/movies/${activeBooking.movieId}/seats?step=4`, {
        state: {
          fromConcessions: true,
          concessionsCart: cart,
          booking: activeBooking,
        },
      });
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-yellow-500/30 selection:text-yellow-200">
      {/* Fondo decorativo con gradientes suaves */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />
        <div className="absolute top-1/2 right-10 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Barra superior de navegacion */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-850 pb-6">
          <button
            onClick={handleBackNavigation}
            className="group inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-2 text-xs font-semibold text-neutral-300 backdrop-blur-md transition hover:border-yellow-500/40 hover:bg-neutral-800 hover:text-yellow-400 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>
              {activeBooking ? "Volver a Seleccion de Asientos" : "Volver"}
            </span>
          </button>

          {/* Contador de productos flotante para moviles */}
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <ShoppingBag className="h-4 w-4 text-yellow-400" />
            <span>
              {totalItemsCount} {totalItemsCount === 1 ? "articulo" : "articulos"} seleccionados
            </span>
          </div>
        </div>

        {/* Tarjeta de reserva activa de pelicula */}
        {activeBooking && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 via-neutral-900/80 to-neutral-900/60 p-5 backdrop-blur-md shadow-xl shadow-yellow-500/5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  <Film className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-yellow-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-yellow-400">
                      Reserva en Curso
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Paso 3 de 5: Confiteria
                    </span>
                  </div>
                  <h2 className="mt-1 text-base font-bold text-neutral-100">
                    {activeBooking.movieTitle || "Pelicula Seleccionada"}
                  </h2>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {activeBooking.selectedTheater} · {activeBooking.selectedDate} ({activeBooking.selectedTime}) · Sala {activeBooking.selectedFormat}
                  </p>
                  <p className="mt-1 text-xs text-neutral-300">
                    Asientos reservados:{" "}
                    <span className="font-mono font-bold text-yellow-400">
                      {activeBooking.selectedSeatIds.join(", ")}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center">
                <button
                  onClick={() => navigate(`/movies/${activeBooking.movieId}/seats?step=2`)}
                  className="rounded-xl border border-neutral-700 bg-neutral-850 px-3 py-2 text-xs font-semibold text-neutral-300 transition hover:border-yellow-500/40 hover:text-yellow-400 cursor-pointer"
                >
                  Cambiar Asientos
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Encabezado visual principal de la dulceria */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-yellow-400">
              <Sparkles className="h-3 w-3" />
              Barra de Snacks y Dulceria Gourmet
            </span>
            <h1 className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-neutral-100 sm:text-5xl">
              El complemento perfecto <br />
              <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                para tu funcion de cine
              </span>
            </h1>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-neutral-400 sm:text-sm">
            Selecciona tus crispetas, gaseosas y golosinas favoritas. Se consolidaran en una sola cuenta junto a tus boletos.
          </p>
        </div>

        {/* Contenido principal en dos columnas: catalogo y carrito sticky */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <main>
            {/* Barra interactiva de categorias y buscador */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Selector horizontal de categorias */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => {
                  const isSelected = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? "bg-yellow-500 text-neutral-950 shadow-md shadow-yellow-500/15"
                          : "border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Input con lupa de busqueda en tiempo real */}
              <div className="relative min-w-[240px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar snack, combo, bebida..."
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/70 py-2 pl-9 pr-8 text-xs text-neutral-100 outline-none transition placeholder:text-neutral-500 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Rejilla de tarjetas de productos */}
            {loading ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800/80 bg-neutral-900/30 p-12 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent" />
                <p className="text-xs text-neutral-400">Cargando catalogo de dulceria...</p>
              </div>
            ) : filteredSnacks.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/20 p-12 text-center">
                <Search className="h-10 w-10 text-neutral-600" />
                <h3 className="text-sm font-bold text-neutral-200">No encontramos productos</h3>
                <p className="text-xs text-neutral-500">
                  No hay snacks que coincidan con &quot;{query}&quot;. Intenta con otra palabra.
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setActiveCategory("all");
                  }}
                  className="mt-2 rounded-xl bg-neutral-800 px-4 py-2 text-xs font-semibold text-yellow-400 hover:bg-neutral-700 transition"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredSnacks.map((snack) => {
                  const cartItem = cart.find((item) => item.id === snack.id);
                  const inCartQty = cartItem ? cartItem.quantity : 0;

                  return (
                    <motion.article
                      key={snack.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 ${
                        inCartQty > 0
                          ? "border-yellow-500/40 bg-neutral-900/90 shadow-lg shadow-yellow-500/5"
                          : "border-neutral-800/80 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900/80"
                      } ${!snack.available ? "opacity-60" : ""}`}
                    >
                      {/* Imagen con banner de promocion */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-800">
                        <img
                          src={snack.image}
                          alt={snack.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-black/20" />

                        {/* Distintivo de promocion */}
                        {snack.promotion && (
                          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-lg bg-yellow-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-950 shadow-md">
                            <Tag className="h-3 w-3" />
                            {snack.promotion}
                          </div>
                        )}

                        {/* Mensaje de no disponible */}
                        {!snack.available && (
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/80 backdrop-blur-xs">
                            <span className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
                              Agotado temporalmente
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Informacion del producto */}
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-sans text-sm font-bold text-neutral-100 group-hover:text-yellow-400 transition-colors">
                              {snack.name}
                            </h3>
                            <span className="font-mono text-sm font-black text-yellow-400 shrink-0">
                              {formatMoney(snack.price)}
                            </span>
                          </div>
                          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-400">
                            {snack.description}
                          </p>
                        </div>

                        {/* Boton o control de cantidad */}
                        <div className="mt-5 pt-3 border-t border-neutral-800/60">
                          {snack.available ? (
                            inCartQty === 0 ? (
                              <button
                                onClick={() => handleQuantityChange(snack, 1)}
                                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-850 py-2.5 text-xs font-bold text-neutral-200 transition hover:border-yellow-500/50 hover:bg-yellow-500 hover:text-neutral-950 cursor-pointer active:scale-95"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Agregar al Carrito</span>
                              </button>
                            ) : (
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-semibold text-yellow-400">
                                  En tu orden:
                                </span>
                                <div className="flex items-center rounded-xl border border-yellow-500/40 bg-neutral-950/80 p-1">
                                  <button
                                    onClick={() => handleQuantityChange(snack, -1)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-800 hover:text-white cursor-pointer active:scale-90"
                                    aria-label="Disminuir"
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <span className="min-w-[28px] text-center font-mono text-xs font-bold text-neutral-100">
                                    {inCartQty}
                                  </span>
                                  <button
                                    onClick={() => handleQuantityChange(snack, 1)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-500 text-neutral-950 transition hover:bg-yellow-400 cursor-pointer active:scale-90"
                                    aria-label="Aumentar"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            )
                          ) : (
                            <div className="text-center py-1 text-[10px] font-semibold text-neutral-500">
                              No disponible en esta sala
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </main>

          {/* Panel lateral del Carrito (Sticky) */}
          <aside className="lg:sticky lg:top-20 h-fit">
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-md shadow-2xl shadow-black/40">
              {/* Cabecera del carrito */}
              <div className="flex items-center justify-between border-b border-neutral-800 p-5 bg-neutral-900/90">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-100">Tu Pedido</h3>
                    <p className="text-[10px] text-neutral-400">Confiteria CineApp</p>
                  </div>
                </div>

                {totalItemsCount > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-[11px] text-neutral-500 hover:text-red-400 transition cursor-pointer"
                  >
                    Vaciar
                  </button>
                )}
              </div>

              {/* Lista de productos seleccionados */}
              {cart.length > 0 ? (
                <div className="p-5">
                  <div className="max-h-72 space-y-3.5 overflow-y-auto pr-1 scrollbar-thin">
                    <AnimatePresence>
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex items-center gap-3 rounded-xl border border-neutral-800/70 bg-neutral-950/40 p-2.5 transition hover:border-neutral-700"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="truncate text-xs font-bold text-neutral-200">
                                {item.name}
                              </h4>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-neutral-500 hover:text-red-400 transition cursor-pointer p-0.5"
                                aria-label="Eliminar"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <div className="mt-1.5 flex items-center justify-between">
                              <span className="font-mono text-xs font-semibold text-yellow-400">
                                {formatMoney(item.price * item.quantity)}
                              </span>

                              {/* Mini selector de cantidad */}
                              <div className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-1.5 py-0.5">
                                <button
                                  onClick={() => handleQuantityChange(item, -1)}
                                  className="text-neutral-400 hover:text-white"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="min-w-[16px] text-center font-mono text-[11px] font-bold">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item, 1)}
                                  className="text-neutral-400 hover:text-white"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Resumen de totales */}
                  <div className="mt-5 space-y-2 border-t border-neutral-800 pt-4 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal Dulceria ({totalItemsCount} items):</span>
                      <span className="font-mono text-neutral-200">
                        {formatMoney(snacksTotal)}
                      </span>
                    </div>

                    {/* Informacion de boletos vinculados si viene de compra */}
                    {activeBooking && (
                      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 space-y-1 mt-3">
                        <div className="flex justify-between text-[11px] text-neutral-300">
                          <span>Boletos ({activeBooking.selectedSeatIds.length} sillas):</span>
                          <span className="font-semibold text-yellow-400">Incluidos</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 leading-tight">
                          Tus entradas y la dulceria se unifican en un unico pago.
                        </p>
                      </div>
                    )}

                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-sm font-bold">
                      <span className="text-neutral-200">Total Confiteria:</span>
                      <span className="font-mono text-base text-yellow-400">
                        {formatMoney(snacksTotal)}
                      </span>
                    </div>

                    {/* Boton de accion para avanzar al pago simulado */}
                    <button
                      onClick={handleProceedToPayment}
                      className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-yellow-500 py-3.5 text-xs font-extrabold uppercase tracking-wider text-neutral-950 shadow-lg shadow-yellow-500/15 transition hover:bg-yellow-400 active:scale-95 cursor-pointer"
                    >
                      <span>
                        {activeBooking
                          ? "Ir a Pagar (Boletos + Snacks)"
                          : "Continuar con la compra"}
                      </span>
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800/60 text-neutral-600">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-300">Tu carrito esta vacio</h4>
                  <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                    Agrega crispetas, gaseosas o combos para disfrutarlos durante tu funcion.
                  </p>

                  {/* Accion rapida para avanzar si el usuario solo quiere boletos sin comida */}
                  {activeBooking && (
                    <div className="mt-6 border-t border-neutral-800/80 pt-4">
                      <p className="text-[11px] text-neutral-400 mb-2.5">
                        Prefieres no llevar confiteria a la sala?
                      </p>
                      <button
                        onClick={handleProceedToPayment}
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-850 py-2.5 text-xs font-bold text-neutral-200 transition hover:border-yellow-500/40 hover:text-yellow-400 cursor-pointer"
                      >
                        Continuar a Pagar (Solo Boletos)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};