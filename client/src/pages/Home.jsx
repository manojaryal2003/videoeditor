import { useEffect, useState } from 'react';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Stats from '../components/sections/Stats';
import Services from '../components/sections/Services';
import Portfolio from '../components/sections/Portfolio';
import FeaturedProjects from '../components/sections/FeaturedProjects';
import Tools from '../components/sections/Tools';
import Testimonials from '../components/sections/Testimonials';
import Contact from '../components/sections/Contact';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppButton from '../components/sections/WhatsAppButton';
import api from '../utils/api';

export default function Home() {
  const [about, setAbout] = useState(null);
  useEffect(() => {
    api.get('/about').then(({ data }) => setAbout(data.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Stats />
        <Services />
        <FeaturedProjects />
        <Portfolio />
        <Tools />
        <Testimonials />
        <Contact />
      </main>
      <Footer about={about} />
      <WhatsAppButton />
    </div>
  );
}
