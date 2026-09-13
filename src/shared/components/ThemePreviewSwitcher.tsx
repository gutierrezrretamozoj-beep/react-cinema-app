import { useState, useEffect } from "react";
import { Palette, Check, Sun, Moon } from "lucide-react";

interface ThemeOption {
  id: string;
  category: "dark" | "light";
  name: string;
  badge: string;
  bgHex: string;
  surfaceHex: string;
  surfaceElevatedHex: string;
  surfaceCardHex: string;
  borderHex: string;
  textHex: string;
  mutedHex: string;
}

const THEMES: ThemeOption[] = [
  // --- TONOS OSCUROS / MEDIOS (NO NEGRO PIRATA) ---
  {
    id: "titanium",
    category: "dark",
    name: "A: Titanium Slate",
    badge: "Apple TV / A24",
    bgHex: "#161a23",
    surfaceHex: "#1f2430",
    surfaceElevatedHex: "#282e3d",
    surfaceCardHex: "#1a1e28",
    borderHex: "rgba(255, 255, 255, 0.09)",
    textHex: "#f9f9fb",
    mutedHex: "#94a3b8",
  },
  {
    id: "midnight",
    category: "dark",
    name: "B: Corporate Midnight",
    badge: "Disney+ / Warner",
    bgHex: "#101929",
    surfaceHex: "#1a263c",
    surfaceElevatedHex: "#22314d",
    surfaceCardHex: "#141f33",
    borderHex: "rgba(154, 179, 207, 0.16)",
    textHex: "#f9f9fb",
    mutedHex: "#9ab3cf",
  },
  {
    id: "charcoal",
    category: "dark",
    name: "C: Neutral Charcoal",
    badge: "Zinc Minimal",
    bgHex: "#18181b",
    surfaceHex: "#27272a",
    surfaceElevatedHex: "#3f3f46",
    surfaceCardHex: "#202024",
    borderHex: "rgba(255, 255, 255, 0.1)",
    textHex: "#f4f4f5",
    mutedHex: "#a1a1aa",
  },

  // --- TONOS CLAROS SOFISTICADOS ---
  {
    id: "studio-white",
    category: "light",
    name: "D: Studio Ice White",
    badge: "Letterboxd / MUBI Light",
    bgHex: "#f8fafc",
    surfaceHex: "#ffffff",
    surfaceElevatedHex: "#f1f5f9",
    surfaceCardHex: "#ffffff",
    borderHex: "rgba(0, 0, 0, 0.08)",
    textHex: "#0f172a",
    mutedHex: "#475569",
  },
  {
    id: "warm-cream",
    category: "light",
    name: "E: Warm Cream Paper",
    badge: "Criterion / A24 Editorial",
    bgHex: "#f6f5ef",
    surfaceHex: "#ffffff",
    surfaceElevatedHex: "#eae8df",
    surfaceCardHex: "#ffffff",
    borderHex: "rgba(0, 0, 0, 0.08)",
    textHex: "#1c1917",
    mutedHex: "#57534e",
  },
  {
    id: "cool-silver",
    category: "light",
    name: "F: Nordic Silver Slate",
    badge: "Cinema Tech Light",
    bgHex: "#e8ecf2",
    surfaceHex: "#f8fafc",
    surfaceElevatedHex: "#dbe2ec",
    surfaceCardHex: "#ffffff",
    borderHex: "rgba(0, 0, 0, 0.09)",
    textHex: "#091124",
    mutedHex: "#4b5b75",
  },
];

export const ThemePreviewSwitcher = () => {
  const [activeTheme, setActiveTheme] = useState<string>("titanium");
  const [activeTab, setActiveTab] = useState<"dark" | "light">("dark");
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const applyTheme = (theme: ThemeOption) => {
    setActiveTheme(theme.id);
    setActiveTab(theme.category);
    const root = document.documentElement;

    root.style.setProperty("--color-cinema-bg", theme.bgHex);
    root.style.setProperty("--color-cinema-surface", theme.surfaceHex);
    root.style.setProperty("--color-cinema-surface-elevated", theme.surfaceElevatedHex);
    root.style.setProperty("--color-cinema-surface-card", theme.surfaceCardHex);
    root.style.setProperty("--color-cinema-border", theme.borderHex);
    root.style.setProperty("--color-cinema-text", theme.textHex);
    root.style.setProperty("--color-cinema-muted", theme.mutedHex);
    root.style.colorScheme = theme.category;
  };

  useEffect(() => {
    applyTheme(THEMES[0]);
  }, []);

  const currentList = THEMES.filter((t) => t.category === activeTab);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 font-sans select-none">
      {isOpen ? (
        <div className="flex flex-col gap-2.5 rounded-2xl border border-white/20 bg-neutral-950/95 p-4 shadow-2xl backdrop-blur-xl max-w-xs sm:max-w-sm w-80 text-white transition-all">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-cinema-electric" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">
                Comparador en Vivo
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-neutral-400 hover:text-white cursor-pointer px-1 py-0.5 rounded hover:bg-white/10"
              title="Minimizar"
            >
              ✕
            </button>
          </div>

          {/* Pestañas: Oscuros / Claros */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setActiveTab("dark");
                const firstDark = THEMES.find((t) => t.category === "dark")!;
                applyTheme(firstDark);
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "dark"
                  ? "bg-white/20 text-white shadow-xs"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Moon className="h-3 w-3" />
              <span>Oscuros / Medios (3)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("light");
                const firstLight = THEMES.find((t) => t.category === "light")!;
                applyTheme(firstLight);
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "light"
                  ? "bg-white/20 text-white shadow-xs"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Sun className="h-3 w-3" />
              <span>Claros (3)</span>
            </button>
          </div>

          <p className="text-[11px] text-neutral-400 leading-tight">
            Toca cualquiera para ver el cambio inmediato en toda la página:
          </p>

          {/* Lista de temas según la pestaña activa */}
          <div className="flex flex-col gap-1.5">
            {currentList.map((theme) => {
              const isSelected = activeTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => applyTheme(theme)}
                  className={`flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? "border-cinema-electric bg-white/15 text-white shadow-md shadow-cinema-electric/20"
                      : "border-white/5 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Círculo de muestra de color */}
                    <span
                      className="h-4 w-4 rounded-full border border-white/30 shadow-xs flex-shrink-0"
                      style={{ backgroundColor: theme.bgHex }}
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold">{theme.name}</span>
                      <span className="text-[10px] text-neutral-400 font-normal">{theme.badge}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-cinema-electric flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="pt-1 text-[10px] text-neutral-400 text-center">
            Dime cuál prefieres para dejarlo fijo en el código.
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full border border-white/20 bg-neutral-950/90 text-white text-xs font-bold shadow-xl backdrop-blur-md hover:scale-105 transition-all cursor-pointer"
        >
          <Palette className="h-4 w-4 text-cinema-electric" />
          <span>Comparar Colores</span>
        </button>
      )}
    </div>
  );
};
