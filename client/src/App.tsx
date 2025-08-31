import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "@/pages/not-found";
import VinChecker from "@/pages/VinChecker";
import VinDecoderEurope from "@/pages/VinDecoderEurope";
import VinCheckAfrica from "@/pages/VinCheckAfrica";
import SampleReport from "@/pages/SampleReport";
import HistoryReport from "@/pages/HistoryReport";
import CarHistoryCheck from "@/pages/CarHistoryCheck";
import LoanCalculator from "@/pages/LoanCalculator";
import PaymentSuccess from "@/pages/PaymentSuccess";
import CarHistoryResults from "@/pages/CarHistoryResults";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import ContactUs from "@/pages/ContactUs";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsConditions from "@/pages/TermsConditions";
import FAQ from "@/pages/FAQ";
import { ThirdPartyScripts } from "@/components/analytics/ThirdPartyScripts";


function Router() {
  return (
    <div>
      <Header />
      <Switch>
        <Route path="/" component={VinChecker} />
        <Route path="/vindecoder-europe" component={VinDecoderEurope} />
        <Route path="/vincheck-africa" component={VinCheckAfrica} />
        <Route path="/sample-report" component={SampleReport} />
        <Route path="/car-history-check" component={CarHistoryCheck} />
        <Route path="/history" component={CarHistoryCheck} />
        <Route path="/history-report" component={HistoryReport} />
        <Route path="/loan-calculator" component={LoanCalculator} />
        <Route path="/payment-success" component={PaymentSuccess} />
        <Route path="/car-history-results" component={CarHistoryResults} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:id" component={BlogPost} />
        <Route path="/contact" component={ContactUs} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-conditions" component={TermsConditions} />
        <Route path="/faq" component={FAQ} />

        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThirdPartyScripts />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
