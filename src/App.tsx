import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CoverPage from "./pages/CoverPage";
import TableOfContents from "./pages/TableOfContents";
import ChapterPage from "./pages/ChapterPage";
import ClosingPage from "./pages/ClosingPage";
import NotFound from "./pages/NotFound";
import PageTurn from "./components/book/PageTurn";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <PageTurn>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<CoverPage />} />
        <Route path="/chapters" element={<TableOfContents />} />
        <Route path="/chapter/:id" element={<ChapterPage />} />
        <Route path="/closing" element={<ClosingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTurn>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
