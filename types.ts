export enum EventType {
  MASS = 'Missa',
  CONFESSION = 'Confissão',
  WEDDING = 'Casamento',
  BAPTISM = 'Batismo',
  MEETING = 'Reunião Pastoral',
  OTHER = 'Outro'
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: EventType;
  location?: string;
  celebrant?: string;
}

export interface AISuggestionResponse {
  refinedTitle: string;
  refinedDescription: string;
  suggestedType: EventType;
}

export interface LiturgyData {
  firstReading: string;
  psalm: string;
  secondReading?: string;
  gospel: string;
  celebrationName: string;
  reflection?: string;
}

export interface ParishAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'baixa' | 'media' | 'alta';
}