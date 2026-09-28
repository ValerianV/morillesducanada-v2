// Export CSV côté admin. Les cellules commençant par = + - @ sont préfixées d'une apostrophe
// pour qu'un tableur ne les interprète pas comme des formules (données saisies par des visiteurs).
export function csvCell(value: unknown): string {
  let text = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function exportCsv(filename: string, headers: string[], rows: unknown[][]): void {
  const csv = [headers.map(csvCell).join(","), ...rows.map((r) => r.map(csvCell).join(","))].join("\n");
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
