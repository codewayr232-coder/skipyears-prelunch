import { useState, useEffect } from 'react';

// ── Launch date ───────────────────────────────────────────────
const LAUNCH_DATE = new Date('2026-04-07T21:00:00+05:30').getTime();

function getTimeLeft() {
  const now = Date.now();
  const diff = Math.max(0, LAUNCH_DATE - now);
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    total:   diff,
  };
}
function pad(n) { return String(n).padStart(2, '0'); }

// ── Win2k clock ───────────────────────────────────────────────
function WinClock() {
  const [t, setT] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  });
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setT(d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{t}</span>;
}

// ── Title bar chrome ──────────────────────────────────────────
function TitleBar({ icon, title, active = true }) {
  return (
    <div className="win-titlebar" style={{ opacity: active ? 1 : 0.75 }}>
      <div className="win-titlebar-left">
        <span style={{ fontSize: '12px', lineHeight: 1 }}>{icon}</span>
        <span className="win-titlebar-text">{title}</span>
      </div>
      <div className="win-titlebar-btns">
        <button className="win-btn" aria-label="Minimize">_</button>
        <button className="win-btn" aria-label="Maximize">□</button>
        <button className="win-btn close" aria-label="Close" style={{ fontWeight: 'bold', color: '#000' }}>✕</button>
      </div>
    </div>
  );
}

// ── Countdown digit ───────────────────────────────────────────
function CountdownDigit({ value, label }) {
  const [prev, setPrev] = useState(value);
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    if (value !== prev) {
      setFlip(true);
      const t = setTimeout(() => { setPrev(value); setFlip(false); }, 250);
      return () => clearTimeout(t);
    }
  }, [value, prev]);
  return (
    <div className="countdown-win-box">
      <span className={`countdown-win-number${flip ? ' flip' : ''}`}>{pad(value)}</span>
      <span className="countdown-win-unit">{label}</span>
    </div>
  );
}

// ── Progress toward launch ─────────────────────────────────────
const TOTAL_DURATION = 6 * 24 * 60 * 60 * 1000; // 6 days in ms
function LaunchProgress({ timeLeft }) {
  const elapsed = TOTAL_DURATION - timeLeft.total;
  const pct = Math.min(100, Math.max(0, (elapsed / TOTAL_DURATION) * 100));
  return (
    <div className="win-progress-container">
      <div className="win-progress-label">Launch progress: {pct.toFixed(1)}% elapsed</div>
      <div className="win-progress-track">
        <div className="win-progress-bar" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Desktop icons (decorative) ─────────────────────────────────
const DESKTOP_ICONS = [
  { img: '💻', label: 'My Computer' },
  { img: '🌐', label: 'Internet Explorer' },
  { img: '🗑️', label: 'Recycle Bin' },
  { img: '📁', label: 'skip/years' },
];

// ── Feature icons (pixel-style via text) ─────────────────────
const FEATURES = [
  { icon: '🗺️', title: 'Structured Paths',  desc: 'Week-by-week guides with clear milestones and curated resources' },
  { icon: '⚡', title: 'Time Saved',         desc: 'Skip the trial & error — learn exactly what works, in order' },
  { icon: '🔧', title: 'Project-Based',      desc: 'Build real projects at every milestone to prove your skills' },
  { icon: '👥', title: 'Community',          desc: 'Discuss, review, and grow together with fellow learners' },
  { icon: '🛡️', title: 'Expert Verified',    desc: 'Every path is created and reviewed by experienced practitioners' },
  { icon: '💡', title: 'Learn by Doing',     desc: 'Hands-on practical approach to ensure real-world readiness' },
];

// ── Menu bar ──────────────────────────────────────────────────
function MenuBar() {
  return (
    <div className="win-menubar">
      {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map(item => (
        <div className="win-menu-item" key={item}>
          <u>{item[0]}</u>{item.slice(1)}
        </div>
      ))}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Desktop icons */}
      <div className="desktop-icons" aria-hidden="true">
        {DESKTOP_ICONS.map(ic => (
          <div className="desktop-icon" key={ic.label} title={ic.label}>
            <span className="desktop-icon-img">{ic.img}</span>
            <span className="desktop-icon-label">{ic.label}</span>
          </div>
        ))}
      </div>

      {/* ── Main page ── */}
      <main className="page">

        {/* ══ Main window: skip/years ═════════════════════════════ */}
        <div className="win-window" style={{ maxWidth: 680 }}>
          <TitleBar icon="🌐" title="skip/years — Pre-Launch Announcement" />
          <MenuBar />

          <div className="win-content">

            {/* Logo + brand */}
            <div className="win-body" style={{ marginBottom: 10 }}>
              <div className="logo-win">
                <img src="/logo.png" alt="skip/years logo" className="logo-image" />
              </div>
              <h1 className="brand-win">skip<span className="slash">/</span>years</h1>
              <p className="win-tagline" style={{ marginTop: 6 }}>
                Stop wasting years on scattered tutorials.<br />
                Curated, week-by-week learning paths from{' '}
                <b>real practitioners</b> — so you master skills in{' '}
                <b>weeks, not years</b>.
              </p>
            </div>

            {/* Status bar badge */}
            <div className="win-statusbar" style={{ marginBottom: 10 }}>
              <div className="win-status-panel" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#06d6a0', display: 'inline-block', boxShadow: '0 0 0 1px #444' }} />
                Pre-Launch • Something Big is Coming
              </div>
              <div className="win-status-panel">Status: COMING SOON</div>
            </div>

            {/* ── Countdown window ── */}
            <div className="win-window" style={{ marginBottom: 10 }}>
              <TitleBar icon="⏰" title="countdown.exe" />
              <div className="win-content" style={{ paddingBottom: 14 }}>
                <div className="countdown-win-label">Launching In</div>
                <div className="countdown-win">
                  <CountdownDigit value={time.days}    label="Days" />
                  <span className="countdown-win-colon">:</span>
                  <CountdownDigit value={time.hours}   label="Hours" />
                  <span className="countdown-win-colon">:</span>
                  <CountdownDigit value={time.minutes} label="Minutes" />
                  <span className="countdown-win-colon">:</span>
                  <CountdownDigit value={time.seconds} label="Seconds" />
                </div>
                <hr className="win-sep" style={{ margin: '12px 0 0' }} />
                <LaunchProgress timeLeft={time} />
              </div>
            </div>

            {/* ── About window ── */}
            <div className="win-window" style={{ marginBottom: 10 }}>
              <TitleBar icon="ℹ️" title="About skip/years — readme.txt" />
              <div className="win-content">
                <div className="about-win-body">
                  <h2>What is skip/years?</h2>
                  <p>
                    We&apos;re building a platform where{' '}
                    <span className="win-highlight">experienced developers, designers, and data scientists</span>{' '}
                    create structured, week-by-week learning paths for any skill. Every path includes{' '}
                    <span className="win-highlight">curated resources, project milestones, progress tracking, and community discussion</span>{' '}
                    — so you always know exactly what to study, in what order, and how long it takes.
                  </p>
                  <p>
                    No more scrolling through random YouTube videos hoping you&apos;ll figure it out. No more $300
                    courses teaching outdated content. Just{' '}
                    <span className="win-highlight">battle-tested roadmaps</span> from people who&apos;ve already walked the path.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Features window ── */}
            <div className="win-window" style={{ marginBottom: 10 }}>
              <TitleBar icon="📋" title="features.msi — Feature List" />
              <div className="win-content">
                <div className="features-win">
                  {FEATURES.map(f => (
                    <div className="feature-win-card" key={f.title}>
                      <div className="feature-win-icon" aria-hidden="true">{f.icon}</div>
                      <div className="feature-win-title">{f.title}</div>
                      <div className="feature-win-desc">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Dialog: follow on LinkedIn ── */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <div className="win-dialog">
                <TitleBar icon="🔔" title="Notification" />
                <div className="win-dialog-body">
                  <span className="win-dialog-icon" aria-hidden="true">ℹ️</span>
                  <div className="win-dialog-text">
                    Would you like to follow <b>skip/years</b> on LinkedIn to stay updated on our launch?
                  </div>
                </div>
                <hr className="win-sep" />
                <div className="win-dialog-btns">
                  <a
                    href="https://www.linkedin.com/company/skipyears"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="win-push-btn default"
                    style={{ textDecoration: 'none', color: '#000' }}
                  >
                    Yes
                  </a>
                  <button className="win-push-btn">No</button>
                  <button className="win-push-btn">Cancel</button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="win-footer">
              © {new Date().getFullYear()} skip/years. All rights reserved. &nbsp;|&nbsp; Windows® 2000 Edition
            </div>
          </div>

          {/* Main status bar */}
          <div className="win-statusbar">
            <div className="win-status-panel">Ready</div>
            <div className="win-status-panel">skipyears.com</div>
          </div>
        </div>

      </main>

      {/* ── Taskbar ── */}
      <div className="win-taskbar" role="toolbar" aria-label="Taskbar">
        <button className="win-start-btn" aria-label="Start">
          <span className="win-start-flag" aria-hidden="true">🪟</span>
          <b>Start</b>
        </button>
        <div className="win-taskbar-divider" aria-hidden="true" />
        <div className="win-taskbar-item active">🌐 skip/years — Pre-Launch</div>
        <div className="win-taskbar-item">⏰ countdown.exe</div>
        <div className="win-systray" aria-label="System tray">
          <span title="Network" aria-hidden="true">🌐</span>
          <span title="Volume"  aria-hidden="true">🔊</span>
          <WinClock />
        </div>
      </div>
    </>
  );
}
