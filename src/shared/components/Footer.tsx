

export default function Footer() {
  return (
    <footer className="w-full border-t border-cinema-border bg-black/25 backdrop-blur-md py-10 mt-12 text-center text-xs text-cinema-muted">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/src/assets/icons/logo-cine.svg" className="w-auto h-7" alt="Logo" />
            <img src="/src/assets/icons/nombre-cine.svg" className="w-30 h-auto" alt="Logo" />
            <span className="text-neutral-600">|</span>
            <span>Experiencia Cinemática 3D</span>
          </div>
          <p>© 2026 DEXUS Cinemas. Todos los derechos reservados.</p>
        </div>
    </footer>
  )
}
