// ErrorBoundary.tsx - Captura errores de JavaScript en el arbol de componentes
// Evita que un crash silencioso deje la pantalla completamente en negro sin ninguna explicacion
// Como desarrollador junior, usamos una clase porque React ErrorBoundary solo funciona con clases

import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Estado inicial: sin error
    this.state = { hasError: false, errorMessage: "" };
  }

  // React llama a este metodo estatico cuando un hijo lanza un error durante el render
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  // Este metodo es llamado despues de que getDerivedStateFromError actualiza el estado
  componentDidCatch(error: Error, info: ErrorInfo) {
    // Registramos el error en la consola para facilitar la depuracion durante desarrollo
    console.error("[ErrorBoundary] Error capturado en el arbol de componentes:", error, info);
  }

  render() {
    // Si hubo un error, mostramos una pantalla de recuperacion amigable en lugar de negro
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-6 py-16 text-center text-neutral-100">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-neutral-100">Algo salio mal</h2>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
            Ocurrio un error inesperado al cargar esta seccion. Por favor recarga la pagina o vuelve al inicio.
          </p>
          {this.state.errorMessage && (
            <code className="mt-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-[10px] font-mono text-red-400 max-w-full overflow-auto">
              {this.state.errorMessage}
            </code>
          )}
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-bold text-neutral-200 hover:bg-neutral-700 transition"
            >
              Recargar pagina
            </button>
            <button
              onClick={() => { this.setState({ hasError: false, errorMessage: "" }); window.location.href = "/"; }}
              className="rounded-xl bg-yellow-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-yellow-400 transition"
            >
              Ir al inicio
            </button>
          </div>
        </div>
      );
    }

    // Si no hay error, renderizamos los hijos normalmente
    return this.props.children;
  }
}
