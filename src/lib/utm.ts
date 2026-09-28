// Paramètres UTM du premier atterrissage de la session, joints aux demandes pro.
const KEY = "mdc_utm";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export function captureUtm(search: string = typeof window !== "undefined" ? window.location.search : ""): void {
  try {
    const params = new URLSearchParams(search);
    const found: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) found[key] = value.slice(0, 200);
    }
    if (Object.keys(found).length > 0 && !sessionStorage.getItem(KEY)) {
      sessionStorage.setItem(KEY, JSON.stringify(found));
    }
  } catch {
    // stockage indisponible (navigation privée, cookies bloqués) : on ignore
  }
}

export function getUtm(): Record<string, string> | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : null;
  } catch {
    return null;
  }
}
