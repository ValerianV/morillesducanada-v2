import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Loader2, LogOut, Save, User, Package, Mail, FileText, ExternalLink, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import type { Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: any;
  customer_name: string;
  email: string;
  tracking_number: string | null;
  tracking_url: string | null;
  carrier: string | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "En attente", color: "text-yellow-500" },
  paid: { label: "Payée", color: "text-green-500" },
  shipped: { label: "Expédiée", color: "text-blue-500" },
  delivered: { label: "Livrée", color: "text-primary" },
  cancelled: { label: "Annulée", color: "text-destructive" },
};

const Profil = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate("/auth");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetchProfile();
    fetchOrders();
  }, [session?.user?.id]);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else if (data) {
      setProfile(data);
      setDisplayName(data.display_name || "");
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    if (!session?.user?.id) return;
    setOrdersLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("id, created_at, status, total_amount, items, customer_name, email, tracking_number, tracking_url, carrier")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data || []);
    }
    setOrdersLoading(false);
  };

  const handleDownloadInvoice = async (orderId: string) => {
    setDownloadingInvoice(orderId);
    try {
      const { data, error } = await supabase.functions.invoke("generate-invoice", {
        body: { orderId },
      });

      if (error) throw error;

      // data is HTML string - open in new tab
      const blob = new Blob([data], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error("Invoice error:", err);
      toast.error("Impossible de générer la facture");
    } finally {
      setDownloadingInvoice(null);
    }
  };

  const handleSaveProfile = async () => {
    if (!session?.user?.id) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id);

    if (error) {
      toast.error("Erreur lors de la sauvegarde");
      console.error(error);
    } else {
      toast.success("Profil mis à jour");
      fetchProfile();
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.id) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2 Mo");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${session.user.id}/avatar.${ext}`;

    await supabase.storage.from("avatars").remove([filePath]);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Erreur lors de l'upload");
      console.error(uploadError);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
      .eq("id", session.user.id);

    if (updateError) {
      toast.error("Erreur lors de la mise à jour du profil");
    } else {
      toast.success("Avatar mis à jour");
      fetchProfile();
    }
    setUploading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-2xl">
          <ScrollReveal blur>
            <div className="text-center mb-12">
              <p className="text-sm tracking-[0.3em] uppercase text-primary/80 mb-4">
                Mon espace
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-light">
                Mon <span className="italic text-gradient-gold">profil</span>
              </h1>
              <div className="divider-gold w-24 mx-auto mt-6" />
            </div>
          </ScrollReveal>

          {/* Avatar Section */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-col items-center mb-10">
              <motion.div
                className="relative group cursor-pointer mb-4"
                whileHover={{ scale: 1.05 }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary/30 bg-card">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  ) : (
                    <Camera className="w-6 h-6 text-primary" />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </motion.div>
              <p className="text-xs text-muted-foreground font-light">
                Cliquez pour changer votre photo (max 2 Mo)
              </p>
            </div>
          </ScrollReveal>

          {/* Profile Form */}
          <ScrollReveal delay={0.2}>
            <div className="bg-card border border-border rounded-lg p-8 mb-8">
              <h2 className="font-serif text-xl text-foreground mb-6">
                Informations personnelles
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-muted-foreground font-light mb-2">
                    Adresse email
                  </label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border border-border rounded-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground/70">
                      {session?.user?.email}
                    </span>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm text-muted-foreground font-light mb-2"
                  >
                    Nom d'affichage
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors text-sm"
                  />
                </div>
                <motion.button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full py-3 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </ScrollReveal>

          {/* Order History */}
          <ScrollReveal delay={0.3}>
            <div className="bg-card border border-border rounded-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-xl text-foreground">
                  Historique de commandes
                </h2>
              </div>
              {ordersLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10">
                  <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground font-light mb-2">
                    Aucune commande pour le moment
                  </p>
                  <p className="text-xs text-muted-foreground/60 font-light max-w-sm mx-auto">
                    Vos commandes et factures apparaîtront ici après votre premier achat.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const statusInfo = STATUS_LABELS[order.status] || { label: order.status, color: "text-muted-foreground" };
                    const items = Array.isArray(order.items) ? order.items : [];
                    const canDownloadInvoice = ["paid", "shipped", "delivered"].includes(order.status);

                    return (
                      <div
                        key={order.id}
                        className="border border-border/50 rounded-sm p-4 hover:border-primary/20 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-xs text-muted-foreground font-light">
                              {new Date(order.created_at).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-sm text-foreground mt-1">
                              Commande #{order.id.substring(0, 8).toUpperCase()}
                            </p>
                          </div>
                          <span className={`text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>

                        {/* Items list */}
                        <div className="space-y-1 mb-3">
                          {items.map((item: any, idx: number) => (
                            <p key={idx} className="text-xs text-muted-foreground font-light">
                              {item.quantity || 1}× {item.name || item.product?.name || "Morilles"}
                            </p>
                          ))}
                        </div>

                        {/* Tracking info */}
                        {order.tracking_number && (
                          <div className="flex items-center gap-2 mb-3 p-2.5 bg-blue-500/5 border border-blue-500/15 rounded-sm">
                            <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                            <div className="text-xs">
                              <span className="text-muted-foreground">{order.carrier ? `${order.carrier} · ` : ""}</span>
                              {order.tracking_url ? (
                                <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-medium">
                                  {order.tracking_number} ↗
                                </a>
                              ) : (
                                <span className="text-foreground font-medium">{order.tracking_number}</span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-border/30">
                          <p className="text-sm font-medium text-primary">
                            {(order.total_amount / 100).toFixed(2)} €
                          </p>
                          {canDownloadInvoice && (
                            <motion.button
                              onClick={() => handleDownloadInvoice(order.id)}
                              disabled={downloadingInvoice === order.id}
                              className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {downloadingInvoice === order.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <FileText className="w-3.5 h-3.5" />
                              )}
                              Facture
                              <ExternalLink className="w-3 h-3" />
                            </motion.button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Account info & Logout */}
          <ScrollReveal delay={0.4}>
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="font-serif text-xl text-foreground mb-4">
                Mon compte
              </h2>
              <div className="flex items-center justify-between text-sm text-muted-foreground font-light mb-6">
                <span>Membre depuis</span>
                <span>
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </span>
              </div>
              <motion.button
                onClick={handleLogout}
                className="w-full py-3 border border-destructive/30 text-destructive font-light tracking-widest uppercase text-sm rounded-sm hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </motion.button>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profil;
