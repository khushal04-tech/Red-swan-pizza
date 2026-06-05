/**
 * Pure business-logic functions extracted from ShiftDesk (index.html).
 *
 * Keeping them in a standalone CommonJS module makes them testable with Jest
 * without requiring a DOM environment.
 */

// ── Avatar palette (same order as index.html) ──
const AVATAR_COLORS = [
  { bg: '#e8f0fb', fg: '#1a4a7a' },
  { bg: '#e8f5ee', fg: '#1a7a4a' },
  { bg: '#fdf3e7', fg: '#c8740a' },
  { bg: '#fdf0ef', fg: '#c0342a' },
  { bg: '#f0eefb', fg: '#4a2a9a' },
  { bg: '#e8f8f5', fg: '#1a6a5a' },
  { bg: '#fdf5e7', fg: '#8a5a0a' },
  { bg: '#f5eef8', fg: '#7a2a8a' },
];

// ── Formatting helpers ──

function pad(n) {
  return String(n).padStart(2, '0');
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function nowTimeStr() {
  const d = new Date();
  return pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function fmtDate(s) {
  if (!s) return '\u2014';
  const [y, m, d] = s.split('-');
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return mo[+m - 1] + ' ' + parseInt(d) + ', ' + y;
}

function fmtTime(t) {
  if (!t) return '\u2014';
  const [h, m] = t.split(':').map(Number);
  return (h % 12 || 12) + ':' + pad(m) + ' ' + (h >= 12 ? 'PM' : 'AM');
}

function fmtHours(h) {
  if (h === null || h === undefined || isNaN(h) || h < 0) return '\u2014';
  return Math.floor(h) + 'h ' + pad(Math.round((h % 1) * 60)) + 'm';
}

// ── Time calculation ──

function calcH(inT, outT) {
  if (!inT || !outT) return null;
  const [ih, im] = inT.split(':').map(Number);
  const [oh, om] = outT.split(':').map(Number);
  const diff = (oh * 60 + om) - (ih * 60 + im);
  return diff / 60;
}

// ── String helpers ──

function getInitials(name) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

function uid() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

// ── Color helper ──

function getAC(idx) {
  return AVATAR_COLORS[idx % AVATAR_COLORS.length];
}

// ── Date-range helpers ──

function getWeekRange(offset) {
  if (offset === undefined) offset = 0;
  const d = new Date();
  const dow = d.getDay();
  const mon = new Date(d);
  mon.setDate(d.getDate() - ((dow + 6) % 7) + offset * 7);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  return { start: mon.toISOString().slice(0, 10), end: sun.toISOString().slice(0, 10) };
}

function inRange(date, s, e) {
  return date >= s && date <= e;
}

// ── Employee lookup (operates on an array passed in) ──

function getEmpById(employees, id) {
  return employees.find(e => e.id === id);
}

function getEmpByEmpId(employees, empId) {
  return employees.find(e => e.empId.toLowerCase() === empId.toLowerCase());
}

function getEmpByNameId(employees, name, empId) {
  return employees.find(e =>
    e.name.toLowerCase() === name.toLowerCase() &&
    e.empId.toLowerCase() === empId.toLowerCase()
  );
}

// ── Default state factory ──

function defaultState() {
  return {
    employees: [
      { id: 'e1', name: 'Meet',    empId: '001', colorIdx: 0 },
      { id: 'e2', name: 'Kushveer', empId: '002', colorIdx: 1 },
      { id: 'e3', name: 'Alpesh',  empId: '003', colorIdx: 2 },
    ],
    entries: [],
    nextEid: 4,
    nextEntId: 1,
  };
}

module.exports = {
  AVATAR_COLORS,
  pad,
  todayStr,
  nowTimeStr,
  fmtDate,
  fmtTime,
  fmtHours,
  calcH,
  getInitials,
  uid,
  getAC,
  getWeekRange,
  inRange,
  getEmpById,
  getEmpByEmpId,
  getEmpByNameId,
  defaultState,
};
