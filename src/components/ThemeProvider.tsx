"use client";
import { useEffect, useState } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add("dark");
  }, []);

  // Evitar problemas de hidratação retornando conteúdo consistente
  if (!mounted) {
    return <div className="dark">{children}</div>;
  }

  return <>{children}</>;
} 