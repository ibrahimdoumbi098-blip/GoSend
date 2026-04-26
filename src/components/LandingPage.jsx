import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { OperatorLogo, OPERATORS } from './OperatorLogos.jsx';

const Icon = ({ name, size = 20, className = "", style = {} }) => {
  const LucideIcon = Lucide[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} style={style} />;
};

// ─── Carousel Slides ───
const SLIDES = [
  { title: "Transfert en 10 secondes", desc: "Orange → MTN, Wave → Moov... Peu importe le réseau, votre argent arrive instantanément.", icon: "Zap", color: "#6366F1", bg: "#EEF2FF" },
  { title: "Frais les plus bas", desc: "Seulement 1.5% de frais. Pas de frais cachés, pas de surprises. Transparence totale.", icon: "TrendingDown", color: "#10B981", bg: "#ECFDF5" },
  { title: "Sécurité Bancaire", desc: "Chiffrement AES-256, ledger immuable, et vérification KYC conforme BCEAO.", icon: "Shield", color: "#8B5CF6", bg: "#F5F3FF" },
  { title: "Re-transfer en 1 Tap", desc: "Refaites un transfert précédent d'un simple clic. Aucun concurrent ne l'a.", icon: "RotateCcw", color: "#F59E0B", bg: "#FFFBEB" },
];

const FEATURES = [
  { icon: "ArrowRightLeft", title: "Inter-Opérateurs", desc: "Transférez entre Orange Money, MTN MoMo, Wave et Moov Money sans aucune friction.", color: "#6366F1", bg: "#EEF2FF" },
  { icon: "Clock", title: "Re-transfer 1 Tap", desc: "Refaites un transfert précédent en un seul clic depuis votre historique.", color: "#10B981", bg: "#ECFDF5" },
  { icon: "BarChart3", title: "Monitoring Live", desc: "Suivez chaque transaction en temps réel sur notre dashboard de télémétrie.", color: "#8B5CF6", bg: "#F5F3FF" },
  { icon: "Lock", title: "PIN & Biométrie", desc: "Protégez votre compte avec un code PIN ou la reconnaissance faciale.", color: "#EF4444", bg: "#FEF2F2" },
  { icon: "Receipt", title: "Reçu Digital", desc: "Chaque transfert génère un reçu imprimable avec Transaction ID unique.", color: "#F59E0B", bg: "#FFFBEB" },
  { icon: "Users", title: "Tontine Digitale", desc: "Gérez vos cotisations de groupe directement dans l'app. Bientôt disponible.", color: "#0EA5E9", bg: "#F0F9FF" },
];

const TESTIMONIALS = [
  { name: "Amadou K.", text: "GoSend c'est vraiment efficace ! J'envoie l'argent à ma famille sur Wave depuis mon Orange en 10 secondes. Avant je devais aller au point de vente.", role: "Commerçant", city: "Abidjan", rating: 5 },
  { name: "Fatou D.", text: "Les frais sont hyper transparents, pas comme d'autres applis où tu découvres les frais à la fin. Je recommande à 100% à tout le monde.", role: "Étudiante", city: "Bouaké", rating: 5 },
  { name: "Ibrahim S.", text: "Le re-transfer en 1 tap me fait gagner un temps fou. J'envoie à mes fournisseurs chaque semaine, et avec GoSend c'est devenu automatique.", role: "Entrepreneur", city: "Daloa", rating: 5 },
  { name: "Marie-Claire A.", text: "J'avais peur de faire des transferts en ligne mais GoSend est tellement simple et sécurisé. Le code PIN me rassure énormément.", role: "Enseignante", city: "Yamoussoukro", rating: 5 },
  { name: "Kouadio J.", text: "Depuis que j'utilise GoSend, je n'ai plus besoin de chercher un point Orange pour envoyer de l'argent sur MTN. Tout se fait depuis mon téléphone.", role: "Chauffeur", city: "San-Pédro", rating: 4 },
  { name: "Aïcha T.", text: "Le suivi en temps réel est incroyable. Je vois exactement où en est mon transfert. C'est le futur du mobile money en Afrique.", role: "Comptable", city: "Korhogo", rating: 5 },
];

export default function LandingPage({ onStart }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [count1, setCount1] = useState(0);
  const [visibleTestimonials, setVisibleTestimonials] = useState(3);
  const touchStart = useRef(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % SLIDES.length), 4500);
    return () => clearInterval(timer);
  }, []);

  // Animated counter
  useEffect(() => {
    const duration = 2000, steps = 60, target = 15000;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const eased = 1 - Math.pow(1 - Math.min(step / steps, 1), 3);
      setCount1(Math.floor(eased * target));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) setCurrentSlide(prev => diff > 0 ? Math.min(prev + 1, SLIDES.length - 1) : Math.max(prev - 1, 0));
  };

  return (
    <div style={{ background: 'white' }}>
      {/* ═══ HERO ═══ */}
      <div className="landing-hero animate-fade-up">
        <div className="landing-hero-container" style={{ alignItems: 'flex-start', paddingTop: '40px' }}>
          <div className="hero-text" style={{ paddingTop: '20px' }}>
            <div className="hero-badge" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}><Icon name="Sparkles" size={14} /> N°1 de l'interopérabilité en CI</div>
            <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.05 }}>
              Transférez vers <br/>
              <span className="gradient-text">tous les réseaux</span><br/>
              sans limite.
            </h1>
            <p className="hero-subtitle" style={{ fontSize: '1.2rem', maxWidth: '480px' }}>
              Orange, MTN, Wave, Moov. Envoyez de l'argent instantanément, à moindres frais, depuis votre canapé.
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '-10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid white', background: '#FCD34D', zIndex: 3 }}></div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid white', background: '#60A5FA', zIndex: 2, marginLeft: '-15px' }}></div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid white', background: '#F87171', zIndex: 1, marginLeft: '-15px' }}></div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Rejoignez <span style={{ color: 'var(--text-primary)', fontWeight: 900 }}>{count1.toLocaleString()}+</span> utilisateurs
              </div>
            </div>
          </div>
          
          <div className="hero-visual animate-fade-up-2" style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
            <div className="glow-blob" style={{ right: '-50px', top: '50px' }}></div>
            
            {/* Quick Calculator Card (SendChap Style) */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', 
              borderRadius: '24px', padding: '32px', boxShadow: '0 24px 48px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)',
              position: 'relative', zIndex: 10, width: '100%'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>Simulateur rapide</h3>
                <div style={{ background: '#ECFDF5', color: '#10B981', padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 800 }}>1.5% FRAIS</div>
              </div>

              <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '16px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>TU ENVOIES (Orange Money)</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A' }}>50 000</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#94A3B8' }}>FCFA</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', margin: '-24px 0 8px', position: 'relative', zIndex: 2 }}>
                <div style={{ background: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <Icon name="ArrowDown" size={16} style={{ color: '#6366F1' }} />
                </div>
              </div>

              <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '16px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>LE DESTINATAIRE REÇOIT (MTN MoMo)</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: '#10B981' }}>50 000</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#94A3B8' }}>FCFA</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '13px', fontWeight: 600 }}>
                <span style={{ color: '#64748B' }}>Frais GoSend</span>
                <span style={{ color: '#0F172A', fontWeight: 800 }}>750 FCFA</span>
              </div>

              <button onClick={onStart} style={{ 
                width: '100%', padding: '20px', borderRadius: '16px', border: 'none', 
                background: 'linear-gradient(135deg, #6366F1, #7C3AED)', color: 'white', 
                fontSize: '16px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 8px 24px rgba(99,102,241,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
              }}>
                Continuer le transfert <Icon name="ArrowRight" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ OPERATOR LOGOS BAR ═══ */}
      <div style={{ padding: '32px 24px', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', background: 'white' }}>
        <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>
          Opérateurs partenaires
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
          {OPERATORS.map(op => (
            <div key={op.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <OperatorLogo id={op.id} size={48} />
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)' }}>{op.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ INNOVATION : GOSEND LINK ═══ */}
      <div style={{ background: '#0F172A', padding: '96px 24px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }}></div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', maxWidth: '800px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
        
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '64px' }}>
          
          <div style={{ flex: '1 1 400px', zIndex: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '100px', color: '#818CF8', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '24px' }}>
              <Icon name="Link" size={14} /> EXCLUSIVITÉ GOSEND
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.03em' }}>
              Ne demandez plus <br/>
              <span style={{ color: '#818CF8' }}>"Tu es sur quel réseau ?"</span>
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#94A3B8', lineHeight: 1.7, marginBottom: '32px' }}>
              Créez votre <strong style={{ color: 'white' }}>GoSend Link</strong>. Partagez-le sur WhatsApp ou Instagram. Vos clients cliquent, choisissent leur opérateur, et vous paient directement.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontWeight: 600, fontSize: '14px' }}>
                <Icon name="CheckCircle2" size={18} style={{ color: '#10B981' }} /> Lien universel
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontWeight: 600, fontSize: '14px' }}>
                <Icon name="CheckCircle2" size={18} style={{ color: '#10B981' }} /> Zéro inscription pour le payeur
              </div>
            </div>
          </div>

          <div style={{ flex: '1 1 400px', position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center' }}>
            {/* Mockup of a social media bio with the link */}
            <div style={{ width: '100%', maxWidth: '340px', background: '#1E293B', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 32px 64px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <img src="/happy_customer.png" alt="Profile" style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #818CF8', padding: '2px', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                <div>
                  <h4 style={{ color: 'white', fontSize: '18px', margin: 0, fontWeight: 800 }}>Boutique Amina</h4>
                  <p style={{ color: '#94A3B8', fontSize: '13px', margin: '4px 0 0' }}>Vêtements & Accessoires</p>
                </div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', marginBottom: '24px' }}>
                <p style={{ color: '#CBD5E1', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>Nouvelle collection disponible ! 🛍️<br/>Paiements acceptés via tous les réseaux ici 👇</p>
                <div style={{ marginTop: '16px', background: '#312E81', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #4338CA' }}>
                  <Icon name="Link2" size={18} style={{ color: '#818CF8' }} />
                  <span style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>gosend.ci/pay/amina</span>
                </div>
              </div>

              {/* Simulated Notification */}
              <div className="animate-fade-up-3" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Bell" size={20} style={{ color: 'white' }} />
                </div>
                <div>
                  <div style={{ color: '#10B981', fontSize: '12px', fontWeight: 800 }}>NOUVEAU PAIEMENT (WAVE)</div>
                  <div style={{ color: 'white', fontSize: '15px', fontWeight: 700 }}>+ 25 000 FCFA reçus</div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      <div style={{ padding: '56px 0 32px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="carousel-container" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {SLIDES.map((slide, i) => (
                <div key={i} className="carousel-slide" style={{ textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: slide.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Icon name={slide.icon} size={28} style={{ color: slide.color }} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '-0.02em' }}>{slide.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto' }}>{slide.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel-dots">
            {SLIDES.map((_, i) => (<button key={i} className={`carousel-dot ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)} />))}
          </div>
        </div>
      </div>

      {/* ═══ FEATURES ═══ */}
      <div className="section" style={{ background: 'white', padding: '72px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div className="section-label">Fonctionnalités</div>
          <h2 className="section-title" style={{ maxWidth: '500px', margin: '0 auto 8px' }}>Tout ce qu'il faut pour vos transferts</h2>
          <p className="section-description" style={{ margin: '0 auto' }}>Conçu pour être simple, rapide et sécurisé.</p>
        </div>
        <div className="features-grid" style={{ maxWidth: '900px', margin: '40px auto 0' }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-card-icon" style={{ background: f.bg }}><Icon name={f.icon} size={22} style={{ color: f.color }} /></div>
              <div className="feature-card-title">{f.title}</div>
              <div className="feature-card-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ TESTIMONIALS / AVIS CLIENTS ═══ */}
      <div id="avis" style={{ background: 'var(--bg-secondary)', padding: '72px 24px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="section-label">Avis Clients</div>
            <h2 className="section-title">Ce qu'en disent nos {count1.toLocaleString()}+ utilisateurs</h2>
            <p className="section-description" style={{ margin: '8px auto 0' }}>Rejoignez la communauté GoSend. Note moyenne : ⭐ 4.8/5</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {TESTIMONIALS.slice(0, visibleTestimonials).map((t, i) => (
              <div key={i} className="feature-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '16px' }}>
                  {[...Array(t.rating)].map((_, j) => <Icon key={j} name="Star" size={15} style={{ color: '#F59E0B', fill: '#F59E0B' }} />)}
                  {[...Array(5 - t.rating)].map((_, j) => <Icon key={j} name="Star" size={15} style={{ color: '#E2E8F0' }} />)}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
                  « {t.text} »
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-primary)' }}>{t.name[0]}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.role}, {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {visibleTestimonials < TESTIMONIALS.length && (
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button onClick={() => setVisibleTestimonials(TESTIMONIALS.length)} style={{
                padding: '12px 32px', borderRadius: '12px', border: '1px solid var(--border-light)',
                background: 'white', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '13px',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
              }}>
                Voir plus d'avis ({TESTIMONIALS.length - visibleTestimonials} restants)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ HOW IT WORKS ═══ */}
      <div style={{ background: 'white', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="section-label">Comment ça marche</div>
            <h2 className="section-title">3 étapes, 10 secondes</h2>
          </div>
          
          <div className="how-it-works-container" style={{ display: 'flex', alignItems: 'center', gap: '64px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {[
                { step: '01', title: 'Choisissez les opérateurs', desc: 'Sélectionnez d\'où vient l\'argent et où il va. Orange, MTN, Wave ou Moov.', icon: 'MousePointerClick' },
                { step: '02', title: 'Entrez le montant', desc: 'Tapez le montant et le numéro du destinataire. Les frais sont affichés en temps réel.', icon: 'PenLine' },
                { step: '03', title: 'Envoyez !', desc: 'Cliquez sur Envoyer. Le transfert est confirmé en quelques secondes avec un reçu digital.', icon: 'Send' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '16px', flexShrink: 0,
                    background: 'var(--accent-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(99,102,241,0.1)'
                  }}>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--accent-primary)' }}>{s.step}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>{s.title}</h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="hide-on-mobile" style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div className="glow-blob" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(99,102,241,0.2))' }}></div>
              <div className="phone-mockup" style={{ animation: 'float 7s ease-in-out infinite reverse' }}>
                <div className="phone-notch"></div>
                <div className="phone-screen" style={{ background: '#f8fafc', color: '#0f172a', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Success Header */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ width: '64px', height: '64px', background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 16px rgba(16,185,129,0.2)' }}>
                      <Icon name="Check" size={32} style={{ color: 'white', strokeWidth: 3 }} />
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#64748b' }}>Transfert Réussi</div>
                    <div style={{ fontSize: '36px', fontWeight: 900, marginTop: '4px', color: '#0f172a', letterSpacing: '-0.02em' }}>15 000 F</div>
                    
                    <div style={{ background: 'white', padding: '12px 24px', borderRadius: '100px', marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                      <OperatorLogo id="ORANGE" size={20} />
                      <Icon name="ArrowRight" size={14} style={{ color: '#94a3b8' }} />
                      <OperatorLogo id="MTN" size={20} />
                    </div>
                  </div>
                  
                  {/* Notification Bubble at the bottom */}
                  <div style={{ background: 'white', borderRadius: '32px 32px 0 0', padding: '32px 24px', color: '#0f172a', boxShadow: '0 -8px 32px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '16px', letterSpacing: '0.05em' }}>DESTINATAIRE SATISFAIT</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src="/happy_customer.png" alt="Client satisfait" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #10B981', padding: '2px' }} />
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 800 }}>Amina K.</div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>+225 05 05 05 05</div>
                      </div>
                    </div>
                    <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '12px', marginTop: '20px', fontSize: '13px', color: '#059669', fontWeight: 600, display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <Icon name="CheckCircle2" size={18} /> L'argent est arrivé à la seconde.
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ CTA FINAL ═══ */}
      <div style={{
        background: 'linear-gradient(135deg, #6366F1, #7C3AED)', padding: '72px 24px', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, color: 'white', marginBottom: '12px', letterSpacing: '-0.03em' }}>
          Prêt à simplifier vos transferts ?
        </h2>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '32px', maxWidth: '420px', margin: '0 auto 32px' }}>
          Rejoignez {count1.toLocaleString()}+ utilisateurs qui font confiance à GoSend pour leurs transferts quotidiens.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={onStart} style={{
            padding: '18px 48px', borderRadius: '16px', border: 'none',
            background: 'white', color: '#6366F1', fontWeight: 800, fontSize: '14px',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            transition: 'all 0.2s',
          }}>
            Commencer maintenant →
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px' }}>
          {OPERATORS.map(op => (
            <div key={op.id} style={{ opacity: 0.7 }}><OperatorLogo id={op.id} size={32} /></div>
          ))}
        </div>
      </div>
    </div>
  );
}
