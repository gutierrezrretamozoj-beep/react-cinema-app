// ConfectioneryPage.tsx — Catálogo interactivo de Confitería y Dulcería Dexus Cinema
// Diseño inmersivo full-width alineado con el sistema de diseño Dexus Midnight

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  X,
  Tag,
  Sparkles,
  Check,
} from "lucide-react";
import { loadConcessions } from "./services";
import type { CartSnack, Snack, SnackCategory } from "./types";

// Formateador de moneda estándar
const formatMoney = (value: number): string => `$${value.toFixed(2)}`;

export const ConfectioneryPage = () => {
  // Estados del catálogo
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [categories, setCategories] = useState<SnackCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Carrito local de confitería persistido en sessionStorage
  // TODO [Rama feature/checkout-and-cart-flow]: Unificar persistencia con CartContext (cinemaApi / backend) y vincular con pago de boletos.
  const [cart, setCart] = useState<CartSnack[]>(() => {
    try {
      const saved = sessionStorage.getItem("cinema_active_snacks");
      return saved ? (JSON.parse(saved) as CartSnack[]) : [];
    } catch {
      return [];
    }
  });

  // Carga inicial del catálogo
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

  // Sincroniza el carrito local
  useEffect(() => {
    sessionStorage.setItem("cinema_active_snacks", JSON.stringify(cart));
  }, [cart]);

  // Autocierre de toast notification
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Manejador de cantidad de productos
  const handleQuantityChange = (snack: Snack, delta: number) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === snack.id);
      if (!existing && delta > 0) {
        setToastMessage(`¡${snack.name} agregado a tu orden!`);
        return [...current, { ...snack, quantity: delta }];
      }

      return current
        .map((item) => {
          if (item.id === snack.id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartSnack[];
    });
  };

  // Filtrado reactivo de productos
  const filteredSnacks = useMemo(() => {
    return snacks.filter((snack) => {
      const matchesCategory =
        activeCategory === "all" || snack.categoryId === activeCategory;
      const searchContent = `${snack.name} ${snack.description}`.toLowerCase();
      const matchesQuery = searchContent.includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [snacks, activeCategory, query]);

  // Métricas del carrito
  const totalItemsCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );
  const snacksTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  return (
    <div className="w-full min-h-screen bg-transparent text-cinema-text">
      {/* Contenedor principal alineado con las demás vistas (w-[90%] max-w-450) */}
      <div className="mx-auto max-w-450 w-[90%] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
        
        {/* Encabezado visual Dexus Cinema */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cinema-turquoise animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-cinema-turquoise font-mono">
              Dexus Candy & Snack Bar
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3.5xl font-normal text-cinema-text tracking-wider uppercase font-monument">
                Confitería y Dulcería
              </h1>
              <p className="mt-1 text-xs text-cinema-muted max-w-2xl">
                Crispetas recién preparadas con mantequilla dorada, combos familiares, nachos con queso caliente y bebidas frías para acompañar tu experiencia cinematográfica.
              </p>
            </div>

            {/* Resumen rápido de selección si hay productos */}
            {totalItemsCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 px-4 py-2 rounded-xl border border-cinema-turquoise/30 bg-cinema-surface/80 backdrop-blur-md shadow-lg"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cinema-turquoise/15 text-cinema-turquoise">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-cinema-muted">
                    {totalItemsCount} {totalItemsCount === 1 ? "snack" : "snacks"} seleccionados
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-cinema-turquoise">
                    {formatMoney(snacksTotal)}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Barra de Filtros por Categoría y Buscador */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2 border-b border-cinema-border">
          {/* Categorías en formato píldora */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                    isSelected
                      ? "bg-cinema-primary text-white border border-cinema-primary shadow-[0_0_15px_rgba(24,62,188,0.4)] font-bold"
                      : "border border-white/10 bg-white/4 text-cinema-muted hover:border-cinema-turquoise/40 hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Buscador con lupa */}
          <div className="relative min-w-[260px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cinema-dim" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar snack, combo, bebida..."
              className="w-full rounded-xl border border-white/10 bg-white/4 py-2 pl-9.5 pr-8 text-xs text-cinema-text outline-none transition placeholder:text-cinema-dim focus:border-cinema-turquoise/50 focus:bg-white/8"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cinema-dim hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Grilla Completa de Productos (Full-Width Responsive) */}
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-cinema-surface/40 p-12 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cinema-turquoise border-t-transparent" />
            <p className="text-xs text-cinema-muted font-mono">Cargando menú de dulcería...</p>
          </div>
        ) : filteredSnacks.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-cinema-surface/30 p-12 text-center">
            <Search className="h-10 w-10 text-cinema-dim" />
            <h3 className="text-sm font-bold text-cinema-text font-monument">No encontramos productos</h3>
            <p className="text-xs text-cinema-muted">
              No hay snacks que coincidan con &quot;{query}&quot;. Intenta con otra palabra.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setActiveCategory("all");
              }}
              className="mt-2 rounded-xl bg-cinema-primary px-4 py-2 text-xs font-semibold text-white hover:bg-cinema-primary-hover transition cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSnacks.map((snack) => {
              const cartItem = cart.find((item) => item.id === snack.id);
              const inCartQty = cartItem ? cartItem.quantity : 0;

              return (
                <motion.article
                  key={snack.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 bg-cinema-surface/75 backdrop-blur-md hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 ${
                    inCartQty > 0
                      ? "border-cinema-turquoise/40 shadow-lg shadow-cinema-primary/10"
                      : "border-white/10 hover:border-cinema-turquoise/40"
                  } ${!snack.available ? "opacity-60" : ""}`}
                >
                  {/* Foto del snack */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                    <img
                      src={snack.image}
                      alt={snack.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-black/20" />

                    {/* Badge de promoción */}
                    {snack.promotion && (
                      <div className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-cinema-primary/80 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold font-mono uppercase tracking-wider text-white border border-white/20 shadow-md">
                        <Tag className="h-3 w-3 text-cinema-turquoise" />
                        {snack.promotion}
                      </div>
                    )}

                    {/* Badge de no disponible */}
                    {!snack.available && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-xs">
                        <span className="rounded-lg border border-white/20 bg-neutral-900/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
                          Agotado temporalmente
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Información del producto */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-sans text-sm font-bold text-white group-hover:text-cinema-turquoise transition-colors leading-snug">
                          {snack.name}
                        </h3>
                        <span className="font-mono text-sm font-bold text-cinema-turquoise shrink-0">
                          {formatMoney(snack.price)}
                        </span>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-cinema-muted">
                        {snack.description}
                      </p>
                    </div>

                    {/* Controles de Compra */}
                    <div className="mt-5 pt-3 border-t border-white/10">
                      {snack.available ? (
                        inCartQty === 0 ? (
                          <button
                            onClick={() => handleQuantityChange(snack, 1)}
                            className="w-full flex items-center justify-center gap-2 rounded-xl border border-cinema-turquoise/30 bg-cinema-primary/20 py-2.5 text-xs font-bold text-cinema-turquoise transition hover:bg-cinema-primary hover:text-white hover:border-cinema-primary active:scale-95 cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Agregar al Pedido</span>
                          </button>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-mono text-cinema-turquoise">
                              En tu orden:
                            </span>
                            <div className="flex items-center rounded-xl border border-cinema-turquoise/40 bg-black/50 p-1">
                              <button
                                onClick={() => handleQuantityChange(snack, -1)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-cinema-muted transition hover:bg-white/10 hover:text-white cursor-pointer active:scale-90"
                                aria-label="Disminuir"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-[28px] text-center font-mono text-xs font-bold text-white">
                                {inCartQty}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(snack, 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-cinema-primary text-white transition hover:bg-cinema-primary-hover cursor-pointer active:scale-90"
                                aria-label="Aumentar"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="text-center py-1 text-[10px] font-semibold text-cinema-dim">
                          No disponible
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

      </div>

      {/* Toast Notification Flotante al agregar items */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border border-cinema-turquoise/40 bg-neutral-950/95 backdrop-blur-xl shadow-2xl text-xs text-white"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cinema-turquoise/20 text-cinema-turquoise">
              <Check className="h-3 w-3" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};