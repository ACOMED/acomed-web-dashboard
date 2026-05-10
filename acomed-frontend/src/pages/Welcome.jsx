import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Particles Background (mimics tsparticles) ──
const Particles = () => {
  useEffect(() => {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 60;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.fillStyle = 'rgba(163, 222, 131, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(163, 222, 131, ${1 - dist / 100})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas id="hero-particles" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />;
};

// ── Typewriter Effect ──
const Typewriter = () => {
  const words = ["Futur De L'Audit", "ACOMED"];
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  return (
    <span style={{ color: '#fff', zIndex: 10, position: 'relative' }}>
      {text}
      <span style={{ animation: 'blink 1s step-end infinite', color: '#A3DE83' }}>|</span>
    </span>
  );
};

const WavyDivider = ({ fill, flip, absolute }) => (
  <svg
    className={`wavy-divider ${absolute ? 'absolute-divider' : ''}`}
    viewBox="0 0 1440 100"
    preserveAspectRatio="none"
    style={{ transform: flip ? 'rotate(180deg)' : 'none' }}
  >
    <path
      fill={fill}
      d="M0,40 C320,100 480,0 720,40 C960,80 1120,0 1440,40 L1440,100 L0,100 Z"
    ></path>
  </svg>
);

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-1337">
      {/* ── Fixed Navbar ── */}
      <header className="nav-1337">
        <div className="logo-1337">
          <img src="/logo.png" alt="ACOMED Logo" style={{ height: '32px', filter: 'brightness(0) invert(1)' }} />
        </div>
        <nav className="links-1337">
          <a href="#adn">L'ADN</a>
          <a href="#campuses">Nos Campuses</a>
          <a href="#concept">Concept</a>
          <a href="#rejoindre">Nous Rejoindre</a>
        </nav>
        <div className="actions-1337">
          <button className="btn-lang">Français ▼</button>
          <button className="btn-login-1337" onClick={() => navigate('/login')}>
            Inscris-toi
          </button>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <main className="hero-1337" style={{ backgroundImage: 'url("/hero.png")' }}>
        <Particles />
        <div className="hero-overlay">
          <div className="hero-content-center">
            <h1 className="hero-title-large">
              <Typewriter />
            </h1>
          </div>
        </div>
        <WavyDivider fill="#ffffff" absolute />
      </main>

      {/* ── ADN Section ── */}
      <section id="adn" className="adn-section">
        <div className="adn-container">
          <h2 className="section-title-1337">L'adn ACOMED</h2>
          <div className="green-dot-line">
            <div className="green-dot"></div>
            <div className="green-dot"></div>
            <div className="green-dot"></div>
          </div>

          <div className="video-box-1337">
            <div className="video-placeholder" style={{ backgroundImage: 'url("/hero.png")', opacity: 0.8 }}>
              <div className="play-btn-1337">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="#1a1c23">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="adn-description">
            <p><strong>JE CODE, TU CODES, NOUS CODONS …</strong></p>
            <p>
              ACOMED est la première plateforme d'audit médical pensée pour les inspecteurs,
              totalement gratuite dans sa phase d'essai, accessible partout et surtout 100% fonctionnelle hors-ligne.
              C’est une immersion complète dans un univers où le futur de la santé est déjà présent.
            </p>
            <p>
              La pédagogie d'ACOMED s’articule autour de l'efficacité sur le terrain.
              Un fonctionnement intuitif qui permet aux inspecteurs de libérer leur potentiel
              grâce à une interface simplifiée et des rapports générés en temps réel.
            </p>
          </div>

          {/* ── Grid Cards ── */}
          <div className="grid-3-1337">
            <div className="card-1337">
              <div className="icon-wrap">
                <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none"><path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7M4 21V7m16 14V7" /></svg>
              </div>
              <h3>Nos Campuses</h3>
              <p>Tous les ingrédients sont réunis pour faire de vos audits une réussite totale.</p>
            </div>
            <div className="card-1337">
              <div className="icon-wrap">
                <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
              </div>
              <h3>Les Étapes</h3>
              <p>Le processus est entièrement digitalisé. Aucun papier ne sera gaspillé durant le cursus.</p>
            </div>
            <div className="card-1337">
              <div className="icon-wrap">
                <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" /></svg>
              </div>
              <h3>FAQ</h3>
              <p>Tu as des questions ? Consultez nos F.A.Q, tu y trouveras sans doute les réponses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pourquoi Section ── */}
      <WavyDivider fill="#1a1c23" flip />
      <section className="pourquoi-section">
        <div className="pourquoi-content">
          <h2>Pourquoi ACOMED?</h2>
          <div className="green-dot-line">
            <div className="green-dot"></div>
            <div className="green-dot"></div>
            <div className="green-dot"></div>
          </div>
          <p>
            Tout d’abord, il faudra prendre l’habitude de voir l'audit comme un outil de progression et non de sanction.
            ACOMED vient simplifier les échanges entre les inspecteurs et les établissements de santé.
            Une application robuste, rapide et intelligente.
          </p>
        </div>
      </section>

      {/* ── Route Section ── */}
      <WavyDivider fill="#ffffff" />
      <section className="route-section">
        <div className="route-container">
          <h2 className="section-title-1337" style={{ textAlign: 'center', marginBottom: '60px' }}>La route vers ACOMED</h2>

          <div className="route-step">
            <div className="step-icon">01</div>
            <div className="step-info">
              <h3><span>#1 </span> - Test En Ligne - 2 Heures</h3>
              <p>Votre admission commence par une évaluation de vos compétences analytiques directement sur notre portail.</p>
            </div>
          </div>

          <div className="route-step">
            <div className="step-icon">02</div>
            <div className="step-info">
              <h3><span>#2 </span> - Check-in</h3>
              <p>Une fois les tests validés, rejoignez-nous pour une session d'orientation et de paramétrage de vos outils.</p>
            </div>
          </div>

          <div className="route-step">
            <div className="step-icon">03</div>
            <div className="step-info">
              <h3><span>#3 </span> - Piscine d'Audit - 4 Semaines</h3>
              <p>Une immersion intensive dans des scénarios d'audit réels pour maîtriser chaque recoin de l'application.</p>
            </div>
          </div>

          <div className="route-step">
            <div className="step-icon">04</div>
            <div className="step-info">
              <h3><span>#4 </span> - Départ en Mission</h3>
              <p>Début de l'aventure ACOMED. Vous êtes maintenant prêt à transformer le paysage médical.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer-1337">
        <div className="footer-top">
          <div className="footer-cta">
            <h2>Prêt(e) à relever le défi?</h2>
            <button className="btn-footer" onClick={() => navigate('/login')}>Inscris-toi</button>
          </div>
          <div className="social-links">
            <a href="#" className="social-icon">F</a>
            <a href="#" className="social-icon">T</a>
            <a href="#" className="social-icon">I</a>
            <a href="#" className="social-icon">Y</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 | ACOMED est un organisme dédié à l'excellence médicale.</p>
        </div>
      </footer>
    </div>
  );
}