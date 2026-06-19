export interface PrescriptionItem {
  name: string;
  advice: string;
  dosage: string;
  duration: string;
  quantity: number;
  price: number;
}

export interface Patient {
  id: string; // Patient Number: e.g. "PT-1001"
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  age: number;
  mobile: string;
  address: string;
  weight: string;
  bloodGroup: string;
  sugarLevel: string;
  allergies: string;
  presentComplaint: string;
  pastHistory: string;
  referenceName: string;
  referenceMobile: string;
  createdDate: string;
  updatedDate: string;
}

export interface Vitals {
  weight?: string;
  pulse?: string;
  bp?: string;
  temp?: string;
  rr?: string;
  sugar?: string;
  thyroid?: string;
}

export interface Checkup {
  id: string; // "CH-2001"
  patientId: string;
  patientName: string;
  date: string; // YYYY-MM-DD
  complaint: string;
  diagnosis: string;
  notes: string;
  remarks: string;
  internalNotes: string;
  followupDate?: string;
  vitals: Vitals;
  investigations: string[];
  medicines: PrescriptionItem[];
  cost: number;
  paid: number;
  due: number;
  paymentMode: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';
  updatedDate: string;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'Followup' | 'Birthday' | 'Payment Due' | 'Custom';
  completed: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  company: string;
  contains: string;
  price: number;
  type: string;
}

export interface ClinicSettings {
  doctorName: string;
  qualification: string;
  regNumber: string;
  clinicName: string;
  clinicAddress: string;
  phone: string;
  email: string;
  consultationFee: number;
  emergencyFee: number;
  followupFee: number;
  displayLogo: boolean;
  displaySignature: boolean;
}

const DEFAULT_SETTINGS: ClinicSettings = {
  doctorName: "Dr. Arvind Sharma",
  qualification: "MBBS, MD (Medicine)",
  regNumber: "MCI-45892",
  clinicName: "Care & Cure Clinic",
  clinicAddress: "Sector 15, Near Central Market, Gurugram, Haryana - 122001",
  phone: "+91 98765 43210",
  email: "dr.sharma@careandcure.in",
  consultationFee: 400,
  emergencyFee: 800,
  followupFee: 200,
  displayLogo: true,
  displaySignature: true
};

const MASTER_MEDICINES: Medicine[] = [
  { id: "MED-001", name: "Paracetamol 650mg (Dolo)", company: "Micro Labs", contains: "Paracetamol", price: 3.5, type: "Tablet" },
  { id: "MED-002", name: "Amoxicillin 500mg", company: "Alkem", contains: "Amoxicillin", price: 12.0, type: "Capsule" },
  { id: "MED-003", name: "Cetirizine 10mg", company: "Cipla", contains: "Cetirizine", price: 2.5, type: "Tablet" },
  { id: "MED-004", name: "Metformin 500mg (Glycomet)", company: "USV", contains: "Metformin", price: 4.0, type: "Tablet" },
  { id: "MED-005", name: "Atorvastatin 10mg (Lipvas)", company: "Cipla", contains: "Atorvastatin", price: 8.5, type: "Tablet" },
  { id: "MED-006", name: "Ibuprofen 400mg (Brufen)", company: "Abbott", contains: "Ibuprofen", price: 3.0, type: "Tablet" },
  { id: "MED-007", name: "Pantoprazole 40mg (Pantocid)", company: "Sun Pharma", contains: "Pantoprazole", price: 9.0, type: "Tablet" },
  { id: "MED-008", name: "Azithromycin 500mg (Azee)", company: "Cipla", contains: "Azithromycin", price: 22.0, type: "Tablet" },
  { id: "MED-009", name: "Cough Syrup (Ascoril)", company: "Glenmark", contains: "Ambroxol + Levosalbutamol", price: 110.0, type: "Syrup" },
  { id: "MED-010", name: "Beta Betadine Ointment", company: "Win-Medicare", contains: "Povidone-Iodine", price: 95.0, type: "Ointment" },
  { id: "MED-011", name: "Multivitamin (A to Z)", company: "Alkem", contains: "Multivitamins & Minerals", price: 7.0, type: "Tablet" },
  { id: "MED-012", name: "Montelukast + Levocetirizine", company: "Mankind", contains: "Montelukast + Levocetirizine", price: 11.5, type: "Tablet" }
];

// Helper to generate historical dates relative to today
const getPastDateString = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const seedInitialData = () => {
  const patients: Patient[] = [
    {
      id: "PT-1001",
      name: "Rajesh Kumar",
      gender: "Male",
      dob: "1980-04-12",
      age: 46,
      mobile: "9812345678",
      address: "123, Sector 4, Gurugram",
      weight: "74",
      bloodGroup: "O+",
      sugarLevel: "140",
      allergies: "Dust, Sulfa drugs",
      presentComplaint: "Chronic dry cough and mild fever",
      pastHistory: "Hypertension for 5 years",
      referenceName: "Dr. Gupta",
      referenceMobile: "9999888877",
      createdDate: getPastDateString(28),
      updatedDate: getPastDateString(28)
    },
    {
      id: "PT-1002",
      name: "Sunita Devi",
      gender: "Female",
      dob: "1988-08-25",
      age: 37,
      mobile: "9876543211",
      address: "45-B, Vyapar Kendra, Gurugram",
      weight: "62",
      bloodGroup: "A+",
      sugarLevel: "110",
      allergies: "None",
      presentComplaint: "Severe acidity and abdominal discomfort",
      pastHistory: "None",
      referenceName: "Self",
      referenceMobile: "",
      createdDate: getPastDateString(25),
      updatedDate: getPastDateString(25)
    },
    {
      id: "PT-1003",
      name: "Amit Sharma",
      gender: "Male",
      dob: "1995-12-05",
      age: 30,
      mobile: "9560123456",
      address: "DLF Phase 3, Gurugram",
      weight: "80",
      bloodGroup: "B+",
      sugarLevel: "98",
      allergies: "Penicillin",
      presentComplaint: "Throat infection and body ache",
      pastHistory: "Tonsillitis in childhood",
      referenceName: "Direct Walk-in",
      referenceMobile: "",
      createdDate: getPastDateString(22),
      updatedDate: getPastDateString(22)
    },
    {
      id: "PT-1004",
      name: "Priyanka Sen",
      gender: "Female",
      dob: "1992-03-18",
      age: 34,
      mobile: "8800112233",
      address: "Flat 402, Oakwood Towers, Gurugram",
      weight: "55",
      bloodGroup: "AB+",
      sugarLevel: "105",
      allergies: "None",
      presentComplaint: "Regular migraines, fatigue",
      pastHistory: "Anemia",
      referenceName: "Amit Sharma",
      referenceMobile: "9560123456",
      createdDate: getPastDateString(18),
      updatedDate: getPastDateString(18)
    },
    {
      id: "PT-1005",
      name: "Vikram Malhotra",
      gender: "Male",
      dob: "1965-06-30",
      age: 60,
      mobile: "9911223344",
      address: "Villas 12, Nirvana Country, Gurugram",
      weight: "88",
      bloodGroup: "O-",
      sugarLevel: "185",
      allergies: "Aspirin",
      presentComplaint: "Routine diabetic checkup, joint stiffness",
      pastHistory: "Diabetes Type-2 for 10 years, Osteoarthritis",
      referenceName: "Dr. Verma",
      referenceMobile: "9898989898",
      createdDate: getPastDateString(15),
      updatedDate: getPastDateString(15)
    },
    {
      id: "PT-1006",
      name: "Harish Gupta",
      gender: "Male",
      dob: "1972-11-20",
      age: 53,
      mobile: "9899887766",
      address: "House 72, Sector 14, Gurugram",
      weight: "78",
      bloodGroup: "B-",
      sugarLevel: "130",
      allergies: "None",
      presentComplaint: "High blood pressure fluctuation",
      pastHistory: "Mild asthma",
      referenceName: "Self",
      referenceMobile: "",
      createdDate: getPastDateString(8),
      updatedDate: getPastDateString(8)
    },
    {
      id: "PT-1007",
      name: "Meera Nair",
      gender: "Female",
      dob: "1983-05-14",
      age: 43,
      mobile: "9447123456",
      address: "Sohna Road, Gurugram",
      weight: "68",
      bloodGroup: "A-",
      sugarLevel: "122",
      allergies: "Peanuts",
      presentComplaint: "Skin rashes and itching on arms",
      pastHistory: "Eczema",
      referenceName: "Dr. Nair",
      referenceMobile: "9845612300",
      createdDate: getPastDateString(3),
      updatedDate: getPastDateString(3)
    }
  ];

  // Seed Checkups & Payments
  const checkups: Checkup[] = [
    {
      id: "CH-2001",
      patientId: "PT-1001",
      patientName: "Rajesh Kumar",
      date: getPastDateString(28),
      complaint: "Dry cough, low-grade fever",
      diagnosis: "Acute Bronchitis",
      notes: "Advised chest steam inhalation twice daily. Rest for 3 days.",
      remarks: "Avoid cold water and oily foods.",
      internalNotes: "Patient seems a heavy smoker. Advised cessation.",
      followupDate: getPastDateString(21),
      vitals: { weight: "74", pulse: "82", bp: "135/85", temp: "99.8", rr: "18", sugar: "140" },
      investigations: ["CBC", "X-Ray Chest"],
      medicines: [
        { name: "Paracetamol 650mg (Dolo)", advice: "After Food", dosage: "1-0-1", duration: "5 Days", quantity: 10, price: 3.5 },
        { name: "Cough Syrup (Ascoril)", advice: "After Food", dosage: "1-1-1", duration: "5 Days", quantity: 1, price: 110 }
      ],
      cost: 545, // 400 fee + 35 meds + 110 syrup
      paid: 545,
      due: 0,
      paymentMode: "UPI",
      updatedDate: getPastDateString(28)
    },
    {
      id: "CH-2002",
      patientId: "PT-1002",
      patientName: "Sunita Devi",
      date: getPastDateString(25),
      complaint: "Severe acidity, bloating",
      diagnosis: "Gastroesophageal Reflux Disease (GERD)",
      notes: "Take antacid 30 mins before breakfast.",
      remarks: "Eat small, frequent meals. Avoid spicy foods.",
      internalNotes: "Stress related.",
      followupDate: getPastDateString(18),
      vitals: { weight: "62", pulse: "76", bp: "120/80", temp: "98.4", rr: "16", sugar: "110" },
      investigations: [],
      medicines: [
        { name: "Pantoprazole 40mg (Pantocid)", advice: "Empty Stomach", dosage: "1-0-0", duration: "15 Days", quantity: 15, price: 9.0 }
      ],
      cost: 535, // 400 + 135 meds
      paid: 500,
      due: 35,
      paymentMode: "Cash",
      updatedDate: getPastDateString(25)
    },
    {
      id: "CH-2003",
      patientId: "PT-1003",
      patientName: "Amit Sharma",
      date: getPastDateString(22),
      complaint: "Sore throat, dysphagia",
      diagnosis: "Acute Pharyngitis",
      notes: "Warm saline gargles 4 times daily.",
      remarks: "Drink warm fluids.",
      internalNotes: "",
      followupDate: getPastDateString(15),
      vitals: { weight: "80", pulse: "88", bp: "118/76", temp: "101.2", rr: "18", sugar: "98" },
      investigations: [],
      medicines: [
        { name: "Amoxicillin 500mg", advice: "After Food", dosage: "1-0-1", duration: "5 Days", quantity: 10, price: 12.0 },
        { name: "Paracetamol 650mg (Dolo)", advice: "After Food", dosage: "1-0-1", duration: "3 Days", quantity: 6, price: 3.5 }
      ],
      cost: 541, // 400 + 120 + 21
      paid: 541,
      due: 0,
      paymentMode: "UPI",
      updatedDate: getPastDateString(22)
    },
    {
      id: "CH-2004",
      patientId: "PT-1004",
      patientName: "Priyanka Sen",
      date: getPastDateString(18),
      complaint: "Severe headache, visual aura",
      diagnosis: "Migraine",
      notes: "Keep room dark and quiet during attacks.",
      remarks: "Maintain a migraine trigger diary.",
      internalNotes: "Sleep cycle is irregular.",
      followupDate: getPastDateString(11),
      vitals: { weight: "55", pulse: "72", bp: "110/70", temp: "98.2", rr: "14", sugar: "105" },
      investigations: ["MRI"],
      medicines: [
        { name: "Ibuprofen 400mg (Brufen)", advice: "After Food", dosage: "SOS", duration: "15 Days", quantity: 10, price: 3.0 }
      ],
      cost: 430, // 400 + 30
      paid: 430,
      due: 0,
      paymentMode: "Card",
      updatedDate: getPastDateString(18)
    },
    {
      id: "CH-2005",
      patientId: "PT-1005",
      patientName: "Vikram Malhotra",
      date: getPastDateString(15),
      complaint: "Joint pain, check blood sugar levels",
      diagnosis: "Type 2 Diabetes + Osteoarthritis Knee",
      notes: "Strict diabetic diet. Walk 30 minutes daily.",
      remarks: "Daily glucose monitoring.",
      internalNotes: "High risk of diabetic neuropathy.",
      followupDate: getPastDateString(1),
      vitals: { weight: "88", pulse: "74", bp: "140/90", temp: "98.0", rr: "16", sugar: "185" },
      investigations: ["CBC", "LFT", "KFT"],
      medicines: [
        { name: "Metformin 500mg (Glycomet)", advice: "After Food", dosage: "1-0-1", duration: "30 Days", quantity: 60, price: 4.0 },
        { name: "Atorvastatin 10mg (Lipvas)", advice: "Night", dosage: "0-0-1", duration: "30 Days", quantity: 30, price: 8.5 }
      ],
      cost: 895, // 400 + 240 + 255
      paid: 800,
      due: 95,
      paymentMode: "Bank Transfer",
      updatedDate: getPastDateString(15)
    },
    {
      id: "CH-2006",
      patientId: "PT-1001",
      patientName: "Rajesh Kumar",
      date: getPastDateString(10),
      complaint: "Followup: dry cough is better, body ache continues",
      diagnosis: "Post-viral fatigue",
      notes: "Prescribed multivitamins.",
      remarks: "Sleep well, keep hydrated.",
      internalNotes: "",
      followupDate: getPastDateString(3),
      vitals: { weight: "74", pulse: "78", bp: "128/82", temp: "98.6", rr: "16", sugar: "125" },
      investigations: [],
      medicines: [
        { name: "Multivitamin (A to Z)", advice: "After Food", dosage: "1-0-0", duration: "15 Days", quantity: 15, price: 7.0 }
      ],
      cost: 505, // 400 + 105
      paid: 505,
      due: 0,
      paymentMode: "UPI",
      updatedDate: getPastDateString(10)
    },
    {
      id: "CH-2007",
      patientId: "PT-1006",
      patientName: "Harish Gupta",
      date: getPastDateString(8),
      complaint: "Dizziness, occipital headache",
      diagnosis: "Essential Hypertension",
      notes: "Reduce sodium intake. Avoid stress.",
      remarks: "Monitor BP twice daily for a week.",
      internalNotes: "Needs close monitoring. Refused immediate hospitalisation.",
      followupDate: getPastDateString(1),
      vitals: { weight: "78", pulse: "84", bp: "160/100", temp: "98.4", rr: "18", sugar: "130" },
      investigations: [],
      medicines: [
        { name: "Atorvastatin 10mg (Lipvas)", advice: "Night", dosage: "0-0-1", duration: "15 Days", quantity: 15, price: 8.5 }
      ],
      cost: 527.5, // 400 + 127.5
      paid: 500,
      due: 27.5,
      paymentMode: "Cash",
      updatedDate: getPastDateString(8)
    },
    {
      id: "CH-2008",
      patientId: "PT-1007",
      patientName: "Meera Nair",
      date: getPastDateString(3),
      complaint: "Itchy red bumps on arms",
      diagnosis: "Allergic Contact Dermatitis",
      notes: "Apply Betadine cream. Stop using new hand lotion.",
      remarks: "Keep skin clean and dry.",
      internalNotes: "",
      followupDate: getPastDateString(0), // Today
      vitals: { weight: "68", pulse: "80", bp: "122/80", temp: "98.6", rr: "16", sugar: "122" },
      investigations: [],
      medicines: [
        { name: "Cetirizine 10mg", advice: "Night", dosage: "0-0-1", duration: "7 Days", quantity: 7, price: 2.5 },
        { name: "Beta Betadine Ointment", advice: "Morning", dosage: "SOS", duration: "7 Days", quantity: 1, price: 95.0 }
      ],
      cost: 512.5, // 400 + 17.5 + 95
      paid: 512.5,
      due: 0,
      paymentMode: "UPI",
      updatedDate: getPastDateString(3)
    }
  ];

  // Add more historical revenue points (fake checkups) to build a beautiful 15/30 day chart
  // We'll generate daily transaction points directly into a chart helper, but seeding checkups here is great.
  for (let i = 1; i <= 30; i++) {
    // skip dates already represented above if we want, or just add some variety
    if (i !== 28 && i !== 25 && i !== 22 && i !== 18 && i !== 15 && i !== 10 && i !== 8 && i !== 3) {
      // 70% chance to have a checkup on that day
      if (Math.random() > 0.3) {
        const randId = 1001 + Math.floor(Math.random() * 7);
        const pt = patients.find(p => p.id === `PT-${randId}`) || patients[0];
        const cost = 400 + Math.floor(Math.random() * 300);
        const due = Math.random() > 0.8 ? 50 : 0;
        checkups.push({
          id: `CH-${2000 + i + 10}`,
          patientId: pt.id,
          patientName: pt.name,
          date: getPastDateString(i),
          complaint: "General Checkup",
          diagnosis: "Seasonal viral elements",
          notes: "Prescribed basic rest.",
          remarks: "",
          internalNotes: "",
          vitals: { weight: pt.weight, pulse: "78", bp: "120/80", temp: "98.6" },
          investigations: [],
          medicines: [
            { name: "Paracetamol 650mg (Dolo)", advice: "After Food", dosage: "1-0-1", duration: "3 Days", quantity: 6, price: 3.5 }
          ],
          cost: cost,
          paid: cost - due,
          due: due,
          paymentMode: Math.random() > 0.5 ? 'UPI' : 'Cash',
          updatedDate: getPastDateString(i)
        });
      }
    }
  }

  // Seeding reminders
  const reminders: Reminder[] = [
    {
      id: "REM-001",
      title: "Followup: Meera Nair",
      description: "Dermatitis checkup - inspect skin patches",
      date: getPastDateString(0), // Today
      time: "10:30",
      type: "Followup",
      completed: false
    },
    {
      id: "REM-002",
      title: "Call Vikram Malhotra",
      description: "Ask about fasting sugar readings",
      date: getPastDateString(0), // Today
      time: "17:00",
      type: "Custom",
      completed: false
    },
    {
      id: "REM-003",
      title: "Pending payment: Vikram Malhotra",
      description: "Collect ₹95 pending dues",
      date: getPastDateString(-2), // 2 days later
      time: "11:00",
      type: "Payment Due",
      completed: false
    },
    {
      id: "REM-004",
      title: "Inventory Check: Azithromycin",
      description: "Order fresh batch of antibiotics",
      date: getPastDateString(-1), // Tomorrow
      time: "12:00",
      type: "Custom",
      completed: false
    }
  ];

  localStorage.setItem('clinicos_patients', JSON.stringify(patients));
  localStorage.setItem('clinicos_checkups', JSON.stringify(checkups));
  localStorage.setItem('clinicos_reminders', JSON.stringify(reminders));
  localStorage.setItem('clinicos_medicines', JSON.stringify(MASTER_MEDICINES));
  localStorage.setItem('clinicos_settings', JSON.stringify(DEFAULT_SETTINGS));
};

export const getPatients = (): Patient[] => {
  const p = localStorage.getItem('clinicos_patients');
  if (!p) {
    seedInitialData();
    return JSON.parse(localStorage.getItem('clinicos_patients') || '[]');
  }
  return JSON.parse(p);
};

export const getCheckups = (): Checkup[] => {
  const c = localStorage.getItem('clinicos_checkups');
  if (!c) {
    seedInitialData();
    return JSON.parse(localStorage.getItem('clinicos_checkups') || '[]');
  }
  return JSON.parse(c);
};

export const getReminders = (): Reminder[] => {
  const r = localStorage.getItem('clinicos_reminders');
  if (!r) {
    seedInitialData();
    return JSON.parse(localStorage.getItem('clinicos_reminders') || '[]');
  }
  return JSON.parse(r);
};

export const getMedicines = (): Medicine[] => {
  const m = localStorage.getItem('clinicos_medicines');
  if (!m) {
    seedInitialData();
    return JSON.parse(localStorage.getItem('clinicos_medicines') || '[]');
  }
  return JSON.parse(m);
};

export const getSettings = (): ClinicSettings => {
  const s = localStorage.getItem('clinicos_settings');
  if (!s) {
    seedInitialData();
    return JSON.parse(localStorage.getItem('clinicos_settings') || 'null');
  }
  return JSON.parse(s);
};

export const savePatients = (p: Patient[]) => localStorage.setItem('clinicos_patients', JSON.stringify(p));
export const saveCheckups = (c: Checkup[]) => localStorage.setItem('clinicos_checkups', JSON.stringify(c));
export const saveReminders = (r: Reminder[]) => localStorage.setItem('clinicos_reminders', JSON.stringify(r));
export const saveMedicines = (m: Medicine[]) => localStorage.setItem('clinicos_medicines', JSON.stringify(m));
export const saveSettings = (s: ClinicSettings) => localStorage.setItem('clinicos_settings', JSON.stringify(s));

// Business actions
export const addPatient = (patientData: Omit<Patient, 'id' | 'createdDate' | 'updatedDate'>): Patient => {
  const patients = getPatients();
  
  // Auto increment ID: PT-1001, PT-1002
  const nextNum = patients.length > 0 
    ? Math.max(...patients.map(p => parseInt(p.id.split('-')[1]))) + 1 
    : 1001;
  const id = `PT-${nextNum}`;
  
  const nowStr = new Date().toISOString().split('T')[0];
  const newPatient: Patient = {
    ...patientData,
    id,
    createdDate: nowStr,
    updatedDate: nowStr
  };
  
  patients.unshift(newPatient);
  savePatients(patients);
  return newPatient;
};

export const addCheckup = (checkupData: Omit<Checkup, 'id' | 'date' | 'updatedDate'>): Checkup => {
  const checkups = getCheckups();
  const nextNum = checkups.length > 0
    ? Math.max(...checkups.map(c => parseInt(c.id.split('-')[1]))) + 1
    : 2001;
  const id = `CH-${nextNum}`;
  
  const nowStr = new Date().toISOString().split('T')[0];
  const newCheckup: Checkup = {
    ...checkupData,
    id,
    date: nowStr,
    updatedDate: nowStr
  };
  
  // Insert checkup at the start
  checkups.unshift(newCheckup);
  saveCheckups(checkups);

  // Update patient's Present Complaint, Weight, and Sugar Level dynamically
  const patients = getPatients();
  const patientIdx = patients.findIndex(p => p.id === checkupData.patientId);
  if (patientIdx !== -1) {
    if (newCheckup.vitals.weight) patients[patientIdx].weight = newCheckup.vitals.weight;
    if (newCheckup.vitals.sugar) patients[patientIdx].sugarLevel = newCheckup.vitals.sugar;
    patients[patientIdx].presentComplaint = newCheckup.complaint;
    patients[patientIdx].updatedDate = nowStr;
    savePatients(patients);
  }

  // Create automatic reminder if followupDate is set
  if (newCheckup.followupDate) {
    addReminder({
      title: `Followup: ${newCheckup.patientName}`,
      description: `Followup for: ${newCheckup.diagnosis || newCheckup.complaint}`,
      date: newCheckup.followupDate,
      time: "10:00",
      type: "Followup"
    });
  }

  return newCheckup;
};

export const addReminder = (reminderData: Omit<Reminder, 'id' | 'completed'>): Reminder => {
  const reminders = getReminders();
  const id = `REM-${Date.now()}`;
  const newReminder: Reminder = {
    ...reminderData,
    id,
    completed: false
  };
  reminders.unshift(newReminder);
  saveReminders(reminders);
  return newReminder;
};

export const toggleReminder = (id: string): Reminder | undefined => {
  const reminders = getReminders();
  const idx = reminders.findIndex(r => r.id === id);
  if (idx !== -1) {
    reminders[idx].completed = !reminders[idx].completed;
    saveReminders(reminders);
    return reminders[idx];
  }
  return undefined;
};

export const deleteReminder = (id: string) => {
  const reminders = getReminders();
  const filtered = reminders.filter(r => r.id !== id);
  saveReminders(filtered);
};

// Simulation of Excel/CSV Backup download
export const downloadBackupData = () => {
  const patients = getPatients();
  const checkups = getCheckups();
  const reminders = getReminders();
  const settings = getSettings();

  const backupObj = {
    version: "2.1",
    timestamp: new Date().toISOString(),
    patients,
    checkups,
    reminders,
    settings
  };

  const jsonStr = JSON.stringify(backupObj, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '_');
  link.href = url;
  link.download = `ClinicOS_Backup_${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Simulation of Restore upload
export interface RestoreResult {
  patientsImported: number;
  checkupsImported: number;
  remindersImported: number;
  errors: string[];
}

export const restoreBackupData = (fileContent: string): RestoreResult => {
  const result: RestoreResult = {
    patientsImported: 0,
    checkupsImported: 0,
    remindersImported: 0,
    errors: []
  };

  try {
    const data = JSON.parse(fileContent);
    if (!data.version || !data.patients || !data.checkups) {
      result.errors.push("Invalid backup file format: Missing essential sheets.");
      return result;
    }

    // Merge Patients (deduplicate by mobile + name)
    const existingPatients = getPatients();
    const existingKeys = new Set(existingPatients.map(p => `${p.name.toLowerCase()}_${p.mobile}`));
    
    const newPatients = [...existingPatients];
    data.patients.forEach((p: any) => {
      const key = `${p.name.toLowerCase()}_${p.mobile}`;
      if (!existingKeys.has(key)) {
        newPatients.push(p);
        result.patientsImported++;
      }
    });
    savePatients(newPatients);

    // Merge Checkups (deduplicate by id or patientId+date+complaint)
    const existingCheckups = getCheckups();
    const existingCheckupKeys = new Set(existingCheckups.map(c => `${c.patientId}_${c.date}_${c.complaint.toLowerCase()}`));
    
    const newCheckups = [...existingCheckups];
    data.checkups.forEach((c: any) => {
      const key = `${c.patientId}_${c.date}_${c.complaint.toLowerCase()}`;
      if (!existingCheckupKeys.has(key)) {
        newCheckups.push(c);
        result.checkupsImported++;
      }
    });
    saveCheckups(newCheckups);

    // Merge Reminders
    const existingReminders = getReminders();
    const existingReminderKeys = new Set(existingReminders.map(r => `${r.title}_${r.date}`));
    
    const newReminders = [...existingReminders];
    data.reminders.forEach((r: any) => {
      const key = `${r.title}_${r.date}`;
      if (!existingReminderKeys.has(key)) {
        newReminders.push(r);
        result.remindersImported++;
      }
    });
    saveReminders(newReminders);

    if (data.settings) {
      saveSettings(data.settings);
    }
  } catch (err: any) {
    result.errors.push(`Parse error: ${err.message || 'unknown error'}`);
  }

  return result;
};
