// SeatSelectionPage.tsx — Contenedor inteligente del Checkout Stepper
// Maneja el estado consolidado de la compra y renderiza los componentes de cada paso.
// Integrado con cinemaApi (json-server con fallback), temporizador global y alerta blocker Swal-like.

import { useState, useCallback, useEffect } from 'react';
// Importamos hooks de React Router incluyendo useLocation para detectar navegación desde confitería
import { useParams, useSearchParams, useNavigate, useBlocker, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, AlertTriangle } from 'lucide-react';
import { MOVIES } from '../auth/pages/Home/data/movieData';
import { generateSeats } from './data/seatData';
import type { SeatData } from './data/seatData';
import { useAuth } from '@/shared/context/AuthContext';
import { useCart } from '@/features/cart/CartContext';
import { cinemaApi } from '@/shared/api/cinemaApi';
import type { Cart, CinemaFunction, PaymentMethod } from '@/shared/api/cinemaApi';

// Importación de componentes de pasos
import { StepShowtime } from './components/steps/StepShowtime';
import { StepSeats } from './components/steps/StepSeats';
import { StepSnacks } from './components/steps/StepSnacks';
import { StepPayment } from './components/steps/StepPayment';
import { StepConfirmation } from './components/steps/StepConfirmation';

const STEPPER_LABELS = [
  { n: 1, l: 'Horario' },
  { n: 2, l: 'Asientos' },
  { n: 3, l: 'Confitería' },
  { n: 4, l: 'Pago' },
  { n: 5, l: 'Boleto' }
];

export const SeatSelectionPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Hook de navegación para recibir estado transferido desde otras pantallas
  const location = useLocation();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const cartOwner = user?.email ?? 'guest';

  const queryTime = searchParams.get('time') ?? '';
  const movie = MOVIES.find((m) => m.id === movieId);

  // ── Estados de Integración API Backend ──
  const [functionsList, setFunctionsList] = useState<CinemaFunction[]>([]);
  const [activeFunction, setActiveFunction] = useState<CinemaFunction | null>(null);

  // ── Detección de navegación desde Confitería ──
  // Verificamos si el usuario fue redirigido desde ConfectioneryPage tras elegir snacks
  const isFromConcessions = Boolean((location.state as { fromConcessions?: boolean })?.fromConcessions);

  // ── Carrito de Confitería consolidado ──
  // Almacena los snacks seleccionados en el catálogo completo para la cuenta unificada
  const [concessionsCart, setConcessionsCart] = useState<Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>>(() => {
    // 1. Revisamos si los snacks vienen en el estado de la navegación
    const stateCart = (location.state as { concessionsCart?: any })?.concessionsCart;
    if (stateCart && Array.isArray(stateCart)) return stateCart;
    // 2. Si no, recuperamos del sessionStorage persistido
    try {
      const saved = sessionStorage.getItem('cinema_active_snacks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ── Estados unificados del Stepper ──
  // Si se solicita por URL (?step=X) o viene de confitería, arrancamos directamente en el paso 4 (Pago)
  const requestedStep = Number(searchParams.get('step'));
  const initialStep = isFromConcessions
    ? 4
    : requestedStep >= 1 && requestedStep <= 5
    ? requestedStep
    : 1;
  const [step, setStep] = useState(initialStep);

  const [selectedDate, setSelectedDate] = useState('Hoy');
  const [selectedTheater, setSelectedTheater] = useState('Multicine Viva Barranquilla');
  const [selectedFormat, setSelectedFormat] = useState('4DX 2D');
  const [selectedLanguage, setSelectedLanguage] = useState<'Subtitulada' | 'Doblada'>('Doblada');
  const [selectedTime, setSelectedTime] = useState(queryTime);

  const [seats, setSeats] = useState<SeatData[]>(() => generateSeats({ movieId: movieId ?? '1' }));
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [snacks, setSnacks] = useState<Record<string, number>>({});
  const [payMethod, setPayMethod] = useState<PaymentMethod>('credit_card');
  const [ticketCode] = useState(() => 'CM-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [orderId, setOrderId] = useState<string | null>(null);

  // ── Temporizador Global de Reserva (10 minutos) ──
  const [timeLeft, setTimeLeft] = useState(600);
  const [timerExpired, setTimerExpired] = useState(false);

  // Efecto para sincronizar el paso si cambia el query param o el estado de navegación
  useEffect(() => {
    if (requestedStep >= 1 && requestedStep <= 5) {
      setStep(requestedStep);
    } else if (isFromConcessions) {
      setStep(4);
    }
  }, [requestedStep, isFromConcessions]);

  // Rehidratación de la reserva activa guardada previamente al salir a la confitería
  useEffect(() => {
    try {
      const savedStr = sessionStorage.getItem('cinema_active_booking');
      if (savedStr) {
        const saved = JSON.parse(savedStr);
        // Validamos que pertenezca a la misma película seleccionada
        if (saved.movieId === movieId) {
          if (saved.selectedSeatIds && saved.selectedSeatIds.length > 0) {
            setSelectedSeatIds(saved.selectedSeatIds);
          }
          if (saved.selectedDate) setSelectedDate(saved.selectedDate);
          if (saved.selectedTheater) setSelectedTheater(saved.selectedTheater);
          if (saved.selectedFormat) setSelectedFormat(saved.selectedFormat);
          if (saved.selectedLanguage) setSelectedLanguage(saved.selectedLanguage);
          if (saved.selectedTime) setSelectedTime(saved.selectedTime);
          if (saved.timeLeft && saved.timeLeft > 0) setTimeLeft(saved.timeLeft);
        }
      }
    } catch (err) {
      console.error('Error restaurando reserva desde sessionStorage:', err);
    }
  }, [movieId]);

  // Carga de funciones desde API / Mock Fallback
  useEffect(() => {
    let active = true;
    cinemaApi.getFunctions(movieId ?? '1').then((list) => {
      if (active) {
        setFunctionsList(list);
        // Empareja con queryTime si viene en la URL, o toma la primera
        const matched = list.find((f) => f.time === queryTime) ?? list[0] ?? null;
        if (matched) {
          setActiveFunction(matched);
          setSelectedTheater(matched.theater);
          setSelectedDate(matched.date);
          setSelectedTime(matched.time);
          setSelectedFormat(matched.format);
          setSelectedLanguage(matched.language);
        }
      }
    });
    return () => {
      active = false;
    };
  }, [movieId, queryTime]);

  // Manejador al seleccionar directamente una función (horario/sala) en StepShowtime
  const handleSelectFunction = (fn: CinemaFunction) => {
    setActiveFunction(fn);
    setSelectedTheater(fn.theater);
    setSelectedDate(fn.date);
    setSelectedTime(fn.time);
    setSelectedFormat(fn.format);
    setSelectedLanguage(fn.language);
    setSelectedSeatIds([]); // Limpia selección al cambiar de sala
  };

  // Regenera la grilla de asientos dinámicamente cuando cambia la función/sala activa
  useEffect(() => {
    if (!activeFunction) return;

    const newSeats = generateSeats({
      rows: activeFunction.rows,
      cols: activeFunction.cols,
      roomType: activeFunction.roomType,
      occupiedSeats: activeFunction.occupiedSeats,
      movieId: movieId ?? '1',
    });

    setSeats(
      newSeats.map((seat) => ({
        ...seat,
        status: activeFunction.occupiedSeats.includes(seat.id)
          ? 'occupied'
          : selectedSeatIds.includes(seat.id)
          ? 'selected'
          : 'available',
      }))
    );
  }, [activeFunction, selectedSeatIds, movieId]);

  // Resetear si cambia de película
  useEffect(() => {
    setSelectedSeatIds([]);
    setSnacks({});
    setTimeLeft(600);
    setTimerExpired(false);
  }, [movieId]);

  // Sincroniza query time si llega
  useEffect(() => {
    if (queryTime) setSelectedTime(queryTime);
  }, [queryTime]);

  // ── Lógica del Temporizador Global (Ticks cuando el usuario está en los Pasos 2, 3 o 4) ──
  useEffect(() => {
    if (step >= 2 && step <= 4 && !timerExpired) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimerExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timerExpired]);

  // ── Alerta de Salida Estética (useBlocker) ──
  // Excluimos la ruta /concessions para que el usuario pueda ir a elegir confitería sin que el blocker interrumpa
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return (
      selectedSeatIds.length > 0 &&
      step < 5 &&
      currentLocation.pathname !== nextLocation.pathname &&
      nextLocation.pathname !== '/concessions'
    );
  });

  // Alerta de confirmación antes de recargar la página o cerrar la pestaña
  useEffect(() => {
    if (selectedSeatIds.length === 0 || step === 5) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const msg = "Tienes asientos seleccionados. Si abandonas la página perderás tu selección.";
      e.preventDefault();
      e.returnValue = msg;
      return msg;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [selectedSeatIds, step]);

  const handleSeatToggle = useCallback((seat: SeatData) => {
    if (seat.status === 'occupied') return;
    setSelectedSeatIds((prev) => {
      if (prev.includes(seat.id)) {
        return prev.filter((id) => id !== seat.id);
      }
      if (prev.length >= 8) return prev;
      return [...prev, seat.id];
    });
  }, []);

  const handleSnackQtyChange = (id: string, qty: number) => {
    setSnacks((prev) => ({ ...prev, [id]: qty }));
  };

  // Cálculo de precios de entradas
  const ticketsTotal = seats
    .filter((s) => selectedSeatIds.includes(s.id))
    .reduce((acc, s) => acc + s.price, 0);

  // Total de confitería seleccionada en el paso interno del stepper (StepSnacks)
  const stepperSnacksTotal = Object.entries(snacks).reduce((acc, [id, qty]) => {
    const snackPrice = id.startsWith('pop') ? (id.endsWith('m') ? 6.50 : 8.00) :
                       id.startsWith('soda') ? (id.endsWith('m') ? 3.50 : 4.80) :
                       id === 'nachos' ? 5.50 : id === 'hotdog' ? 6.00 :
                       id === 'candy' ? 3.00 : 2.20;
    return acc + snackPrice * qty;
  }, 0);

  // Total de confitería seleccionada en el catálogo completo (ConfectioneryPage)
  const concessionsCartTotal = concessionsCart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Si existen productos en concessionsCart, se toman esos prioritariamente; de lo contrario, los del stepper básico
  const snacksTotal = concessionsCart.length > 0 ? concessionsCartTotal : stepperSnacksTotal;

  // Cuenta consolidada unificada: Entradas de cine + Confitería seleccionada
  const grandTotal = ticketsTotal + snacksTotal;

  // Navegación hacia la tienda de confitería guardando el estado completo de la reserva
  const handleGoToConcessions = () => {
    // 1. Empaquetamos los datos de la reserva actual
    const activeBooking = {
      movieId: movie?.id ?? movieId,
      movieTitle: movie?.title,
      selectedSeatIds,
      selectedDate,
      selectedTheater,
      selectedFormat,
      selectedLanguage,
      selectedTime,
      ticketCode,
      timeLeft,
    };
    // 2. Almacenamos en sessionStorage para que la dulcería conozca la reserva activa
    sessionStorage.setItem('cinema_active_booking', JSON.stringify(activeBooking));
    // 3. Sincronizamos con el backend los asientos seleccionados
    void createOrUpdateCart();
    // 4. Redirigimos a la página de confitería pasando el estado
    navigate('/concessions', {
      state: {
        fromSeatSelection: true,
        booking: activeBooking,
      },
    });
  };

  const getSnackPrice = (id: string) => id.startsWith('pop') ? (id.endsWith('m') ? 6.50 : 8.00) :
    id.startsWith('soda') ? (id.endsWith('m') ? 3.50 : 4.80) :
    id === 'nachos' ? 5.50 : id === 'hotdog' ? 6.00 : id === 'candy' ? 3.00 : 2.20;

  // Convierte la selección del stepper al contrato del carrito antes de ir a snacks o pago.
  const createOrUpdateCart = async () => {
    if (!activeFunction || selectedSeatIds.length === 0 || !movie) return;

    const ticketItems = seats
      .filter((seat) => selectedSeatIds.includes(seat.id))
      .map((seat) => ({
        id: `ticket-${seat.id}`,
        type: 'ticket' as const,
        name: `${seat.type === 'vip' ? 'VIP' : seat.type === 'accessible' ? 'Accesible' : 'General'} · ${seat.id}`,
        quantity: 1,
        unitPrice: seat.price,
        seatId: seat.id,
        movieId: movie.id,
        showtime: selectedTime,
      }));
    const concessionItems = Object.entries(snacks)
      .filter(([, quantity]) => quantity > 0)
      .map(([id, quantity]) => ({
        id,
        type: 'concession' as const,
        name: id,
        quantity,
        unitPrice: getSnackPrice(id),
      }));
    // Conserva descuentos previamente aplicados si el usuario vuelve a editar su selección.
    const currentCart = await cinemaApi.getCart(cartOwner);
    // Conserva tickets de otras películas; sólo reemplaza la selección pendiente de esta película.
    const otherMovieItems = (currentCart?.items ?? []).filter(
      (item) => item.type !== 'ticket' || item.movieId !== movie.id
    );
    const cart: Cart = {
      id: currentCart?.id ?? `cart-${Date.now()}`,
      userEmail: cartOwner,
      movieId: movie.id,
      functionId: activeFunction.id,
      movieTitle: movie.title,
      theater: selectedTheater,
      date: selectedDate,
      time: selectedTime,
      items: [...otherMovieItems, ...ticketItems, ...concessionItems],
      membershipDiscount: currentCart?.membershipDiscount ?? 0,
      giftCardDiscount: currentCart?.giftCardDiscount ?? 0,
      expiresAt: new Date(Date.now() + timeLeft * 1000).toISOString(),
    };
    if (currentCart) await cinemaApi.updateCart(cart);
    else await cinemaApi.createCart(cart);
  };

  // Rehidrata la selección cuando el usuario vuelve del resumen del carrito.
  useEffect(() => {
    if (requestedStep !== 4) return;
    cinemaApi.getCart(cartOwner).then((cart) => {
      if (!cart) return;
      setSelectedSeatIds(cart.items.filter((item) => item.type === 'ticket' && item.seatId).map((item) => item.seatId as string));
      setSnacks(Object.fromEntries(cart.items.filter((item) => item.type === 'concession').map((item) => [item.id, item.quantity])));
    });
  }, [requestedStep, cartOwner]);

  // Confirmar compra e integrar persistencia mediante cinemaApi
  const handlePaymentConfirm = async (paymentId: string) => {
    if (!activeFunction) return;

    try {
      const currentCart = await cinemaApi.getCart(cartOwner);
      if (!currentCart || currentCart.items.length === 0 || new Date(currentCart.expiresAt).getTime() <= Date.now()) {
        throw new Error('El carrito ya no está vigente.');
      }

      // 1. Bloqueamos asientos de forma persistente en backend o cache local
      await cinemaApi.updateOccupiedSeats(activeFunction.id, selectedSeatIds, 'lock');

      const order = await cinemaApi.createOrder({
        cartId: currentCart.id,
        userEmail: cartOwner,
        total: grandTotal,
        paymentId,
      });
      setOrderId(order.id);

      // 2. Registramos la reserva vinculando el correo del usuario activo para que sea privada
      await cinemaApi.createReservation({
        movieId: movieId ?? '1',
        userEmail: user?.email ?? cartOwner,
        date: selectedDate,
        time: selectedTime,
        seats: selectedSeatIds,
        format: selectedFormat,
        code: ticketCode,
        total: grandTotal,
      });

      await cinemaApi.deleteCart(currentCart);
      clearCart();

      // Limpiamos la reserva activa y los snacks de dulceria de sessionStorage al completar el pago exitoso
      sessionStorage.removeItem('cinema_active_booking');
      sessionStorage.removeItem('cinema_active_snacks');

      // 3. Avanzar al paso de confirmacion
      setStep(5);
    } catch (err) {
      console.error('Error al registrar pago en servidor:', err);
      // Limpiamos igualmente en caso de error para no dejar datos huerfanos
      sessionStorage.removeItem('cinema_active_booking');
      sessionStorage.removeItem('cinema_active_snacks');
      // Un error de orden no debe mostrar un boleto aprobado ni cerrar el carrito.
      setStep(4);
    }
  };

  const handleResetReserva = () => {
    // Al reiniciar la reserva, limpiamos los asientos, la dulcería y el temporizador
    sessionStorage.removeItem('cinema_active_booking');
    sessionStorage.removeItem('cinema_active_snacks');
    setConcessionsCart([]);
    setSelectedSeatIds([]);
    setSnacks({});
    setStep(1);
    setTimeLeft(600);
    setTimerExpired(false);
  };

  if (!movie) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center px-6">
        <h1 className="text-xl font-semibold text-neutral-100">Película no encontrada</h1>
        <button onClick={() => navigate('/home')} className="rounded-full border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:border-yellow-500/40 hover:text-yellow-400">
          Volver a Cartelera
        </button>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 md:px-8">
      
      {/* ── stepper visual ── */}
      {step < 5 && (
        <div className="flex items-center justify-between overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/45 p-4 backdrop-blur-md">
          {STEPPER_LABELS.map((s, idx) => (
            <div key={s.n} className="flex flex-1 items-center justify-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold border transition-all ${
                  step === s.n
                    ? 'bg-yellow-500 border-yellow-500 text-neutral-950 shadow-md shadow-yellow-500/10'
                    : step > s.n
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-600'
                }`}>
                  {step > s.n ? <Check className="h-3 w-3" /> : s.n}
                </div>
                <span className={`text-[8.5px] font-bold uppercase tracking-wider ${
                  step === s.n ? 'text-yellow-500' : step > s.n ? 'text-emerald-400' : 'text-neutral-500'
                }`}>
                  {s.l}
                </span>
              </div>
              {idx < STEPPER_LABELS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-4 min-w-5 transition-colors ${
                  step > s.n ? 'bg-emerald-500/30' : 'bg-neutral-800'
                }`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Barra del Temporizador Global ── */}
      {step >= 2 && step <= 4 && (
        <div className={`flex w-full items-center justify-between border rounded-2xl px-5 py-3.5 transition-all duration-300 backdrop-blur-md ${
          timeLeft < 120
            ? 'border-red-500/30 bg-red-500/5 text-red-400'
            : 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400'
        }`}>
          <div className="flex items-center gap-3">
            <Clock className={`h-5 w-5 ${timeLeft < 120 ? 'animate-pulse text-red-400' : 'text-yellow-400'}`} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-200">Tiempo de Reserva Activo</p>
              <p className="text-[11px] text-neutral-400 leading-none mt-1">Completa los datos de tu compra antes de que expire la reserva de tus asientos.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
      )}

      {/* ── Render del Paso Actual con Transición ── */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && (
              <StepShowtime
                movie={movie}
                functionsList={functionsList}
                activeFunction={activeFunction}
                onSelectFunction={handleSelectFunction}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTheater={selectedTheater}
                setSelectedTheater={setSelectedTheater}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <StepSeats
                movie={movie}
                seats={seats}
                activeFunction={activeFunction}
                selectedSeatIds={selectedSeatIds}
                onSeatToggle={handleSeatToggle}
                selectedDate={selectedDate}
                selectedTheater={selectedTheater}
                selectedTime={selectedTime}
                timeLeft={timeLeft}
                timerExpired={timerExpired}
                onNextSnacks={
                  // Conectamos el boton de agregar snacks directamente con el catalogo de confiteria
                  handleGoToConcessions
                }
                onNextPayment={() => { void createOrUpdateCart(); setStep(4); }}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <StepSnacks
                movie={movie}
                selectedSeatsCount={selectedSeatIds.length}
                ticketsTotal={ticketsTotal}
                snacks={snacks}
                onSnackQtyChange={handleSnackQtyChange}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onNext={() => { void createOrUpdateCart(); setStep(4); }}
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && (
              <StepPayment
                movie={movie}
                selectedSeatsCount={selectedSeatIds.length}
                selectedSeatsLabel={selectedSeatIds.join(', ')}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                ticketsTotal={ticketsTotal}
                snacksTotal={snacksTotal}
                grandTotal={grandTotal}
                payMethod={payMethod}
                setPayMethod={setPayMethod}
                onConfirm={handlePaymentConfirm}
                onBack={() => {
                  // Si el usuario agregó snacks de dulcería, al volver regresa a la tienda de confitería
                  if (concessionsCart.length > 0) {
                    navigate('/concessions');
                  } else {
                    setStep(selectedSeatIds.length > 0 ? 3 : 2);
                  }
                }}
                defaultCardholderName={user?.name || ''}
                concessionsItems={
                  // Pasamos los snacks del catálogo para desglosar la cuenta unificada en el ticket
                  concessionsCart
                }
              />
            )}
            {step === 5 && (
              <StepConfirmation
                movie={movie}
                selectedSeatsLabel={selectedSeatIds.join(', ')}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                theater={selectedTheater}
                roomName={activeFunction?.roomName}
                language={selectedLanguage}
                ticketCode={orderId ?? ticketCode}
                totalPrice={grandTotal}
                creditsEarned={Math.round(ticketsTotal * 10)}
                onGoHome={() => navigate('/home')}
                onGoToTickets={() => navigate('/tickets')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Modal / Overlay de Tiempo Expirado ── */}
      <AnimatePresence>
        {timerExpired && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-[90%] rounded-2xl border border-red-500/30 bg-neutral-950 p-6 text-center shadow-2xl"
            >
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500 animate-bounce mb-3" />
              <h3 className="text-lg font-bold text-neutral-100 uppercase tracking-wider">Tiempo Expirado</h3>
              <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                El tiempo reservado para realizar tu compra ha concluido. Para garantizar la disponibilidad del aforo de las salas, tu reserva ha sido cancelada.
              </p>
              <button
                onClick={handleResetReserva}
                className="mt-6 w-full rounded-xl bg-red-500 py-3 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-red-400 cursor-pointer"
              >
                Reiniciar Reserva
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal Estético Swal-like de Salida (framer-motion) ── */}
      <AnimatePresence>
        {blocker.state === 'blocked' && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-sm rounded-2xl border border-yellow-500/20 bg-neutral-950 p-6 text-center shadow-2xl shadow-yellow-500/5"
            >
              {/* Icono de advertencia premium */}
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-400">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <h3 className="text-base font-bold text-neutral-100 uppercase tracking-wider">¿Abandonar Reserva?</h3>
              <p className="mt-2 text-[11px] leading-relaxed text-neutral-400">
                Tienes asientos seleccionados en curso. Si sales ahora de esta pantalla, perderás tu selección de butacas de forma inmediata.
              </p>

              {/* Botones de acción del modal flotante */}
              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => blocker.reset()}
                  className="w-full rounded-xl bg-yellow-500 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-yellow-400 transition-all cursor-pointer active:scale-[0.98]"
                >
                  Continuar Compra
                </button>
                <button
                  onClick={() => blocker.proceed()}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:border-red-500/20 hover:text-red-400 transition-all cursor-pointer active:scale-[0.98]"
                >
                  Sí, salir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default SeatSelectionPage;
