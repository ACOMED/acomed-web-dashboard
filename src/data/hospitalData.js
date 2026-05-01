/*
 * ═══════════════════════════════════════════════════════════════════
 *  ACOMED — Static Mock Data & Constants
 * ═══════════════════════════════════════════════════════════════════
 */

export const CATEGORY_CONFIG = [
  { key: "hygiene",      label: "Hygiène des locaux",        labelShort: "Hygiène",      icon: "🧴", weight: 0.30 },
  { key: "temperatures", label: "Maîtrise des températures", labelShort: "Températures", icon: "❄️", weight: 0.25 },
  { key: "tracabilite",  label: "Traçabilité des produits",  labelShort: "Traçabilité",  icon: "🏷️", weight: 0.25 },
  { key: "nettoyage",    label: "Plan de nettoyage",         labelShort: "Nettoyage",    icon: "🧹", weight: 0.20 },
];

export const NATIONAL_AVERAGE = {
  
  hygiene:      68,
  temperatures: 63,
  tracabilite:  61,
  nettoyage:    66,
  global:       64.8,
};

export const ACCREDITATION_LEVELS = [
  { level: 1, label: "Niveau 1 — Normes de Base",        color: "#ef4444", min: 0,     max: 49.99 },
  { level: 2, label: "Niveau 2 — Documentation",         color: "#f59e0b", min: 50,    max: 70    },
  { level: 3, label: "Niveau 3 — Données et Résultats",  color: "#3b82f6", min: 70.01, max: 85    },
  { level: 4, label: "Niveau 4 — Amélioration Continue", color: "#10b981", min: 85.01, max: 100   },
];

export const HOSPITALS = [
  {
    id: 1,
    name: "Hôpital Régional Hassan II",
    type: "Hôpital Régional",
    city: "Agadir",
    region: "Souss-Massa",
    beds: 640,
    established: 1982,
    lastAudit: "2024-11-15",
    auditor: "Dr. Amina Benchekroun",
    service: "Urgences",
    scoreConformite: 78.5,
    scoreMaturite: 65,
    accreditationLevel: 3,
    accreditationLabel: "Niveau 3 — Données et Résultats",
    ncMajeures: 2,
    ncMineures: 7,
    capaOuvertes: 4,
    capaCloturees: 15,
    scores: { hygiene: 82, temperatures: 75, tracabilite: 78, nettoyage: 80 },
    pinPosition: { x: "52%", y: "30%" },
  },
  {
    id: 2,
    name: "Hôpital Préfectoral Inezgane",
    type: "Hôpital Préfectoral",
    city: "Inezgane",
    region: "Souss-Massa",
    beds: 280,
    established: 1995,
    lastAudit: "2024-10-22",
    auditor: "Dr. Youssef El Alaoui",
    service: "Bloc Opératoire",
    scoreConformite: 58,
    scoreMaturite: 42,
    accreditationLevel: 2,
    accreditationLabel: "Niveau 2 — Documentation",
    ncMajeures: 5,
    ncMineures: 11,
    capaOuvertes: 9,
    capaCloturees: 6,
    scores: { hygiene: 60, temperatures: 55, tracabilite: 68, nettoyage: 58 },
    pinPosition: { x: "72%", y: "66%" },
  },
  {
    id: 3,
    name: "Polyclinique CNSS Agadir",
    type: "Polyclinique",
    city: "Agadir",
    region: "Souss-Massa",
    beds: 150,
    established: 2005,
    lastAudit: "2024-12-03",
    auditor: "Dr. Fatima-Zahra Tazi",
    service: "Pédiatrie",
    scoreConformite: 91,
    scoreMaturite: 82,
    accreditationLevel: 4,
    accreditationLabel: "Niveau 4 — Amélioration Continue",
    ncMajeures: 0,
    ncMineures: 3,
    capaOuvertes: 1,
    capaCloturees: 22,
    scores: { hygiene: 90, temperatures: 92, tracabilite: 85, nettoyage: 88 },
    pinPosition: { x: "34%", y: "50%" },
  },
];

export function getAccreditationColor(level) {
  const acc = ACCREDITATION_LEVELS.find((a) => a.level === level);
  return acc ? acc.color : "#6b7280";
}

export function getScoreColor(score) {
  if (score >= 85) return "#10b981";
  if (score >= 70) return "#3b82f6";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export function getScoreLabel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Bon";
  if (score >= 50) return "Moyen";
  return "Insuffisant";
}
