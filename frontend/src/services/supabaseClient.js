import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iozslsxkiilwyvavpfmb.supabase.co";
const supabaseKey = "sb_publishable_ePunocPsMlUpWEDl3JrZfw_ENmr13fm";

export const supabase = createClient(supabaseUrl, supabaseKey);