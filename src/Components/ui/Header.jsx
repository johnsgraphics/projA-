import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ onMobileMenuToggle, isMobileMenuOpen = false }) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const toggleMoreMenu = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  const handleMobileMenuToggle = () => {
    if (onMobileMenuToggle) {
      onMobileMenuToggle();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm border-b border-border z-50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-3">
          {/* Hamburger menu for mobile */}
          <button
            onClick={handleMobileMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors nav-item-hover"
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
          
          {/* Logo - Positioned on the LEFT side (original position) */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="FileText" size={24} color="white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-foreground">
                CabinetDoc Pro
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Gestion Comptable</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Actions - Functional buttons */}
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={() => alert('Export functionality will be implemented')}
            className="hidden sm:flex border-primary/20 hover:bg-primary/5"
          >
            Exporter
          </Button>
          
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => navigate('/document-creation')}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md"
          >
            <span className="hidden sm:inline">Nouveau</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;