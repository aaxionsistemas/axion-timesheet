"use client";
import React, { useState, useEffect } from "react";
import { Input } from "./input";
import { Label } from "./label";

interface PixInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}

type PixType = 'cpf' | 'cnpj' | 'phone' | 'email' | 'random';

export default function PixInput({
  id,
  value,
  onChange,
  className,
  required = false,
}: PixInputProps) {
  
  const [pixType, setPixType] = useState<PixType>('cpf');
  const [displayValue, setDisplayValue] = useState(value);

  // Formata CPF: 000.000.000-00
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  // Formata CNPJ: 00.000.000/0000-00
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
    if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
  };

  // Formata telefone: (00) 00000-0000
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Aplica formatação e limitação baseada no tipo selecionado
    let formattedValue = inputValue;
    
    if (pixType === 'cpf') {
      const numbers = inputValue.replace(/\D/g, '');
      if (numbers.length <= 11) {
        formattedValue = formatCPF(inputValue);
      } else {
        return; // Não permite mais que 11 dígitos para CPF
      }
    } else if (pixType === 'cnpj') {
      const numbers = inputValue.replace(/\D/g, '');
      if (numbers.length <= 14) {
        formattedValue = formatCNPJ(inputValue);
      } else {
        return; // Não permite mais que 14 dígitos para CNPJ
      }
    } else if (pixType === 'phone') {
      const numbers = inputValue.replace(/\D/g, '');
      if (numbers.length <= 11) {
        formattedValue = formatPhone(inputValue);
      } else {
        return; // Não permite mais que 11 dígitos para telefone
      }
    }
    // Email e chave aleatória não têm limitação
    
    setDisplayValue(formattedValue);
    onChange(formattedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Para CPF, CNPJ e telefone, só permite números e teclas de controle
    if (pixType === 'cpf' || pixType === 'cnpj' || pixType === 'phone') {
      // Permite backspace, delete, tab, escape, enter
      if ([8, 9, 27, 13, 46].includes(e.keyCode) ||
          // Permite Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
          (e.keyCode === 65 && e.ctrlKey) ||
          (e.keyCode === 67 && e.ctrlKey) ||
          (e.keyCode === 86 && e.ctrlKey) ||
          (e.keyCode === 88 && e.ctrlKey) ||
          // Permite setas
          (e.keyCode >= 35 && e.keyCode <= 40)) {
        return;
      }
      // Bloqueia se não for número
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    }
    // Email e chave aleatória permitem qualquer caractere
  };

  const handleTypeChange = (newType: PixType) => {
    setPixType(newType);
    // Limpar o campo quando muda o tipo
    setDisplayValue('');
    onChange('');
  };

  const getPlaceholder = () => {
    switch (pixType) {
      case 'cpf': return '000.000.000-00';
      case 'cnpj': return '00.000.000/0000-00';
      case 'phone': return '(11) 99999-9999';
      case 'email': return 'email@exemplo.com';
      case 'random': return 'Chave aleatória (36 caracteres)';
    }
  };

  const getMaxLength = () => {
    switch (pixType) {
      case 'cpf': return 14; // 000.000.000-00 (14 caracteres com formatação)
      case 'cnpj': return 18; // 00.000.000/0000-00 (18 caracteres com formatação)
      case 'phone': return 15; // (00) 00000-0000 (15 caracteres com formatação)
      case 'email': return undefined; // Sem limite
      case 'random': return undefined; // Sem limite
    }
  };

  const getTypeOptions = () => [
    { value: 'cpf', label: 'CPF' },
    { value: 'cnpj', label: 'CNPJ' },
    { value: 'phone', label: 'Telefone' },
    { value: 'email', label: 'Email' },
    { value: 'random', label: 'Chave Aleatória' },
  ];

  // Atualiza o display quando o value prop muda
  useEffect(() => {
    if (value !== displayValue) {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        Chave PIX
      </Label>
      
      {/* Seletor de tipo */}
      <select
        value={pixType}
        onChange={(e) => handleTypeChange(e.target.value as PixType)}
        className="w-full px-3 py-2 bg-[#23232b] border border-[#23232b] rounded-md text-white h-11 text-base focus:border-blue-500 focus:outline-none"
      >
        {getTypeOptions().map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Campo de input com máscara */}
      <Input
        id={id}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={className}
        placeholder={getPlaceholder()}
        maxLength={getMaxLength()}
        required={required}
      />
    </div>
  );
}
