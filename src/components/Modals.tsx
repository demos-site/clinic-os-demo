import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  UserPlus, 
  Stethoscope, 
  Printer, 
  Plus, 
  Trash2, 
  Search, 
  ChevronRight,
  User,
  DollarSign
} from 'lucide-react';
import type { 
  Patient, 
  Checkup, 
  PrescriptionItem, 
  Medicine, 
  ClinicSettings
} from '../utils/mockData';
import {
  getMedicines,
  addPatient
} from '../utils/mockData';

// ==========================================
// 1. ADD PATIENT MODAL
// ==========================================
interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Patient['gender']>('Male');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<number>(0);
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [sugarLevel, setSugarLevel] = useState('');
  const [allergies, setAllergies] = useState('');
  const [presentComplaint, setPresentComplaint] = useState('');
  const [pastHistory, setPastHistory] = useState('');
  const [refName, setRefName] = useState('');
  const [refMobile, setRefMobile] = useState('');

  // Auto calculate age from DOB
  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
      setAge(calculatedAge);
    }
  }, [dob]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) return;

    const patient = addPatient({
      name,
      gender,
      dob,
      age: age || parseInt(dob) || 0,
      mobile,
      address,
      weight,
      bloodGroup,
      sugarLevel,
      allergies,
      presentComplaint,
      pastHistory,
      referenceName: refName,
      referenceMobile: refMobile
    });

    onSave(patient);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '700px' }}>
        <div style={modalStyles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={22} color="var(--primary)" />
            <h2 style={modalStyles.title}>Register New Patient</h2>
          </div>
          <button onClick={onClose} style={modalStyles.closeBtn}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={modalStyles.form}>
          <h4 style={modalStyles.sectionHeader}>Personal Information</h4>
          <div style={modalStyles.grid2}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" placeholder="e.g. Ramesh Chandra" required />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className="form-input" placeholder="10-digit number" pattern="[0-9]{10}" required />
            </div>
          </div>

          <div style={modalStyles.grid3}>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value as Patient['gender'])} className="form-select">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Age (Years)</label>
              <input type="number" value={age || ''} onChange={(e) => setAge(parseInt(e.target.value))} className="form-input" placeholder="Auto / Manual" min="0" max="130" />
            </div>
          </div>

          <div style={modalStyles.grid3}>
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="form-select">
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="form-input" placeholder="e.g. 70" />
            </div>
            <div className="form-group">
              <label className="form-label">Sugar Level (mg/dL)</label>
              <input type="number" value={sugarLevel} onChange={(e) => setSugarLevel(e.target.value)} className="form-input" placeholder="e.g. 110" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="form-input" placeholder="Residential address" />
          </div>

          <h4 style={{ ...modalStyles.sectionHeader, marginTop: '1.25rem' }}>Medical Baseline</h4>
          <div className="form-group">
            <label className="form-label">Allergies (if any)</label>
            <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} className="form-input" placeholder="e.g. Penicillin, Peanuts" />
          </div>

          <div style={modalStyles.grid2}>
            <div className="form-group">
              <label className="form-label">Present Complaint</label>
              <textarea value={presentComplaint} onChange={(e) => setPresentComplaint(e.target.value)} className="form-textarea" placeholder="Chief complaints..." rows={2} />
            </div>
            <div className="form-group">
              <label className="form-label">Past Medical History</label>
              <textarea value={pastHistory} onChange={(e) => setPastHistory(e.target.value)} className="form-textarea" placeholder="Hypertension, Asthma, surgeries..." rows={2} />
            </div>
          </div>

          <h4 style={{ ...modalStyles.sectionHeader, marginTop: '1.25rem' }}>Reference (Optional)</h4>
          <div style={modalStyles.grid2}>
            <div className="form-group">
              <label className="form-label">Reference Person Name</label>
              <input type="text" value={refName} onChange={(e) => setRefName(e.target.value)} className="form-input" placeholder="Referring Doctor or Patient" />
            </div>
            <div className="form-group">
              <label className="form-label">Reference Person Mobile</label>
              <input type="tel" value={refMobile} onChange={(e) => setRefMobile(e.target.value)} className="form-input" placeholder="10-digit number" />
            </div>
          </div>

          <div style={modalStyles.actions}>
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Patient</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ==========================================
// 2. NEW CHECKUP WORKFLOW MODAL
// ==========================================
interface NewCheckupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (checkup: Checkup) => void;
  patients: Patient[];
  settings: ClinicSettings;
}

export const NewCheckupModal: React.FC<NewCheckupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patients,
  settings
}) => {
  // Step navigation
  const [step, setStep] = useState(1); // 1: Vitals & Details, 2: Prescription & Investigations, 3: Billing & Mode

  // Patient Select
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // Vitals
  const [wt, setWt] = useState('');
  const [pulse, setPulse] = useState('');
  const [bp, setBp] = useState('');
  const [temp, setTemp] = useState('');
  const [rr, setRr] = useState('');
  const [sugar, setSugar] = useState('');
  const [thyroid] = useState('');

  // Clinical Details
  const [complaint, setComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [remarks, setRemarks] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [followupDate, setFollowupDate] = useState('');

  // Investigations Checklist
  const [checkedInvs, setCheckedInvs] = useState<string[]>([]);
  const [customInv, setCustomInv] = useState('');

  // Prescription builder
  const [prescItems, setPrescItems] = useState<PrescriptionItem[]>([]);
  const [medicineSearch, setMedicineSearch] = useState('');
  const [medSearchResults, setMedSearchResults] = useState<Medicine[]>([]);
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);

  // Dose, Advice, Duration for builder
  const [dosage, setDosage] = useState('1-0-1');
  const [advice, setAdvice] = useState('After Food');
  const [duration, setDuration] = useState('5 Days');
  const [qty, setQty] = useState(10);
  const [price, setPrice] = useState(0);

  // Billing
  const [consultFee, setConsultFee] = useState(settings.consultationFee);
  const [medFee, setMedFee] = useState(0);
  const [discount, setDiscount] = useState(0); // absolute amount
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paidAmt, setPaidAmt] = useState(0);
  const [paymentMode, setPaymentMode] = useState<Checkup['paymentMode']>('UPI');

  const medicinesList = useMemo(() => getMedicines(), []);

  // Reset all states on opening the modal
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedPatientId('');
      setWt('');
      setPulse('');
      setBp('');
      setTemp('');
      setRr('');
      setSugar('');
      setComplaint('');
      setDiagnosis('');
      setNotes('');
      setRemarks('');
      setInternalNotes('');
      setFollowupDate('');
      setCheckedInvs([]);
      setCustomInv('');
      setPrescItems([]);
      setMedicineSearch('');
      setMedSearchResults([]);
      setSelectedMed(null);
      setDosage('1-0-1');
      setAdvice('After Food');
      setDuration('5 Days');
      setQty(10);
      setPrice(0);
      setConsultFee(settings.consultationFee);
      setMedFee(0);
      setDiscount(0);
      setDiscountPercent(0);
      setPaidAmt(0);
      setPaymentMode('UPI');
    }
  }, [isOpen, settings.consultationFee]);

  // Sync initial patient weight/sugar if patient is selected
  useEffect(() => {
    if (selectedPatient) {
      setWt(selectedPatient.weight || '');
      setSugar(selectedPatient.sugarLevel || '');
      setComplaint(selectedPatient.presentComplaint || '');
    }
  }, [selectedPatientId, selectedPatient]);

  // Handle autocomplete search
  useEffect(() => {
    if (medicineSearch.trim().length > 1) {
      const query = medicineSearch.toLowerCase();
      const filtered = medicinesList.filter(
        (m: Medicine) => m.name.toLowerCase().includes(query) || m.contains.toLowerCase().includes(query)
      );
      setMedSearchResults(filtered);
    } else {
      setMedSearchResults([]);
    }
  }, [medicineSearch, medicinesList]);

  // Auto calculate quantity when dosage/duration changes
  useEffect(() => {
    let factor = 1;
    if (dosage === '1-0-0' || dosage === '0-1-0' || dosage === '0-0-1') factor = 1;
    else if (dosage === '1-1-0' || dosage === '1-0-1' || dosage === '0-1-1') factor = 2;
    else if (dosage === '1-1-1') factor = 3;
    else if (dosage === 'SOS') factor = 1;

    const days = parseInt(duration) || 1;
    setQty(factor * days);
  }, [dosage, duration]);

  // Recalculate medicine total fee when prescription items change
  useEffect(() => {
    const total = prescItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setMedFee(total);
  }, [prescItems]);

  // Recalculate billing fields
  const subTotal = consultFee + medFee;
  const grandTotal = Math.max(subTotal - discount, 0);
  const dueAmt = Math.max(grandTotal - paidAmt, 0);

  // Sync paid amount on grandTotal change
  useEffect(() => {
    setPaidAmt(grandTotal);
  }, [grandTotal]);

  if (!isOpen) return null;

  const handleSelectMed = (med: Medicine) => {
    setSelectedMed(med);
    setPrice(med.price);
    setMedicineSearch(med.name);
    setMedSearchResults([]);
  };

  const handleAddMedicine = () => {
    if (!medicineSearch.trim()) return;

    const name = selectedMed ? selectedMed.name : medicineSearch;
    const finalPrice = selectedMed ? selectedMed.price : price || 5;

    const newItem: PrescriptionItem = {
      name,
      advice,
      dosage,
      duration,
      quantity: qty,
      price: finalPrice
    };

    setPrescItems([...prescItems, newItem]);
    setMedicineSearch('');
    setSelectedMed(null);
    setPrice(0);
  };

  const handleDeleteMed = (idx: number) => {
    setPrescItems(prescItems.filter((_, i) => i !== idx));
  };

  const toggleInvestigation = (invName: string) => {
    if (checkedInvs.includes(invName)) {
      setCheckedInvs(checkedInvs.filter(i => i !== invName));
    } else {
      setCheckedInvs([...checkedInvs, invName]);
    }
  };

  const handleAddCustomInv = () => {
    if (customInv.trim() && !checkedInvs.includes(customInv.trim())) {
      setCheckedInvs([...checkedInvs, customInv.trim()]);
      setCustomInv('');
    }
  };

  const handleApplyDiscountPercent = (percent: number) => {
    setDiscountPercent(percent);
    const discAmt = Math.round((subTotal * percent) / 100);
    setDiscount(discAmt);
  };

  const handleSubmitCheckup = () => {
    if (!selectedPatientId) return;

    const checkup: Checkup = {
      id: '', // Will be overridden in state manager
      patientId: selectedPatientId,
      patientName: selectedPatient?.name || 'Unknown',
      date: '',
      complaint: complaint || 'General consultation',
      diagnosis,
      notes,
      remarks,
      internalNotes,
      followupDate: followupDate || undefined,
      vitals: {
        weight: wt,
        pulse,
        bp,
        temp,
        rr,
        sugar,
        thyroid
      },
      investigations: checkedInvs,
      medicines: prescItems,
      cost: grandTotal,
      paid: paidAmt,
      due: dueAmt,
      paymentMode,
      updatedDate: ''
    };

    onSave(checkup);
    onClose();
  };

  const invTemplates = ['CBC', 'LFT', 'KFT', 'Urine Routine', 'MRI', 'CT Scan', 'X-Ray'];

  return (
    <div className="slideover-overlay">
      <div className="slideover-content" style={{ maxWidth: '650px' }}>
        
        {/* Header */}
        <div style={modalStyles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Stethoscope size={22} color="var(--primary)" />
            <h2 style={modalStyles.title}>New Clinical Consultation</h2>
          </div>
          <button onClick={onClose} style={modalStyles.closeBtn}><X size={20} /></button>
        </div>

        {/* Step Indicator */}
        <div style={styles.stepIndicatorRow}>
          <div style={{ ...styles.stepNum, backgroundColor: step >= 1 ? 'var(--primary)' : 'var(--border-color)', color: '#ffffff' }}>1</div>
          <span style={{ ...styles.stepText, color: step === 1 ? 'var(--text-main)' : 'var(--text-muted)' }}>Vitals & Case</span>
          <div style={styles.stepConnector} />
          <div style={{ ...styles.stepNum, backgroundColor: step >= 2 ? 'var(--primary)' : 'var(--border-color)', color: '#ffffff' }}>2</div>
          <span style={{ ...styles.stepText, color: step === 2 ? 'var(--text-main)' : 'var(--text-muted)' }}>Meds & Exams</span>
          <div style={styles.stepConnector} />
          <div style={{ ...styles.stepNum, backgroundColor: step >= 3 ? 'var(--primary)' : 'var(--border-color)', color: '#ffffff' }}>3</div>
          <span style={{ ...styles.stepText, color: step === 3 ? 'var(--text-main)' : 'var(--text-muted)' }}>Invoice & Save</span>
        </div>

        {/* STEP 1: Case Details */}
        {step === 1 && (
          <div style={styles.stepContent}>
            {/* Patient selector */}
            <div className="form-group">
              <label className="form-label">Select Patient *</label>
              <select 
                value={selectedPatientId} 
                onChange={(e) => setSelectedPatientId(e.target.value)} 
                className="form-select"
                required
              >
                <option value="">-- Choose Patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id}) - {p.mobile}</option>
                ))}
              </select>
            </div>

            {selectedPatient && (
              <div style={styles.patientBanner}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={16} color="var(--primary)" />
                  <span style={{ fontWeight: 600 }}>{selectedPatient.name}</span>
                  <span style={styles.bannerTag}>{selectedPatient.gender}, {selectedPatient.age} Yrs</span>
                </div>
                {selectedPatient.allergies && (
                  <span style={styles.bannerAllergies}>Allergies: {selectedPatient.allergies}</span>
                )}
              </div>
            )}

            {/* Vitals Form */}
            <h4 style={modalStyles.sectionHeader}>Physical Vitals</h4>
            <div style={modalStyles.grid3}>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input type="text" value={wt} onChange={(e) => setWt(e.target.value)} className="form-input" placeholder="e.g. 70" />
              </div>
              <div className="form-group">
                <label className="form-label">Pulse (bpm)</label>
                <input type="text" value={pulse} onChange={(e) => setPulse(e.target.value)} className="form-input" placeholder="e.g. 72" />
              </div>
              <div className="form-group">
                <label className="form-label">Blood Pressure</label>
                <input type="text" value={bp} onChange={(e) => setBp(e.target.value)} className="form-input" placeholder="e.g. 120/80" />
              </div>
            </div>

            <div style={modalStyles.grid3}>
              <div className="form-group">
                <label className="form-label">Temperature (°F)</label>
                <input type="text" value={temp} onChange={(e) => setTemp(e.target.value)} className="form-input" placeholder="e.g. 98.4" />
              </div>
              <div className="form-group">
                <label className="form-label">Respiration (bpm)</label>
                <input type="text" value={rr} onChange={(e) => setRr(e.target.value)} className="form-input" placeholder="e.g. 16" />
              </div>
              <div className="form-group">
                <label className="form-label">Sugar Level (mg/dL)</label>
                <input type="text" value={sugar} onChange={(e) => setSugar(e.target.value)} className="form-input" placeholder="e.g. 120" />
              </div>
            </div>

            {/* Clinical records */}
            <h4 style={modalStyles.sectionHeader}>Case Notes</h4>
            <div className="form-group">
              <label className="form-label">Chief Complaint *</label>
              <textarea 
                value={complaint} 
                onChange={(e) => setComplaint(e.target.value)} 
                className="form-textarea" 
                placeholder="Describe patient symptoms..." 
                rows={2} 
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Clinical Diagnosis</label>
              <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="form-input" placeholder="e.g. Viral Pharyngitis" />
            </div>
            <div className="form-group">
              <label className="form-label">Doctor Examination Notes (Internal)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="form-textarea" placeholder="Private clinical observations..." rows={2} />
            </div>
          </div>
        )}

        {/* STEP 2: Prescriptions & Investigations */}
        {step === 2 && (
          <div style={styles.stepContent}>
            {/* Investigations checklist */}
            <h4 style={modalStyles.sectionHeader}>Lab Investigations</h4>
            <div style={styles.invContainer}>
              {invTemplates.map((inv) => (
                <button
                  key={inv}
                  type="button"
                  onClick={() => toggleInvestigation(inv)}
                  style={{
                    ...styles.invTag,
                    backgroundColor: checkedInvs.includes(inv) ? 'var(--primary)' : 'var(--bg-app)',
                    color: checkedInvs.includes(inv) ? '#ffffff' : 'var(--text-main)',
                  }}
                >
                  {inv}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
              <input
                type="text"
                placeholder="Custom test name..."
                value={customInv}
                onChange={(e) => setCustomInv(e.target.value)}
                className="form-input"
                style={{ flex: 1 }}
              />
              <button type="button" onClick={handleAddCustomInv} className="btn btn-secondary">
                <Plus size={16} /> Add Test
              </button>
            </div>

            {/* Prescription Generator */}
            <h4 style={modalStyles.sectionHeader}>Rx Prescription Pad</h4>
            <div style={styles.prescBuilder}>
              <div style={{ position: 'relative' }}>
                <div style={styles.searchBox}>
                  <Search size={16} style={{ marginRight: '5px' }} />
                  <input
                    type="text"
                    placeholder="Search medicine / brand name..."
                    value={medicineSearch}
                    onChange={(e) => setMedicineSearch(e.target.value)}
                    style={styles.builderSearchInput}
                  />
                </div>
                {/* Autocomplete items */}
                {medSearchResults.length > 0 && (
                  <div style={styles.dropdown}>
                    {medSearchResults.map((med) => (
                      <div
                        key={med.id}
                        onClick={() => handleSelectMed(med)}
                        style={styles.dropdownItem}
                      >
                        <div>
                          <strong>{med.name}</strong>
                          <span style={styles.dropdownMeta}>{med.contains} ({med.company})</span>
                        </div>
                        <span style={styles.dropdownPrice}>₹{med.price}/u</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input for price if medicine not found / custom */}
              {!selectedMed && medicineSearch && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <div style={{ flex: 1 }} className="form-group">
                    <label className="form-label">Price per Unit (₹)</label>
                    <input
                      type="number"
                      value={price || ''}
                      onChange={(e) => setPrice(parseFloat(e.target.value))}
                      className="form-input"
                      placeholder="e.g. 5.0"
                    />
                  </div>
                </div>
              )}

              {/* Template Row */}
              <div style={styles.templateRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Dosage</label>
                  <select value={dosage} onChange={(e) => setDosage(e.target.value)} className="form-select">
                    <option value="1-0-0">1-0-0 (Morning)</option>
                    <option value="0-1-0">0-1-0 (Afternoon)</option>
                    <option value="0-0-1">0-0-1 (Night)</option>
                    <option value="1-0-1">1-0-1 (Morning & Night)</option>
                    <option value="1-1-1">1-1-1 (Thrice daily)</option>
                    <option value="SOS">SOS (As needed)</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Duration</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)} className="form-select">
                    <option value="1 Day">1 Day</option>
                    <option value="3 Days">3 Days</option>
                    <option value="5 Days">5 Days</option>
                    <option value="7 Days">7 Days</option>
                    <option value="15 Days">15 Days</option>
                    <option value="30 Days">30 Days</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Advice</label>
                  <select value={advice} onChange={(e) => setAdvice(e.target.value)} className="form-select">
                    <option value="After Food">After Food</option>
                    <option value="Before Food">Before Food</option>
                    <option value="Empty Stomach">Empty Stomach</option>
                    <option value="SOS">SOS</option>
                  </select>
                </div>
              </div>

              <div style={styles.qtyRow}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Auto Quantity: <strong>{qty} units</strong>
                </div>
                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="btn btn-primary"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                >
                  <Plus size={14} /> Add to Prescription
                </button>
              </div>
            </div>

            {/* Prescribed Items Table */}
            {prescItems.length > 0 && (
              <div style={styles.miniTableContainer}>
                <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Dosage</th>
                      <th>Duration</th>
                      <th>Qty</th>
                      <th>Cost</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescItems.map((item, idx) => (
                      <tr key={idx}>
                        <td><strong>{item.name}</strong><br /><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.advice}</span></td>
                        <td>{item.dosage}</td>
                        <td>{item.duration}</td>
                        <td>{item.quantity}</td>
                        <td>₹{(item.price * item.quantity).toFixed(1)}</td>
                        <td>
                          <button onClick={() => handleDeleteMed(idx)} style={styles.deleteMiniBtn} type="button">
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={styles.liveCostContainer}>
                  Running Medicine Cost: <strong>₹{medFee.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label">Special Advice Remarks (Prints on Rx)</label>
              <input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} className="form-input" placeholder="e.g. Bed rest, avoid heavy weights" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Follow-up Date</label>
              <input type="date" value={followupDate} onChange={(e) => setFollowupDate(e.target.value)} className="form-input" />
            </div>
          </div>
        )}

        {/* STEP 3: Billing & Mode */}
        {step === 3 && (
          <div style={styles.stepContent}>
            <h4 style={modalStyles.sectionHeader}>Billing Summary</h4>
            <div style={styles.billingCard}>
              <div style={styles.billingRow}>
                <span>Consultation Fee:</span>
                <input 
                  type="number" 
                  value={consultFee} 
                  onChange={(e) => setConsultFee(parseFloat(e.target.value) || 0)} 
                  style={styles.billingInput}
                />
              </div>
              <div style={styles.billingRow}>
                <span>Medicine Charges:</span>
                <span>₹{medFee.toLocaleString('en-IN')}</span>
              </div>

              <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '0.75rem 0' }} />

              <div style={styles.billingRow}>
                <span>Discount Percentage:</span>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[5, 10, 15, 20].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleApplyDiscountPercent(p)}
                      style={{
                        ...styles.discTag,
                        backgroundColor: discountPercent === p ? 'var(--primary)' : 'var(--bg-app)',
                        color: discountPercent === p ? '#ffffff' : 'var(--text-main)',
                      }}
                    >
                      {p}%
                    </button>
                  ))}
                  <button type="button" onClick={() => { setDiscount(0); setDiscountPercent(0); }} style={styles.discTag}>Clear</button>
                </div>
              </div>

              <div style={styles.billingRow}>
                <span>Discount Amount (₹):</span>
                <input 
                  type="number" 
                  value={discount} 
                  onChange={(e) => {
                    setDiscount(parseFloat(e.target.value) || 0);
                    setDiscountPercent(0);
                  }} 
                  style={styles.billingInput}
                />
              </div>

              <hr style={{ border: '0', borderTop: '2px solid var(--border-color)', margin: '0.75rem 0' }} />

              <div style={{ ...styles.billingRow, fontSize: '1.15rem', fontWeight: 'bold' }}>
                <span>Grand Total:</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <h4 style={modalStyles.sectionHeader}><DollarSign size={18} style={{ marginRight: '5px' }} /> Payment Details</h4>
            <div style={modalStyles.grid2}>
              <div className="form-group">
                <label className="form-label">Amount Paid *</label>
                <input 
                  type="number" 
                  value={paidAmt || ''} 
                  onChange={(e) => setPaidAmt(parseFloat(e.target.value) || 0)} 
                  className="form-input" 
                  placeholder="e.g. ₹500"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <select 
                  value={paymentMode} 
                  onChange={(e) => setPaymentMode(e.target.value as Checkup['paymentMode'])} 
                  className="form-select"
                >
                  <option value="UPI">UPI (QR Code / Manual)</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card Swipe</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            {dueAmt > 0 && (
              <div style={styles.warningAlert}>
                Outstanding balance of <strong>₹{dueAmt}</strong> will be registered under the patient profile dues.
              </div>
            )}

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Internal Private Doctor Notes (Will not print)</label>
              <textarea value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} className="form-textarea" placeholder="Private reminders for the doctor..." rows={2} />
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div style={styles.footerNav}>
          {step > 1 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="btn btn-outline">Back</button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button 
              type="button" 
              onClick={() => {
                if (step === 1 && !selectedPatientId) {
                  alert("Please select a patient first.");
                  return;
                }
                setStep(step + 1);
              }} 
              className="btn btn-primary"
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleSubmitCheckup} 
              className="btn btn-success"
              style={{ width: '150px' }}
            >
              Save Checkup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 3. READ-ONLY VIEW CONSULTATION MODAL
// ==========================================
interface ViewCheckupModalProps {
  checkup: Checkup | null;
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
}

export const ViewCheckupModal: React.FC<ViewCheckupModalProps> = ({
  checkup,
  isOpen,
  onClose,
  onPrint
}) => {
  if (!isOpen || !checkup) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div style={modalStyles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Stethoscope size={22} color="var(--primary)" />
            <h2 style={modalStyles.title}>Consultation Details ({checkup.id})</h2>
          </div>
          <button onClick={onClose} style={modalStyles.closeBtn}><X size={20} /></button>
        </div>

        <div style={viewStyles.container}>
          <div style={viewStyles.metaRow}>
            <span>Patient: <strong>{checkup.patientName} ({checkup.patientId})</strong></span>
            <span>Date: <strong>{new Date(checkup.date).toLocaleDateString('en-IN')}</strong></span>
          </div>

          <h4 style={modalStyles.sectionHeader}>Case Description</h4>
          <div style={viewStyles.field}>
            <span style={viewStyles.label}>Chief Complaint:</span>
            <p style={viewStyles.text}>{checkup.complaint}</p>
          </div>
          {checkup.diagnosis && (
            <div style={viewStyles.field}>
              <span style={viewStyles.label}>Diagnosis:</span>
              <p style={viewStyles.text}><strong>{checkup.diagnosis}</strong></p>
            </div>
          )}

          <h4 style={modalStyles.sectionHeader}>Physical Vitals</h4>
          <div style={viewStyles.vitalsGrid}>
            <div style={viewStyles.vitalItem}>Weight: <strong>{checkup.vitals.weight || '-'} kg</strong></div>
            <div style={viewStyles.vitalItem}>BP: <strong>{checkup.vitals.bp || '-'}</strong></div>
            <div style={viewStyles.vitalItem}>Pulse: <strong>{checkup.vitals.pulse || '-'} bpm</strong></div>
            <div style={viewStyles.vitalItem}>Temp: <strong>{checkup.vitals.temp || '-'} °F</strong></div>
            <div style={viewStyles.vitalItem}>RR: <strong>{checkup.vitals.rr || '-'}</strong></div>
            <div style={viewStyles.vitalItem}>Sugar: <strong>{checkup.vitals.sugar || '-'} mg/dL</strong></div>
          </div>

          {checkup.investigations.length > 0 && (
            <>
              <h4 style={modalStyles.sectionHeader}>Prescribed Investigations</h4>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {checkup.investigations.map(inv => (
                  <span key={inv} className="badge badge-primary">{inv}</span>
                ))}
              </div>
            </>
          )}

          {checkup.medicines.length > 0 && (
            <>
              <h4 style={modalStyles.sectionHeader}>Prescription Medicines</h4>
              <table className="custom-table" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Duration</th>
                    <th>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {checkup.medicines.map((m, idx) => (
                    <tr key={idx}>
                      <td><strong>{m.name}</strong><br /><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.advice}</span></td>
                      <td>{m.dosage}</td>
                      <td>{m.duration}</td>
                      <td>{m.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {checkup.remarks && (
            <div style={{ ...viewStyles.field, marginTop: '1rem' }}>
              <span style={viewStyles.label}>Special Remarks:</span>
              <p style={viewStyles.text}>{checkup.remarks}</p>
            </div>
          )}

          {checkup.followupDate && (
            <div style={viewStyles.field}>
              <span style={viewStyles.label}>Follow-up Scheduled:</span>
              <p style={{ ...viewStyles.text, color: 'var(--primary)', fontWeight: 'bold' }}>
                {new Date(checkup.followupDate).toLocaleDateString('en-IN')}
              </p>
            </div>
          )}

          <h4 style={modalStyles.sectionHeader}>Invoicing Summary</h4>
          <div style={viewStyles.invoiceCard}>
            <div style={viewStyles.invoiceRow}>
              <span>Grand Total:</span>
              <span>₹{checkup.cost}</span>
            </div>
            <div style={viewStyles.invoiceRow}>
              <span>Paid ({checkup.paymentMode}):</span>
              <span style={{ color: 'var(--success)' }}>₹{checkup.paid}</span>
            </div>
            {checkup.due > 0 && (
              <div style={viewStyles.invoiceRow}>
                <span style={{ color: 'var(--danger)' }}>Outstanding Due:</span>
                <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>₹{checkup.due}</span>
              </div>
            )}
          </div>

          <div style={{ ...modalStyles.actions, marginTop: '1.5rem' }}>
            <button onClick={onClose} className="btn btn-outline">Close</button>
            <button onClick={onPrint} className="btn btn-primary"><Printer size={16} /> Print Prescription</button>
          </div>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 4. PRINT RX PREVIEW MODAL
// ==========================================
interface PrintRxModalProps {
  checkup: Checkup | null;
  isOpen: boolean;
  onClose: () => void;
  settings: ClinicSettings;
}

export const PrintRxModal: React.FC<PrintRxModalProps> = ({
  checkup,
  isOpen,
  onClose,
  settings
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !checkup) return null;

  const handlePrintTrigger = () => {
    const printContent = printAreaRef.current?.innerHTML;
    
    // Simple custom print mechanism for localized printing
    if (printContent) {
      const win = window.open('', '', 'height=650,width=900');
      win?.document.write(`
        <html>
          <head>
            <title>Rx Prescription - ${checkup.patientName}</title>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; }
              .header { border-bottom: 2px solid #3b5bdb; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
              .doctor-info { text-align: left; }
              .doctor-name { font-size: 20px; font-weight: bold; color: #3b5bdb; }
              .doctor-meta { font-size: 12px; color: #555; }
              .clinic-info { text-align: right; }
              .clinic-name { font-size: 18px; font-weight: bold; }
              .clinic-meta { font-size: 12px; color: #555; }
              .patient-bar { background: #f4f6fa; border-radius: 6px; padding: 10px 15px; display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 25px; border: 1px solid #e2e8f0; }
              .section-title { font-size: 14px; font-weight: bold; color: #3b5bdb; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 20px; margin-bottom: 10px; text-transform: uppercase; }
              .vitals-grid { display: flex; gap: 15px; font-size: 12px; background: #fafafa; padding: 10px; border-radius: 4px; border: 1px solid #eee; }
              .rx-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              .rx-table th { background: #f4f6fa; border-bottom: 2px solid #e2e8f0; padding: 8px; font-size: 12px; text-align: left; }
              .rx-table td { padding: 10px 8px; border-bottom: 1px solid #edf2ff; font-size: 12px; }
              .footer { margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; border-top: 1px solid #eee; padding-top: 15px; }
              .signature { text-align: right; margin-bottom: 40px; }
              .signature-line { border-top: 1px solid #333; width: 150px; margin-top: 40px; }
            </style>
          </head>
          <body>
            ${printContent}
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      win?.document.close();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px' }}>
        <div style={modalStyles.header} className="no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Printer size={22} color="var(--primary)" />
            <h2 style={modalStyles.title}>Print Rx (A4 Format)</h2>
          </div>
          <button onClick={onClose} style={modalStyles.closeBtn}><X size={20} /></button>
        </div>

        {/* Printable Area Wrapper */}
        <div style={printStyles.previewContainer} ref={printAreaRef}>
          {/* Header */}
          <div style={printStyles.header}>
            <div style={printStyles.doctorInfo}>
              <div style={printStyles.docName}>{settings.doctorName}</div>
              <div style={printStyles.docMeta}>{settings.qualification}</div>
              <div style={printStyles.docMeta}>Reg No: {settings.regNumber}</div>
            </div>
            
            <div style={printStyles.clinicInfo}>
              <div style={printStyles.clinicName}>{settings.clinicName}</div>
              <div style={printStyles.clinicMeta}>{settings.clinicAddress}</div>
              <div style={printStyles.clinicMeta}>Ph: {settings.phone} | {settings.email}</div>
            </div>
          </div>

          {/* Patient Details Bar */}
          <div style={printStyles.patientBar}>
            <div>
              <span>Patient Name: <strong>{checkup.patientName}</strong></span>
            </div>
            <div>
              <span>Patient ID: <strong>{checkup.patientId}</strong></span>
            </div>
            <div>
              <span>Date: <strong>{new Date(checkup.date).toLocaleDateString('en-IN')}</strong></span>
            </div>
          </div>

          {/* Vitals Summary */}
          <div>
            <div style={printStyles.secTitle}>Clinical Vitals</div>
            <div style={printStyles.vitalsGrid}>
              <span>Wt: <strong>{checkup.vitals.weight || '-'} kg</strong></span>
              <span>BP: <strong>{checkup.vitals.bp || '-'}</strong></span>
              <span>Pulse: <strong>{checkup.vitals.pulse || '-'} bpm</strong></span>
              <span>Temp: <strong>{checkup.vitals.temp || '-'} °F</strong></span>
              <span>Sugar: <strong>{checkup.vitals.sugar || '-'} mg/dL</strong></span>
            </div>
          </div>

          {/* Diagnosis & Complaints */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={printStyles.secTitle}>Chief Symptoms</div>
              <p style={printStyles.bodyText}>{checkup.complaint}</p>
            </div>
            {checkup.diagnosis && (
              <div style={{ flex: 1 }}>
                <div style={printStyles.secTitle}>Diagnosis</div>
                <p style={printStyles.bodyText}><strong>{checkup.diagnosis}</strong></p>
              </div>
            )}
          </div>

          {/* Investigations */}
          {checkup.investigations.length > 0 && (
            <div>
              <div style={printStyles.secTitle}>Suggested Investigations</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {checkup.investigations.map(inv => (
                  <span key={inv} style={printStyles.invBadge}>{inv}</span>
                ))}
              </div>
            </div>
          )}

          {/* Prescription Medicine Table */}
          {checkup.medicines.length > 0 && (
            <div>
              <div style={printStyles.secTitle}>Rx (Prescribed Medicines)</div>
              <table style={printStyles.table}>
                <thead>
                  <tr>
                    <th style={printStyles.th}>Medicine Name</th>
                    <th style={printStyles.th}>Dosage</th>
                    <th style={printStyles.th}>Duration</th>
                    <th style={printStyles.th}>Advice</th>
                    <th style={printStyles.th}>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {checkup.medicines.map((m, idx) => (
                    <tr key={idx}>
                      <td style={printStyles.td}><strong>{m.name}</strong></td>
                      <td style={printStyles.td}>{m.dosage}</td>
                      <td style={printStyles.td}>{m.duration}</td>
                      <td style={printStyles.td}>{m.advice}</td>
                      <td style={printStyles.td}>{m.quantity} units</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Remarks & Followup */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
            {checkup.remarks && (
              <div style={{ flex: 1 }}>
                <div style={printStyles.secTitle}>Special Instructions</div>
                <p style={printStyles.bodyText}>{checkup.remarks}</p>
              </div>
            )}
            {checkup.followupDate && (
              <div style={{ flex: 1 }}>
                <div style={printStyles.secTitle}>Next Follow-up Date</div>
                <p style={{ ...printStyles.bodyText, color: '#3b5bdb', fontWeight: 'bold' }}>
                  {new Date(checkup.followupDate).toLocaleDateString('en-IN')}
                </p>
              </div>
            )}
          </div>

          {/* Footer Signature */}
          <div style={printStyles.footer}>
            <div>
              <span>Generated via ClinicOS Clinical Dashboard.</span>
            </div>
            
            <div style={printStyles.signatureSection}>
              {settings.displaySignature && (
                <div style={printStyles.signatureText}>
                  Digital Signature Approved<br />
                  <strong>{settings.doctorName}</strong>
                </div>
              )}
              <div style={printStyles.sigLine} />
            </div>
          </div>
        </div>

        {/* Action button */}
        <div style={{ ...modalStyles.actions, borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }} className="no-print">
          <button onClick={onClose} className="btn btn-outline">Close</button>
          <button onClick={handlePrintTrigger} className="btn btn-primary"><Printer size={16} /> Print Document</button>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// INLINE CUSTOM STYLES
// ==========================================
const modalStyles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.75rem',
  },
  title: {
    fontSize: '1.25rem',
    color: 'var(--text-main)',
    fontFamily: 'var(--font-heading)',
  },
  closeBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
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

const styles = {
  stepIndicatorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: '0.75rem',
    borderRadius: 'var(--radius-md)',
  },
  stepNum: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '0.75rem',
  },
  stepText: {
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  stepConnector: {
    flex: 1,
    height: '2px',
    backgroundColor: 'var(--border-color)',
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  patientBanner: {
    backgroundColor: 'var(--primary-light)',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem',
  },
  bannerTag: {
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    fontSize: '0.7rem',
    fontWeight: 600,
    padding: '1px 6px',
    borderRadius: 'var(--radius-full)',
    marginLeft: '6px',
  },
  bannerAllergies: {
    color: 'var(--danger)',
    fontWeight: 500,
  },
  invContainer: {
    display: 'flex',
    gap: '0.4rem',
    flexWrap: 'wrap' as const,
  },
  invTag: {
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-full)',
    padding: '0.3rem 0.8rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  prescBuilder: {
    backgroundColor: 'rgba(0,0,0,0.01)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    padding: '0.4rem 0.75rem',
    backgroundColor: '#ffffff',
  },
  builderSearchInput: {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '0.85rem',
    color: '#000000',
  },
  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 200,
    maxHeight: '180px',
    overflowY: 'auto' as const,
  },
  dropdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.6rem 0.8rem',
    borderBottom: '1px solid #f1f5f9',
    cursor: 'pointer',
    transition: 'background-color 0.1s ease',
  },
  dropdownMeta: {
    display: 'block',
    fontSize: '0.7rem',
    color: '#64748b',
    fontWeight: 'normal' as const,
  },
  dropdownPrice: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#0ca678',
  },
  templateRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  qtyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniTableContainer: {
    marginTop: '0.75rem',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
  },
  deleteMiniBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--danger)',
    cursor: 'pointer',
  },
  liveCostContainer: {
    textAlign: 'right' as const,
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(0,0,0,0.02)',
    fontSize: '0.8rem',
    borderTop: '1px solid var(--border-color)',
  },
  billingCard: {
    backgroundColor: 'rgba(59, 91, 219, 0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.6rem',
  },
  billingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem',
    color: 'var(--text-main)',
  },
  billingInput: {
    width: '100px',
    padding: '0.3rem 0.5rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-color)',
    fontSize: '0.9rem',
    textAlign: 'right' as const,
  },
  discTag: {
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: 'var(--text-main)',
  },
  warningAlert: {
    backgroundColor: 'var(--danger-light)',
    color: 'var(--danger)',
    padding: '0.75rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.8rem',
    fontWeight: 500,
  },
  footerNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '1.25rem',
    borderTop: '1px solid var(--border-color)',
  }
};

const viewStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.85rem',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--radius-sm)',
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.2rem',
  },
  label: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
  },
  text: {
    fontSize: '0.9rem',
    color: 'var(--text-main)',
  },
  vitalsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.5rem',
    backgroundColor: 'rgba(0,0,0,0.01)',
    border: '1px dashed var(--border-color)',
    padding: '0.75rem',
    borderRadius: 'var(--radius-md)',
  },
  vitalItem: {
    fontSize: '0.8rem',
    color: 'var(--text-main)',
  },
  invoiceCard: {
    backgroundColor: 'var(--primary-light)',
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem',
  },
  invoiceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
  }
};

const printStyles = {
  previewContainer: {
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    padding: '30px',
    fontFamily: 'Inter, sans-serif',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '2px solid #3b5bdb',
    paddingBottom: '15px',
    marginBottom: '5px',
  },
  doctorInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
  },
  docName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#3b5bdb',
  },
  docMeta: {
    fontSize: '11px',
    color: '#555',
  },
  clinicInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    textAlign: 'right' as const,
  },
  clinicName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  clinicMeta: {
    fontSize: '11px',
    color: '#555',
  },
  patientBar: {
    backgroundColor: '#f4f6fa',
    padding: '10px 15px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
  },
  secTitle: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#3b5bdb',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '3px',
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
  },
  vitalsGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#fafafa',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #eee',
    fontSize: '11px',
  },
  bodyText: {
    fontSize: '12px',
    lineHeight: 1.4,
  },
  invBadge: {
    border: '1px solid #3b5bdb',
    color: '#3b5bdb',
    fontSize: '10px',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '5px',
  },
  th: {
    background: '#f4f6fa',
    borderBottom: '2px solid #e2e8f0',
    padding: '6px 8px',
    fontSize: '11px',
    textAlign: 'left' as const,
  },
  td: {
    padding: '8px 8px',
    borderBottom: '1px solid #edf2ff',
    fontSize: '11px',
  },
  footer: {
    marginTop: '40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    fontSize: '10px',
    borderTop: '1px solid #eee',
    paddingTop: '10px',
    color: '#666',
  },
  signatureSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    textAlign: 'right' as const,
  },
  signatureText: {
    fontSize: '10px',
    color: '#333',
    lineHeight: 1.3,
  },
  sigLine: {
    borderTop: '1px solid #333',
    width: '120px',
    marginTop: '30px',
  }
};

const extraStyles = document.createElement('style');
extraStyles.innerHTML = `
  .slideover-overlay, .modal-overlay {
    transition: opacity 0.25s ease;
  }
  .form-select, .form-input, .form-textarea {
    color: var(--text-main) !important;
  }
  .form-select option {
    background-color: var(--bg-card) !important;
    color: var(--text-main) !important;
  }
`;
document.head.appendChild(extraStyles);
export default AddPatientModal;
