import React, { useState, useEffect } from "react";
import Routes from "./Routes";
import SidebarNavigation from "./components/ui/SidebarNavigation";
import Header from "./components/ui/Header";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
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
      <Routes />
    </div>
  );
}

export default App;
