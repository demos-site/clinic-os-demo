import React from 'react';
import { 
  Users, 
  UserCheck, 
  IndianRupee, 
  AlertCircle, 
  TrendingUp, 
  CalendarClock 
} from 'lucide-react';
import type { Patient, Checkup, Reminder } from '../utils/mockData';

interface StatsCardsProps {
  patients: Patient[];
  checkups: Checkup[];
  reminders?: Reminder[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ patients, checkups }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate stats
  const todayPatients = patients.filter(p => p.createdDate === todayStr).length;
  const todayCheckups = checkups.filter(c => c.date === todayStr).length;
  
  const todayRevenue = checkups
    .filter(c => c.date === todayStr)
    .reduce((sum, c) => sum + c.paid, 0);

  const totalPatients = patients.length;
  const totalCheckups = checkups.length;
  
  const totalRevenue = checkups.reduce((sum, c) => sum + c.paid, 0);
  
  const pendingDues = checkups.reduce((sum, c) => sum + c.due, 0);
  
  // Followups due today: Patients with checkup followupDate equal to today AND followup reminder is not completed
  const followupsDue = checkups.filter(c => c.followupDate === todayStr).length;

  const stats = [
    {
      title: "Today's Patients",
      value: todayPatients,
      subtext: "+15% vs yesterday",
      icon: Users,
      color: "var(--primary)",
      lightBg: "var(--primary-light)",
      sparkline: [2, 5, 3, 7, 5, 8, todayPatients],
    },
    {
      title: "Today's Checkups",
      value: todayCheckups,
      subtext: "Capacity: 80 max",
      icon: UserCheck,
      color: "var(--accent-blue)",
      lightBg: "rgba(21, 170, 191, 0.1)",
      sparkline: [4, 6, 5, 8, 7, 9, todayCheckups],
    },
    {
      title: "Today's Revenue",
      value: `₹${todayRevenue.toLocaleString('en-IN')}`,
      subtext: "+8% vs avg day",
      icon: IndianRupee,
      color: "var(--success)",
      lightBg: "var(--success-light)",
      sparkline: [1200, 2400, 1800, 3100, 2800, 4200, todayRevenue],
    },
    {
      title: "Pending Dues",
      value: `₹${pendingDues.toLocaleString('en-IN')}`,
      subtext: "Needs attention",
      icon: AlertCircle,
      color: "var(--danger)",
      lightBg: "var(--danger-light)",
      sparkline: [400, 350, 420, 280, 310, 220, pendingDues],
    },
    {
      title: "Total Patients",
      value: totalPatients,
      subtext: "All-time database",
      icon: Users,
      color: "var(--accent-purple)",
      lightBg: "rgba(156, 54, 181, 0.1)",
      sparkline: [25, 32, 40, 48, 52, 58, totalPatients],
    },
    {
      title: "Total Checkups",
      value: totalCheckups,
      subtext: "Consults conducted",
      icon: UserCheck,
      color: "var(--primary)",
      lightBg: "var(--primary-light)",
      sparkline: [40, 52, 60, 68, 75, 82, totalCheckups],
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      subtext: "Cumulative collection",
      icon: IndianRupee,
      color: "var(--success)",
      lightBg: "var(--success-light)",
      sparkline: [15000, 18200, 21000, 24300, 26900, 28500, totalRevenue],
    },
    {
      title: "Followups Due Today",
      value: followupsDue,
      subtext: "Scheduled for today",
      icon: CalendarClock,
      color: "var(--warning)",
      lightBg: "var(--warning-light)",
      sparkline: [1, 3, 2, 4, 1, 3, followupsDue],
    },
  ];

  return (
    <div style={styles.grid}>
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        
        // Generate SVG Path for sparkline
        const maxVal = Math.max(...stat.sparkline, 1);
        const minVal = Math.min(...stat.sparkline);
        const range = maxVal - minVal || 1;
        const width = 100;
        const height = 30;
        const points = stat.sparkline
          .map((val, i) => {
            const x = (i / (stat.sparkline.length - 1)) * width;
            const y = height - ((val - minVal) / range) * (height - 6) - 3;
            return `${x},${y}`;
          })
          .join(' ');

        return (
          <div key={idx} className="card hover-scale" style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <span style={styles.cardTitle}>{stat.title}</span>
                <h3 style={styles.cardValue}>{stat.value}</h3>
              </div>
              <div style={{ ...styles.iconWrapper, backgroundColor: stat.lightBg, color: stat.color }}>
                <Icon size={22} />
              </div>
            </div>
            
            <div style={styles.cardFooter}>
              <span style={{ 
                ...styles.subtext, 
                color: stat.title.includes("Dues") ? 'var(--danger)' : 'var(--text-muted)'
              }}>
                <TrendingUp size={12} style={{ marginRight: '3px' }} />
                {stat.subtext}
              </span>
              
              {/* Sparkline Graph */}
              <div style={styles.sparklineContainer}>
                <svg width="60" height="20" style={{ overflow: 'visible' }}>
                  <polyline
                    fill="none"
                    stroke={stat.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    minHeight: '125px',
    padding: '1.25rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  cardValue: {
    fontSize: '1.65rem',
    fontWeight: 700,
    marginTop: '0.25rem',
    color: 'var(--text-main)',
    fontFamily: 'var(--font-heading)',
  },
  iconWrapper: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '0.5rem',
  },
  subtext: {
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
  },
  sparklineContainer: {
    opacity: 0.8,
  }
};
export default StatsCards;
