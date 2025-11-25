import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const SidebarNavigation = ({ isOpen = false, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Tableau de Bord'
    },
    {
      id: 'create',
      label: 'Créer',
      path: '/creer',
      icon: 'FileText',
      tooltip: 'Créer un Document'
    },
    {
      id: 'clients',
      label: 'Clients',
      path: '/clients',
      icon: 'Users',
      tooltip: 'Gestion des Clients'
    },
    {
      id: 'documents',
      label: 'Documents',
      path: '/documents',
      icon: 'FolderOpen',
      tooltip: 'Bibliothèque de Documents'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      path: '/parametres',
      icon: 'Settings',
      tooltip: 'Paramètres'
    }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Load saved state only for desktop
    if (!isMobile) {
      const savedState = localStorage.getItem('sidebar-expanded');
      if (savedState !== null) {
        setIsExpanded(JSON.parse(savedState));
      } else {
        setIsExpanded(true); // Default to expanded on desktop
      }
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem('sidebar-expanded', JSON.stringify(newState));
    if (onToggle) onToggle(newState);
  };

  const handleMobileToggle = () => {
    if (onToggle) onToggle(!isOpen);
  };

  // Mobile version with overlay
  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-custom"
            onClick={handleMobileToggle}
          />
        )}
        <aside 
          className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-card to-card/95 backdrop-blur-sm border-r border-border z-50 slide-transition ${
            isOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon name="FileText" size={24} color="white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    CabinetDoc Pro
                  </h1>
                  <p className="text-xs text-muted-foreground">Gestion Comptable</p>
                </div>
              </div>
              <button
                onClick={handleMobileToggle}
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors nav-item-hover"
                aria-label="Fermer le menu"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {menuItems?.map((item) => (
                  <li key={item?.id}>
                    <NavLink
                      to={item?.path}
                      onClick={handleMobileToggle}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-3 rounded-lg nav-item-hover ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`
                      }
                    >
                      <Icon name={item?.icon} size={20} />
                      <span className="font-medium">{item?.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      </>
    );
  }

  // Desktop version
  return (
    <aside 
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-gradient-to-b from-card to-card/95 backdrop-blur-sm border-r border-border z-40 sidebar-transition ${
        isExpanded ? 'w-60' : 'w-15'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Hamburger button for collapsed state */}
        {!isExpanded && (
          <div className="p-2 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5">
            <button
              onClick={toggleSidebar}
              className="w-full p-3 rounded-lg hover:bg-primary/10 transition-colors nav-item-hover flex items-center justify-center"
              title="Développer le menu"
              aria-label="Développer le menu"
            >
              <Icon name="Menu" size={20} />
            </button>
          </div>
        )}
        
        {/* Expanded header */}
        {isExpanded && (
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <Icon name="FileText" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  CabinetDoc Pro
                </h1>
                <p className="text-xs text-muted-foreground">Gestion Comptable</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-primary/10 transition-colors nav-item-hover"
              title="Réduire le menu"
              aria-label="Réduire le menu"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
          </div>
        )}
        
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {menuItems?.map((item) => (
              <li key={item?.id}>
                <NavLink
                  to={item?.path}
                  title={!isExpanded ? item?.tooltip : undefined}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 rounded-lg nav-item-hover relative group ${
                      isExpanded ? 'space-x-3' : 'justify-center'
                    } ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`
                  }
                >
                  <Icon name={item?.icon} size={20} />
                  {isExpanded && (
                    <span className="font-medium">{item?.label}</span>
                  )}
                  {!isExpanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item?.tooltip}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default SidebarNavigation;