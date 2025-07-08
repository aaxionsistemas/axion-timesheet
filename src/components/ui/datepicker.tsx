

import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

interface CustomDatePickerProps {
  selected?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  className?: string;
}

// Componente customizado para o input
const DateInput = forwardRef<HTMLInputElement, { value?: string; onClick?: () => void; placeholder?: string; className?: string; disabled?: boolean }>(({ value, onClick, placeholder, className, disabled }, ref) => (
  <div className="relative">
    <input
      ref={ref}
      value={value}
      onClick={onClick}
      placeholder={placeholder}
      readOnly
      disabled={disabled}
      className={`flex h-10 w-full rounded-md border px-3 py-2 pr-10 text-base shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-600 cursor-pointer md:text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`}
    />
    <Calendar 
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
      size={16} 
    />
  </div>
));

DateInput.displayName = "DateInput";

// Componente customizado para o header
const CustomHeader = ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }: { date: Date; decreaseMonth: () => void; increaseMonth: () => void; prevMonthButtonDisabled: boolean; nextMonthButtonDisabled: boolean }) => (
  <div className="flex items-center justify-between px-4 py-2 bg-[#18181b] border-b border-[#23232b]">
    <button
      onClick={decreaseMonth}
      disabled={prevMonthButtonDisabled}
      className="p-1 hover:bg-[#23232b] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      type="button"
    >
      <ChevronLeft size={16} className="text-gray-400" />
    </button>
    
    <span className="text-white font-medium">
      {format(date, "MMMM yyyy", { locale: ptBR })}
    </span>
    
    <button
      onClick={increaseMonth}
      disabled={nextMonthButtonDisabled}
      className="p-1 hover:bg-[#23232b] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      type="button"
    >
      <ChevronRight size={16} className="text-gray-400" />
    </button>
  </div>
);

export default function CustomDatePicker({
  selected,
  onChange,
  placeholder = "Selecione uma data",
  disabled = false,
  minDate,
  maxDate,
  dateFormat = "dd/MM/yyyy",
  className
}: CustomDatePickerProps) {
  return (
    <div className="w-full">
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat={dateFormat}
        placeholderText={placeholder}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        locale={ptBR}
        customInput={<DateInput placeholder={placeholder} className={className} disabled={disabled} />}
        renderCustomHeader={CustomHeader}
        showPopperArrow={false}
        popperClassName="custom-datepicker-popper"
        calendarClassName="custom-datepicker-calendar"
      />
    </div>
  );
}

// Estilos CSS para o datepicker (adicionar ao globals.css)
export const datePickerStyles = `
.custom-datepicker-popper {
  z-index: 9999;
}

.custom-datepicker-calendar {
  font-family: inherit;
  background-color: #18181b !important;
  border: 1px solid #23232b !important;
  border-radius: 8px !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.1) !important;
  overflow: hidden;
}

.react-datepicker__month-container {
  background-color: #18181b;
}

.react-datepicker__day-names {
  background-color: #23232b;
  border-bottom: 1px solid #2a2a2a;
}

.react-datepicker__day-name {
  color: #9ca3af !important;
  font-weight: 500;
  width: 2.5rem;
  line-height: 2rem;
}

.react-datepicker__week {
  display: flex;
}

.react-datepicker__day {
  color: #e5e7eb !important;
  width: 2.5rem;
  line-height: 2rem;
  text-align: center;
  cursor: pointer;
  border-radius: 6px;
  margin: 2px;
  transition: all 0.15s ease;
  font-weight: 400;
}

.react-datepicker__day:hover {
  background-color: #3b82f6 !important;
  color: white !important;
}

.react-datepicker__day--selected {
  background-color: #2563eb !important;
  color: white !important;
  font-weight: 600;
}

.react-datepicker__day--today {
  font-weight: 600;
  background-color: #1f2937 !important;
  color: #60a5fa !important;
}

.react-datepicker__day--outside-month {
  color: #6b7280 !important;
  opacity: 0.5;
}

.react-datepicker__day--disabled {
  color: #4b5563 !important;
  cursor: not-allowed;
  opacity: 0.3;
}

.react-datepicker__day--keyboard-selected {
  background-color: #1e40af !important;
  color: white !important;
}

.react-datepicker__month {
  padding: 8px;
  background-color: #18181b;
}

.react-datepicker__navigation {
  display: none;
}

.react-datepicker__header {
  background-color: #18181b;
  border-bottom: none;
  padding: 0;
}

.react-datepicker__current-month {
  display: none;
}
`; 