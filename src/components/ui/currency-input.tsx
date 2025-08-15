"use client";
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export default function CurrencyInput({ 
  value, 
  onChange, 
  placeholder = "R$ 0,00", 
  className = "",
  id,
  disabled = false
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  // Função para formatar número para moeda brasileira
  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Função para converter string formatada para número
  const parseCurrency = (str: string): number => {
    // Remove tudo exceto números e vírgula/ponto
    const cleanStr = str.replace(/[^\d,]/g, '');
    // Substitui vírgula por ponto para conversão
    const normalizedStr = cleanStr.replace(',', '.');
    const num = parseFloat(normalizedStr) || 0;
    return num;
  };

  // Atualiza o valor exibido quando o valor prop muda
  useEffect(() => {
    if (value === 0) {
      setDisplayValue('');
    } else {
      setDisplayValue(formatCurrency(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Se o campo estiver vazio, define como 0
    if (inputValue === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    // Extrai apenas números da entrada
    const numbersOnly = inputValue.replace(/\D/g, '');
    
    if (numbersOnly === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    // Converte para centavos (divide por 100)
    const numericValue = parseInt(numbersOnly) / 100;
    
    // Formata e exibe
    const formatted = formatCurrency(numericValue);
    setDisplayValue(formatted);
    
    // Chama onChange com o valor numérico
    onChange(numericValue);
  };

  const handleFocus = () => {
    // Se estiver vazio, não faz nada
    if (displayValue === '') return;
    
    // Remove formatação para edição mais fácil
    const numericOnly = displayValue.replace(/[^\d,]/g, '');
    setDisplayValue(numericOnly);
  };

  const handleBlur = () => {
    // Se estiver vazio, mantém vazio
    if (displayValue === '') return;
    
    // Reformata quando perde o foco
    const numericValue = parseCurrency(displayValue);
    const formatted = formatCurrency(numericValue);
    setDisplayValue(formatted);
    onChange(numericValue);
  };

  return (
    <Input
      id={id}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  );
}


