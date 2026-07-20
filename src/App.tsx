
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import Reviews from "./pages/Reviews";
import FAQ from "./pages/FAQ";
import Contacts from "./pages/Contacts";
import BuildPC from "./pages/BuildPC";
import Articles from "./pages/Articles";
import ArticlePage from "./pages/ArticlePage";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Privacy from "./pages/Privacy";
import Consent from "./pages/Consent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/build" element={<BuildPC />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/consent" element={<Consent />} />
          <Route path="/yadirfetihwwork/login" element={<AdminLogin />} />
          <Route path="/yadirfetihwwork" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;