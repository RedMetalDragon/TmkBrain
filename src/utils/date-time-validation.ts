export function validateTime(timeString: string): boolean {
    // Regular expression to match time in 12-hour format
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (am|pm)$/i;
    
    if (!timeRegex.test(timeString)) {
      return false; // Time format doesn't match
    }
  
    // Further validation of hours and minutes
    const [hours, minutes] = timeString.split(':').map(part => parseInt(part));
    if (isNaN(hours) || isNaN(minutes) || hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
      return false; // Invalid hours or minutes
    }
  
    return true;
  };

export function convertTo24Hour(time12h: string): string {
    const [time, period] = time12h.split(' ');
    const [hours_, minutes_] = time.split(':');
    
    let hours = parseInt(hours_);
    const minutes = parseInt(minutes_);
    
    if (period.toLowerCase() === 'pm' && hours < 12) {
      hours += 12;
    } else if (period.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }
  
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  };

export function convertTo12Hour(time24h: string): string {
    // Split the time into hours, minutes, and seconds
    const [hours, minutes] = time24h.split(':').map(part => parseInt(part));
  
    // Determine AM/PM and adjust hours
    const period = hours >= 12 ? 'pm' : 'am';
    const twelveHour = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  
    // Construct the 12-hour time string
    const time12h = `${twelveHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  
    return time12h;
  }