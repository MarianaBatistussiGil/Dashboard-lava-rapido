import Headline from "@/components/landing/Headline";
import LoginCard from "@/components/landing/LoginCard";

export default function Home() {
  return (
    <main className="relative grid min-h-screen grid-cols-1 overflow-hidden lg:grid-cols-2">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-[36rem] w-[36rem] rounded-full bg-wine-900/30 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-wine-950/50 blur-[120px]"
      />

      <section className="relative flex items-center justify-center border-b border-ink-800 px-6 py-14 sm:px-8 sm:py-20 lg:border-b-0 lg:border-r lg:px-20">
        <div className="w-full max-w-md">
          <Headline />
        </div>
      </section>

      <section className="relative flex items-center justify-center px-6 py-14 sm:px-8 sm:py-20 lg:px-20">
        <LoginCard />
      </section>
    </main>
  );
}
