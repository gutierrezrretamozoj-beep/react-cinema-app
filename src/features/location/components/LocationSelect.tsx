interface LocationSelectProps {
  label: string;
  value: string;
  options: string[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

export const LocationSelect = ({
  label,
  value,
  options,
  disabled = false,
  onChange,
}: LocationSelectProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-neutral-300">
        {label}
      </label>

      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-neutral-200 outline-none transition focus:border-yellow-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <option value="">
          Selecciona {label.toLowerCase()}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};