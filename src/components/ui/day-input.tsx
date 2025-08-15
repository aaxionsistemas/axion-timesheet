"use client";
import React, { useRef } from "react";
import { Label } from "./label";
import { Input } from "./input";

interface DayInputProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}

export default function DayInput({
  id,
  label,
  value,
  onChange,
  className,
  required = false,
}: DayInputProps) {
  
  const hiddenDateInputRef = useRef<HTMLInputElement>(null);

  // Converter o valor do dia para uma data válida para o input oculto
  const getDateValue = () => {
    if (!value) return '';
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(value).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (selectedDate) {
      // Extrair o dia diretamente da string da data (formato YYYY-MM-DD)
      // Isso evita problemas de fuso horário com new Date()
      const dateParts = selectedDate.split('-');
      const day = parseInt(dateParts[2], 10); // Pega o DD da string YYYY-MM-DD
      onChange(day.toString());
    } else {
      onChange('');
    }
  };

  const handleTextInputClick = () => {
    // Abrir o calendário quando clicar no input de texto
    hiddenDateInputRef.current?.showPicker();
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Permitir apenas números de 1 a 31
    const numericValue = inputValue.replace(/\D/g, '');
    const dayValue = parseInt(numericValue);
    
    if (numericValue === '') {
      onChange('');
    } else if (dayValue >= 1 && dayValue <= 31) {
      onChange(dayValue.toString());
    }
  };

  return (
    <div>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && ' *'}
      </Label>
      <div className="relative">
        {/* Input visível que mostra apenas o dia */}
        <Input
          id={id}
          type="text"
          value={value}
          onChange={handleTextInputChange}
          onClick={handleTextInputClick}
          className={`${className} cursor-pointer`}
          required={required}
          placeholder="Dia (1-31)"
          maxLength={2}
        />
        
        {/* Input de data oculto para abrir o calendário */}
        <input
          ref={hiddenDateInputRef}
          type="date"
          value={getDateValue()}
          onChange={handleDateChange}
          className="absolute inset-0 opacity-0 pointer-events-none"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
