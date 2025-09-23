import { ChevronDown } from "lucide-react"
import { ChangeEvent, ReactNode } from "react"

interface CitySelectProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  className?: string
  id?: string
  name?: string
  disabled?: boolean
  placeholder?: string
}

export function CitySelect({
  value,
  onChange,
  options,
  className = "",
  id,
  name,
  disabled = false,
  placeholder = "Select city",
}: CitySelectProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={`relative ${className}`}>
      <select
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`w-full px-4 py-2 bg-gray-100/90 backdrop-blur-sm rounded-lg text-gray-800 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-200 appearance-none pr-8 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
    </div>
  )
}

export default CitySelect
