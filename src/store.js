/**
 * DocDocs Reader — Data Store
 * Holds the parsed JSON and exposes query helpers.
 */

let _data = null;

export const store = {
  /** Load parsed backup JSON */
  load(data) {
    _data = data;
  },

  isLoaded() {
    return _data !== null;
  },

  // ─── Root accessors ─────────────────────────────────────────

  exportedAt()       { return _data?.exportedAt ?? null; },
  clinic()           { return _data?.clinic ?? null; },
  patients()         { return _data?.patients ?? []; },
  patientGroups()    { return _data?.patientGroups ?? []; },
  appointments()     { return _data?.appointments ?? []; },
  visits()           { return _data?.visits ?? []; },
  treatmentPlans()   { return _data?.treatmentPlans ?? []; },
  prescriptions()    { return _data?.prescriptions ?? []; },
  acts()             { return _data?.acts ?? []; },
  expenses()         { return _data?.expenses ?? []; },
  recurringExpenses(){ return _data?.recurringExpenses ?? []; },
  documents()        { return _data?.documents ?? []; },

  // ─── Patient helpers ─────────────────────────────────────────

  getPatient(id) {
    return this.patients().find(p => p.id === id) ?? null;
  },

  getPatientGroup(groupId) {
    return this.patientGroups().find(g => g.id === groupId) ?? null;
  },

  getPatientsByGroup(groupId) {
    return this.patients().filter(p => p.groupId === groupId);
  },

  searchPatients(query) {
    const q = query.toLowerCase().trim();
    if (!q) return this.patients();
    return this.patients().filter(p => {
      const full = `${p.firstName} ${p.lastName}`.toLowerCase();
      return (
        full.includes(q) ||
        (p.email ?? '').toLowerCase().includes(q) ||
        (p.phone ?? '').toLowerCase().includes(q) ||
        (p.cin ?? '').toLowerCase().includes(q)
      );
    });
  },

  // ─── Appointment helpers ──────────────────────────────────────

  getAppointmentsByPatient(patientId) {
    return this.appointments()
      .filter(a => a.patientId === patientId)
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  },

  getRecentAppointments(limit = 10) {
    return [...this.appointments()]
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, limit);
  },

  // ─── Visit helpers ────────────────────────────────────────────

  getVisitsByPatient(patientId) {
    return this.visits()
      .filter(v => v.patientId === patientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getTotalRevenue() {
    return this.visits().reduce((sum, v) => sum + (v.paidAmount ?? 0), 0);
  },

  getTotalExpenses() {
    return this.expenses().reduce((sum, e) => sum + (e.amount ?? 0), 0);
  },

  /** Revenue grouped by month: { 'YYYY-MM': total } */
  getMonthlyRevenue() {
    const map = {};
    for (const v of this.visits()) {
      if (!v.date || !v.paidAmount) continue;
      const key = v.date.slice(0, 7);
      map[key] = (map[key] ?? 0) + v.paidAmount;
    }
    return map;
  },

  /** Monthly expenses from Expense[] */
  getMonthlyExpenses() {
    const map = {};
    for (const e of this.expenses()) {
      if (!e.date || !e.amount) continue;
      const key = e.date.slice(0, 7);
      map[key] = (map[key] ?? 0) + e.amount;
    }
    return map;
  },

  // ─── Prescription helpers ─────────────────────────────────────

  getPrescriptionsByPatient(patientId) {
    return this.prescriptions()
      .filter(p => p.patientId === patientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  /** Deduplicated drug list from all prescription items */
  getAllDrugs() {
    const seen = new Set();
    const drugs = [];
    for (const rx of this.prescriptions()) {
      for (const item of (rx.items ?? [])) {
        if (item.drug && !seen.has(item.drug.id)) {
          seen.add(item.drug.id);
          drugs.push(item.drug);
        }
      }
    }
    return drugs.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  },

  // ─── Act helpers ──────────────────────────────────────────────

  getAct(id) {
    return this.acts().find(a => a.id === id) ?? null;
  },

  // ─── Dashboard stats ──────────────────────────────────────────

  getDashboardStats() {
    const today = new Date().toISOString().slice(0, 10);
    const todayAppts = this.appointments().filter(a =>
      a.startTime?.startsWith(today)
    );
    return {
      totalPatients:     this.patients().length,
      totalAppointments: this.appointments().length,
      todayAppointments: todayAppts.length,
      totalRevenue:      this.getTotalRevenue(),
      totalExpenses:     this.getTotalExpenses(),
    };
  },
};
