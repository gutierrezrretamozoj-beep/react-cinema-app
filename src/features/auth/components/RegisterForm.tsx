import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../store";
import { useLocation } from "../../location/hooks/useLocation";
import { documentTypeService } from "@/shared/services/documentType.service";
import type { DocumentType } from "@/shared/interfaces/documentType";

/**
 * Props for the registration form component.
 */
interface RegisterFormProps {
  onRegisterSuccess?: () => void;
}

/**
 * Registration form that collects all backend-required fields and creates an account via POST /users.
 * @param props - Component props
 * @returns JSX element
 */
export const RegisterForm = ({ onRegisterSuccess }: RegisterFormProps) => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [documentTypeId, setDocumentTypeId] = useState<number | "">("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const firstNameRef = useRef<HTMLInputElement>(null);

  const {
    countries,
    departments,
    cities,
    selectedCountry,
    selectedDepartment,
    selectedCity,
    setSelectedCountry,
    setSelectedDepartment,
    setSelectedCity,
  } = useLocation();

  useEffect(() => {
    firstNameRef.current?.focus();
  }, []);

  useEffect(() => {
    documentTypeService.getAll().then(setDocumentTypes).catch(console.error);
  }, []);

  /**
   * Handles registration form submission.
   * @param event - Form submit event
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError(null);

    if (!selectedCity || documentTypeId === "") {
      setError("Debes seleccionar tipo de documento y ubicación completa.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    setLoading(true);

    const response = await registerUser({
      email,
      password,
      documentTypeId: Number(documentTypeId),
      documentNumber,
      firstName,
      lastName,
      birthDate,
      gender,
      phone,
      address,
      cityId: selectedCity.id,
    });

    setLoading(false);

    if (!response.success) {
      setError(response.message ?? "Ocurrió un error al crear tu cuenta.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    setSuccess(true);
    onRegisterSuccess?.();
    setTimeout(() => navigate("/auth/login"), 1500);
  }

  const isDisabled =
    loading ||
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    documentTypeId === "" ||
    !documentNumber ||
    !birthDate ||
    !gender ||
    !phone ||
    !address ||
    !selectedCountry ||
    !selectedDepartment ||
    !selectedCity;

  return (
    <div
      className={`relative w-full overflow-visible rounded-3xl p-6 ${shake ? "animate-shake" : ""}`}
      style={{
        background: "linear-gradient(135deg, rgba(20,20,35,0.95) 0%, rgba(10,10,20,0.98) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: success
          ? "0 0 0 2px rgba(234,179,8,0.5), 0 30px 80px -20px rgba(0,0,0,0.9), 0 0 60px rgba(234,179,8,0.1)"
          : "0 30px 80px -20px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.04)",
        transition: "box-shadow 0.4s ease",
      }}
    >
      <div className="mb-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-yellow-500/20" />
          <span className="text-[10px] font-bold tracking-[4px] text-yellow-500/60 uppercase px-2">Nuevo Boleto</span>
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-yellow-500/20" />
        </div>
        <h2 className="text-2xl font-black text-white mb-1">Crea tu cuenta</h2>
        <p className="text-sm text-neutral-500">Únete a la función</p>
      </div>

      <div className="relative -mx-6 mb-5">
        <div className="border-t border-dashed border-white/6" />
        <div className="absolute left-0 -top-2 w-4 h-4 rounded-full" style={{ background: "#050810" }} />
        <div className="absolute right-0 -top-2 w-4 h-4 rounded-full" style={{ background: "#050810" }} />
      </div>

      {success && (
        <div
          className="mb-6 flex flex-col items-center gap-2 rounded-2xl py-5"
          style={{ background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.15)" }}
        >
          <div className="text-3xl animate-bounce">🎬</div>
          <p className="text-sm font-bold text-yellow-400">¡Cuenta creada con éxito!</p>
          <p className="text-xs text-neutral-500">Redirigiendo al login...</p>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Nombre</label>
              <div
                className="relative overflow-hidden rounded-xl transition-all duration-300"
                style={{
                  background: focusedField === "firstName" ? "rgba(234,179,8,0.04)" : "rgba(255,255,255,0.03)",
                  border: focusedField === "firstName" ? "1px solid rgba(234,179,8,0.35)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: focusedField === "firstName" ? "0 0 0 3px rgba(234,179,8,0.06)" : "none",
                }}
              >
                <input
                  ref={firstNameRef}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onFocus={() => setFocusedField("firstName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Daniel"
                  required
                  className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Apellido</label>
              <div
                className="relative overflow-hidden rounded-xl transition-all duration-300"
                style={{
                  background: focusedField === "lastName" ? "rgba(234,179,8,0.04)" : "rgba(255,255,255,0.03)",
                  border: focusedField === "lastName" ? "1px solid rgba(234,179,8,0.35)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: focusedField === "lastName" ? "0 0 0 3px rgba(234,179,8,0.06)" : "none",
                }}
              >
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onFocus={() => setFocusedField("lastName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Mendoza"
                  required
                  className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Correo electrónico</label>
            <div
              className="relative overflow-hidden rounded-xl transition-all duration-300"
              style={{
                background: focusedField === "email" ? "rgba(234,179,8,0.04)" : "rgba(255,255,255,0.03)",
                border: focusedField === "email" ? "1px solid rgba(234,179,8,0.35)" : "1px solid rgba(255,255,255,0.07)",
                boxShadow: focusedField === "email" ? "0 0 0 3px rgba(234,179,8,0.06)" : "none",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="tu@correo.com"
                autoComplete="email"
                required
                className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Contraseña</label>
            <div
              className="relative overflow-hidden rounded-xl transition-all duration-300"
              style={{
                background: focusedField === "password" ? "rgba(234,179,8,0.04)" : "rgba(255,255,255,0.03)",
                border: focusedField === "password" ? "1px solid rgba(234,179,8,0.35)" : "1px solid rgba(255,255,255,0.07)",
                boxShadow: focusedField === "password" ? "0 0 0 3px rgba(234,179,8,0.06)" : "none",
              }}
            >
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                className="w-full bg-transparent pl-4 pr-12 py-2.5 text-sm text-white placeholder-neutral-600 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 transition-colors hover:text-neutral-400 focus:outline-none"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
                  {showPassword ? (
                    <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <>
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Tipo de documento</label>
              <div
                className="relative overflow-hidden rounded-xl transition-all duration-300"
                style={{
                  background: focusedField === "documentType" ? "rgba(234,179,8,0.04)" : "rgba(255,255,255,0.03)",
                  border: focusedField === "documentType" ? "1px solid rgba(234,179,8,0.35)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: focusedField === "documentType" ? "0 0 0 3px rgba(234,179,8,0.06)" : "none",
                }}
              >
                <select
                  value={documentTypeId}
                  onChange={(e) => setDocumentTypeId(e.target.value ? Number(e.target.value) : "")}
                  onFocus={() => setFocusedField("documentType")}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full bg-[#0d1117] px-4 py-2.5 text-sm text-white outline-none cursor-pointer"
                >
                  <option value="" className="bg-neutral-900 text-neutral-400">Selecciona tipo</option>
                  {documentTypes.map((dt) => (
                    <option key={dt.id} value={dt.id} className="bg-neutral-900 text-white">
                      {dt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Número de documento</label>
              <div
                className="relative overflow-hidden rounded-xl transition-all duration-300"
                style={{
                  background: focusedField === "documentNumber" ? "rgba(234,179,8,0.04)" : "rgba(255,255,255,0.03)",
                  border: focusedField === "documentNumber" ? "1px solid rgba(234,179,8,0.35)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: focusedField === "documentNumber" ? "0 0 0 3px rgba(234,179,8,0.06)" : "none",
                }}
              >
                <input
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  onFocus={() => setFocusedField("documentNumber")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="1045678901"
                  required
                  className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Fecha de nacimiento</label>
              <div
                className="relative overflow-hidden rounded-xl transition-all duration-300"
                style={{
                  background: focusedField === "birthDate" ? "rgba(234,179,8,0.04)" : "rgba(255,255,255,0.03)",
                  border: focusedField === "birthDate" ? "1px solid rgba(234,179,8,0.35)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: focusedField === "birthDate" ? "0 0 0 3px rgba(234,179,8,0.06)" : "none",
                }}
              >
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  onFocus={() => setFocusedField("birthDate")}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full bg-transparent px-4 py-2.5 text-sm text-white outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Género</label>
              <div
                className="relative overflow-hidden rounded-xl transition-all duration-300"
                style={{
                  background: focusedField === "gender" ? "rgba(234,179,8,0.04)" : "rgba(255,255,255,0.03)",
                  border: focusedField === "gender" ? "1px solid rgba(234,179,8,0.35)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: focusedField === "gender" ? "0 0 0 3px rgba(234,179,8,0.06)" : "none",
                }}
              >
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  onFocus={() => setFocusedField("gender")}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full bg-[#0d1117] px-4 py-2.5 text-sm text-white outline-none cursor-pointer"
                >
                  <option value="" className="bg-neutral-900 text-neutral-400">Selecciona género</option>
                  <option value="Masculino" className="bg-neutral-900 text-white">Masculino</option>
                  <option value="Femenino" className="bg-neutral-900 text-white">Femenino</option>
                  <option value="Otro" className="bg-neutral-900 text-white">Otro</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Teléfono</label>
              <div
                className="relative overflow-hidden rounded-xl transition-all duration-300"
                style={{
                  background: focusedField === "phone" ? "rgba(234,179,8,0.04)" : "rgba(255,255,255,0.03)",
                  border: focusedField === "phone" ? "1px solid rgba(234,179,8,0.35)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: focusedField === "phone" ? "0 0 0 3px rgba(234,179,8,0.06)" : "none",
                }}
              >
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="3001234567"
                  required
                  className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Dirección</label>
              <div
                className="relative overflow-hidden rounded-xl transition-all duration-300"
                style={{
                  background: focusedField === "address" ? "rgba(234,179,8,0.04)" : "rgba(255,255,255,0.03)",
                  border: focusedField === "address" ? "1px solid rgba(234,179,8,0.35)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: focusedField === "address" ? "0 0 0 3px rgba(234,179,8,0.06)" : "none",
                }}
              >
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onFocus={() => setFocusedField("address")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Calle 123"
                  required
                  className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">País</label>
            <div
              className="relative overflow-hidden rounded-xl transition-all duration-300"
              style={{
                background: focusedField === "country" ? "rgba(234,179,8,0.04)" : "rgba(255,255,255,0.03)",
                border: focusedField === "country" ? "1px solid rgba(234,179,8,0.35)" : "1px solid rgba(255,255,255,0.07)",
                boxShadow: focusedField === "country" ? "0 0 0 3px rgba(234,179,8,0.06)" : "none",
              }}
            >
              <select
                value={selectedCountry?.id ?? ""}
                onChange={(e) => {
                  const country = countries.find((item) => item.id === Number(e.target.value));
                  setSelectedCountry(country ?? null);
                  setSelectedDepartment(null);
                  setSelectedCity(null);
                }}
                onFocus={() => setFocusedField("country")}
                onBlur={() => setFocusedField(null)}
                required
                className="w-full bg-[#0d1117] px-4 py-2.5 text-sm text-white outline-none cursor-pointer"
              >
                <option value="" className="bg-neutral-900 text-neutral-400">Selecciona un país</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id} className="bg-neutral-900 text-white">
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Departamento</label>
              <div
                className="relative overflow-hidden rounded-xl transition-all duration-300"
                style={{
                  background: focusedField === "department" ? "rgba(234,179,8,0.04)" : "rgba(255,255,255,0.03)",
                  border: focusedField === "department" ? "1px solid rgba(234,179,8,0.35)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: focusedField === "department" ? "0 0 0 3px rgba(234,179,8,0.06)" : "none",
                }}
              >
                <select
                  value={selectedDepartment?.id ?? ""}
                  onChange={(e) => {
                    const department = departments.find((item) => item.id === Number(e.target.value));
                    setSelectedDepartment(department ?? null);
                    setSelectedCity(null);
                  }}
                  onFocus={() => setFocusedField("department")}
                  onBlur={() => setFocusedField(null)}
                  disabled={!selectedCountry}
                  required
                  className="w-full bg-[#0d1117] px-4 py-2.5 text-sm text-white outline-none disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <option value="" className="bg-neutral-900 text-neutral-400">Selecciona departamento</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id} className="bg-neutral-900 text-white">
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Ciudad</label>
              <div
                className="relative overflow-hidden rounded-xl transition-all duration-300"
                style={{
                  background: focusedField === "city" ? "rgba(234,179,8,0.04)" : "rgba(255,255,255,0.03)",
                  border: focusedField === "city" ? "1px solid rgba(234,179,8,0.35)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: focusedField === "city" ? "0 0 0 3px rgba(234,179,8,0.06)" : "none",
                }}
              >
                <select
                  value={selectedCity?.id ?? ""}
                  onChange={(e) => {
                    const city = cities.find((item) => item.id === Number(e.target.value));
                    setSelectedCity(city ?? null);
                  }}
                  onFocus={() => setFocusedField("city")}
                  onBlur={() => setFocusedField(null)}
                  disabled={!selectedDepartment}
                  required
                  className="w-full bg-[#0d1117] px-4 py-2.5 text-sm text-white outline-none disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <option value="" className="bg-neutral-900 text-neutral-400">Selecciona ciudad</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id} className="bg-neutral-900 text-white">
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div
              className="flex items-start gap-2.5 rounded-xl px-3.5 py-3"
              style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}
              role="alert"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 mt-0.5 shrink-0 text-red-400" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm text-red-400 leading-relaxed">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isDisabled}
            className="relative mt-2 w-full overflow-hidden rounded-xl py-3 text-sm font-bold tracking-widest uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 disabled:cursor-not-allowed"
            style={{
              background: isDisabled ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: isDisabled ? "rgba(255,255,255,0.2)" : "#0a0a0a",
              boxShadow: !isDisabled ? "0 8px 30px rgba(234,179,8,0.25), 0 1px 0 rgba(255,255,255,0.1) inset" : "none",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creando cuenta...
              </span>
            ) : (
              "Crear cuenta 🎬"
            )}
          </button>
        </form>
      )}

      <div className="relative mt-4">
        <div className="border-t border-dashed border-white/6 mb-6">
          <div className="absolute left-0 -top-2 w-4 h-4 rounded-full" style={{ background: "#050810" }} />
          <div className="absolute right-0 -top-2 w-4 h-4 rounded-full" style={{ background: "#050810" }} />
        </div>
        <p className="text-center text-[11px] text-neutral-600">
          ¿Ya tienes cuenta?{" "}
          <Link to="/auth/login" className="text-yellow-500 hover:text-yellow-400 transition-colors font-semibold">
            Inicia sesión
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
        .animate-shake { animation: shake 0.6s ease; }
      `}</style>
    </div>
  );
};
