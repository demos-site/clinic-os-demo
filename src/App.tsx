import React, { useState, useEffect } from 'react';
import { 
  Sidebar 
} from './components/Sidebar';
import { StatsCards } from './components/StatsCards';
import { ReminderWidget } from './components/ReminderWidget';
import { RecentCheckups } from './components/RecentCheckups';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { 
  AddPatientModal, 
  NewCheckupModal, 
  ViewCheckupModal, 
  PrintRxModal 
} from './components/Modals';
import * as db from './utils/mockData';
import { 
  Plus, 
  Download, 
  Upload, 
  Search, 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Settings as SettingsIcon,
  Trash2,
  Stethoscope
} from 'lucide-react';

const modalStyles = {
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  sectionHeader: {
    fontSize: '0.9rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    color: 'var(--primary)',
    borderBottom: '1px dashed var(--border-color)',
    paddingBottom: '4px',
    marginTop: '0.5rem',
    letterSpacing: '0.02em',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '1rem',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1.5rem',
  }
};

export const App: React.FC = () => {
  // Database States
  const [patients, setPatients] = useState<db.Patient[]>([]);
  const [checkups, setCheckups] = useState<db.Checkup[]>([]);
  const [reminders, setReminders] = useState<db.Reminder[]>([]);
  const [settings, setSettings] = useState<db.ClinicSettings | null>(null);
  const [medicines, setMedicines] = useState<db.Medicine[]>([]);

  // Navigation & UI States
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Modal Triggers
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isNewCheckupOpen, setIsNewCheckupOpen] = useState(false);
  const [viewingCheckup, setViewingCheckup] = useState<db.Checkup | null>(null);
  const [printingCheckup, setPrintingCheckup] = useState<db.Checkup | null>(null);

  // Active Patient Profile View
  const [activePatient, setActivePatient] = useState<db.Patient | null>(null);

  // Search/Filters in sub-views
  const [patientSearch, setPatientSearch] = useState('');
  const [medSearch, setMedSearch] = useState('');
  const [newMedName, setNewMedName] = useState('');
  const [newMedCompany, setNewMedCompany] = useState('');
  const [newMedContains, setNewMedContains] = useState('');
  const [newMedPrice, setNewMedPrice] = useState(5);
  const [newMedType, setNewMedType] = useState('Tablet');

  // Load state on mount
  useEffect(() => {
    // Check if seeded
    const seeded = localStorage.getItem('clinicos_patients');
    if (!seeded) {
      db.seedInitialData();
    }
    setPatients(db.getPatients());
    setCheckups(db.getCheckups());
    setReminders(db.getReminders());
    setSettings(db.getSettings());
    setMedicines(db.getMedicines());

    // Theme check
    const savedTheme = localStorage.getItem('clinicos_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  // Theme Toggler
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('clinicos_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // State handlers
  const handleAddPatientSave = (_newPt: db.Patient) => {
    setPatients(db.getPatients());
    // Trigger checkup on this patient immediately if wanted
    setCurrentView('dashboard');
  };

  const handleNewCheckupSave = (_newCh: db.Checkup) => {
    setCheckups(db.getCheckups());
    setPatients(db.getPatients());
    setReminders(db.getReminders()); // Vitals or followup reminders
  };

  const handleToggleReminder = (id: string) => {
    db.toggleReminder(id);
    setReminders(db.getReminders());
  };

  const handleDeleteReminder = (id: string) => {
    db.deleteReminder(id);
    setReminders(db.getReminders());
  };

  const handleQuickReminderAdd = (
    title: string, 
    description: string, 
    date: string, 
    time: string, 
    type: db.Reminder['type']
  ) => {
    db.addReminder({ title, description, date, time, type });
    setReminders(db.getReminders());
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    const list = db.getMedicines();
    const id = `MED-${Date.now()}`;
    const newMed: db.Medicine = {
      id,
      name: newMedName,
      company: newMedCompany || 'Generic',
      contains: newMedContains || newMedName,
      price: newMedPrice,
      type: newMedType
    };
    list.unshift(newMed);
    db.saveMedicines(list);
    setMedicines(list);
    setNewMedName('');
    setNewMedCompany('');
    setNewMedContains('');
    setNewMedPrice(5);
  };

  const handleDeleteMedicine = (id: string) => {
    const list = medicines.filter(m => m.id !== id);
    db.saveMedicines(list);
    setMedicines(list);
  };

  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) return;
    db.saveSettings(settings);
    alert("Settings saved successfully!");
  };

  // Restore State Handler
  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = db.restoreBackupData(content);
      if (res.errors.length > 0) {
        alert(`Failed to restore backup:\n${res.errors.join('\n')}`);
      } else {
        alert(`Backup Restored Successfully!\nImported: ${res.patientsImported} Patients, ${res.checkupsImported} Checkups, ${res.remindersImported} Reminders.`);
        // Reload all state
        setPatients(db.getPatients());
        setCheckups(db.getCheckups());
        setReminders(db.getReminders());
        setSettings(db.getSettings());
        setMedicines(db.getMedicines());
      }
    };
    reader.readAsText(file);
  };

  if (!settings) return null;

  return (
    <div className="app-container" style={{ display: 'flex' }}>
      
      {/* Sidebar Panel */}
      <Sidebar
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          setActivePatient(null);
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        settings={settings}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Panel Content Area */}
      <main style={appStyles.main}>
        {/* Header Ribbon */}
        <header style={appStyles.header} className="no-print">
          <div>
            <h1 style={appStyles.headerTitle}>
              {currentView === 'dashboard' && "Practice Dashboard"}
              {currentView === 'patients' && "Patient Registry"}
              {currentView === 'checkups' && "Medical Consultation Logs"}
              {currentView === 'medicines' && "Medicine Stock & Inventory"}
              {currentView === 'reminders' && "Notifications & Follow-ups"}
              {currentView === 'reports' && "Revenue Reports & Analytics"}
              {currentView === 'backup' && "System Backup & Restore"}
              {currentView === 'settings' && "Clinic OS Settings"}
            </h1>
            <p style={appStyles.headerSub}>
              {settings.clinicName} — Today: {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div style={appStyles.quickActions}>
            <button onClick={() => setIsAddPatientOpen(true)} className="btn btn-secondary">
              <Plus size={16} /> Add Patient
            </button>
            <button onClick={() => setIsNewCheckupOpen(true)} className="btn btn-primary pulsate">
              <Stethoscope size={16} /> New Checkup
            </button>
          </div>
        </header>

        {/* Dynamic Views Router */}
        <div style={appStyles.viewBody}>
          
          {/* 1. DASHBOARD VIEW */}
          {currentView === 'dashboard' && !activePatient && (
            <div style={appStyles.viewContainer}>
              {/* Stats Cards */}
              <StatsCards patients={patients} checkups={checkups} reminders={reminders} />

              {/* Grid section */}
              <div style={appStyles.gridDashboard}>
                <div style={{ gridColumn: 'span 8' }}>
                  <AnalyticsCharts checkups={checkups} patients={patients} />
                </div>
                <div style={{ gridColumn: 'span 4' }}>
                  <ReminderWidget
                    reminders={reminders}
                    onToggleReminder={handleToggleReminder}
                    onDeleteReminder={handleDeleteReminder}
                    onAddReminder={handleQuickReminderAdd}
                  />
                </div>
              </div>

              {/* Recent Consultations Table */}
              <RecentCheckups
                checkups={checkups}
                onViewCheckup={(c) => setViewingCheckup(c)}
                onPrintCheckup={(c) => setPrintingCheckup(c)}
              />
            </div>
          )}

          {/* 2. PATIENTS LIST VIEW & PROFILE */}
          {currentView === 'patients' && (
            activePatient ? (
              // Patient Profile Detail View
              <div style={appStyles.profileContainer}>
                <button onClick={() => setActivePatient(null)} style={appStyles.backBtn} className="btn btn-outline">
                  <ArrowLeft size={16} /> Back to Directory
                </button>

                <div style={appStyles.profileLayout}>
                  {/* Left Column: Demographics */}
                  <div className="card" style={{ gridColumn: 'span 4', height: 'fit-content' }}>
                    <div style={appStyles.profileAvatar}>
                      {activePatient.name.split(' ').pop()?.charAt(0) || 'D'}
                    </div>
                    <h3 style={appStyles.profileName}>{activePatient.name}</h3>
                    <span className="badge badge-primary" style={{ display: 'table', margin: '0.25rem auto' }}>{activePatient.id}</span>
                    
                    <div style={appStyles.profileMetaList}>
                      <div style={appStyles.profileMetaItem}><User size={14} /> {activePatient.gender}, {activePatient.age} Years</div>
                      <div style={appStyles.profileMetaItem}><Phone size={14} /> {activePatient.mobile}</div>
                      {activePatient.address && <div style={appStyles.profileMetaItem}><MapPin size={14} /> {activePatient.address}</div>}
                    </div>

                    <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
                    
                    <h5 style={appStyles.profileSectionTitle}>Baseline Vitals</h5>
                    <div style={appStyles.vitalsGridMini}>
                      <div>Wt: <strong>{activePatient.weight || '-'} kg</strong></div>
                      <div>Sugar: <strong>{activePatient.sugarLevel || '-'} mg/dL</strong></div>
                      <div>Blood Group: <strong>{activePatient.bloodGroup}</strong></div>
                    </div>

                    {activePatient.allergies && (
                      <div style={{ marginTop: '1rem', backgroundColor: 'var(--danger-light)', padding: '0.5rem', borderRadius: '6px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--danger)' }}>ALLERGIES:</span>
                        <p style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{activePatient.allergies}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Case Logs */}
                  <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="card">
                      <h4 style={appStyles.profileSectionTitle}>Medical Narrative</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <strong>Presenting Complaint:</strong> {activePatient.presentComplaint || 'No active complaints.'}
                      </p>
                      {activePatient.pastHistory && (
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                          <strong>Medical History:</strong> {activePatient.pastHistory}
                        </p>
                      )}
                    </div>

                    <div className="card">
                      <h4 style={appStyles.profileSectionTitle}>Consultation History</h4>
                      <div className="table-container">
                        <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Complaint</th>
                              <th>Diagnosis</th>
                              <th>Total Charges</th>
                              <th>Dues</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {checkups.filter(c => c.patientId === activePatient.id).length === 0 ? (
                              <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                  No previous consultation logs found.
                                </td>
                              </tr>
                            ) : (
                              checkups
                                .filter(c => c.patientId === activePatient.id)
                                .map((c) => (
                                  <tr key={c.id}>
                                    <td>{new Date(c.date).toLocaleDateString('en-IN')}</td>
                                    <td>{c.complaint}</td>
                                    <td>{c.diagnosis || '-'}</td>
                                    <td>₹{c.cost}</td>
                                    <td>
                                      {c.due > 0 ? (
                                        <span className="badge badge-danger">₹{c.due}</span>
                                      ) : (
                                        <span className="badge badge-success">Nil</span>
                                      )}
                                    </td>
                                    <td>
                                      <button onClick={() => setViewingCheckup(c)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--primary)' }}>
                                        View Rx
                                      </button>
                                    </td>
                                  </tr>
                                ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Directory Table
              <div className="card">
                <div style={appStyles.viewSubHeader}>
                  <div style={appStyles.searchWrapper}>
                    <Search size={16} style={appStyles.searchIcon} />
                    <input 
                      type="text" 
                      placeholder="Search patients by name, mobile, ID..." 
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.25rem' }}
                    />
                  </div>
                  <button onClick={() => setIsAddPatientOpen(true)} className="btn btn-primary">
                    <Plus size={16} /> Register Patient
                  </button>
                </div>

                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Patient Name</th>
                        <th>Gender / Age</th>
                        <th>Mobile Number</th>
                        <th>Blood Group</th>
                        <th>Allergies</th>
                        <th>Outstanding dues</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients
                        .filter(p => {
                          const query = patientSearch.toLowerCase();
                          return (
                            p.name.toLowerCase().includes(query) ||
                            p.mobile.includes(query) ||
                            p.id.toLowerCase().includes(query)
                          );
                        })
                        .map((p) => {
                          // Calculate pending dues for patient
                          const dues = checkups
                            .filter(c => c.patientId === p.id)
                            .reduce((sum, c) => sum + c.due, 0);

                          return (
                            <tr key={p.id}>
                              <td><span className="badge badge-primary">{p.id}</span></td>
                              <td>
                                <button 
                                  onClick={() => setActivePatient(p)} 
                                  style={appStyles.linkButton}
                                >
                                  {p.name}
                                </button>
                              </td>
                              <td>{p.gender} / {p.age} Yrs</td>
                              <td>{p.mobile}</td>
                              <td>{p.bloodGroup}</td>
                              <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {p.allergies ? <span style={{ color: 'var(--danger)', fontWeight: 500 }}>{p.allergies}</span> : 'None'}
                              </td>
                              <td>
                                {dues > 0 ? (
                                  <span className="badge badge-danger">₹{dues}</span>
                                ) : (
                                  <span className="badge badge-success">Nil</span>
                                )}
                              </td>
                              <td>
                                <button onClick={() => setActivePatient(p)} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                                  View Profile
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}

          {/* 3. CHECKUP HISTORY VIEW */}
          {currentView === 'checkups' && (
            <RecentCheckups
              checkups={checkups}
              onViewCheckup={(c) => setViewingCheckup(c)}
              onPrintCheckup={(c) => setPrintingCheckup(c)}
            />
          )}

          {/* 4. MEDICINE INVENTORY VIEW */}
          {currentView === 'medicines' && (
            <div style={appStyles.gridDashboard}>
              {/* List Card */}
              <div className="card" style={{ gridColumn: 'span 8' }}>
                <div style={appStyles.viewSubHeader}>
                  <div style={appStyles.searchWrapper}>
                    <Search size={16} style={appStyles.searchIcon} />
                    <input 
                      type="text" 
                      placeholder="Search inventory name, brand, salt..." 
                      value={medSearch}
                      onChange={(e) => setMedSearch(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.25rem' }}
                    />
                  </div>
                </div>

                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Brand / Medicine Name</th>
                        <th>Manufacturer</th>
                        <th>Composition / Contains</th>
                        <th>Price (₹)</th>
                        <th>Type</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicines
                        .filter(m => {
                          const query = medSearch.toLowerCase();
                          return (
                            m.name.toLowerCase().includes(query) ||
                            m.company.toLowerCase().includes(query) ||
                            m.contains.toLowerCase().includes(query)
                          );
                        })
                        .map((m) => (
                          <tr key={m.id}>
                            <td><strong>{m.name}</strong></td>
                            <td>{m.company}</td>
                            <td><span style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>{m.contains}</span></td>
                            <td><strong>₹{m.price.toFixed(1)}</strong></td>
                            <td><span className="badge badge-primary">{m.type}</span></td>
                            <td>
                              <button onClick={() => handleDeleteMedicine(m.id)} style={{ border: 'none', backgroundColor: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}>
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add form card */}
              <div className="card" style={{ gridColumn: 'span 4', height: 'fit-content' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Add New Formula</h3>
                <form onSubmit={handleAddMedicine} style={modalStyles.form}>
                  <div className="form-group">
                    <label className="form-label">Brand Name *</label>
                    <input type="text" value={newMedName} onChange={(e) => setNewMedName(e.target.value)} className="form-input" placeholder="e.g. Paracetamol 650mg" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Active Salt Composition *</label>
                    <input type="text" value={newMedContains} onChange={(e) => setNewMedContains(e.target.value)} className="form-input" placeholder="e.g. Paracetamol IP" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pharmaceutical Company</label>
                    <input type="text" value={newMedCompany} onChange={(e) => setNewMedCompany(e.target.value)} className="form-input" placeholder="e.g. Micro Labs" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Selling Price per Unit (₹) *</label>
                    <input type="number" value={newMedPrice || ''} onChange={(e) => setNewMedPrice(parseFloat(e.target.value))} className="form-input" placeholder="e.g. 3.5" min="0" step="0.1" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Medicine Form factor</label>
                    <select value={newMedType} onChange={(e) => setNewMedType(e.target.value)} className="form-select">
                      <option value="Tablet">Tablet</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Drops">Drops</option>
                      <option value="Injection">Injection</option>
                      <option value="Cream">Cream / Gel</option>
                      <option value="Ointment">Ointment</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Save to Inventory</button>
                </form>
              </div>
            </div>
          )}

          {/* 5. REMINDERS VIEW */}
          {currentView === 'reminders' && (
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <ReminderWidget
                reminders={reminders}
                onToggleReminder={handleToggleReminder}
                onDeleteReminder={handleDeleteReminder}
                onAddReminder={handleQuickReminderAdd}
              />
            </div>
          )}

          {/* 6. REPORTS VIEW */}
          {currentView === 'reports' && (
            <div style={appStyles.viewContainer}>
              <div style={appStyles.gridDashboard}>
                <div style={{ gridColumn: 'span 12' }}>
                  <AnalyticsCharts checkups={checkups} patients={patients} />
                </div>
              </div>

              {/* Dues Report Card */}
              <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--danger)' }}>Outstanding Balance Report</h3>
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Patient Number</th>
                        <th>Patient Name</th>
                        <th>Mobile Number</th>
                        <th>Last Consultation Date</th>
                        <th>Dues Outstanding</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients
                        .map(p => {
                          const userCheckups = checkups.filter(c => c.patientId === p.id);
                          const totalDues = userCheckups.reduce((sum, c) => sum + c.due, 0);
                          const lastDate = userCheckups.length > 0 ? userCheckups[0].date : '-';
                          return { p, totalDues, lastDate };
                        })
                        .filter(item => item.totalDues > 0)
                        .map(item => (
                          <tr key={item.p.id}>
                            <td><span className="badge badge-primary">{item.p.id}</span></td>
                            <td><strong>{item.p.name}</strong></td>
                            <td>{item.p.mobile}</td>
                            <td>{item.lastDate}</td>
                            <td><span className="badge badge-danger">₹{item.totalDues}</span></td>
                            <td>
                              <button onClick={() => { setActivePatient(item.p); setCurrentView('patients'); }} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                                View Account
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 7. BACKUP & RESTORE VIEW */}
          {currentView === 'backup' && (
            <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
              <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Clinic Data Utility</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
                  Export clinical database spreadsheets or upload files to restore parameters, profiles, and histories.
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                  <button onClick={db.downloadBackupData} className="btn btn-primary" style={{ padding: '1rem 1.5rem' }}>
                    <Download size={20} /> Export Local Database (.json)
                  </button>

                  <label className="btn btn-secondary" style={{ padding: '1rem 1.5rem', margin: '0' }}>
                    <Upload size={20} /> Import Backup File
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={handleFileRestore} 
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 8. SETTINGS VIEW */}
          {currentView === 'settings' && (
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <div className="card">
                <form onSubmit={handleSaveSettings} style={modalStyles.form}>
                  <h3 style={appStyles.profileSectionTitle}><SettingsIcon size={18} style={{ marginRight: '5px' }} /> Clinical Configuration</h3>
                  
                  <h4 style={modalStyles.sectionHeader}>Doctor Parameters</h4>
                  <div style={modalStyles.grid2}>
                    <div className="form-group">
                      <label className="form-label">Doctor Name</label>
                      <input 
                        type="text" 
                        value={settings.doctorName} 
                        onChange={(e) => setSettings({ ...settings, doctorName: e.target.value })} 
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Qualifications</label>
                      <input 
                        type="text" 
                        value={settings.qualification} 
                        onChange={(e) => setSettings({ ...settings, qualification: e.target.value })} 
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Medical Registration License Number</label>
                    <input 
                      type="text" 
                      value={settings.regNumber} 
                      onChange={(e) => setSettings({ ...settings, regNumber: e.target.value })} 
                      className="form-input"
                    />
                  </div>

                  <h4 style={modalStyles.sectionHeader}>Clinic Identification</h4>
                  <div style={modalStyles.grid2}>
                    <div className="form-group">
                      <label className="form-label">Clinic Brand Name</label>
                      <input 
                        type="text" 
                        value={settings.clinicName} 
                        onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })} 
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Clinic Phone Contact</label>
                      <input 
                        type="text" 
                        value={settings.phone} 
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })} 
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Clinic Registered Address</label>
                    <input 
                      type="text" 
                      value={settings.clinicAddress} 
                      onChange={(e) => setSettings({ ...settings, clinicAddress: e.target.value })} 
                      className="form-input"
                    />
                  </div>

                  <h4 style={modalStyles.sectionHeader}>Standard Pricing Rules</h4>
                  <div style={modalStyles.grid3}>
                    <div className="form-group">
                      <label className="form-label">Consultation Fee (₹)</label>
                      <input 
                        type="number" 
                        value={settings.consultationFee} 
                        onChange={(e) => setSettings({ ...settings, consultationFee: parseInt(e.target.value) || 0 })} 
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Emergency Consultation (₹)</label>
                      <input 
                        type="number" 
                        value={settings.emergencyFee} 
                        onChange={(e) => setSettings({ ...settings, emergencyFee: parseInt(e.target.value) || 0 })} 
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Follow-up Consultation (₹)</label>
                      <input 
                        type="number" 
                        value={settings.followupFee} 
                        onChange={(e) => setSettings({ ...settings, followupFee: parseInt(e.target.value) || 0 })} 
                        className="form-input"
                      />
                    </div>
                  </div>

                  <h4 style={modalStyles.sectionHeader}>Prescription print layouts</h4>
                  <div style={modalStyles.grid2}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={settings.displayLogo} 
                        onChange={(e) => setSettings({ ...settings, displayLogo: e.target.checked })}
                        style={{ width: '16px', height: '16px' }}
                      />
                      Include Clinic Header on PDF
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={settings.displaySignature} 
                        onChange={(e) => setSettings({ ...settings, displaySignature: e.target.checked })}
                        style={{ width: '16px', height: '16px' }}
                      />
                      Include Signature line
                    </label>
                  </div>

                  <div style={modalStyles.actions}>
                    <button type="submit" className="btn btn-success" style={{ width: '150px' }}>Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ==========================================
          MODALS INTEGRATION DOCK
          ========================================== */}
      
      {/* 1. Register Patient Modal Form */}
      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
        onSave={handleAddPatientSave}
      />

      {/* 2. New Consultation Record Slideover */}
      <NewCheckupModal
        isOpen={isNewCheckupOpen}
        onClose={() => setIsNewCheckupOpen(false)}
        onSave={handleNewCheckupSave}
        patients={patients}
        settings={settings}
      />

      {/* 3. Read-only Consultation Review Modal */}
      <ViewCheckupModal
        isOpen={viewingCheckup !== null}
        onClose={() => setViewingCheckup(null)}
        checkup={viewingCheckup}
        onPrint={() => {
          setPrintingCheckup(viewingCheckup);
          setViewingCheckup(null);
        }}
      />

      {/* 4. Rx A4 Document Print Dialog */}
      <PrintRxModal
        isOpen={printingCheckup !== null}
        onClose={() => setPrintingCheckup(null)}
        checkup={printingCheckup}
        settings={settings}
      />

    </div>
  );
};

const appStyles = {
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    overflowY: 'auto' as const,
  },
  header: {
    height: '70px',
    backgroundColor: 'var(--bg-card)',
    borderBottom: '1px solid var(--border-color)',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky' as const,
    top: 0,
    zIndex: 90,
    backdropFilter: 'var(--glass-backdrop)',
  },
  headerTitle: {
    fontSize: '1.25rem',
    color: 'var(--text-main)',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  headerSub: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  quickActions: {
    display: 'flex',
    gap: '0.75rem',
  },
  viewBody: {
    padding: '2rem',
    flex: 1,
  },
  viewContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem',
  },
  gridDashboard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  viewSubHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  searchWrapper: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '350px',
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 'inherit',
    padding: 0,
    textAlign: 'left' as const,
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  backBtn: {
    alignSelf: 'flex-start',
    padding: '0.4rem 0.8rem',
  },
  profileLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: '1.5rem',
  },
  profileAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '2rem',
    margin: '0 auto 1rem auto',
    fontFamily: 'var(--font-heading)',
    border: '2px solid var(--primary)',
  },
  profileName: {
    fontSize: '1.35rem',
    textAlign: 'center' as const,
    color: 'var(--text-main)',
  },
  profileMetaList: {
    marginTop: '1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.6rem',
  },
  profileMetaItem: {
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-main)',
  },
  profileSectionTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
  },
  vitalsGridMini: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
    fontSize: '0.8rem',
    backgroundColor: 'rgba(0,0,0,0.01)',
    padding: '0.5rem',
    borderRadius: '6px',
  }
};
export default App;
