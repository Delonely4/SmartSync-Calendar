export interface ParsedEvent {
  googleEventId: string;
  calendarId: string;
  title: string;
  description: string | null;
  startTime: Date | null; 
  endTime: Date | null;  
  deadlineAt: Date | null;
  isManual: boolean;
}