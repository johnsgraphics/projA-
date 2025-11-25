import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./Pages/NotFound";
import DocumentCreation from './pages/document-creation';
import SettingsManagement from './pages/settings-management';
import DocumentLibrary from './pages/document-library';
import Dashboard from './pages/dashboard';
import ClientManagement from './pages/client-management';
import Header from "./components/ui/Header";
import SidebarNavigation from "./components/ui/SidebarNavigation";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    // Load sidebar state from localStorage
    const savedState = localStorage.getItem('sidebar-expanded');
    if (savedState !== null) {
      setIsSidebarOpen(JSON.parse(savedState));
    }
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
    localStorage.setItem('sidebar-expanded', JSON.stringify(isOpen));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      
      <SidebarNavigation 
        isOpen={isMobile ? isMobileMenuOpen : isSidebarOpen}
        onToggle={isMobile ? setIsMobileMenuOpen : handleSidebarToggle}
      />

      <main className={`pt-16 transition-all duration-300 ${
        isMobile ? 'ml-0' : (isSidebarOpen ? 'ml-60' : 'ml-15')
      }`}>
        {children}
      </main>
    </div>
  );
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/creer" element={<Layout><DocumentCreation /></Layout>} />
          <Route path="/document-creation" element={<Layout><DocumentCreation /></Layout>} />
          <Route path="/clients" element={<Layout><ClientManagement /></Layout>} />
          <Route path="/client-management" element={<Layout><ClientManagement /></Layout>} />
          <Route path="/documents" element={<Layout><DocumentLibrary /></Layout>} />
          <Route path="/document-library" element={<Layout><DocumentLibrary /></Layout>} />
          <Route path="/parametres" element={<Layout><SettingsManagement /></Layout>} />
          <Route path="/settings-management" element={<Layout><SettingsManagement /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
