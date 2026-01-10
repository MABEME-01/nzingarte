import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import PageLoader from "./components/ui/PageLoader";

// Lazy load pages for better performance
const Sobre = lazy(() => import("./pages/Sobre"));
const Servicos = lazy(() => import("./pages/Servicos"));
const ServicoDetalhe = lazy(() => import("./pages/ServicoDetalhe"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Galeria = lazy(() => import("./pages/Galeria"));
const Cursos = lazy(() => import("./pages/Cursos"));
const Contactos = lazy(() => import("./pages/Contactos"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds - dados mais frescos
      gcTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true, // refetch quando volta à tab
      refetchOnReconnect: true, // refetch quando reconecta
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/servicos/:id" element={<ServicoDetalhe />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/contactos" element={<Contactos />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
