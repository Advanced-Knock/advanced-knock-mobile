export interface Lead {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  status: 'new' | 'contacted' | 'demo' | 'closed' | 'lost';
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface KnockRecord {
  id: string;
  address: string;
  result: 'no-answer' | 'talk' | 'demo' | 'close';
  notes: string;
  timestamp: number;
  leadId?: string;
}

export interface DailyStats {
  date: string;
  knocks: number;
  talks: number;
  demos: number;
  closes: number;
}

