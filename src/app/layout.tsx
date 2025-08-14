import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata = {
  title: "Axion Timesheet",
  description: "Plataforma de apontamento de horas Axion Sistemas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased min-h-screen bg-background text-foreground" suppressHydrationWarning={true}>
        <ThemeProvider>
          <div className="bg-background text-foreground min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
