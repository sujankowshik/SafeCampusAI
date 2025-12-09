'use server';

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase/config';
import { revalidatePath } from 'next/cache';
import { classifyIncident } from '@/ai/flows/classify-incident-type';
import { estimateIncidentRiskLevel } from '@/ai/flows/estimate-incident-risk-level';
import { summarizeIncidentDescription } from '@/ai/flows/summarize-incident-description';
import { auth } from '@/lib/firebase/config';
import type { ReportStatus } from './types';


export async function reportIncident(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());

    const currentUser = auth.currentUser;

    const isAnonymous = rawData.isAnonymous === 'true';

    const dataToSave = {
      reportType: rawData.reportType,
      title: rawData.title,
      description: rawData.description,
      locationText: rawData.locationText,
      dateTime: Timestamp.fromDate(new Date(rawData.dateTime as string)),
      allowFollowUp: rawData.allowFollowUp === 'true',
      contactEmail: rawData.allowFollowUp === 'true' ? rawData.contactEmail : null,
      isAnonymous,
      createdByUserId: isAnonymous ? null : currentUser?.uid ?? null,
      status: 'New',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      attachments: [] as string[],
    };

    // 1. Save initial report to get an ID
    const incidentRef = await addDoc(collection(db, 'incidents'), dataToSave);
    await updateDoc(incidentRef, { id: incidentRef.id });

    // 2. Handle file uploads
    const files = formData.getAll('attachments') as File[];
    const attachmentUrls: string[] = [];
    if (files.length > 0) {
      for (const file of files) {
        if(file.size === 0) continue;
        const storageRef = ref(
          storage,
          `incidents/${incidentRef.id}/${file.name}`
        );
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        attachmentUrls.push(downloadURL);
      }
      await updateDoc(incidentRef, { attachments: attachmentUrls });
    }

    // 3. Trigger AI flows (no need to await all of them if it takes time)
    // We will await for this demo to show results immediately.
    try {
        const [category, risk, summary] = await Promise.all([
            classifyIncident({ description: dataToSave.description as string }),
            estimateIncidentRiskLevel({ title: dataToSave.title as string, description: dataToSave.description as string }),
            summarizeIncidentDescription({ description: dataToSave.description as string }),
        ]);

        await updateDoc(incidentRef, {
            aiCategory: category.aiCategory,
            aiRiskLevel: risk.aiRiskLevel,
            aiSummary: summary.summary,
            updatedAt: serverTimestamp(),
        });
    } catch (aiError) {
        console.error("AI processing failed:", aiError);
        // Continue without AI data if it fails
    }
    
    // Revalidate paths
    revalidatePath('/admin/dashboard');
    if (!isAnonymous) {
      revalidatePath('/my-reports');
    }

    return { success: true, reportId: incidentRef.id };
  } catch (error: any) {
    console.error('Error reporting incident:', error);
    return { success: false, error: error.message };
  }
}

export async function updateIncidentStatus(
  incidentId: string,
  status: ReportStatus,
  adminNotes: string
) {
  try {
    const incidentRef = doc(db, 'incidents', incidentId);
    await updateDoc(incidentRef, {
      status,
      adminNotes,
      updatedAt: serverTimestamp(),
    });

    revalidatePath('/admin/dashboard');
    revalidatePath(`/admin/incidents/${incidentId}`);
    revalidatePath(`/my-reports`);
    revalidatePath(`/reports/${incidentId}`);

    // In a real app, trigger an email notification here if contactEmail exists.
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating incident status:', error);
    return { success: false, error: error.message };
  }
}
