// MyTicketsPage.tsx — Página de "Mis Boletas": lista de boletas reservadas e historial
// Se adapta de la referencia con un diseño premium y lee boletas guardadas del localStorage.

import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Calendar, Clock, Film, AlertCircle, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/shared/context/AuthContext';
import { MOVIES } from '@/features/auth/pages/Home/data/movieData';

interface PurchasedTicket {
  id: string;
  movieId: string;
  date: string;
  time: string;
  seats: string[];
  format: string;
  code: string;
  total: number;
}

// Boletas mockeadas por defecto para cuando ingresan
const MOCK_TICKETS: PurchasedTicket[] = [
  { id: '1', movieId: '1', date: 'Hoy', time: '19:00', seats: ['E5', 'E6'], format: 'IMAX 3D', code: 'CM-A1B2C3', total: 40.00 },
  { id: '2', movieId: '2', date: 'Mañana', time: '21:30', seats: ['C4', 'C5', 'C6'], format: '2D', code: 'CM-D4E5F6', total: 28.50 },
];

export const MyTicketsPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<PurchasedTicket[]>([]);

  useEffect(() => {
    // Carga boletas de localStorage + mocks por defecto
    const local = localStorage.getItem('cinema_tickets');
    const parsedLocal = local ? JSON.parse(local) : [];
    setTickets([...parsedLocal, ...MOCK_TICKETS]);
  }, []);

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center px-4 py-8 text-center">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 backdrop-blur-md w-full">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 mb-4">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold text-neutral-100 uppercase tracking-wider font-sans">
            Sesión requerida
          </h2>
          <p className="text-xs text-neutral-400 mt-2 leading-relaxed mb-6">
            Inicia sesión o ingresa tus datos en el portal para poder ver y administrar tus entradas reservadas.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/home"
              className="rounded-xl border border-neutral-800 bg-neutral-950/40 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
            >
              Catálogo
            </Link>
            <button
              onClick={() => {
                // Simula login de prueba para facilitar verificación al usuario
                const defaultEmail = 'invitado@cinemax.com';
                localStorage.setItem('cinema_user', JSON.stringify({
                  name: 'Invitado Especial',
                  email: defaultEmail,
                  avatar: 'I'
                }));
                window.location.reload();
              }}
              className="rounded-xl bg-yellow-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-yellow-400 active:scale-95 shadow-lg shadow-yellow-500/10"
            >
              Login de Prueba
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:px-8">
      
      {/* Back button */}
      <Link
        to="/home"
        className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-300 transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" /> Volver a Cartelera
      </Link>

      {/* Header Info */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <span className="inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-400 mb-2">
            🎟️ Mis Entradas
          </span>
          <h1 className="text-2xl font-black text-neutral-100 tracking-tight font-sans">
            Hola, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Aquí tienes el listado de tus reservas y boletos activos para ingresar a sala.
          </p>
        </div>

        {/* Stats card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 px-6 flex gap-8 items-center backdrop-blur-md md:w-auto self-start">
          <div className="text-center">
            <p className="text-xl font-black text-yellow-500 font-sans">{tickets.length}</p>
            <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5">Activas</p>
          </div>
          <div className="h-8 w-px bg-neutral-800" />
          <div className="text-center">
            <p className="text-xl font-black text-yellow-500 font-sans">1</p>
            <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5">Próxima</p>
          </div>
        </div>
      </div>

      {/* List of active tickets */}
      <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 border-b border-neutral-800 pb-2">
        Boletas Reservadas
      </h2>

      <div className="flex flex-col gap-4">
        {tickets.map((ticket, index) => {
          const movie = MOVIES.find((m) => m.id === ticket.movieId);
          if (!movie) return null;
          return (
            <div
              key={ticket.id}
              className={`rounded-2xl border bg-neutral-900/40 backdrop-blur-md overflow-hidden relative ${
                index === 0 ? 'border-yellow-500/30 shadow-lg shadow-yellow-500/5' : 'border-neutral-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-stretch">
                
                {/* Poster strip */}
                <div className="w-full sm:w-24 shrink-0 overflow-hidden h-32 sm:h-auto min-h-24 relative">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-900/80 sm:hidden" />
                </div>

                {/* Details */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    {index === 0 && (
                      <span className="inline-block rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2">
                        ● Próxima función
                      </span>
                    )}
                    <h3 className="text-base font-bold text-neutral-100">{movie.title}</h3>
                    <div className="flex flex-wrap gap-4 text-xs text-neutral-400 mt-2">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-yellow-500" /> {ticket.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-yellow-500" /> {ticket.time}</span>
                      <span className="flex items-center gap-1"><Film className="h-3.5 w-3.5 text-yellow-500" /> {ticket.format}</span>
                    </div>
                  </div>

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

                {/* Separator for small screens */}
                <div className="h-px border-b border-dashed border-neutral-800 sm:hidden mx-5" />

                {/* QR area */}
                <div className="w-full sm:w-40 border-t sm:border-t-0 sm:border-l border-dashed border-neutral-800 p-5 flex flex-col items-center justify-center gap-2 text-center bg-neutral-950/20">
                  <div className="w-16 h-16 bg-white rounded-lg p-1.5 flex items-center justify-center">
                    <svg viewBox="0 0 60 60" width="52" height="52">
                      {[...Array(6)].map((_, i) =>
                        [...Array(6)].map((_, j) => {
                          const isBlack = (i + j) % 2 === 0 || (i === 0 && j === 0) || (i === 5 && j === 5);
                          return isBlack ? (
                            <rect key={`${i}${j}`} x={i * 10} y={j * 10} width={9} height={9} fill="#0d0d12" />
                          ) : null;
                        })
                      )}
                    </svg>
                  </div>
                  <span className="font-mono text-[9px] text-neutral-500 tracking-wider">{ticket.code}</span>
                  <span className="text-xs font-bold text-yellow-400 font-mono">${ticket.total.toFixed(2)}</span>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
export default MyTicketsPage;
