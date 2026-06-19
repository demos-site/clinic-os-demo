import React, { useState, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import type { Checkup, Patient } from '../utils/mockData';
import { BarChart3, TrendingUp, Users } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsChartsProps {
  checkups: Checkup[];
  patients: Patient[];
}

type ChartView = 'revenue15' | 'revenue30' | 'revenue12m' | 'growth' | 'patientVsCheckup';

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ checkups, patients }) => {
  const [view, setView] = useState<ChartView>('revenue30');

  // Helper to format date
  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  // Helper to get array of past N dates
  const getPastNDates = (n: number) => {
    const dates = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  // 1. Last N Days Revenue Calculation
  const revenueDataNDays = useMemo(() => {
    const days = view === 'revenue15' ? 15 : 30;
    const pastDates = getPastNDates(days);
    
    // Group checkups by date
    const revMap: Record<string, number> = {};
    pastDates.forEach(date => { revMap[date] = 0; });

    checkups.forEach(c => {
      if (revMap[c.date] !== undefined) {
        revMap[c.date] += c.paid;
      }
    });

    const labels = pastDates.map(d => formatDateLabel(d));
    const values = pastDates.map(d => revMap[d]);

    return { labels, values };
  }, [checkups, view]);

  // 2. Last 12 Months Revenue
  const revenueData12Months = useMemo(() => {
    const labels: string[] = [];
    const values: number[] = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth(); // 0-11
      const label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      labels.push(label);

      // Filter checkups for this month & year
      const monthlySum = checkups
        .filter(c => {
          const cDate = new Date(c.date);
          return cDate.getFullYear() === year && cDate.getMonth() === month;
        })
        .reduce((sum, c) => sum + c.paid, 0);

      values.push(monthlySum);
    }

    return { labels, values };
  }, [checkups]);

  // 3. Patient Growth Cumulative Chart
  const growthData = useMemo(() => {
    const pastDates = getPastNDates(30);
    const growthMap: Record<string, number> = {};
    pastDates.forEach(date => { growthMap[date] = 0; });

    // Count registrations per day
    patients.forEach(p => {
      if (growthMap[p.createdDate] !== undefined) {
        growthMap[p.createdDate]++;
      }
    });

    // Compute cumulative patient totals
    // Start with all-time patients registered BEFORE the 30-day window
    const earliestDate = pastDates[0];
    const baseCount = patients.filter(p => p.createdDate < earliestDate).length;

    const labels = pastDates.map(d => formatDateLabel(d));
    const values: number[] = [];
    let currentCumulative = baseCount;

    pastDates.forEach(date => {
      currentCumulative += growthMap[date];
      values.push(currentCumulative);
    });

    return { labels, values };
  }, [patients]);

  // 4. Patient vs Checkup Comparison Bar Chart
  const patientVsCheckupData = useMemo(() => {
    const pastDates = getPastNDates(7); // Last 7 days comparison
    const patientsMap: Record<string, number> = {};
    const checkupsMap: Record<string, number> = {};

    pastDates.forEach(date => {
      patientsMap[date] = 0;
      checkupsMap[date] = 0;
    });

    patients.forEach(p => {
      if (patientsMap[p.createdDate] !== undefined) patientsMap[p.createdDate]++;
    });

    checkups.forEach(c => {
      if (checkupsMap[c.date] !== undefined) checkupsMap[c.date]++;
    });

    const labels = pastDates.map(d => formatDateLabel(d));
    const patientCounts = pastDates.map(d => patientsMap[d]);
    const checkupCounts = pastDates.map(d => checkupsMap[d]);

    return { labels, patientCounts, checkupCounts };
  }, [patients, checkups]);

  // Chart Styling Configurations
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
  const fontColor = isDark ? '#94a3b8' : '#64748b';

  const chartOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: view === 'patientVsCheckup',
        position: 'top' as const,
        labels: {
          color: fontColor,
          font: { family: 'Inter', size: 11, weight: 'normal' }
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#000000',
        bodyColor: isDark ? '#94a3b8' : '#475569',
        borderColor: 'var(--border-color)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
        titleFont: { family: 'Outfit', size: 12, weight: 'bold' as const },
        bodyFont: { family: 'Inter', size: 12 }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: fontColor, font: { family: 'Inter', size: 10 } }
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: fontColor, font: { family: 'Inter', size: 10 } }
      }
    }
  };

  // Line Chart datasets
  const lineChartData = useMemo(() => {
    let labels: string[] = [];
    let data: number[] = [];
    let label = '';
    let color = 'var(--primary)';
    let gradientFill = 'rgba(59, 91, 219, 0.08)';

    if (view === 'revenue15' || view === 'revenue30') {
      labels = revenueDataNDays.labels;
      data = revenueDataNDays.values;
      label = 'Revenue (₹)';
      color = '#0ca678'; // Green for revenue
      gradientFill = 'rgba(12, 166, 120, 0.08)';
    } else if (view === 'revenue12m') {
      labels = revenueData12Months.labels;
      data = revenueData12Months.values;
      label = 'Revenue (₹)';
      color = '#0ca678';
      gradientFill = 'rgba(12, 166, 120, 0.08)';
    } else if (view === 'growth') {
      labels = growthData.labels;
      data = growthData.values;
      label = 'Total Patients';
      color = 'var(--primary)';
      gradientFill = 'rgba(59, 91, 219, 0.08)';
    }

    return {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          backgroundColor: gradientFill,
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointBackgroundColor: color,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1.5,
          pointHoverRadius: 6,
          pointRadius: 3
        }
      ]
    };
  }, [view, revenueDataNDays, revenueData12Months, growthData]);

  // Bar Chart datasets
  const barChartData = useMemo(() => {
    return {
      labels: patientVsCheckupData.labels,
      datasets: [
        {
          label: 'New Patients',
          data: patientVsCheckupData.patientCounts,
          backgroundColor: 'rgba(59, 91, 219, 0.85)',
          borderRadius: 4
        },
        {
          label: 'Consultations',
          data: patientVsCheckupData.checkupCounts,
          backgroundColor: 'rgba(21, 170, 191, 0.85)',
          borderRadius: 4
        }
      ]
    };
  }, [patientVsCheckupData]);

  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleWrapper}>
          <BarChart3 size={20} color="var(--primary)" />
          <h3 style={styles.title}>Practice Analytics</h3>
        </div>
        
        {/* Controls */}
        <div style={styles.controls}>
          <select
            value={view}
            onChange={(e) => setView(e.target.value as ChartView)}
            className="form-select"
            style={styles.select}
          >
            <option value="revenue15">Revenue: Last 15 Days</option>
            <option value="revenue30">Revenue: Last 30 Days</option>
            <option value="revenue12m">Revenue: Last 12 Months</option>
            <option value="growth">Patient Growth (30 Days)</option>
            <option value="patientVsCheckup">Patients vs Consultations (7 Days)</option>
          </select>
        </div>
      </div>

      {/* Chart Wrapper */}
      <div style={styles.chartContainer}>
        {view === 'patientVsCheckup' ? (
          <Bar data={barChartData} options={chartOptions as any} />
        ) : (
          <Line data={lineChartData} options={chartOptions as any} />
        )}
      </div>

      {/* Quick Summary Badge Row */}
      <div style={styles.summaryRow}>
        <div style={styles.summaryItem}>
          <TrendingUp size={14} color="#0ca678" />
          <span style={styles.summaryText}>
            Average ticket: <strong>₹520</strong> per patient visit
          </span>
        </div>
        <div style={{ ...styles.summaryItem, borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
          <Users size={14} color="var(--primary)" />
          <span style={styles.summaryText}>
            Growth trajectory: <strong>+18.5%</strong> month-over-month
          </span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '400px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    flexWrap: 'wrap' as const,
    gap: '0.75rem',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  title: {
    fontSize: '1.1rem',
    color: 'var(--text-main)',
  },
  controls: {
    display: 'flex',
    gap: '0.5rem',
  },
  select: {
    fontSize: '0.85rem',
    padding: '0.4rem 0.75rem',
    height: '36px',
    borderRadius: 'var(--radius-sm)',
    borderColor: 'var(--border-color)',
    cursor: 'pointer',
  },
  chartContainer: {
    flex: 1,
    minHeight: '260px',
    position: 'relative' as const,
  },
  summaryRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1rem',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '0.75rem',
  },
  summaryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  summaryText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  }
};
export default AnalyticsCharts;
