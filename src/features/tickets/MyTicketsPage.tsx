// MyTicketsPage.tsx - Pagina de boletos reservados e historial de compras del usuario autenticado
// Implementado para filtrar exclusivamente las reservas pertenecientes a la cuenta activa

import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Calendar, Clock, Film, AlertCircle, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/shared/context/AuthContext';
import { MOVIES } from '@/features/auth/pages/Home/data/movieData';

// Interfaz que define la estructura de un boleto comprado y guardado en localStorage
interface PurchasedTicket {
  id: string;
  movieId: string;
  userEmail?: string;
  date: string;
  time: string;
  seats: string[];
  format: string;
  code: string;
  total: number;
}

// Precalculamos el patron del QR fuera del render principal para evitar conflictos de nombre
// con el indice 'ticketIndex' del map exterior de boletos
const QR_CELLS = Array.from({ length: 36 }, (_, cellIndex) => {
  // Calculamos fila y columna en una grilla 6x6 a partir del indice lineal
  const row = Math.floor(cellIndex / 6);
  const col = cellIndex % 6;
  // Una celda es negra si cumple el patron de ajedrez o es una esquina especial del QR
  const isBlack = (row + col) % 2 === 0 || (row === 0 && col === 0) || (row === 5 && col === 5);
  return { cellIndex, col, row, isBlack };
});

// Componente auxiliar que dibuja el patron de QR simulado usando SVG
// Se extrae como componente separado para evitar que TypeScript confunda variables de indice
const QRCodeDisplay = () => (
  <div className="w-16 h-16 bg-white rounded-lg p-1.5 flex items-center justify-center">
    <svg viewBox="0 0 60 60" width="52" height="52">
      {QR_CELLS.filter((cell) => cell.isBlack).map((cell) => (
        <rect
          key={cell.cellIndex}
          x={cell.col * 10}
          y={cell.row * 10}
          width={9}
          height={9}
          fill="#0d0d12"
        />
      ))}
    </svg>
  </div>
);

export const MyTicketsPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<PurchasedTicket[]>([]);

  useEffect(() => {
    // Si no hay sesion iniciada, limpiamos los boletos del estado
    if (!user?.email) {
      setTickets([]);
      return;
    }
    // Cargamos unicamente las boletas que pertenecen al correo del usuario en sesion
    // La clave usa el email en minusculas para evitar duplicados por diferencias de mayusculas
    const userEmailKey = user.email.toLowerCase();
    const localUserTickets = localStorage.getItem(`cinema_tickets_${userEmailKey}`);
    const parsedTickets: PurchasedTicket[] = localUserTickets ? JSON.parse(localUserTickets) : [];
    setTickets(parsedTickets);
  }, [user?.email]);

  // Si el usuario no esta autenticado mostramos pantalla de sesion requerida
  if (!user) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center px-4 py-8 text-center">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 backdrop-blur-md w-full">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 mb-4">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold text-neutral-100 uppercase tracking-wider font-sans">
            Sesion requerida
          </h2>
          <p className="text-xs text-neutral-400 mt-2 leading-relaxed mb-6">
            Inicia sesion para poder ver y administrar tus entradas reservadas.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/home"
              className="rounded-xl border border-neutral-800 bg-neutral-950/40 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
            >
              Catalogo
            </Link>
            <Link
              to="/auth/login"
              className="rounded-xl bg-yellow-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-yellow-400 active:scale-95 shadow-lg shadow-yellow-500/10"
            >
              Iniciar Sesion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:px-8">

      {/* Boton para regresar a la cartelera */}
      <Link
        to="/home"
        className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-300 transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" /> Volver a Cartelera
      </Link>

      {/* Encabezado con saludo al usuario y estadisticas de boletos */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <span className="inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-400 mb-2">
            Mis Entradas
          </span>
          {/* Mostramos solo el primer nombre del usuario para un saludo mas personal */}
          <h1 className="text-2xl font-black text-neutral-100 tracking-tight font-sans">
            Hola, {user.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Aqui tienes el listado de tus reservas y boletos activos para ingresar a sala.
          </p>
        </div>

        {/* Tarjeta de estadisticas rapidas del usuario */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 px-6 flex gap-8 items-center backdrop-blur-md md:w-auto self-start">
          <div className="text-center">
            <p className="text-xl font-black text-yellow-500 font-sans">{tickets.length}</p>
            <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5">Activas</p>
          </div>
          <div className="h-8 w-px bg-neutral-800" />
          <div className="text-center">
            {/* Mostramos 1 proxima funcion solo si hay al menos un boleto */}
            <p className="text-xl font-black text-yellow-500 font-sans">{tickets.length > 0 ? 1 : 0}</p>
            <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5">Proxima</p>
          </div>
        </div>
      </div>

      {/* Titulo de la seccion de boletos */}
      <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 border-b border-neutral-800 pb-2">
        Boletas Reservadas
      </h2>

      {/* Si no hay boletos mostramos estado vacio; si los hay los renderizamos en lista */}
      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/30">
          <Film className="h-10 w-10 text-neutral-600 mb-3" />
          <h3 className="text-sm font-bold text-neutral-200">No tienes boletos reservados</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm">
            Aun no has realizado reservas con esta cuenta. Visita la cartelera para elegir tus funciones.
          </p>
          <Link
            to="/home"
            className="mt-4 rounded-xl bg-yellow-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-yellow-400 transition"
          >
            Ver Cartelera
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {tickets.map((ticket, ticketIndex) => {
            // Buscamos la pelicula que corresponde a este boleto usando el movieId guardado
            const movie = MOVIES.find((m) => m.id === ticket.movieId);
            // Si la pelicula no existe en los datos locales, no renderizamos este boleto
            if (!movie) return null;

            // El primer boleto recibe un estilo destacado como proxima funcion
            const isFirst = ticketIndex === 0;

            return (
              <div
                key={ticket.id}
                className={`rounded-2xl border bg-neutral-900/40 backdrop-blur-md overflow-hidden relative ${
                  isFirst ? 'border-yellow-500/30 shadow-lg shadow-yellow-500/5' : 'border-neutral-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-stretch">

                  {/* Franja lateral con el poster de la pelicula */}
                  <div className="w-full sm:w-24 shrink-0 overflow-hidden h-32 sm:h-auto min-h-24 relative">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Gradiente que cubre el poster unicamente en pantallas moviles */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-900/80 sm:hidden" />
                  </div>

                  {/* Columna central con los datos del boleto */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      {/* Etiqueta de proxima funcion solo para el primer boleto de la lista */}
                      {isFirst && (
                        <span className="inline-block rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2">
                          Proxima funcion
                        </span>
                      )}
                      <h3 className="text-base font-bold text-neutral-100">{movie.title}</h3>
                      <div className="flex flex-wrap gap-4 text-xs text-neutral-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-yellow-500" /> {ticket.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-yellow-500" /> {ticket.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Film className="h-3.5 w-3.5 text-yellow-500" /> {ticket.format}
                        </span>
                      </div>
                    </div>

                    {/* Chips individuales para cada asiento reservado del boleto */}
                    <div className="flex flex-wrap gap-1 mt-4">
                      {ticket.seats.map((seat) => (
                        <span
                          key={seat}
                          className="rounded-md border border-yellow-500/20 bg-yellow-500/5 px-2.5 py-0.5 text-[10px] font-mono font-bold text-yellow-400"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Divisor visible en moviles entre detalles y zona QR */}
                  <div className="h-px border-b border-dashed border-neutral-800 sm:hidden mx-5" />

                  {/* Zona del QR simulado y precio total del boleto */}
                  <div className="w-full sm:w-40 border-t sm:border-t-0 sm:border-l border-dashed border-neutral-800 p-5 flex flex-col items-center justify-center gap-2 text-center bg-neutral-950/20">
                    {/* Patron QR decorativo generado por el componente auxiliar QRCodeDisplay */}
                    <QRCodeDisplay />
                    {/* Codigo de referencia del boleto mostrado en fuente monoespaciada */}
                    <span className="font-mono text-[9px] text-neutral-500 tracking-wider">{ticket.code}</span>
                    {/* Precio total del boleto: usamos la concatenacion de string para evitar
                        que el parser de TSX confunda el signo de dolar con un template literal */}
                    <span className="text-xs font-bold text-yellow-400 font-mono">
                      {'$'}{ticket.total.toFixed(2)}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default MyTicketsPage;
