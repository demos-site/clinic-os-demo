import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Pill, 
  Bell, 
  BarChart3, 
  Settings as SettingsIcon, 
  Database, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon,
  Stethoscope
} from 'lucide-react';
import type { ClinicSettings } from '../utils/mockData';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  settings: ClinicSettings;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  collapsed,
  onToggleCollapse,
  settings,
  theme,
  onToggleTheme
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients List', icon: Users },
    { id: 'checkups', label: 'Checkup History', icon: FileText },
    { id: 'medicines', label: 'Medicine Inventory', icon: Pill },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} style={sidebarStyles.aside}>
      {/* Brand Header */}
      <div style={sidebarStyles.brandContainer}>
        <div style={sidebarStyles.brandIcon}>
          <Stethoscope size={24} color="#ffffff" />
        </div>
        {!collapsed && (
          <div style={sidebarStyles.brandNameContainer}>
            <span style={sidebarStyles.brandName}>ClinicOS</span>
            <span style={sidebarStyles.brandVersion}>v2.1 PRD</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={sidebarStyles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              style={{
                ...sidebarStyles.navItem,
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} style={{ minWidth: '20px' }} />
              {!collapsed && <span style={sidebarStyles.navLabel}>{item.label}</span>}
              {!collapsed && isActive && (
                <div style={sidebarStyles.activeIndicator} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Settings & Doctor Summary */}
      <div style={sidebarStyles.footer}>
        {/* Doctor Info */}
        {!collapsed && (
          <div style={sidebarStyles.doctorProfile}>
            <div style={sidebarStyles.avatar}>
              {settings.doctorName.split(' ').pop()?.charAt(0) || 'D'}
            </div>
            <div style={sidebarStyles.doctorDetails}>
              <span style={sidebarStyles.doctorName}>{settings.doctorName}</span>
              <span style={sidebarStyles.doctorTitle}>{settings.qualification}</span>
            </div>
          </div>
        )}

        {/* Theme Toggle & Collapse Toggle */}
        <div style={{
          ...sidebarStyles.actionsRow,
          flexDirection: collapsed ? 'column' : 'row',
          gap: collapsed ? '1rem' : '0.5rem',
        }}>
          <button 
            onClick={onToggleTheme} 
            style={sidebarStyles.iconButton} 
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={18} color="#94a3b8" /> : <Sun size={18} color="#f59f00" />}
          </button>
          
          <button 
            onClick={onToggleCollapse} 
            style={sidebarStyles.iconButton}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={18} color="#94a3b8" /> : <ChevronLeft size={18} color="#94a3b8" />}
          </button>
        </div>
      </div>
    </aside>
  );
};

// Inline CSS styled for the dark sidebar look specified in the PRD (var(--bg-sidebar))
const sidebarStyles = {
  aside: {
    width: '260px',
    backgroundColor: 'var(--bg-sidebar)',
    color: '#94a3b8',
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRight: '1px solid rgba(255,255,255,0.05)',
  },
  brandContainer: {
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 1.25rem',
    gap: '0.75rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  brandIcon: {
    backgroundColor: 'var(--primary)',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(59, 91, 219, 0.3)',
    flexShrink: 0,
  },
  brandNameContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  brandName: {
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '1.25rem',
    color: '#ffffff',
    lineHeight: 1.2,
  },
  brandVersion: {
    fontSize: '0.7rem',
    color: '#64748b',
    fontWeight: 500,
  },
  nav: {
    flex: 1,
    padding: '1.25rem 0.75rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.35rem',
    overflowY: 'auto' as const,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.15s ease',
    position: 'relative' as const,
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    fontSize: '0.9rem',
  },
  navLabel: {
    marginLeft: '0.75rem',
    whiteSpace: 'nowrap' as const,
  },
  activeIndicator: {
    position: 'absolute' as const,
    right: '0px',
    top: '25%',
    height: '50%',
    width: '3px',
    backgroundColor: '#ffffff',
    borderRadius: '4px 0 0 4px',
  },
  footer: {
    padding: '1.25rem',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  doctorProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    overflow: 'hidden',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontFamily: 'var(--font-heading)',
    fontSize: '1rem',
    flexShrink: 0,
    border: '1px solid rgba(255,255,255,0.15)',
  },
  doctorDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  doctorName: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#ffffff',
    whiteSpace: 'nowrap' as const,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  doctorTitle: {
    fontSize: '0.75rem',
    color: '#64748b',
    whiteSpace: 'nowrap' as const,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  actionsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.03)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  }
};

// Add CSS variables in sidebar selector to animate width
const styles = document.createElement('style');
styles.innerHTML = `
  .sidebar.collapsed {
    width: 70px !important;
  }
  .sidebar nav::-webkit-scrollbar {
    width: 3px;
  }
  .sidebar button:hover {
    color: #ffffff !important;
    background-color: rgba(255, 255, 255, 0.05) !important;
  }
  .sidebar button:active {
    transform: scale(0.98);
  }
`;
document.head.appendChild(styles);
export default Sidebar;
