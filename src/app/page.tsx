import Hero from "@/components/Hero";
import Games from "@/components/Games";
import News from "@/components/News";
import Careers from "@/components/Careers";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Games />
      <News />
      <Careers />
      <Footer />
    </main>
  );
}