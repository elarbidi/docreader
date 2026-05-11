/**
 * Sample data fixture for development testing.
 * Auto-loaded when ?demo=1 is in the URL (browser only, not Electron).
 */

export const SAMPLE_DATA = {
  exportedAt: new Date().toISOString(),
  clinic: {
    id: 'org_demo',
    name: 'Cabinet Dentaire Dr. Alami',
    phone: '+212 5 22 00 00 00',
    email: 'contact@dr-alami.ma',
    address: '15 Rue Hassan II, Casablanca',
    ice: '002345678000045',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  patientGroups: [
    { id: 'grp1', name: 'VIP', description: 'Patients prioritaires', color: '#8b5cf6', clinicId: 'org_demo', createdAt: '2024-01-01T00:00:00Z' },
    { id: 'grp2', name: 'AMO', description: 'Assurance maladie obligatoire', color: '#06b6d4', clinicId: 'org_demo', createdAt: '2024-01-01T00:00:00Z' },
    { id: 'grp3', name: 'CNSS', description: 'Caisse nationale sécurité sociale', color: '#10b981', clinicId: 'org_demo', createdAt: '2024-01-01T00:00:00Z' },
  ],
  patients: [
    { id: 'pat1', firstName: 'Youssef', lastName: 'Alami', email: 'youssef@email.com', phone: '0661000001', dateOfBirth: '1985-03-15', gender: 'M', cin: 'BE123456', mutuelle: 'CNSS', allergies: 'Pénicilline', notes: 'Patient fidèle depuis 2018', createdAt: '2024-01-10T00:00:00Z', updatedAt: '2024-12-01T00:00:00Z', clinicId: 'org_demo', groupId: 'grp1' },
    { id: 'pat2', firstName: 'Fatima', lastName: 'Benali', email: 'fatima@email.com', phone: '0661000002', dateOfBirth: '1990-07-22', gender: 'F', cin: 'BE654321', mutuelle: 'AMO', createdAt: '2024-02-15T00:00:00Z', updatedAt: '2024-11-20T00:00:00Z', clinicId: 'org_demo', groupId: 'grp2' },
    { id: 'pat3', firstName: 'Mohamed', lastName: 'Tazi', phone: '0661000003', dateOfBirth: '1975-11-30', gender: 'M', cin: 'BK001122', createdAt: '2024-03-01T00:00:00Z', updatedAt: '2024-10-05T00:00:00Z', clinicId: 'org_demo', groupId: 'grp3' },
    { id: 'pat4', firstName: 'Amina', lastName: 'Chraibi', email: 'amina.c@email.com', phone: '0661000004', dateOfBirth: '2001-05-10', gender: 'F', createdAt: '2024-04-20T00:00:00Z', updatedAt: '2024-09-01T00:00:00Z', clinicId: 'org_demo' },
    { id: 'pat5', firstName: 'Hassan', lastName: 'Idrissi', phone: '0661000005', dateOfBirth: '1968-12-01', gender: 'M', cin: 'AA556677', mutuelle: 'CNOPS', createdAt: '2024-05-05T00:00:00Z', updatedAt: '2024-08-15T00:00:00Z', clinicId: 'org_demo', groupId: 'grp1' },
  ],
  appointments: [
    { id: 'appt1', startTime: new Date(Date.now() - 1 * 86400000).toISOString(), endTime: new Date(Date.now() - 1 * 86400000 + 3600000).toISOString(), type: 'Consultation', status: 'COMPLETED', patientId: 'pat1', clinicId: 'org_demo', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    { id: 'appt2', startTime: new Date(Date.now() + 1 * 86400000).toISOString(), endTime: new Date(Date.now() + 1 * 86400000 + 3600000).toISOString(), type: 'Détartrage', status: 'CONFIRMED', patientId: 'pat2', clinicId: 'org_demo', notes: 'Patient à prévenir la veille', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    { id: 'appt3', startTime: new Date(Date.now() + 2 * 86400000).toISOString(), endTime: new Date(Date.now() + 2 * 86400000 + 1800000).toISOString(), type: 'Urgence', status: 'SCHEDULED', patientId: 'pat3', clinicId: 'org_demo', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    { id: 'appt4', startTime: new Date(Date.now() - 7 * 86400000).toISOString(), endTime: new Date(Date.now() - 7 * 86400000 + 3600000).toISOString(), type: 'Consultation', status: 'NO_SHOW', patientId: 'pat4', clinicId: 'org_demo', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    { id: 'appt5', startTime: new Date(Date.now() - 14 * 86400000).toISOString(), endTime: new Date(Date.now() - 14 * 86400000 + 3600000).toISOString(), type: 'Blanchiment', status: 'CANCELLED', patientId: 'pat5', clinicId: 'org_demo', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  ],
  visits: [
    { id: 'vis1', date: new Date(Date.now() - 1 * 86400000).toISOString().slice(0,10), status: 'COMPLETED', patientId: 'pat1', doctorId: 'doc1', totalAmount: 800, paidAmount: 800, actId: 'act1', actData: '{"Dent traitée":"16","Nombre de canaux":3}', clinicId: 'org_demo', notes: 'Traitement bien toléré', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    { id: 'vis2', date: new Date(Date.now() - 30 * 86400000).toISOString().slice(0,10), status: 'COMPLETED', patientId: 'pat1', doctorId: 'doc1', totalAmount: 400, paidAmount: 350, actId: 'act2', clinicId: 'org_demo', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    { id: 'vis3', date: new Date(Date.now() - 5 * 86400000).toISOString().slice(0,10), status: 'DRAFT', patientId: 'pat2', doctorId: 'doc1', totalAmount: 600, paidAmount: 300, actId: 'act1', clinicId: 'org_demo', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    { id: 'vis4', date: new Date(Date.now() - 60 * 86400000).toISOString().slice(0,10), status: 'COMPLETED', patientId: 'pat3', doctorId: 'doc1', totalAmount: 1200, paidAmount: 1200, clinicId: 'org_demo', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    { id: 'vis5', date: new Date(Date.now() - 90 * 86400000).toISOString().slice(0,10), status: 'COMPLETED', patientId: 'pat4', doctorId: 'doc1', totalAmount: 500, paidAmount: 500, clinicId: 'org_demo', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  ],
  treatmentPlans: [],
  prescriptions: [
    {
      id: 'rx1', date: new Date(Date.now() - 1 * 86400000).toISOString().slice(0,10),
      status: 'SIGNED', patientId: 'pat1', doctorId: 'doc1', visitId: 'vis1',
      clinicId: 'org_demo', notes: 'Prendre après les repas',
      createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
      items: [
        { id: 'ri1', prescriptionId: 'rx1', drugId: 'drg1', dosage: '1cp 3x/j', durationDays: 7, quantity: 21,
          drug: { id: 'drg1', name: 'Amoxicilline 500mg', description: 'Antibiotique large spectre', contraindications: 'Allergie pénicilline', categoryId: 'cat1', category: { id: 'cat1', name: 'Antibiotiques', createdAt: '2024-01-01T00:00:00Z' } }
        },
        { id: 'ri2', prescriptionId: 'rx1', drugId: 'drg2', dosage: '1cp 2x/j', durationDays: 5, quantity: 10,
          drug: { id: 'drg2', name: 'Ibuprofène 400mg', description: 'Anti-inflammatoire AINS', categoryId: 'cat2', category: { id: 'cat2', name: 'Anti-inflammatoires', createdAt: '2024-01-01T00:00:00Z' } }
        },
      ]
    },
    {
      id: 'rx2', date: new Date(Date.now() - 30 * 86400000).toISOString().slice(0,10),
      status: 'SIGNED', patientId: 'pat2', doctorId: 'doc1',
      clinicId: 'org_demo',
      createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
      items: [
        { id: 'ri3', prescriptionId: 'rx2', drugId: 'drg3', dosage: '2cp le soir', durationDays: 10, quantity: 20,
          drug: { id: 'drg3', name: 'Paracétamol 1g', description: 'Antalgique antipyrétique', categoryId: 'cat3', category: { id: 'cat3', name: 'Antalgiques', createdAt: '2024-01-01T00:00:00Z' } }
        },
      ]
    },
  ],
  acts: [
    { id: 'act1', name: 'Traitement Endodontique', defaultPrice: 800, description: 'Dévitalisation et obturation canalaire', clinicId: 'org_demo', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', fields: [
      { id: 'f1', label: 'Dent traitée', type: 'text', required: true, order: 1, actId: 'act1' },
      { id: 'f2', label: 'Nombre de canaux', type: 'number', required: true, order: 2, actId: 'act1' },
      { id: 'f3', label: 'Radiographie prise', type: 'boolean', required: false, order: 3, actId: 'act1' },
    ]},
    { id: 'act2', name: 'Détartrage + Polissage', defaultPrice: 400, description: 'Détartrage ultrasonique et polissage coronaire', clinicId: 'org_demo', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', fields: [] },
    { id: 'act3', name: 'Extraction Simple', defaultPrice: 250, clinicId: 'org_demo', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', fields: [
      { id: 'f4', label: 'Dent extraite', type: 'text', required: true, order: 1, actId: 'act3' },
    ]},
    { id: 'act4', name: 'Blanchiment Dentaire', defaultPrice: 1500, description: 'Blanchiment au fauteuil LED', clinicId: 'org_demo', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', fields: [] },
  ],
  expenses: [
    { id: 'exp1', title: 'Matériel dentaire', description: 'Fraises et instruments rotatiifs', amount: 3500, date: new Date(Date.now() - 15 * 86400000).toISOString().slice(0,10), clinicId: 'org_demo', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    { id: 'exp2', title: 'Produits de stérilisation', amount: 850, date: new Date(Date.now() - 30 * 86400000).toISOString().slice(0,10), clinicId: 'org_demo', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    { id: 'exp3', title: 'Maintenance équipement', description: 'Révision annuelle du fauteuil', amount: 2200, date: new Date(Date.now() - 60 * 86400000).toISOString().slice(0,10), clinicId: 'org_demo', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  ],
  recurringExpenses: [
    { id: 're1', title: 'Loyer cabinet', amount: 8000, frequency: 'MONTHLY', interval: 1, startDate: '2024-01-01', clinicId: 'org_demo', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    { id: 're2', title: 'Électricité & Eau', amount: 600, frequency: 'MONTHLY', interval: 1, startDate: '2024-01-01', clinicId: 'org_demo', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    { id: 're3', title: 'Abonnement logiciel', amount: 299, frequency: 'MONTHLY', interval: 1, startDate: '2024-01-01', clinicId: 'org_demo', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  ],
  documents: [],
};
