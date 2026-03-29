import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.webp";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";

type AuthView = "login" | "signup" | "forgot";

const Auth = () => {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) navigate("/");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Erreur de connexion", description: error.message, variant: "destructive" });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: displayName },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erreur d'inscription", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Vérifiez votre boîte mail",
        description: "Un lien de confirmation vous a été envoyé.",
      });
      setView("login");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "E-mail envoyé",
        description: "Consultez votre boîte mail pour réinitialiser votre mot de passe.",
      });
      setView("login");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erreur Google", description: String(error), variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-3 mb-6">
            <img src={logo} alt="Morilles du Canada" className="w-12 h-12 rounded-full" />
            <span className="font-serif text-2xl font-semibold text-gradient-gold tracking-wider">
              Morilles du Canada
            </span>
          </a>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-lg p-8 shadow-gold">
          {view === "login" && (
            <>
              <h1 className="font-serif text-2xl text-foreground text-center mb-6">Connexion</h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-muted-foreground text-sm">Adresse e-mail</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" className="pl-10" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password" className="text-muted-foreground text-sm">Mot de passe</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wide">
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>
              <button onClick={() => setView("forgot")} className="text-sm text-muted-foreground hover:text-primary mt-3 block mx-auto transition-colors">
                Mot de passe oublié ?
              </button>
              <div className="relative my-6">
                <div className="divider-gold" />
                <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground uppercase tracking-widest">ou</span>
              </div>
              <Button type="button" variant="outline" onClick={handleGoogleLogin} disabled={loading} className="w-full border-border hover:border-primary/50">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continuer avec Google
              </Button>
              <p className="text-sm text-muted-foreground text-center mt-6">
                Pas encore de compte ?{" "}
                <button onClick={() => setView("signup")} className="text-primary hover:underline font-medium">S'inscrire</button>
              </p>
            </>
          )}

          {view === "signup" && (
            <>
              <h1 className="font-serif text-2xl text-foreground text-center mb-6">Créer un compte</h1>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-muted-foreground text-sm">Nom d'affichage</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="name" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Votre nom" className="pl-10" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signup-email" className="text-muted-foreground text-sm">Adresse e-mail</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" className="pl-10" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signup-password" className="text-muted-foreground text-sm">Mot de passe</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10" required minLength={6} />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wide">
                  {loading ? "Inscription..." : "S'inscrire"}
                </Button>
              </form>
              <div className="relative my-6">
                <div className="divider-gold" />
                <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground uppercase tracking-widest">ou</span>
              </div>
              <Button type="button" variant="outline" onClick={handleGoogleLogin} disabled={loading} className="w-full border-border hover:border-primary/50">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continuer avec Google
              </Button>
              <p className="text-sm text-muted-foreground text-center mt-6">
                Déjà un compte ?{" "}
                <button onClick={() => setView("login")} className="text-primary hover:underline font-medium">Se connecter</button>
              </p>
            </>
          )}

          {view === "forgot" && (
            <>
              <button onClick={() => setView("login")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              <h1 className="font-serif text-2xl text-foreground text-center mb-2">Mot de passe oublié</h1>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
              </p>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <Label htmlFor="forgot-email" className="text-muted-foreground text-sm">Adresse e-mail</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wide">
                  {loading ? "Envoi..." : "Envoyer le lien"}
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          © {new Date().getFullYear()} Morilles du Canada. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default Auth;
