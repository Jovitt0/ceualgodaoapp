import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import LoginCliente from "./pages/LoginCliente";
import ProdutosCliente from "./pages/ProdutosCliente";
import Checkout from "./pages/Checkout";
import LoginFornecedor from "./pages/LoginFornecedor";
import DashboardFornecedor from "./pages/DashboardFornecedor";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/cliente/login"} component={LoginCliente} />
      <Route path={"/cliente/produtos"} component={ProdutosCliente} />
      <Route path={"/cliente/checkout/:produtoId"} component={Checkout} />
      <Route path={"/fornecedor/login"} component={LoginFornecedor} />
      <Route path={"/fornecedor/dashboard"} component={DashboardFornecedor} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
