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
        <rect width="52" height="52" rx="10" fill="#FF6600"/>
        <text x="25" y="42" textAnchor="middle" fontWeight="700" fontSize="17" fill="white" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="-0.5">orange</text>
        <text x="44" y="32" textAnchor="middle" fontWeight="700" fontSize="6" fill="white" fontFamily="Arial, Helvetica, sans-serif">TM</text>
      </svg>
    ),

    // ─── MTN MoMo — Fond jaune + Ovale bleu + MTN ───
    MTN: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" rx="10" fill="#FFCC00"/>
        <ellipse cx="26" cy="26" rx="22" ry="12" fill="#006699"/>
        <text x="25" y="32" textAnchor="middle" fontWeight="900" fontSize="16" fill="white" fontFamily="Arial, Helvetica, sans-serif" fontStyle="italic" letterSpacing="-0.5">MTN</text>
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
