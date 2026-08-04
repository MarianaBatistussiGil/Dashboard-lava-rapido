import "./globals.css";

export const metadata = {
  title: "Nogueira Valuation Suite",
  description: "Modelo de DCF interativo do Lava-Rápido Nogueira",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
