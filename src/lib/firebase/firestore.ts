import { collection, query, where, getDocs, getDoc, doc, orderBy, limit, startAfter, QueryConstraint } from 'firebase/firestore';
import { db } from './config';
import type { Incident } from '../types';

export async function getAllIncidents(
  filters: { status?: string; riskLevel?: string; category?: string; },
  sortBy: 'newest' | 'oldest' | 'risk',
  searchQuery: string
): Promise<Incident[]> {
  const incidentsCol = collection(db, 'incidents');
  
  let q = query(incidentsCol);

  // This is a basic text search. For production, use a dedicated search service like Algolia or Typesense.
  if (searchQuery) {
    // Firestore does not support native text search in the way SQL LIKE works.
    // This is a workaround and not efficient.
    // We fetch all and filter client-side for this demo.
  }
  
  const constraints: QueryConstraint[] = [];
  
  if (filters.status) {
    constraints.push(where('status', '==', filters.status));
  }
  if (filters.riskLevel) {
    constraints.push(where('aiRiskLevel', '==', filters.riskLevel));
  }
  if (filters.category) {
    constraints.push(where('aiCategory', '==', filters.category));
  }
  
  if (sortBy === 'newest') {
    constraints.push(orderBy('createdAt', 'desc'));
  } else if (sortBy === 'oldest') {
    constraints.push(orderBy('createdAt', 'asc'));
  } else if (sortBy === 'risk') {
    // Firestore requires the first orderBy to match an inequality filter if one exists.
    // This is a simplified sort and may not work with multiple filters.
    // For this demo, we can't reliably sort by risk and filter by others without composite indexes for every combination.
    // A robust solution would involve more complex data modeling or a different database/search service.
    // We will sort client-side for risk.
    constraints.push(orderBy('createdAt', 'desc'));
  }

  q = query(incidentsCol, ...constraints);
  
  const querySnapshot = await getDocs(q);
  let incidents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Incident));

  if (searchQuery) {
    const lowercasedQuery = searchQuery.toLowerCase();
    incidents = incidents.filter(
      (incident) =>
        incident.title.toLowerCase().includes(lowercasedQuery) ||
        incident.description.toLowerCase().includes(lowercasedQuery)
    );
  }

  if (sortBy === 'risk') {
    const riskOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    incidents.sort((a, b) => {
        const riskA = riskOrder[a.aiRiskLevel as keyof typeof riskOrder] ?? 0;
        const riskB = riskOrder[b.aiRiskLevel as keyof typeof riskOrder] ?? 0;
        return riskB - riskA;
    });
  }

  return incidents;
}


export async function getIncidentsForUser(userId: string): Promise<Incident[]> {
    const incidentsCol = collection(db, 'incidents');
    const q = query(incidentsCol, where('createdByUserId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Incident);
}

export async function getIncidentById(id: string): Promise<Incident | null> {
    const docRef = doc(db, 'incidents', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as Incident;
    }
    return null;
}
