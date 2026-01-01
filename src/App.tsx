import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import FileInventory from "@/pages/FileInventory";
import TieringPolicies from "@/pages/TieringPolicies";
import Deduplication from "@/pages/Deduplication";
import ArchiveRestore from "@/pages/ArchiveRestore";
import JobsActivity from "@/pages/JobsActivity";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/files" element={<FileInventory />} />
            <Route path="/policies" element={<TieringPolicies />} />
            <Route path="/deduplication" element={<Deduplication />} />
            <Route path="/archive" element={<ArchiveRestore />} />
            <Route path="/jobs" element={<JobsActivity />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
