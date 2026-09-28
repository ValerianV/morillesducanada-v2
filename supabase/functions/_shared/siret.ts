// Numéro SIRET : 14 chiffres, clé de contrôle de Luhn.
// Module pur, partagé par le formulaire /professionnels, submit-pro-lead et stripe-webhook.

// Garde uniquement les chiffres (« 802 861 948 00023 » → « 80286194800023 »).
export function normalizeSiret(value: unknown): string {
  return typeof value === "string" ? value.replace(/[\s.-]/g, "") : "";
}

function luhnValid(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

// Les établissements de La Poste (SIREN 356 000 000) ne respectent pas la clé de Luhn :
// la somme de leurs chiffres est un multiple de 5.
const LA_POSTE_SIREN = "356000000";

export function isValidSiret(value: unknown): boolean {
  const digits = normalizeSiret(value);
  if (!/^\d{14}$/.test(digits)) return false;
  if (digits.startsWith(LA_POSTE_SIREN) && digits !== "35600000000048") {
    const sum = [...digits].reduce((acc, d) => acc + Number(d), 0);
    return sum % 5 === 0;
  }
  return luhnValid(digits);
}

// « 80286194800023 » → « 802 861 948 00023 ».
export function formatSiret(value: unknown): string {
  const d = normalizeSiret(value);
  return /^\d{14}$/.test(d) ? `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}` : String(value ?? "");
}
