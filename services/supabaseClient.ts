// supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Diese Variablen sollten Umgebungsvariablen sein, die du in deiner .env-Datei konfigurierst
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Initialisiere den Supabase-Client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exportiere den Supabase-Client, damit er in anderen Teilen deiner Anwendung verwendet werden kann
export { supabase };
