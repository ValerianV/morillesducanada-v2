import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, MemoryRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { isNoindexPath } from "@/lib/seo/noindex";
import { I18nProvider } from "@/i18n/context";
import { lazy, Suspense, useEffect, useState } from "react";
import Index from "./pages/Index";
import { ARTICLES } from "@/lib/seo/articles";
import NotFound from "./pages/NotFound";

const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const CGV = lazy(() => import("./pages/CGV"));
const Livraison = lazy(() => import("./pages/Livraison"));
const Recettes = lazy(() => import("./pages/Recettes"));
const RecetteDetail = lazy(() => import("./pages/RecetteDetail"));
const GuideMorellesDeFeu = lazy(() => import("./pages/GuideMorellesDeFeu"));
const Professionnels = lazy(() => import("./pages/Professionnels"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancelled = lazy(() => import("./pages/PaymentCancelled"));
const PreOrderSuccess = lazy(() => import("./pages/PreOrderSuccess"));
const Precommande2027 = lazy(() => import("./pages/Precommande2027"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Galerie = lazy(() => import("./pages/Galerie"));
const Journal = lazy(() => import("./pages/Journal"));
const PlaquettePro = lazy(() => import("./pages/PlaquettePro"));
const FicheTechnique = lazy(() => import("./pages/FicheTechnique"));
const ContentArticle = lazy(() => import("./pages/ContentArticle"));
const Fondateur = lazy(() => import("./pages/Fondateur"));
const ZonesDePassage = lazy(() => import("./pages/ZonesDePassage"));

const queryClient = new QueryClient();

const RobotsGuard = () => {
  const { pathname } = useLocation();
  if (!isNoindexPath(pathname)) return null;
  return (
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );
};

interface AppProps {
  // Prérendu (src/entry-server.tsx) : chemin à rendre et contexte Helmet à remplir.
  ssrPath?: string;
  helmetContext?: Record<string, unknown>;
}

const App = ({ ssrPath, helmetContext }: AppProps = {}) => {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent;
      setIsSafari(/Safari/i.test(ua) && !/Chrome|CriOS|Chromium|Android|Edg|FxiOS/i.test(ua));
    }

    const isImageTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return target.tagName === "IMG" || Boolean(target.closest("img"));
    };

    const handleContextMenu = (event: MouseEvent) => {
      if (isImageTarget(event.target)) event.preventDefault();
    };

    const handleDragStart = (event: DragEvent) => {
      if (isImageTarget(event.target)) event.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  const routes = (
    <>
      <RobotsGuard />
      <Suspense fallback={<div className={isSafari ? "min-h-screen bg-background safari-safe-layer" : "min-h-screen bg-background"} />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/cgv" element={<CGV />} />
          <Route path="/livraison" element={<Livraison />} />
          <Route path="/recettes" element={<Recettes />} />
          <Route path="/recettes/:slug" element={<RecetteDetail />} />
          <Route path="/profil" element={<Navigate to="/" replace />} />
          <Route path="/guide-morilles-de-feu" element={<GuideMorellesDeFeu />} />
          <Route path="/professionnels" element={<Professionnels />} />
          <Route path="/pre-commande" element={<Navigate to="/precommande-2027" replace />} />
          <Route path="/precommande-2027" element={<Precommande2027 />} />
          <Route path="/paiement-reussi" element={<PaymentSuccess />} />
          <Route path="/paiement-annule" element={<PaymentCancelled />} />
          <Route path="/precommande-confirmee" element={<PreOrderSuccess />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/galerie" element={<Galerie />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/plaquette-pro" element={<PlaquettePro />} />
          <Route path="/fiche-technique" element={<FicheTechnique />} />
          <Route path="/valerian-vilane" element={<Fondateur />} />
          <Route path="/zones-de-passage" element={<ZonesDePassage />} />
          {ARTICLES.map((article) => (
            <Route key={article.path} path={article.path} element={<ContentArticle article={article} />} />
          ))}
          {/* Vente au détail fermée (site réservé aux professionnels) : 301 dans vercel.json. */}
          <Route path="/produits" element={<Navigate to="/professionnels" replace />} />
          <Route path="/produits/*" element={<Navigate to="/professionnels" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );

  return (
    <HelmetProvider context={helmetContext}>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {ssrPath ? (
              <MemoryRouter initialEntries={[ssrPath]}>{routes}</MemoryRouter>
            ) : (
              <BrowserRouter>{routes}</BrowserRouter>
            )}
          </TooltipProvider>
        </QueryClientProvider>
      </I18nProvider>
    </HelmetProvider>
  );
};

export default App;

