const {
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
} = require('../src/logic');

// ═══════════════════════════════════════════════
//  pad()
// ═══════════════════════════════════════════════
describe('pad', () => {
  it('should pad single-digit numbers with a leading zero', () => {
    expect(pad(0)).toBe('00');
    expect(pad(5)).toBe('05');
    expect(pad(9)).toBe('09');
  });

  it('should leave two-digit numbers unchanged', () => {
    expect(pad(10)).toBe('10');
    expect(pad(23)).toBe('23');
    expect(pad(59)).toBe('59');
  });

  it('should convert non-string input to string', () => {
    expect(pad(1)).toBe('01');
  });
});

// ═══════════════════════════════════════════════
//  todayStr()
// ═══════════════════════════════════════════════
describe('todayStr', () => {
  it('should return an ISO date string (YYYY-MM-DD)', () => {
    const result = todayStr();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('should match the current date', () => {
    const expected = new Date().toISOString().slice(0, 10);
    expect(todayStr()).toBe(expected);
  });
});

// ═══════════════════════════════════════════════
//  nowTimeStr()
// ═══════════════════════════════════════════════
describe('nowTimeStr', () => {
  it('should return a time string in HH:MM format', () => {
    const result = nowTimeStr();
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});

// ═══════════════════════════════════════════════
//  fmtDate()
// ═══════════════════════════════════════════════
describe('fmtDate', () => {
  it('should format an ISO date string to readable form', () => {
    expect(fmtDate('2025-01-15')).toBe('Jan 15, 2025');
    expect(fmtDate('2024-12-01')).toBe('Dec 1, 2024');
    expect(fmtDate('2024-06-30')).toBe('Jun 30, 2024');
  });

  it('should return em-dash for falsy input', () => {
    expect(fmtDate(null)).toBe('\u2014');
    expect(fmtDate(undefined)).toBe('\u2014');
    expect(fmtDate('')).toBe('\u2014');
  });

  it('should handle all 12 months', () => {
    const months = [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec',
    ];
    months.forEach((mo, i) => {
      const m = String(i + 1).padStart(2, '0');
      expect(fmtDate(`2024-${m}-10`)).toBe(`${mo} 10, 2024`);
    });
  });
});

// ═══════════════════════════════════════════════
//  fmtTime()
// ═══════════════════════════════════════════════
describe('fmtTime', () => {
  it('should format 24h time to 12h AM/PM', () => {
    expect(fmtTime('09:05')).toBe('9:05 AM');
    expect(fmtTime('13:30')).toBe('1:30 PM');
    expect(fmtTime('00:00')).toBe('12:00 AM');
    expect(fmtTime('12:00')).toBe('12:00 PM');
    expect(fmtTime('23:59')).toBe('11:59 PM');
  });

  it('should return em-dash for falsy input', () => {
    expect(fmtTime(null)).toBe('\u2014');
    expect(fmtTime(undefined)).toBe('\u2014');
    expect(fmtTime('')).toBe('\u2014');
  });
});

// ═══════════════════════════════════════════════
//  fmtHours()
// ═══════════════════════════════════════════════
describe('fmtHours', () => {
  it('should format decimal hours to Xh Ym', () => {
    expect(fmtHours(1.5)).toBe('1h 30m');
    expect(fmtHours(0)).toBe('0h 00m');
    expect(fmtHours(8.75)).toBe('8h 45m');
    expect(fmtHours(2.25)).toBe('2h 15m');
  });

  it('should return em-dash for null/undefined/NaN/negative', () => {
    expect(fmtHours(null)).toBe('\u2014');
    expect(fmtHours(undefined)).toBe('\u2014');
    expect(fmtHours(NaN)).toBe('\u2014');
    expect(fmtHours(-1)).toBe('\u2014');
  });
});

// ═══════════════════════════════════════════════
//  calcH()
// ═══════════════════════════════════════════════
describe('calcH', () => {
  it('should calculate hours between two times', () => {
    expect(calcH('09:00', '17:00')).toBe(8);
    expect(calcH('09:00', '09:30')).toBe(0.5);
    expect(calcH('08:15', '12:45')).toBe(4.5);
  });

  it('should return null if either time is missing', () => {
    expect(calcH(null, '17:00')).toBeNull();
    expect(calcH('09:00', null)).toBeNull();
    expect(calcH('', '17:00')).toBeNull();
    expect(calcH('09:00', '')).toBeNull();
  });

  it('should return 0 for same clock-in and clock-out', () => {
    expect(calcH('10:00', '10:00')).toBe(0);
  });

  it('should return negative for overnight (out < in) within same calc', () => {
    // The app does not handle overnight shifts; this documents the behavior
    expect(calcH('23:00', '01:00')).toBeLessThan(0);
  });
});

// ═══════════════════════════════════════════════
//  getInitials()
// ═══════════════════════════════════════════════
describe('getInitials', () => {
  it('should return up to two uppercase initials', () => {
    expect(getInitials('Meet')).toBe('M');
    expect(getInitials('John Doe')).toBe('JD');
    expect(getInitials('Alice Bob Charlie')).toBe('AB');
  });

  it('should handle single-character names', () => {
    expect(getInitials('A')).toBe('A');
  });
});

// ═══════════════════════════════════════════════
//  uid()
// ═══════════════════════════════════════════════
describe('uid', () => {
  it('should return a string starting with "id_"', () => {
    expect(uid()).toMatch(/^id_\d+_[a-z0-9]+$/);
  });

  it('should return unique values on successive calls', () => {
    const a = uid();
    const b = uid();
    expect(a).not.toBe(b);
  });
});

// ═══════════════════════════════════════════════
//  getAC()
// ═══════════════════════════════════════════════
describe('getAC', () => {
  it('should return the correct avatar color by index', () => {
    expect(getAC(0)).toEqual({ bg: '#e8f0fb', fg: '#1a4a7a' });
    expect(getAC(2)).toEqual({ bg: '#fdf3e7', fg: '#c8740a' });
  });

  it('should wrap around when index exceeds palette length', () => {
    expect(getAC(8)).toEqual(getAC(0));
    expect(getAC(10)).toEqual(getAC(2));
  });

  it('should always return a valid {bg, fg} object', () => {
    for (let i = 0; i < 20; i++) {
      const c = getAC(i);
      expect(c).toHaveProperty('bg');
      expect(c).toHaveProperty('fg');
    }
  });
});

// ═══════════════════════════════════════════════
//  getWeekRange()
// ═══════════════════════════════════════════════
describe('getWeekRange', () => {
  it('should return an object with start and end ISO-date strings', () => {
    const r = getWeekRange(0);
    expect(r).toHaveProperty('start');
    expect(r).toHaveProperty('end');
    expect(r.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(r.end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('should span exactly 6 days (Mon-Sun)', () => {
    const r = getWeekRange(0);
    const s = new Date(r.start);
    const e = new Date(r.end);
    const diffDays = (e - s) / (1000 * 60 * 60 * 24);
    expect(diffDays).toBe(6);
  });

  it('should start on a Monday (day 1)', () => {
    const r = getWeekRange(0);
    const day = new Date(r.start).getDay();
    expect(day).toBe(1); // Monday
  });

  it('should shift by 7 days per offset', () => {
    const r0 = getWeekRange(0);
    const r1 = getWeekRange(-1);
    const diff = (new Date(r0.start) - new Date(r1.start)) / (1000 * 60 * 60 * 24);
    expect(diff).toBe(7);
  });
});

// ═══════════════════════════════════════════════
//  inRange()
// ═══════════════════════════════════════════════
describe('inRange', () => {
  it('should return true when date is within [start, end]', () => {
    expect(inRange('2024-06-15', '2024-06-10', '2024-06-20')).toBe(true);
  });

  it('should return true when date equals start or end', () => {
    expect(inRange('2024-06-10', '2024-06-10', '2024-06-20')).toBe(true);
    expect(inRange('2024-06-20', '2024-06-10', '2024-06-20')).toBe(true);
  });

  it('should return false when date is outside range', () => {
    expect(inRange('2024-06-09', '2024-06-10', '2024-06-20')).toBe(false);
    expect(inRange('2024-06-21', '2024-06-10', '2024-06-20')).toBe(false);
  });
});

// ═══════════════════════════════════════════════
//  Employee lookup functions
// ═══════════════════════════════════════════════
describe('Employee lookups', () => {
  const employees = [
    { id: 'e1', name: 'Meet',     empId: '001', colorIdx: 0 },
    { id: 'e2', name: 'Kushveer', empId: '002', colorIdx: 1 },
    { id: 'e3', name: 'Alpesh',   empId: '003', colorIdx: 2 },
  ];

  describe('getEmpById', () => {
    it('should find an employee by internal id', () => {
      expect(getEmpById(employees, 'e1')).toEqual(employees[0]);
      expect(getEmpById(employees, 'e3')).toEqual(employees[2]);
    });

    it('should return undefined for unknown id', () => {
      expect(getEmpById(employees, 'e99')).toBeUndefined();
    });
  });

  describe('getEmpByEmpId', () => {
    it('should find an employee by empId (case-insensitive)', () => {
      expect(getEmpByEmpId(employees, '001')).toEqual(employees[0]);
      expect(getEmpByEmpId(employees, '002')).toEqual(employees[1]);
    });

    it('should be case-insensitive for empId', () => {
      const emps = [{ id: 'e1', name: 'Test', empId: 'EMP-001', colorIdx: 0 }];
      expect(getEmpByEmpId(emps, 'emp-001')).toEqual(emps[0]);
      expect(getEmpByEmpId(emps, 'EMP-001')).toEqual(emps[0]);
    });

    it('should return undefined for unknown empId', () => {
      expect(getEmpByEmpId(employees, '999')).toBeUndefined();
    });
  });

  describe('getEmpByNameId', () => {
    it('should find an employee by name + empId combo', () => {
      expect(getEmpByNameId(employees, 'Meet', '001')).toEqual(employees[0]);
    });

    it('should be case-insensitive for both name and empId', () => {
      expect(getEmpByNameId(employees, 'MEET', '001')).toEqual(employees[0]);
      expect(getEmpByNameId(employees, 'meet', '001')).toEqual(employees[0]);
    });

    it('should return undefined when name matches but empId does not', () => {
      expect(getEmpByNameId(employees, 'Meet', '999')).toBeUndefined();
    });

    it('should return undefined when empId matches but name does not', () => {
      expect(getEmpByNameId(employees, 'Unknown', '001')).toBeUndefined();
    });
  });
});

// ═══════════════════════════════════════════════
//  defaultState()
// ═══════════════════════════════════════════════
describe('defaultState', () => {
  it('should return an object with employees, entries, nextEid, nextEntId', () => {
    const s = defaultState();
    expect(s).toHaveProperty('employees');
    expect(s).toHaveProperty('entries');
    expect(s).toHaveProperty('nextEid');
    expect(s).toHaveProperty('nextEntId');
  });

  it('should have 3 default employees', () => {
    expect(defaultState().employees).toHaveLength(3);
  });

  it('should start with empty entries', () => {
    expect(defaultState().entries).toEqual([]);
  });

  it('should return a fresh object on each call (no shared refs)', () => {
    const a = defaultState();
    const b = defaultState();
    expect(a).not.toBe(b);
    expect(a.employees).not.toBe(b.employees);
  });
});

// ═══════════════════════════════════════════════
//  AVATAR_COLORS constant
// ═══════════════════════════════════════════════
describe('AVATAR_COLORS', () => {
  it('should contain 8 color entries', () => {
    expect(AVATAR_COLORS).toHaveLength(8);
  });

  it('each entry should have bg and fg hex strings', () => {
    AVATAR_COLORS.forEach(c => {
      expect(c.bg).toMatch(/^#[0-9a-f]{6}$/);
      expect(c.fg).toMatch(/^#[0-9a-f]{6}$/);
    });
  });
});
