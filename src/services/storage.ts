/**
 * STORAGE SERVICE - Data Persistence
 * 
 * Pattern: SERVICE × STORAGE × ONE
 * Frequency: 999 Hz (AEYON)
 * ∞ AbëONE ∞
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Lead, KnockRecord, DailyStats } from '../types/lead';

const KEYS = {
  LEADS: 'leads',
  KNOCKS: 'knocks',
};

export async function saveLead(lead: Lead): Promise<void> {
  const leads = await getAllLeads();
  const index = leads.findIndex((l) => l.id === lead.id);
  
  if (index >= 0) {
    leads[index] = lead;
  } else {
    leads.push(lead);
  }
  
  await AsyncStorage.setItem(KEYS.LEADS, JSON.stringify(leads));
}

export async function getAllLeads(): Promise<Lead[]> {
  const data = await AsyncStorage.getItem(KEYS.LEADS);
  return data ? JSON.parse(data) : [];
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const leads = await getAllLeads();
  return leads.find((l) => l.id === id) || null;
}

export async function saveKnock(knock: KnockRecord): Promise<void> {
  const knocks = await getAllKnocks();
  knocks.push(knock);
  await AsyncStorage.setItem(KEYS.KNOCKS, JSON.stringify(knocks));
}

export async function getAllKnocks(): Promise<KnockRecord[]> {
  const data = await AsyncStorage.getItem(KEYS.KNOCKS);
  return data ? JSON.parse(data) : [];
}

export async function getRecentKnocks(limit: number): Promise<KnockRecord[]> {
  const knocks = await getAllKnocks();
  return knocks
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

export async function getTodayStats(): Promise<DailyStats> {
  const knocks = await getAllKnocks();
  const today = new Date().toDateString();
  
  const todayKnocks = knocks.filter((k) => {
    const knockDate = new Date(k.timestamp).toDateString();
    return knockDate === today;
  });

  return {
    date: today,
    knocks: todayKnocks.length,
    talks: todayKnocks.filter((k) => k.result === 'talk').length,
    demos: todayKnocks.filter((k) => k.result === 'demo').length,
    closes: todayKnocks.filter((k) => k.result === 'close').length,
  };
}

export async function getStats(days: number): Promise<DailyStats[]> {
  const knocks = await getAllKnocks();
  const statsMap = new Map<string, DailyStats>();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  knocks
    .filter((k) => new Date(k.timestamp) >= startDate)
    .forEach((knock) => {
      const date = new Date(knock.timestamp).toDateString();
      
      if (!statsMap.has(date)) {
        statsMap.set(date, {
          date,
          knocks: 0,
          talks: 0,
          demos: 0,
          closes: 0,
        });
      }

      const stat = statsMap.get(date)!;
      stat.knocks++;
      
      if (knock.result === 'talk') stat.talks++;
      if (knock.result === 'demo') stat.demos++;
      if (knock.result === 'close') stat.closes++;
    });

  return Array.from(statsMap.values()).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

