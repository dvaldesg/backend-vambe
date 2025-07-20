// TOTALMENTE GEPETEADO

export function parseDate(dateString: string): Date {
  const cleanDateString = dateString.trim();
  
  const ddmmyyyyPattern = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
  const ddmmMatch = cleanDateString.match(ddmmyyyyPattern);
  
  if (ddmmMatch) {
    const [, day, month, year] = ddmmMatch;
    return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  }
  
  const yyyymmddPattern = /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/;
  const yyyymmMatch = cleanDateString.match(yyyymmddPattern);
  
  if (yyyymmMatch) {
    const [, year, month, day] = yyyymmMatch;
    return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  }
  
  const parsedDate = new Date(cleanDateString);
  
  if (isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date format: ${dateString}. Expected DD-MM-YYYY or YYYY-MM-DD`);
  }
  
  return parsedDate;
}

export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}