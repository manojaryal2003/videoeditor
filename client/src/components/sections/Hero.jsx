import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FiPlay, FiArrowRight, FiChevronDown, FiVolume2, FiVolumeX } from 'react-icons/fi';
import api from '../../utils/api';

export default function Hero() {
  const [hero, setHero] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const soundUnlocked = useRef(false); // tracks if user has ever given a gesture

  useEffect(() => {
    api.get('/hero').then(({ data }) => setHero(data.data)).catch(() => {});
  }, []);

  // Initial play (muted — browser requires this)
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.volume = 0.8;
    const play = () => vid.play().catch(() => {});
    if (vid.readyState >= 2) { play(); } else { vid.addEventListener('canplay', play, { once: true }); }
  }, [hero?.videoUrl]);

  // Unlock sound on first real gesture
  useEffect(() => {
    if (!hero?.videoUrl) return;
    const unlock = async () => {
      if (soundUnlocked.current) return;
      soundUnlocked.current = true;
      const vid = videoRef.current;
      if (!vid) return;
      try {
        vid.muted = false;
        vid.volume = 0.8;
        if (vid.paused) await vid.play();
        setIsMuted(false);
      } catch {
        vid.muted = true;
        setIsMuted(true);
      }
      ['click', 'touchend', 'keydown'].forEach((e) => window.removeEventListener(e, unlock));
    };
    ['click', 'touchend', 'keydown'].forEach((e) => window.addEventListener(e, unlock, { passive: true }));
    return () => {
      ['click', 'touchend', 'keydown'].forEach((e) => window.removeEventListener(e, unlock));
    };
  }, [hero?.videoUrl]);

  // Pause+mute when hero scrolls out of view, resume+unmute when back in view
  useEffect(() => {
    if (!hero?.videoUrl) return;
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const vid = videoRef.current;
        if (!vid) return;
        if (entry.isIntersecting) {
          // Back in view — resume from where it stopped
          vid.muted = !soundUnlocked.current; // sound only if user already unlocked it
          setIsMuted(vid.muted);
          vid.play().catch(() => {});
        } else {
          // Scrolled away — pause and mute
          vid.pause();
          vid.muted = true;
          setIsMuted(true);
        }
      },
      { threshold: 0.3 } // fires when 30% of section is visible
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [hero?.videoUrl]);

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    if (!vid.muted) soundUnlocked.current = true; // manual unmute counts as unlock
    setIsMuted(vid.muted);
  };

  const typingSequence = hero?.typingWords?.length
    ? hero.typingWords.flatMap((w) => [w, 2000])
    : ['Video Editor', 2000, 'Motion Designer', 2000, 'Colorist', 2000];

  const scrollToPortfolio = () => {
    document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen flex items-center overflow-hidden bg-dark-900">

      {/* Color Motion Background */}
      {/* Slow drifting orbs */}
      <motion.div
        animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0], scale: [1, 1.3, 0.9, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/25 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -70, 50, 0], y: [0, 80, -30, 0], scale: [1.1, 0.85, 1.2, 1.1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-rose-600/20 rounded-full blur-[140px]"
      />
      <motion.div
        animate={{ x: [0, 60, -80, 0], y: [0, -50, 70, 0], scale: [0.9, 1.2, 1, 0.9] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, -50, 30, 0], y: [0, 60, -80, 0], scale: [1, 0.8, 1.3, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
        className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-red-700/20 rounded-full blur-[90px]"
      />
      {/* Fast-pulsing accent sparks */}
      <motion.div
        animate={{ scale: [1, 1.6, 1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-16 right-1/4 w-48 h-48 bg-primary/40 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ scale: [1.4, 1, 1.4], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-24 left-1/4 w-40 h-40 bg-orange-400/30 rounded-full blur-2xl"
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900/70 via-dark-900/40 to-dark-900" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-transparent to-dark-900/60" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Minimal floating geometric elements */}
      {/* Top-left corner bracket */}
      <motion.div
        animate={{ opacity: [0.12, 0.25, 0.12] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-10 w-16 h-16 border-l-2 border-t-2 border-primary/40 rounded-tl-sm"
      />
      {/* Bottom-right corner bracket */}
      <motion.div
        animate={{ opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-24 right-12 w-16 h-16 border-r-2 border-b-2 border-primary/30 rounded-br-sm"
      />
      {/* Small rotating square */}
      <motion.div
        animate={{ rotate: 360, opacity: [0.08, 0.18, 0.08] }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, opacity: { duration: 5, repeat: Infinity } }}
        className="absolute top-1/3 right-16 w-8 h-8 border border-orange-400/30"
      />
      {/* Tiny dot cluster */}
      <div className="absolute bottom-1/3 left-16 flex gap-2 opacity-20">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
            className="w-1.5 h-1.5 bg-primary rounded-full"
          />
        ))}
      </div>
      {/* Horizontal thin line accent */}
      <motion.div
        animate={{ scaleX: [0.4, 1, 0.4], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-0 w-48 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent origin-left"
      />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-10 items-center min-h-[calc(100vh-80px)]">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase bg-green-500/10 text-green-400 border border-green-500/30 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Available for Projects
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-gray-400 text-lg mb-3 font-medium"
            >
              {hero?.greeting || "Hello, I'm"}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-4"
            >
              {hero?.name || 'Your Name'}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-6 h-12"
            >
              <span className="gradient-text">
                <TypeAnimation
                  sequence={typingSequence}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0"
            >
              {hero?.subheading || 'Crafting cinematic stories that captivate audiences and elevate brands through the art of video editing.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToPortfolio}
                className="btn-primary group"
              >
                <FiPlay size={18} className="group-hover:scale-110 transition-transform" />
                {hero?.ctaLabel || 'View My Work'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToContact}
                className="btn-outline group"
              >
                {hero?.hireMeLabel || 'Hire Me'}
                <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-12 flex gap-8 justify-center lg:justify-start"
            >
              {[['200+', 'Projects'], ['50+', 'Clients'], ['5★', 'Rating']].map(([val, label]) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-bold text-white">{val}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side - Intro Video */}
          {hero?.videoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative hidden lg:flex items-center justify-center w-full"
            >
              {/* Outer glow */}
              <div className="absolute -inset-6 bg-primary/20 rounded-3xl blur-3xl" />

              {/* Animated border wrapper */}
              <div className="relative w-full p-[3px] rounded-2xl bg-gradient-to-br from-primary via-orange-400 to-rose-600 shadow-2xl shadow-primary/50">
                {/* Shimmer pulse */}
                <motion.div
                  animate={{ opacity: [0.3, 0.9, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -inset-[4px] rounded-2xl bg-gradient-to-br from-primary via-orange-400 to-rose-600 blur-md -z-10"
                />

                {/* Video container */}
                <div className="relative rounded-2xl overflow-hidden w-full aspect-video">
                  <video
                    ref={videoRef}
                    loop
                    playsInline
                    controls
                    className="w-full h-full object-cover"
                  >
                    <source src={hero.videoUrl} type="video/mp4" />
                  </video>

                  {/* Sound toggle button */}
                  <button
                    onClick={toggleMute}
                    className="absolute bottom-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white text-xs font-medium hover:bg-black/80 transition-all"
                  >
                    {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
                    {isMuted ? 'Unmute' : 'Mute'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <FiChevronDown size={20} />
      </motion.div>
    </section>
  );
}
