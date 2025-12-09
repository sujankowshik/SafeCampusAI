import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-incident-description.ts';
import '@/ai/flows/classify-incident-type.ts';
import '@/ai/flows/estimate-incident-risk-level.ts';