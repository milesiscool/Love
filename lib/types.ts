export type RelationshipStatus = 'PENDING' | 'YES' | 'NO';

export type RelationshipState = {
  id: number;
  status: RelationshipStatus;
  met_at_utc: string;
  decided_at_utc: string | null;
  anniversary_start_utc: string | null;
  updated_at_utc: string;
};

export type Milestone = {
  id: string;
  title: string;
  date_utc: string;
  kind?: 'past' | 'future';
  notes?: string;
};

export type EventLogType = 'decision_set' | 'seeded';

export type ClockUnit = 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds';

export type ElapsedParts = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

export type JourneyTab = 'clock' | 'boxes' | 'milestones';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      relationship_state: {
        Row: RelationshipState;
        Insert: {
          id?: number;
          status: RelationshipStatus;
          met_at_utc: string;
          decided_at_utc?: string | null;
          anniversary_start_utc?: string | null;
          updated_at_utc?: string;
        };
        Update: {
          id?: number;
          status?: RelationshipStatus;
          met_at_utc?: string;
          decided_at_utc?: string | null;
          anniversary_start_utc?: string | null;
          updated_at_utc?: string;
        };
        Relationships: [];
      };
      event_log: {
        Row: {
          id: number;
          event_type: EventLogType | string;
          payload: Json;
          created_at_utc: string;
        };
        Insert: {
          id?: number;
          event_type: EventLogType | string;
          payload?: Json;
          created_at_utc?: string;
        };
        Update: {
          id?: number;
          event_type?: EventLogType | string;
          payload?: Json;
          created_at_utc?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
