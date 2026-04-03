import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Safe access to environment variables to prevent ReferenceErrors
const getEnv = (key: string) => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key];
    }
  } catch (e) {
    // Ignore error if process is not defined
  }
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {
    // Ignore error if import.meta is not defined
  }
  return undefined;
};

// Support both standard env vars and Vite env vars
const envUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
const envKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_ANON_KEY');

// Use provided credentials as default fallback if env vars are missing
const supabaseUrl = envUrl || 'https://cvxkcjgpvoulylejalwc.supabase.co';
const supabaseKey = envKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2eGtjamdwdm91bHlsZWphbHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMTkyNzEsImV4cCI6MjA5MDY5NTI3MX0.kaL20KrJWLXqxJHz3HJlZmAUbRI8MF6UR4NgIAgpmzM';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Key is missing. API calls will fail. Check environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to get the client (matching the provided code's import style)
export const createClientHelper = () => supabase;