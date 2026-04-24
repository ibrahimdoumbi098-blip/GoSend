import React from 'react';

/**
 * OperatorLogos — Logos fidèles aux marques officielles
 * 
 * Wave:   Pingouin noir sur fond bleu #1DC8FF
 * MTN:    "MTN" jaune #FFCC08 + icône téléphone
 * Orange: Carré arrondi orange #FF7900 + logo
 * Moov:   "MOOV Money" sur fond orange #F58220
 */

export const OperatorLogo = ({ id, size = 40 }) => {
  const s = size;
  const logos = {
    // ─── Orange Money — Carré orange + logo officiel ───
    ORANGE: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" rx="13" fill="#FF7900"/>
        {/* Logo "carré arrondi" d'Orange */}
        <rect x="13" y="13" width="26" height="26" rx="7" fill="white"/>
        <rect x="17" y="17" width="18" height="18" rx="5" fill="#FF7900"/>
        <rect x="20" y="20" width="12" height="12" rx="3" fill="white"/>
        <rect x="23" y="23" width="6" height="6" rx="2" fill="#FF7900"/>
      </svg>
    ),

    // ─── MTN MoMo — Fond jaune + "MTN" bleu + icône mobile ───
    MTN: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" rx="13" fill="#FFCC08"/>
        <text x="26" y="23" textAnchor="middle" fontWeight="900" fontSize="16" fill="#003068" fontFamily="Inter,Arial,sans-serif">MTN</text>
        {/* Petite icône téléphone mobile */}
        <rect x="20" y="28" width="12" height="16" rx="2.5" fill="#003068"/>
        <rect x="22" y="30" width="8" height="9" rx="1" fill="#FFCC08"/>
        <circle cx="26" cy="41" r="1.3" fill="#FFCC08"/>
        {/* Ondes */}
        <path d="M34 30 Q37 33 34 36" stroke="#003068" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M37 28 Q41 33 37 38" stroke="#003068" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      </svg>
    ),

    // ─── Wave — Pingouin sur fond bleu ───
    WAVE: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26" cy="26" r="26" fill="#1DC8FF"/>
        {/* Corps du pingouin */}
        <ellipse cx="26" cy="30" rx="10" ry="14" fill="#2D2D2D"/>
        {/* Ventre blanc */}
        <ellipse cx="26" cy="32" rx="7" ry="11" fill="white"/>
        {/* Tête */}
        <circle cx="26" cy="17" r="8" fill="#2D2D2D"/>
        {/* Yeux */}
        <circle cx="23" cy="16" r="2" fill="white"/>
        <circle cx="29" cy="16" r="2" fill="white"/>
        <circle cx="23.5" cy="16" r="1" fill="#2D2D2D"/>
        <circle cx="29.5" cy="16" r="1" fill="#2D2D2D"/>
        {/* Bec */}
        <path d="M24 20 L26 23 L28 20" fill="#FF8C00" stroke="#FF8C00" strokeWidth="0.5" strokeLinejoin="round"/>
        {/* Ailes */}
        <ellipse cx="16" cy="30" rx="3" ry="8" fill="#2D2D2D" transform="rotate(-8 16 30)"/>
        <ellipse cx="36" cy="30" rx="3" ry="8" fill="#2D2D2D" transform="rotate(8 36 30)"/>
        {/* Pattes */}
        <ellipse cx="22" cy="43" rx="3.5" ry="1.5" fill="#FF8C00"/>
        <ellipse cx="30" cy="43" rx="3.5" ry="1.5" fill="#FF8C00"/>
      </svg>
    ),

    // ─── Moov Money — Fond orange + texte MOOV/Money ───
    MOOV: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" rx="13" fill="#F58220"/>
        <text x="26" y="22" textAnchor="middle" fontWeight="900" fontSize="13" fill="#003B7C" fontFamily="Inter,Arial,sans-serif">MOOV</text>
        <text x="26" y="36" textAnchor="middle" fontWeight="700" fontSize="13" fill="white" fontFamily="Georgia,serif" fontStyle="italic">Money</text>
        {/* Petite icône enveloppe/billet */}
        <path d="M18 39 L22 42 L34 42 L34 39" stroke="#FFF" strokeWidth="1" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  };
  return logos[id] || null;
};

export const OPERATORS = [
  { id: 'ORANGE', name: 'Orange Money', short: 'Orange', color: '#FF7900' },
  { id: 'MTN', name: 'MTN MoMo', short: 'MTN', color: '#FFCC08' },
  { id: 'WAVE', name: 'Wave', short: 'Wave', color: '#1DC8FF' },
  { id: 'MOOV', name: 'Moov Money', short: 'Moov', color: '#F58220' },
];

export default OperatorLogo;
