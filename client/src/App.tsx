
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BusinessSignup from "./pages/BusinessSignup";
import BusinessSignin from "./pages/BusinessSignin";
import AICampaignPage from "./pages/AICampaignPage";
import Dashboard from "@/pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import CreateCampaign from "./pages/CreateCampaign";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import PaymentSelect from "./pages/PaymentSelect";
import CookieBanner from "./components/CookieBanner";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Switch>
          <Route path="/" component={Index} />
          <Route path="/business/signup" component={BusinessSignup} />
          <Route path="/business/signin" component={BusinessSignin} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/create-campaign" component={CreateCampaign} />
          <Route path="/ai-campaigns" component={AICampaignPage} />
          <Route path="/campaigns" component={Campaigns} />
          <Route path="/contact" component={Contact} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/payment/select" component={PaymentSelect} />
          <Route path="/superadmin/login" component={SuperAdminLogin} />
          <Route path="/superadmin/dashboard" component={SuperAdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      <CookieBanner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
