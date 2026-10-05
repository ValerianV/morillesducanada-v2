import { useEffect, useMemo, useState } from "react";
import { Download, Loader2, Phone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PRO_STOCK_KG, formatEurosLocale, formatKg } from "@/lib/proPricing";
import { LEGACY_SAMPLE_KIND, PRO_LEAD_STATUSES, type ProLeadStatus } from "@/lib/proLead";
import { exportCsv } from "@/lib/csv";

type ProLead = {
  id: string;
  created_at: string;
  kind: string;
  status: string;
  company: string;
  siret: string | null;
  contact_name: string;
  email: string;
  phone: string | null;
  establishment_type: string;
  city: string;
  postal_code: string;
  address: string | null;
  availability: string | null;
  kg: number | string | null;
  message: string | null;
  utm: unknown;
  price_tier: string | null;
  unit_price_cents: number | null;
  total_cents: number | null;
  admin_notified_at: string | null;
};

const STATUS_LABELS: Record<ProLeadStatus, string> = {
  nouveau: "Nouveau",
  contacte: "Contacté",
  devis_envoye: "Devis envoyé",
  degustation_planifiee: "Remise planifiée",
  echantillon_remis: "Échantillon remis",
  echantillon_envoye: "Échantillon posté (ancien)",
  gagne: "Gagné",
  perdu: "Perdu",
};

const STATUS_COLORS: Record<string, string> = {
  nouveau: "bg-yellow-500/20 text-yellow-300",
  contacte: "bg-blue-500/20 text-blue-300",
  devis_envoye: "bg-indigo-500/20 text-indigo-300",
  degustation_planifiee: "bg-indigo-500/20 text-indigo-300",
  echantillon_remis: "bg-indigo-500/20 text-indigo-300",
  echantillon_envoye: "bg-indigo-500/20 text-indigo-300",
  gagne: "bg-green-500/20 text-green-300",
  perdu: "bg-red-500/20 text-red-300",
};

const ESTABLISHMENT_LABELS: Record<string, string> = {
  restaurant: "Restaurant",
  epicerie: "Épicerie fine",
  traiteur: "Traiteur",
  distributeur: "Distributeur",
  autre: "Autre",
};

const COLUMNS =
  "id, created_at, kind, status, company, siret, contact_name, email, phone, establishment_type, city, postal_code, address, availability, kg, message, utm, price_tier, unit_price_cents, total_cents, admin_notified_at";

const leadKg = (lead: ProLead) => (lead.kg === null || lead.kg === undefined ? 0 : Number(lead.kg));

const ProLeadsTab = ({ refreshToken }: { refreshToken: number }) => {
  const [leads, setLeads] = useState<ProLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("pro_leads")
        .select(COLUMNS)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error("pro_leads:", error);
        toast.error("Impossible de charger les leads pro (migration pro_leads appliquée ?)");
      } else {
        setLeads((data ?? []) as ProLead[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  // kg demandés : devis encore ouverts ou gagnés (les leads perdus ne comptent plus).
  const requestedKg = useMemo(
    () => leads.filter((l) => l.kind === "devis" && l.status !== "perdu").reduce((s, l) => s + leadKg(l), 0),
    [leads],
  );
  const wonKg = useMemo(
    () => leads.filter((l) => l.kind === "devis" && l.status === "gagne").reduce((s, l) => s + leadKg(l), 0),
    [leads],
  );
  const sampleCount = leads.filter((l) => l.kind !== "devis").length;
  const progress = Math.min(100, (requestedKg / PRO_STOCK_KG) * 100);

  const filtered = leads.filter(
    (l) => (statusFilter === "all" || l.status === statusFilter) && (kindFilter === "all" || l.kind === kindFilter),
  );

  async function updateStatus(id: string, status: string) {
    const previous = leads;
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    const { error } = await supabase.from("pro_leads").update({ status }).eq("id", id);
    if (error) {
      console.error("pro_leads update:", error);
      setLeads(previous);
      toast.error("Statut non enregistré");
    }
  }

  const handleExport = () => {
    exportCsv(
      "leads-pro.csv",
      ["Date", "Type", "Statut", "Établissement", "SIRET", "Type d'établissement", "Contact", "Email", "Téléphone", "Adresse", "Disponibilités", "Code postal", "Ville", "Kg", "Prix €/kg", "Total €", "Message", "UTM"],
      filtered.map((l) => [
        new Date(l.created_at).toLocaleString("fr-FR"),
        l.kind,
        l.status,
        l.company,
        l.siret ?? "",
        ESTABLISHMENT_LABELS[l.establishment_type] ?? l.establishment_type,
        l.contact_name,
        l.email,
        l.phone ?? "",
        l.address ?? "",
        l.availability ?? "",
        l.postal_code,
        l.city,
        l.kg ?? "",
        l.unit_price_cents !== null ? (l.unit_price_cents / 100).toFixed(2) : "",
        l.total_cents !== null ? (l.total_cents / 100).toFixed(2) : "",
        l.message ?? "",
        l.utm ? JSON.stringify(l.utm) : "",
      ]),
    );
  };

  return (
    <div>
      {/* Compteur de stock */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 border border-gold/20 rounded-sm p-5 bg-background/50">
          <p className="text-sm text-foreground/80 tracking-wider uppercase">kg demandés / {PRO_STOCK_KG} kg</p>
          <p className="font-serif text-3xl text-primary mt-1">
            {new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(requestedKg)} / {PRO_STOCK_KG} kg
          </p>
          <div
            className="mt-3 h-2 rounded-full bg-secondary overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={PRO_STOCK_KG}
            aria-valuenow={requestedKg}
          >
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-foreground/75 mt-2">
            Devis non perdus · dont {formatKg(wonKg)} gagnés
          </p>
        </div>
        <div className="border border-gold/20 rounded-sm p-5 bg-background/50">
          <p className="text-sm text-foreground/80 tracking-wider uppercase">Leads</p>
          <p className="font-serif text-3xl text-primary mt-1">{leads.length}</p>
          <p className="text-sm text-foreground/75 mt-2">
            {leads.length - sampleCount} devis · {sampleCount} dégustation{sampleCount > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value)}
          className="px-3 py-2 bg-secondary/30 border border-gold/15 rounded-sm text-sm text-foreground focus:outline-none focus:border-primary"
        >
          <option value="all">Devis et dégustations</option>
          <option value="devis">Devis</option>
          <option value="degustation">Échantillons</option>
          <option value={LEGACY_SAMPLE_KIND}>Échantillons postés (anciens)</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-secondary/30 border border-gold/15 rounded-sm text-sm text-foreground focus:outline-none focus:border-primary"
        >
          <option value="all">Tous les statuts</option>
          {PRO_LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-2 border border-gold/20 rounded-sm text-sm text-foreground/80 hover:text-primary hover:border-primary transition-colors"
        >
          <Download className="w-4 h-4" /> CSV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/15 text-left text-xs text-foreground/70 uppercase tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Établissement</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Demande</th>
                <th className="py-3 px-3">Message</th>
                <th className="py-3 px-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-foreground/70">
                    Aucun lead pro
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr key={lead.id} className="border-b border-gold/10 align-top hover:bg-secondary/10">
                    <td className="py-3 px-3 text-foreground/75 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString("fr-FR")}
                      <div className="text-xs">{new Date(lead.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {lead.kind === "devis" ? "Devis" : lead.kind === LEGACY_SAMPLE_KIND ? "Échantillon (ancien)" : "Dégustation"}
                      {!lead.admin_notified_at && (
                        <div className="text-xs text-red-300" title="L'alerte email n'a pas été envoyée">email non envoyé</div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-foreground">{lead.company}</div>
                      {lead.siret && <div className="text-xs text-foreground/70">SIRET {lead.siret}</div>}
                      <div className="text-xs text-foreground/70">
                        {ESTABLISHMENT_LABELS[lead.establishment_type] ?? lead.establishment_type} · {lead.postal_code} {lead.city}
                      </div>
                      {lead.address && <div className="text-xs text-foreground/70">{lead.address}</div>}
                    </td>
                    <td className="py-3 px-3">
                      <div>{lead.contact_name}</div>
                      <a href={`mailto:${lead.email}`} className="text-xs text-primary hover:underline break-all">
                        {lead.email}
                      </a>
                      {lead.phone && (
                        <a href={`tel:${lead.phone.replace(/[^+0-9]/g, "")}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
                          <Phone className="w-3 h-3" /> {lead.phone}
                        </a>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {lead.kind === "devis" && lead.kg !== null ? (
                        <>
                          <div className="font-medium">{formatKg(leadKg(lead))}</div>
                          {lead.total_cents !== null && (
                            <div className="text-xs text-primary">
                              {formatEurosLocale(lead.total_cents)}
                              {lead.unit_price_cents !== null && ` · ${formatEurosLocale(lead.unit_price_cents)}/kg`}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="text-foreground/75">Pot 30 g</span>
                          {lead.availability && <div className="text-xs text-primary whitespace-normal max-w-[14rem]">{lead.availability}</div>}
                        </>
                      )}
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      {lead.message ? (
                        <button
                          type="button"
                          onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                          className={`text-left text-foreground/80 ${expanded === lead.id ? "whitespace-pre-wrap" : "line-clamp-2"}`}
                        >
                          {lead.message}
                        </button>
                      ) : (
                        <span className="text-foreground/50">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block mb-2 px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[lead.status] ?? "bg-muted text-foreground/80"}`}>
                        {STATUS_LABELS[lead.status as ProLeadStatus] ?? lead.status}
                      </span>
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        aria-label={`Statut du lead ${lead.company}`}
                        className="block px-2 py-1 bg-secondary/30 border border-gold/15 rounded-sm text-xs focus:outline-none focus:border-primary"
                      >
                        {(PRO_LEAD_STATUSES as readonly string[]).includes(lead.status) ? null : (
                          <option value={lead.status}>{STATUS_LABELS[lead.status as ProLeadStatus] ?? lead.status}</option>
                        )}
                        {PRO_LEAD_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProLeadsTab;
