import { useState, useEffect, useRef } from 'react';

// ── Launch date: 6 days from now ──────────────────────────────
const LAUNCH_DATE = new Date('2026-04-07T21:00:00+05:30').getTime();

function getTimeLeft() {
  const now = Date.now();
  const diff = Math.max(0, LAUNCH_DATE - now);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
function pad(n) { return String(n).padStart(2, '0'); }

// ── Particle Canvas ───────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '37,99,235' : '6,214,160',
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(37,99,235,${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

const createThemedIcon = (svgPaths) => (
  <svg viewBox="0 0 24 24" fill="none" style={{ width: '28px', height: '28px', filter: 'drop-shadow(0 0 8px rgba(6,214,160,0.5))' }}>
    <defs>
      <linearGradient id="icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="50%" stopColor="#0d9488" />
        <stop offset="100%" stopColor="#06d6a0" />
      </linearGradient>
    </defs>
    <g stroke="url(#icon-grad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {svgPaths}
    </g>
  </svg>
);

const icons = {
  path: createThemedIcon(<path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />),
  bolt: createThemedIcon(<path d="M13 10V3L4 14h7v7l9-11h-7z" fill="url(#icon-grad)" fillOpacity="0.15" />),
  build: createThemedIcon(<><rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="url(#icon-grad)" fillOpacity="0.08" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" /></>),
  community: createThemedIcon(<><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></>),
  expert: createThemedIcon(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#icon-grad)" fillOpacity="0.1" /><path d="M9 12l2 2 4-4" /></>),
  code: createThemedIcon(<><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></>),
};

// ── Countdown Digit (flip-style) ──────────────────────────────
function CountdownDigit({ value, label }) {
  const [prev, setPrev] = useState(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (value !== prev) {
      setFlip(true);
      const t = setTimeout(() => { setPrev(value); setFlip(false); }, 300);
      return () => clearTimeout(t);
    }
  }, [value, prev]);

  return (
    <div className="countdown-box">
      <div className={`countdown-number ${flip ? 'flip' : ''}`}>{pad(value)}</div>
      <div className="countdown-unit">{label}</div>
      <div className="countdown-glow" />
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const [time, setTime] = useState(getTimeLeft);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const audioRef = useRef(null);

  useEffect(() => {
    // Preload the clock sound
    audioRef.current = new Audio('/clock.mp3');
    audioRef.current.volume = 1.0;
    
    // Browsers strictly block audio until the user interacts with the page once.
    // This silently unlocks the audio context the moment they click or tap anywhere.
    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }).catch(() => {});
      }
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };

    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });

    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(getTimeLeft());
      if (audioRef.current) {
        // Cloning the node ensures that if the mp3 is slightly longer than 1s, 
        // the next tick plays immediately without waiting or cutting off.
        const tick = audioRef.current.cloneNode();
        tick.volume = 1.0;
        tick.play().catch(() => {});
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
  };

  return (
    <div onMouseMove={handleMouseMove}>
      <ParticleField />

      {/* Animated background glows that follow mouse slightly */}
      <div className="bg-glow">
        <div className="orb orb-1" style={{ transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)` }} />
        <div className="orb orb-2" style={{ transform: `translate(${-mousePos.x * 20}px, ${-mousePos.y * 20}px)` }} />
        <div className="orb orb-3" />
      </div>

      <div className="page">
        {/* ── Floating Badge ── */}
        <div className="badge animate-in delay-0">
          <span className="badge-dot" />
          <span>Pre-Launch • Something Big is Coming</span>
        </div>

        {/* ── Logo ── */}
        <div className="logo-container animate-in delay-1">
          <img src="/logo.png" alt="skip/years logo" className="logo-image" />
          <div className="logo-ring ring-1" />
          <div className="logo-ring ring-2" />
          <div className="logo-ring ring-3" />
        </div>

        {/* ── Brand ── */}
        <h1 className="brand animate-in delay-2">
          skip<span className="gradient-text">/</span>years
        </h1>
        <p className="tagline animate-in delay-2">
          Stop wasting years on scattered tutorials.<br />
          Curated, week-by-week learning paths from <span className="highlight">real practitioners</span> —{' '}
          so you master skills in <span className="highlight">weeks, not years</span>.
        </p>

        {/* ── Countdown ── */}
        <div className="countdown-wrapper animate-in delay-3">
          <div className="countdown-label">
            <span className="countdown-label-line" />
            Launching In
            <span className="countdown-label-line" />
          </div>
          <div className="countdown">
            <CountdownDigit value={time.days} label="Days" />
            <span className="countdown-colon">:</span>
            <CountdownDigit value={time.hours} label="Hours" />
            <span className="countdown-colon">:</span>
            <CountdownDigit value={time.minutes} label="Minutes" />
            <span className="countdown-colon">:</span>
            <CountdownDigit value={time.seconds} label="Seconds" />
          </div>
        </div>

        {/* ── About ── */}
        <div className="about-section animate-in delay-4">
          <div className="about-accent" />
          <h2>What is <span className="gradient-text">skip/years</span>?</h2>
          <p>
            We're building a platform where <span className="highlight">experienced developers, designers, and data scientists</span> create
            structured, week-by-week learning paths for any skill. Every path includes{' '}
            <span className="highlight">curated resources, project milestones, progress tracking, and community discussion</span> — so
            you always know exactly what to study, in what order, and how long it takes.
          </p>
          <br />
          <p>
            No more scrolling through random YouTube videos hoping you'll figure it out. No more $300 courses
            that teach you outdated content. Just <span className="highlight">battle-tested roadmaps</span> from people who've already walked the path.
          </p>
        </div>

        {/* ── Features ── */}
        <div className="features animate-in delay-5">
          {[
            { icon: icons.path, title: 'Structured Paths', desc: 'Week-by-week guides with clear milestones and curated resources' },
            { icon: icons.bolt, title: 'Time Saved', desc: 'Skip the trial & error — learn exactly what works, in order' },
            { icon: icons.build, title: 'Project-Based', desc: 'Build real projects at every milestone to prove your skills' },
            { icon: icons.community, title: 'Community', desc: 'Discuss, review, and grow together with fellow learners' },
            { icon: icons.expert, title: 'Expert Verified', desc: 'Every path is created and reviewed by experienced practitioners' },
            { icon: icons.code, title: 'Learn by Doing', desc: 'Hands-on practical approach to ensure real-world readiness' },
          ].map((f, i) => (
            <div className="feature-card" key={f.title} style={{ animationDelay: `${0.8 + i * 0.1}s` }}>
              <div className="feature-icon-wrap">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
              <div className="feature-shine" />
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div className="footer animate-in delay-6">
          <p>© {new Date().getFullYear()} skip/years. All rights reserved.</p>
          <a href="https://www.linkedin.com/company/skipyears" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 500 }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-blue)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            Follow our journey on LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
