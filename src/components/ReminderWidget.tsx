import React, { useState } from 'react';
import { Plus, Trash2, Calendar, BellRing, Clock } from 'lucide-react';
import type { Reminder } from '../utils/mockData';

interface ReminderWidgetProps {
  reminders: Reminder[];
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  onAddReminder: (title: string, description: string, date: string, time: string, type: Reminder['type']) => void;
}

export const ReminderWidget: React.FC<ReminderWidgetProps> = ({
  reminders,
  onToggleReminder,
  onDeleteReminder,
  onAddReminder,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [type, setType] = useState<Reminder['type']>('Custom');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddReminder(title, desc, date, time, type);
    setTitle('');
    setDesc('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('10:00');
    setType('Custom');
    setShowAddForm(false);
  };

  const getTagStyle = (remType: Reminder['type']) => {
    switch (remType) {
      case 'Followup':
        return { bg: 'var(--primary-light)', text: 'var(--primary)' };
      case 'Birthday':
        return { bg: 'rgba(156, 54, 181, 0.1)', text: 'var(--accent-purple)' };
      case 'Payment Due':
        return { bg: 'var(--danger-light)', text: 'var(--danger)' };
      default:
        return { bg: 'var(--warning-light)', text: 'var(--warning)' };
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const sortedReminders = [...reminders].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.date.localeCompare(b.date);
  });

  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleContainer}>
          <BellRing size={20} color="var(--primary)" />
          <h3 style={styles.title}>Reminders & Followups</h3>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={styles.addButton}
        >
          {showAddForm ? 'Cancel' : <><Plus size={16} /> Quick Add</>}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Reminder title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Short description..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="form-input"
            style={styles.input}
          />
          <div style={styles.formRow}>
            <div style={styles.formCol}>
              <label style={styles.label}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div style={styles.formCol}>
              <label style={styles.label}>Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div style={styles.formCol}>
              <label style={styles.label}>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Reminder['type'])}
                className="form-select"
              >
                <option value="Followup">Followup</option>
                <option value="Birthday">Birthday</option>
                <option value="Payment Due">Payment Due</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
            Save Reminder
          </button>
        </form>
      )}

      <div style={styles.listContainer}>
        {sortedReminders.length === 0 ? (
          <div style={styles.emptyState}>
            No active reminders scheduled.
          </div>
        ) : (
          sortedReminders.map((rem) => {
            const tag = getTagStyle(rem.type);
            const isToday = rem.date === todayStr;

            return (
              <div 
                key={rem.id} 
                style={{
                  ...styles.reminderItem,
                  opacity: rem.completed ? 0.6 : 1,
                  borderLeft: `4px solid ${isToday && !rem.completed ? 'var(--primary)' : 'var(--border-color)'}`,
                  backgroundColor: isToday && !rem.completed ? 'rgba(59, 91, 219, 0.03)' : 'transparent',
                }}
              >
                <div style={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={rem.completed}
                    onChange={() => onToggleReminder(rem.id)}
                    style={styles.checkbox}
                  />
                  <div style={styles.textDetails}>
                    <span style={{
                      ...styles.remTitle,
                      textDecoration: rem.completed ? 'line-through' : 'none',
                      fontWeight: isToday && !rem.completed ? 600 : 500,
                    }}>
                      {rem.title}
                    </span>
                    {rem.description && (
                      <span style={styles.remDesc}>{rem.description}</span>
                    )}
                    <div style={styles.metaRow}>
                      <span style={styles.metaItem}>
                        <Calendar size={12} />
                        {rem.date === todayStr ? 'Today' : new Date(rem.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                      <span style={styles.metaItem}>
                        <Clock size={12} />
                        {rem.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={styles.rightActions}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: tag.bg,
                    color: tag.text,
                  }}>
                    {rem.type}
                  </span>
                  <button 
                    onClick={() => onDeleteReminder(rem.id)}
                    style={styles.deleteBtn}
                    title="Delete Reminder"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '400px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.75rem',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  title: {
    fontSize: '1.1rem',
    color: 'var(--text-main)',
  },
  addButton: {
    fontSize: '0.8rem',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '0.4rem 0.8rem',
    cursor: 'pointer',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    transition: 'all 0.15s ease',
  },
  form: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px dashed var(--border-color)',
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  input: {
    padding: '0.5rem 0.75rem',
    fontSize: '0.85rem',
  },
  formRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  formCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'var(--text-muted)',
  },
  submitBtn: {
    padding: '0.5rem 1rem',
    alignSelf: 'flex-end',
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.65rem',
    maxHeight: '350px',
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100px',
    color: 'var(--text-muted)',
    fontSize: '0.875rem',
  },
  reminderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    borderRadius: 'var(--radius-sm)',
    borderBottom: '1px solid var(--border-color)',
    transition: 'background-color 0.15s ease',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    flex: 1,
  },
  checkbox: {
    marginTop: '0.25rem',
    cursor: 'pointer',
    width: '16px',
    height: '16px',
    accentColor: 'var(--primary)',
  },
  textDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.15rem',
  },
  remTitle: {
    fontSize: '0.875rem',
    color: 'var(--text-main)',
  },
  remDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  metaRow: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '0.25rem',
  },
  metaItem: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  rightActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  badge: {
    fontSize: '0.65rem',
    fontWeight: 600,
    padding: '0.15rem 0.4rem',
    borderRadius: 'var(--radius-full)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.02em',
  },
  deleteBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: 'var(--radius-sm)',
    transition: 'all 0.15s ease',
  }
};
export default ReminderWidget;
