import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.webp";
import { Lock } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Mot de passe mis à jour", description: "Vous pouvez maintenant vous connecter." });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-3 mb-6">
            <img src={logo} alt="Morilles du Canada" className="w-12 h-12 rounded-full" />
            <span className="font-serif text-2xl font-semibold text-gradient-gold tracking-wider">
              Morilles du Canada
            </span>
          </a>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 shadow-gold">
          <h1 className="font-serif text-2xl text-foreground text-center mb-6">Nouveau mot de passe</h1>
          {!ready ? (
            <p className="text-sm text-muted-foreground text-center">Vérification en cours…</p>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <Label htmlFor="new-password" className="text-muted-foreground text-sm">Nouveau mot de passe</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10" required minLength={6} />
                </div>
              </div>
              <div>
                <Label htmlFor="confirm-password" className="text-muted-foreground text-sm">Confirmer le mot de passe</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="pl-10" required minLength={6} />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wide">
                {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
