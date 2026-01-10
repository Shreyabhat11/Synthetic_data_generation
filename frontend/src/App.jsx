console.log("App rendered");


import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Database, Upload, Sparkles, BarChart3, Shield, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import Dashboard from '@/pages/Dashboard';
import UploadPage from '@/pages/Upload';
import Generate from '@/pages/Generate';
import Evaluate from '@/pages/Evaluate';
import Privacy from '@/pages/Privacy';
import '@/App.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Database },
    { name: 'Upload', href: '/upload', icon: Upload },
    { name: 'Generate', href: '/generate', icon: Sparkles },
    { name: 'Evaluate', href: '/evaluate', icon: BarChart3 },
    { name: 'Privacy', href: '/privacy', icon: Shield },
  ];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="page-container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-foreground">
                  CTGAN Synthesizer
                </h1>
                <p className="text-xs text-muted-foreground">AI-Powered Test Data</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-2 border-t border-border animate-in">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="page-container py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">CTGAN Synthesizer</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Generate high-quality synthetic data using Conditional Tabular GAN for testing, development, and ML training.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/upload" className="hover:text-foreground transition-colors">
                    Upload Dataset
                  </Link>
                </li>
                <li>
                  <Link to="/generate" className="hover:text-foreground transition-colors">
                    Generate Data
                  </Link>
                </li>
                <li>
                  <Link to="/evaluate" className="hover:text-foreground transition-colors">
                    Evaluate Quality
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-foreground transition-colors">
                    Check Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">About</h3>
              <p className="text-sm text-muted-foreground">
                This tool uses CTGAN (Conditional Tabular Generative Adversarial Network) to create synthetic tabular data that preserves statistical properties while ensuring privacy.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p> CTGAN Test Data Synthesis. Built with React + FastAPI.</p>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toaster richColors position="top-right" />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/evaluate" element={<Evaluate />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </Layout>
      
    </div>
  );
}

export default App;

