import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShieldAlert, Download, RefreshCw, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

type Order = {
  id: string;
  email: string;
  customer_name: string;
  status: string;
  items: unknown;
  total_amount: number;
  currency: string;
  stripe_session_id: string | null;
  created_at: string;
  tracking_number: string | null;
  tracking_url: string | null;
  carrier: string | null;
};

type PreOrder = {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  morel_type: string;
  quantity_kg: number;
  total_amount: number;
  status: string;
  stripe_session_id: string | null;
  notes: string | null;
  created_at: string;
};

type Review = {
  id: string;
  first_name: string;
  rating: number;
  comment: string;
  approved: boolean;
  created_at: string;
};

const STATUS_OPTIONS = ["pending", "paid", "shipped", "delivered", "cancelled"];
const PRE_STATUS_OPTIONS = ["pending", "paid", "confirmed", "delivered", "cancelled"];

function exportCsv(filename: string, headers: string[], rows: string[][]) {
  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"orders" | "preorders" | "reviews">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [preOrders, setPreOrders] = useState<PreOrder[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [trackingModal, setTrackingModal] = useState<{ orderId: string; carrier: string; trackingNumber: string; trackingUrl: string } | null>(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/auth"); return; }
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
    if (!data || data.length === 0) { setIsAdmin(false); return; }
    setIsAdmin(true);
    fetchData();
  }

  async function fetchData() {
    setLoading(true);
    try {
      const [ordersRes, preOrdersRes, reviewsRes] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("pre_orders").select("*").order("created_at", { ascending: false }),
        supabase.from("reviews").select("*").order("created_at", { ascending: false }),
      ]);
      if (ordersRes.data) setOrders(ordersRes.data as Order[]);
      if (preOrdersRes.data) setPreOrders(preOrdersRes.data as PreOrder[]);
      if (reviewsRes.data) setReviews(reviewsRes.data as Review[]);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(id: string, newStatus: string) {
    // If changing to "shipped", open tracking modal
    if (newStatus === "shipped") {
      const order = orders.find((o) => o.id === id);
      setTrackingModal({
        orderId: id,
        carrier: order?.carrier || "",
        trackingNumber: order?.tracking_number || "",
        trackingUrl: order?.tracking_url || "",
      });
      return;
    }
    await supabase.from("orders").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
  }

  async function submitShipping() {
    if (!trackingModal) return;
    const { orderId, carrier, trackingNumber, trackingUrl } = trackingModal;
    const { error } = await supabase.from("orders").update({
      status: "shipped",
      carrier: carrier || null,
      tracking_number: trackingNumber || null,
      tracking_url: trackingUrl || null,
      updated_at: new Date().toISOString(),
    }).eq("id", orderId);
    if (error) {
      toast.error("Erreur lors de la mise à jour");
      return;
    }
    setOrders((prev) => prev.map((o) =>
      o.id === orderId ? { ...o, status: "shipped", carrier, tracking_number: trackingNumber, tracking_url: trackingUrl } : o
    ));
    setTrackingModal(null);
    toast.success("Commande expédiée avec suivi");
  }

  async function updatePreOrderStatus(id: string, status: string) {
    await supabase.from("pre_orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    setPreOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  async function deleteReview(id: string) {
    await supabase.from("reviews").delete().eq("id", id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  async function toggleReviewApproval(id: string, approved: boolean) {
    await supabase.from("reviews").update({ approved: !approved }).eq("id", id);
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved: !approved } : r)));
  }

  const filteredOrders = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);
  const filteredPreOrders = statusFilter === "all" ? preOrders : preOrders.filter((o) => o.status === statusFilter);

  const handleExportOrders = () => {
    exportCsv("commandes.csv", ["ID", "Client", "Email", "Statut", "Total", "Date"], filteredOrders.map((o) => [o.id, o.customer_name, o.email, o.status, `${(o.total_amount / 100).toFixed(2)}€`, new Date(o.created_at).toLocaleDateString("fr-FR")]));
  };

  const handleExportPreOrders = () => {
    exportCsv("pre-commandes.csv", ["ID", "Entreprise", "Contact", "Email", "Téléphone", "Type", "Quantité (kg)", "Total", "Statut", "Notes", "Date"], filteredPreOrders.map((o) => [o.id, o.company_name, o.contact_name, o.email, o.phone || "", o.morel_type, String(o.quantity_kg), `${o.total_amount}€`, o.status, o.notes || "", new Date(o.created_at).toLocaleDateString("fr-FR")]));
  };

  if (isAdmin === null) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <ShieldAlert className="w-16 h-16 text-destructive" />
          <h1 className="font-serif text-2xl">Accès refusé</h1>
          <p className="text-muted-foreground font-light">Vous n'avez pas les droits administrateur.</p>
        </div>
      </div>
    );
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-400",
      paid: "bg-green-500/20 text-green-400",
      shipped: "bg-blue-500/20 text-blue-400",
      confirmed: "bg-green-500/20 text-green-400",
      delivered: "bg-emerald-500/20 text-emerald-400",
      cancelled: "bg-red-500/20 text-red-400",
    };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[status] || "bg-muted text-muted-foreground"}`}>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl text-gradient-gold">Dashboard Admin</h1>
              <p className="text-sm text-muted-foreground font-light mt-1">Gestion des commandes et pré-commandes</p>
            </div>
            <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 border border-gold/20 rounded-sm text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Actualiser
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Commandes", value: orders.length },
              { label: "Pré-commandes", value: preOrders.length },
              { label: "En attente", value: [...orders, ...preOrders].filter((o) => o.status === "pending").length },
              { label: "Pré-commandes (kg)", value: `${preOrders.reduce((s, o) => s + Number(o.quantity_kg), 0)} kg` },
            ].map((stat) => (
              <div key={stat.label} className="border border-gold/15 rounded-sm p-4 bg-background/50">
                <p className="text-xs text-muted-foreground font-light tracking-wider uppercase">{stat.label}</p>
                <p className="font-serif text-2xl text-gradient-gold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs + filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex gap-2">
              {(["orders", "preorders", "reviews"] as const).map((t) => (
                <button key={t} onClick={() => { setTab(t); setStatusFilter("all"); }}
                  className={`px-4 py-2 text-sm tracking-wider uppercase rounded-sm transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "border border-gold/20 text-muted-foreground hover:text-primary"}`}
                >{t === "orders" ? "Commandes" : t === "preorders" ? "Pré-commandes" : "Avis"}</button>
              ))}
            </div>
            {tab !== "reviews" && (
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-secondary/30 border border-gold/15 rounded-sm text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">Tous les statuts</option>
                {(tab === "orders" ? STATUS_OPTIONS : PRE_STATUS_OPTIONS).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button onClick={tab === "orders" ? handleExportOrders : handleExportPreOrders}
                className="flex items-center gap-2 px-3 py-2 border border-gold/20 rounded-sm text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Download className="w-4 h-4" /> CSV
              </button>
            </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : tab === "orders" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                   <tr className="border-b border-gold/15 text-left text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Client</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Total</th>
                    <th className="py-3 px-3">Suivi</th>
                    <th className="py-3 px-3">Statut</th>
                    <th className="py-3 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr><td colSpan={7} className="py-12 text-center text-muted-foreground font-light">Aucune commande</td></tr>
                  ) : filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gold/10 hover:bg-secondary/10">
                      <td className="py-3 px-3 text-muted-foreground">{new Date(order.created_at).toLocaleDateString("fr-FR")}</td>
                      <td className="py-3 px-3 font-medium">{order.customer_name}</td>
                      <td className="py-3 px-3 text-muted-foreground">{order.email}</td>
                      <td className="py-3 px-3 text-primary">{(order.total_amount / 100).toFixed(2)} €</td>
                      <td className="py-3 px-3">
                        {order.tracking_number ? (
                          <div className="flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-blue-400" />
                            {order.tracking_url ? (
                              <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">
                                {order.tracking_number}
                              </a>
                            ) : (
                              <span className="text-xs text-muted-foreground">{order.tracking_number}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3">{statusBadge(order.status)}</td>
                      <td className="py-3 px-3">
                        <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="px-2 py-1 bg-secondary/30 border border-gold/15 rounded-sm text-xs focus:outline-none focus:border-primary">
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : tab === "preorders" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/15 text-left text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Entreprise</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Quantité</th>
                    <th className="py-3 px-3">Total</th>
                    <th className="py-3 px-3">Statut</th>
                    <th className="py-3 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPreOrders.length === 0 ? (
                    <tr><td colSpan={8} className="py-12 text-center text-muted-foreground font-light">Aucune pré-commande</td></tr>
                  ) : filteredPreOrders.map((po) => (
                    <tr key={po.id} className="border-b border-gold/10 hover:bg-secondary/10">
                      <td className="py-3 px-3 text-muted-foreground">{new Date(po.created_at).toLocaleDateString("fr-FR")}</td>
                      <td className="py-3 px-3 font-medium">{po.company_name}</td>
                      <td className="py-3 px-3">
                        <div>{po.contact_name}</div>
                        <div className="text-xs text-muted-foreground">{po.email}</div>
                      </td>
                      <td className="py-3 px-3 capitalize">{po.morel_type}</td>
                      <td className="py-3 px-3">{po.quantity_kg} kg</td>
                      <td className="py-3 px-3 text-primary">{po.total_amount} €</td>
                      <td className="py-3 px-3">{statusBadge(po.status)}</td>
                      <td className="py-3 px-3">
                        <select value={po.status} onChange={(e) => updatePreOrderStatus(po.id, e.target.value)}
                          className="px-2 py-1 bg-secondary/30 border border-gold/15 rounded-sm text-xs focus:outline-none focus:border-primary">
                          {PRE_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Reviews tab */
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/15 text-left text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Prénom</th>
                    <th className="py-3 px-3">Note</th>
                    <th className="py-3 px-3">Commentaire</th>
                    <th className="py-3 px-3">Statut</th>
                    <th className="py-3 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-muted-foreground font-light">Aucun avis</td></tr>
                  ) : reviews.map((review) => (
                    <tr key={review.id} className="border-b border-gold/10 hover:bg-secondary/10">
                      <td className="py-3 px-3 text-muted-foreground">{new Date(review.created_at).toLocaleDateString("fr-FR")}</td>
                      <td className="py-3 px-3 font-medium">{review.first_name}</td>
                      <td className="py-3 px-3 text-primary">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</td>
                      <td className="py-3 px-3 text-muted-foreground max-w-xs truncate">{review.comment}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${review.approved ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {review.approved ? "Publié" : "Masqué"}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-2">
                          <button onClick={() => toggleReviewApproval(review.id, review.approved)}
                            className="px-2 py-1 border border-gold/15 rounded-sm text-xs hover:border-primary hover:text-primary transition-colors">
                            {review.approved ? "Masquer" : "Publier"}
                          </button>
                          <button onClick={() => { if (confirm("Supprimer cet avis ?")) deleteReview(review.id); }}
                            className="px-2 py-1 border border-red-500/30 rounded-sm text-xs text-red-400 hover:border-red-500 hover:text-red-300 transition-colors">
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tracking Modal */}
        {trackingModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setTrackingModal(null)}>
            <div className="bg-card border border-gold/20 rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-6">
                <Truck className="w-5 h-5 text-primary" />
                <h3 className="font-serif text-xl">Expédier la commande</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Transporteur</label>
                  <select
                    value={trackingModal.carrier}
                    onChange={(e) => setTrackingModal({ ...trackingModal, carrier: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-gold/15 rounded-sm text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Colissimo">Colissimo</option>
                    <option value="Chronopost">Chronopost</option>
                    <option value="Mondial Relay">Mondial Relay</option>
                    <option value="DHL">DHL</option>
                    <option value="UPS">UPS</option>
                    <option value="FedEx">FedEx</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Numéro de suivi</label>
                  <input
                    type="text"
                    value={trackingModal.trackingNumber}
                    onChange={(e) => setTrackingModal({ ...trackingModal, trackingNumber: e.target.value })}
                    placeholder="Ex: 6A12345678901"
                    className="w-full px-3 py-2 bg-background border border-gold/15 rounded-sm text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1.5">URL de suivi (optionnel)</label>
                  <input
                    type="url"
                    value={trackingModal.trackingUrl}
                    onChange={(e) => setTrackingModal({ ...trackingModal, trackingUrl: e.target.value })}
                    placeholder="https://www.laposte.fr/outils/suivre-vos-envois?code=..."
                    className="w-full px-3 py-2 bg-background border border-gold/15 rounded-sm text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setTrackingModal(null)}
                    className="flex-1 py-2.5 border border-gold/20 rounded-sm text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Annuler
                  </button>
                  <button onClick={submitShipping}
                    className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-sm text-sm font-medium tracking-wider uppercase hover:bg-primary/90 transition-colors">
                    Confirmer l'expédition
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
