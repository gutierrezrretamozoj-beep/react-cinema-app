// StepPayment.tsx — Paso 4 del Stepper: Método de Pago y Procesamiento
// Formulario interactivo, selección de método y pantalla de carga de procesamiento de pago seguro.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Shield, Check, Lock, Smartphone, Sparkles, Landmark, RotateCcw } from 'lucide-react';
import type { Movie } from '@/features/auth/pages/Home/data/movieData';
import { cinemaApi } from '@/shared/api/cinemaApi';
import type { PaymentMethod, PaymentStatus } from '@/shared/api/cinemaApi';
import { sfx } from '../../utils/soundEffects';

interface StepPaymentProps {
  movie: Movie;
  selectedSeatsCount: number;
  selectedSeatsLabel: string;
  selectedDate: string;
  selectedTime: string;
  ticketsTotal: number;
  snacksTotal: number;
  grandTotal: number;
  payMethod: PaymentMethod;
  setPayMethod: (method: PaymentMethod) => void;
  onConfirm: (paymentId: string) => void | Promise<void>;
  onBack: () => void;
  defaultCardholderName?: string;
  // NUEVO: Lista de snacks seleccionados en la tienda de confitería para desglosarlos individualmente en el recibo
  concessionsItems?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
}

export const StepPayment: React.FC<StepPaymentProps> = ({
  movie,
  selectedSeatsCount,
  selectedSeatsLabel,
  selectedDate,
  selectedTime,
  ticketsTotal,
  snacksTotal,
  grandTotal,
  payMethod,
  setPayMethod,
  onConfirm,
  onBack,
  defaultCardholderName = '',
  // NUEVO: Recibimos los items de confitería con valor por defecto array vacío
  concessionsItems = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholder, setCardholder] = useState(defaultCardholderName);
  const [redeemCredits, setRedeemCredits] = useState(false);

  // Descuento por canje de Nova Credits ($5.00)
  const creditsDiscount = redeemCredits ? Math.min(5.0, grandTotal) : 0;
  const finalAmount = Math.max(0, grandTotal - creditsDiscount);

  // Estados para simular el rasgado del boleto como en MovieCard
  const [isTearing, setIsTearing] = useState(false);
  const [isPeeling, setIsPeeling] = useState(false);

  const handlePayClick = async () => {
    if (!isFormValid()) return;
    setSubmitted(true);
    setLoading(true);
    setPaymentStatus('processing');
    setPaymentMessage('Validando la compra y conectando con la pasarela segura...');

    sfx.playStepTransition();
    setIsTearing(true);
    setIsPeeling(true);

    const payment = await cinemaApi.createPayment({
      cartId: `checkout-${movie.id}-${selectedTime}`,
      method: payMethod,
      amount: finalAmount,
    });
    let result = payment;
    if (payment.status === 'pending') {
      setPaymentMessage(payment.message ?? 'Esperando confirmación de tu banco...');
      await new Promise((resolve) => window.setTimeout(resolve, 800));
      result = await cinemaApi.getPaymentStatus(payment.id);
    }
    setLoading(false);
    setPaymentStatus(result.status);
    setPaymentMessage(result.message ?? (result.status === 'approved' ? 'Pago aprobado.' : 'No fue posible completar el pago.'));
    if (result.status === 'approved') await onConfirm(result.id);
  };

  const isFormValid = () => {
    if (payMethod !== 'credit_card' && payMethod !== 'debit_card') return true;
    return cardNumber.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvv.length === 3 && cardholder.trim().length > 0;
  };

  const handleRetry = () => {
    setSubmitted(false);
    setPaymentStatus(null);
    setPaymentMessage('');
    setIsTearing(false);
    setIsPeeling(false);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    if (value.length <= 16) setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    if (value.length <= 4) setExpiry(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) setCvv(value);
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch select-none">
      
      {/* Panel izquierdo: Métodos de pago y formularios */}
      <div className="flex-1 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md relative">
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl bg-neutral-950/85 backdrop-blur-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent" />
            <p className="mt-4 text-sm font-bold text-neutral-100 uppercase tracking-widest">Procesando pago seguro...</p>
            <p className="mt-1 text-[10px] text-neutral-400">Por favor, no refresques ni cierres esta pestaña</p>
          </div>
        )}

        <h2 className="text-lg font-bold text-neutral-100 uppercase tracking-wider mb-1">Método de Pago</h2>
        <p className="text-xs text-neutral-400 mb-6 flex items-center gap-1">
          <Shield className="h-3.5 w-3.5 text-emerald-500" /> Transacción encriptada de extremo a extremo
        </p>
        {paymentStatus && paymentStatus !== 'processing' && (
          <div className={`mb-5 rounded-xl border p-3 text-xs ${paymentStatus === 'approved' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : paymentStatus === 'pending' ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
            <p className="font-bold">{paymentStatus === 'approved' ? 'Pago aprobado' : paymentStatus === 'pending' ? 'Pago pendiente' : 'Pago rechazado'}</p>
            <p className="mt-1">{paymentMessage}</p>
            {paymentStatus === 'rejected' && <button onClick={handleRetry} className="mt-3 inline-flex items-center gap-2 font-bold text-red-200 hover:text-white"><RotateCcw className="h-3.5 w-3.5" /> Reintentar pago</button>}
          </div>
        )}

        {/* Métodos de Pago */}
        <div className="space-y-3">
          {[
            { id: 'credit_card' as const, label: 'Tarjeta de crédito', sub: 'Visa, MasterCard, Amex', icon: <CreditCard className="h-5 w-5 text-yellow-500" /> },
            { id: 'debit_card' as const, label: 'Tarjeta débito', sub: 'Paga con tu tarjeta débito', icon: <CreditCard className="h-5 w-5 text-yellow-500" /> },
            { id: 'pse' as const, label: 'PSE', sub: 'Serás dirigido a tu banco', icon: <Landmark className="h-5 w-5 text-yellow-500" /> },
            { id: 'nequi' as const, label: 'Nequi', sub: 'Aprueba desde tu aplicación', icon: <Smartphone className="h-5 w-5 text-yellow-500" /> },
            { id: 'daviplata' as const, label: 'Daviplata', sub: 'Aprueba desde tu aplicación', icon: <Smartphone className="h-5 w-5 text-yellow-500" /> },
          ].map((m) => (
            <div
              key={m.id}
              onClick={() => !submitted && setPayMethod(m.id)}
              className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                payMethod === m.id
                  ? 'border-yellow-500 bg-yellow-500/5 shadow-md shadow-yellow-500/5'
                  : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800">
                  {m.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-200">{m.label}</h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{m.sub}</p>
                </div>
              </div>

              <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                payMethod === m.id ? 'border-yellow-500 bg-yellow-500' : 'border-neutral-700'
              }`}>
                {payMethod === m.id && <Check className="h-3 w-3 text-neutral-950 font-bold" />}
              </div>
            </div>
          ))}
        </div>

        {/* Formulario de tarjeta */}
        {(payMethod === 'credit_card' || payMethod === 'debit_card') && (
          <div className="mt-6 border-t border-neutral-800/80 pt-6 space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5">Número de Tarjeta</label>
              <input
                type="text"
                placeholder="4000 1234 5678 9010"
                value={cardNumber}
                onChange={handleCardNumberChange}
                disabled={submitted}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-neutral-200 placeholder-neutral-600 focus:border-yellow-500/50 focus:outline-hidden"
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5">Expiración</label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  value={expiry}
                  onChange={handleExpiryChange}
                  disabled={submitted}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-neutral-200 placeholder-neutral-600 focus:border-yellow-500/50 focus:outline-hidden text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5">CVV</label>
                <input
                  type="password"
                  placeholder="•••"
                  value={cvv}
                  onChange={handleCvvChange}
                  disabled={submitted}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-neutral-200 placeholder-neutral-600 focus:border-yellow-500/50 focus:outline-hidden text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5">Nombre del Titular</label>
              <input
                type="text"
                placeholder="Como figura en la tarjeta"
                value={cardholder}
                onChange={(e) => setCardholder(e.target.value)}
                disabled={submitted}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-neutral-200 placeholder-neutral-600 focus:border-yellow-500/50 focus:outline-hidden"
              />
            </div>
          </div>
        )}
      </div>

      {/* Panel derecho: Resumen con notches y efecto de rasgado */}
      <div className="flex flex-col w-full lg:w-76 shrink-0 rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden backdrop-blur-md justify-between select-none relative h-full">
        
        {/* Cuerpo superior del tiquete: Detalles de la película y desglose de pago */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="relative h-32 w-full overflow-hidden rounded-xl border border-neutral-800 mb-4">
              <img
                src={movie.backdropUrl || movie.posterUrl}
                alt=""
                className="h-full w-full object-cover brightness-[0.55]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-neutral-900/90 to-transparent" />
              <div className="absolute inset-x-3 bottom-2">
                <span className="font-mono text-[8px] text-yellow-500 font-bold uppercase tracking-widest">Resumen</span>
                <h3 className="text-xs font-bold text-neutral-100 mt-0.5 line-clamp-1">{movie.title}</h3>
              </div>
            </div>

            <div className="space-y-2.5 text-[11px] text-neutral-400">
              <div className="flex justify-between">
                <span className="font-medium text-neutral-500">TEATRO</span>
                <span className="font-semibold text-neutral-200 truncate max-w-44">Multiplex Portal</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-neutral-500">FECHA Y HORA</span>
                <span className="font-semibold text-neutral-200">{selectedDate} · {selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-neutral-500">FORMATO</span>
                <span className="font-semibold text-neutral-200">{movie.formats?.[0] || 'IMAX'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-neutral-500">SALA</span>
                <span className="font-semibold text-neutral-200">Sala IMAX 3D</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-neutral-500">SILLAS ({selectedSeatsCount})</span>
                <span className="font-semibold text-yellow-400 truncate max-w-44">{selectedSeatsLabel}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-neutral-800/80 pt-4">
            <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-yellow-500">Desglose de Compra</h4>
            <div className="space-y-2 text-xs text-neutral-400 border-b border-neutral-850/60 pb-3">
              <div className="flex justify-between">
                <span>Entradas ({selectedSeatsCount})</span>
                <span className="text-neutral-200">${ticketsTotal.toFixed(2)}</span>
              </div>
              {/* Desglose unificado de confitería: Si viene de la tienda con items seleccionados, se listan uno a uno con sus subtotales */}
              {concessionsItems && concessionsItems.length > 0 ? (
                <div className="space-y-1.5 pt-1">
                  {/* Encabezado de confitería con cantidad total de productos e importe acumulado */}
                  <div className="flex justify-between font-semibold text-neutral-300">
                    <span>Confitería ({concessionsItems.reduce((acc, c) => acc + c.quantity, 0)} items)</span>
                    <span className="text-neutral-200">${snacksTotal.toFixed(2)}</span>
                  </div>
                  {/* Iteración de cada producto de dulcería adquirido */}
                  {concessionsItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-[11px] text-neutral-400 pl-2">
                      <span className="truncate max-w-47.5">• {item.name} × {item.quantity}</span>
                      <span className="font-mono text-neutral-300">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : snacksTotal > 0 ? (
                /* Fallback si los snacks vienen del stepper simple sin items desglosados */
                <div className="flex justify-between">
                  <span>Confitería</span>
                  <span className="text-neutral-200">${snacksTotal.toFixed(2)}</span>
                </div>
              ) : null}
              {redeemCredits && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Nova Credits (100 pts)
                  </span>
                  <span>-${creditsDiscount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Canje interactivo de Nova Credits */}
            <div className="my-2.5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-2.5">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                  <span className="text-[11px] font-semibold text-neutral-200">Canjear 100 Nova Credits</span>
                </div>
                <input
                  type="checkbox"
                  checked={redeemCredits}
                  onChange={(e) => setRedeemCredits(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-neutral-700 accent-yellow-500 cursor-pointer"
                />
              </label>
              {redeemCredits && (
                <p className="text-[10px] text-emerald-400 mt-1">✓ Descuento de -$5.00 aplicado a tu compra</p>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs font-bold text-yellow-500">
              <span>TOTAL NETO</span>
              <span>${finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Divisor con línea de rasgado SVG animada */}
        <div className="relative w-full h-6 bg-neutral-955 flex items-center justify-between z-10 overflow-visible border-y border-neutral-900/50">
          <div className="absolute -left-3 h-6 w-6 rounded-full bg-neutral-950 border-r border-neutral-800/40 z-20" />
          
          {/* Línea base punteada */}
          {!isTearing && (
            <div className="flex-1 border-b border-dashed border-neutral-800/80 mx-3" />
          )}

          {/* SVG de rasgado: se dibuja de izquierda a derecha al hacer clic en Pagar */}
          {isTearing && (
            <svg
              className="absolute inset-x-3 top-1/2 -translate-y-1/2 overflow-visible"
              height="10"
              style={{ width: 'calc(100% - 1.5rem)' }}
              preserveAspectRatio="none"
            >
              <motion.path
                d="M0,5 L14,2 L28,8 L42,1 L56,7 L70,2 L84,9 L98,3 L112,7 L126,1 L140,8 L154,3 L168,7 L182,2 L196,8 L210,3 L224,7 L238,2 L252,6 L266,1 L280,5"
                fill="none"
                stroke="rgba(234,179,8,0.65)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.32, ease: "easeInOut" }}
                style={{ vectorEffect: 'non-scaling-stroke' }}
              />
              <motion.path
                d="M0,5 L14,2 L28,8 L42,1 L56,7 L70,2 L84,9 L98,3 L112,7 L126,1 L140,8 L154,3 L168,7 L182,2 L196,8 L210,3 L224,7 L238,2 L252,6 L266,1 L280,5"
                fill="none"
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 0.32, ease: "easeInOut", delay: 0.02 }}
                style={{ vectorEffect: 'non-scaling-stroke' }}
              />
            </svg>
          )}

          <div className="absolute -right-3 h-6 w-6 rounded-full bg-neutral-950 border-l border-neutral-800/40 z-20" />
        </div>

        {/* Stub del boleto con perspectiva CSS para el efecto 3D */}
        <div className="w-full h-32 relative z-0" style={{ perspective: '800px', perspectiveOrigin: '50% 0%' }}>
          <AnimatePresence>
            {!isPeeling || paymentStatus === 'rejected' ? (
              <motion.div
                key="stub-payment"
                initial={{ rotateX: 0, rotateY: 0, rotateZ: 0, scaleX: 1, x: 0, y: 0, opacity: 1 }}
                exit={{
                  scaleX:  [1, 0.75, 0.45, 0.15, 0],
                  rotateY: [0, -90, -180, -270, -360],
                  rotateZ: [0, 8, 15, 8, 0],
                  x:       [0, 12, 32, 55, 75],
                  y:       [0, -4, -8, -2, 10],
                  opacity: [1, 1, 0.95, 0.8, 0],
                }}
                transition={{
                  duration: 1.1,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  ease: "easeInOut"
                }}
                style={{
                  transformOrigin: 'right center',
                  transformStyle: 'preserve-3d'
                }}
                className="absolute inset-0 w-full bg-neutral-955/40 border-x border-b border-neutral-800 rounded-b-2xl p-5 flex flex-col justify-center shadow-lg"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-linear-to-tr from-black/90 via-black/45 to-transparent pointer-events-none"
                />

                {/* CTAs */}
                <div className="relative z-10 flex flex-col gap-2 w-full">
                  <button
                    onClick={handlePayClick}
                    disabled={!isFormValid() || submitted}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 transition-all duration-200 cursor-pointer ${
                      isFormValid() && !submitted
                        ? 'bg-yellow-500 hover:bg-yellow-400 active:scale-95 shadow-lg shadow-yellow-500/10'
                        : 'cursor-not-allowed border border-neutral-800 bg-neutral-950/40 text-neutral-600'
                    }`}
                  >
                    <Lock className="h-3.5 w-3.5" /> Pagar ${finalAmount.toFixed(2)}
                  </button>
                  <button
                    onClick={onBack}
                    className="w-full text-center text-[10px] text-neutral-500 hover:text-neutral-300 mt-1.5 transition-colors font-medium cursor-pointer"
                  >
                    Atrás
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="stub-payment-confirmed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute inset-0 w-full bg-neutral-955/20 border-x border-b border-dashed border-neutral-800/80 rounded-b-2xl p-4 flex flex-col items-center justify-center gap-1.5"
              >
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent" />
                <span className="text-[8px] font-bold text-neutral-200 uppercase tracking-widest leading-none">Procesando Transacción...</span>
                <span className="text-[7.5px] text-neutral-500 text-center max-w-44 leading-tight">Por favor, mantén esta ventana abierta.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
