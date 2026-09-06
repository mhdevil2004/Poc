import HeroSection from './components/HeroSection';
import { TokenHandler } from './components/TokenHandler';

export default function Home() {
  return (
    <main>
      <TokenHandler />
      <HeroSection />
    </main>
  );
}