
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lhzxombklejqgkmrgxht.supabase.co';
const supabaseKey = 'sb_publishable_0XyDd4TBVrgOIJCl0eJqog_dhGL6RXF';

export const supabase = createClient(supabaseUrl, supabaseKey);
