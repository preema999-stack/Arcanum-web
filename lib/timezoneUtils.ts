/**
 * Arcanum Timezone & Date Utilities
 * Handles timezone-independent UTC timestamps, staff local timezone display (IST default),
 * and Admin multi-timezone reference rendering.
 */

export interface SupportedTimezone {
  id: string;
  label: string;
  offset: string;
  city: string;
}

export const SUPPORTED_TIMEZONES: SupportedTimezone[] = [
  { id: 'Asia/Kolkata', label: 'India Standard Time (IST)', offset: '+05:30', city: 'Kochi / Mumbai / Delhi' },
  { id: 'Asia/Dubai', label: 'Gulf Standard Time (GST)', offset: '+04:00', city: 'Dubai / Abu Dhabi' },
  { id: 'Europe/London', label: 'British Summer / GMT', offset: '+00:00 / +01:00', city: 'London' },
  { id: 'Europe/Berlin', label: 'Central European Time (CET)', offset: '+01:00 / +02:00', city: 'Berlin / Paris' },
  { id: 'America/New_York', label: 'Eastern Time (ET)', offset: '-05:00 / -04:00', city: 'New York' },
  { id: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: '-08:00 / -07:00', city: 'San Francisco / LA' },
  { id: 'Asia/Singapore', label: 'Singapore Time (SGT)', offset: '+08:00', city: 'Singapore' },
  { id: 'Asia/Riyadh', label: 'Arabia Standard Time (AST)', offset: '+03:00', city: 'Riyadh' },
];

export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

/**
 * Format an ISO UTC string or Date object into human-readable time in a target timezone
 * e.g., "08:30:00 AM IST" or "08:30 AM"
 */
export function formatTimeInTimezone(
  dateInput: string | Date | null | undefined,
  timeZone: string = DEFAULT_TIMEZONE,
  options: {
    includeSeconds?: boolean;
    includeTimezoneName?: boolean;
    includeDate?: boolean;
    use24Hour?: boolean;
  } = {}
): string {
  if (!dateInput) return '--:--';

  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return '--:--';

    const {
      includeSeconds = false,
      includeTimezoneName = true,
      includeDate = false,
      use24Hour = false,
    } = options;

    const formatOptions: Intl.DateTimeFormatOptions = {
      timeZone: timeZone || DEFAULT_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: !use24Hour,
    };

    if (includeSeconds) {
      formatOptions.second = '2-digit';
    }

    if (includeDate) {
      formatOptions.day = '2-digit';
      formatOptions.month = 'short';
      formatOptions.year = 'numeric';
    }

    if (includeTimezoneName) {
      formatOptions.timeZoneName = 'short';
    }

    const formatter = new Intl.DateTimeFormat('en-US', formatOptions);
    return formatter.format(date);
  } catch (err) {
    console.warn('[Timezone Format Error]', err);
    return typeof dateInput === 'string' ? dateInput.slice(11, 16) : '--:--';
  }
}

/**
 * Get current date string (YYYY-MM-DD) in a specific timezone
 */
export function getTodayDateString(timeZone: string = DEFAULT_TIMEZONE): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timeZone || DEFAULT_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(now); // Produces YYYY-MM-DD
  } catch (e) {
    return new Date().toISOString().slice(0, 10);
  }
}

/**
 * Get current month string (YYYY-MM) in a specific timezone
 */
export function getCurrentMonthString(timeZone: string = DEFAULT_TIMEZONE): string {
  const today = getTodayDateString(timeZone);
  return today.slice(0, 7); // "YYYY-MM"
}

/**
 * Convert a given Date or ISO string into a YYYY-MM-DD string in a specific timezone
 */
export function getDateStringInTimezone(
  dateInput: string | Date,
  timeZone: string = DEFAULT_TIMEZONE
): string {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timeZone || DEFAULT_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(date);
  } catch (e) {
    return typeof dateInput === 'string' ? dateInput.slice(0, 10) : '';
  }
}

/**
 * Calculate working minutes between checkIn and checkOut
 */
export function calculateWorkingMinutes(
  checkInIso: string,
  checkOutIso?: string | null
): { totalMinutes: number; overtimeMinutes: number; formattedDuration: string } {
  if (!checkInIso) {
    return { totalMinutes: 0, overtimeMinutes: 0, formattedDuration: '00h 00m' };
  }

  const start = new Date(checkInIso).getTime();
  const end = checkOutIso ? new Date(checkOutIso).getTime() : Date.now();

  if (isNaN(start) || isNaN(end) || end < start) {
    return { totalMinutes: 0, overtimeMinutes: 0, formattedDuration: '00h 00m' };
  }

  const totalMinutes = Math.max(0, Math.floor((end - start) / (1000 * 60)));
  const standardShiftMinutes = 8 * 60; // 8 hours standard workday
  const overtimeMinutes = Math.max(0, totalMinutes - standardShiftMinutes);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formattedDuration = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;

  return {
    totalMinutes,
    overtimeMinutes,
    formattedDuration,
  };
}

/**
 * Format minutes into readable "08h 30m" format
 */
export function formatMinutes(minutesTotal: number): string {
  if (!minutesTotal || minutesTotal <= 0) return '00h 00m';
  const hours = Math.floor(minutesTotal / 60);
  const mins = Math.floor(minutesTotal % 60);
  return `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`;
}

/**
 * Check if today is the staff member's birthday based on DOB string (YYYY-MM-DD)
 * and staff's current timezone.
 */
export function isBirthdayToday(
  dobString?: string | null,
  timeZone: string = DEFAULT_TIMEZONE
): boolean {
  if (!dobString) return false;

  try {
    const todayStr = getTodayDateString(timeZone); // "YYYY-MM-DD"
    const todayMonthDay = todayStr.slice(5); // "MM-DD"
    const dobMonthDay = dobString.slice(5); // "MM-DD"

    return todayMonthDay === dobMonthDay;
  } catch (err) {
    return false;
  }
}

/**
 * Check if birthday is coming up in the next N days
 */
export function isBirthdayUpcoming(
  dobString?: string | null,
  daysAhead: number = 7,
  timeZone: string = DEFAULT_TIMEZONE
): boolean {
  if (!dobString) return false;

  try {
    const todayStr = getTodayDateString(timeZone);
    const [tYear, tMonth, tDay] = todayStr.split('-').map(Number);
    const [, bMonth, bDay] = dobString.split('-').map(Number);

    const todayDate = new Date(tYear, tMonth - 1, tDay);
    const thisYearBirthday = new Date(tYear, bMonth - 1, bDay);

    // If already passed this year, check next year
    let targetBirthday = thisYearBirthday;
    if (thisYearBirthday < todayDate) {
      targetBirthday = new Date(tYear + 1, bMonth - 1, bDay);
    }

    const diffTime = targetBirthday.getTime() - todayDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays <= daysAhead;
  } catch (err) {
    return false;
  }
}

/**
 * Get short timezone abbreviation badge label
 */
export function getTimezoneBadge(timeZone: string = DEFAULT_TIMEZONE): string {
  const match = SUPPORTED_TIMEZONES.find((t) => t.id === timeZone);
  if (match) {
    if (timeZone === 'Asia/Kolkata') return 'IST';
    if (timeZone === 'Asia/Dubai') return 'GST';
    if (timeZone === 'Europe/London') return 'GMT/BST';
    if (timeZone === 'America/New_York') return 'ET';
    return match.label.split('(')[1]?.replace(')', '') || timeZone;
  }
  return timeZone.split('/')[1]?.replace('_', ' ') || timeZone;
}
