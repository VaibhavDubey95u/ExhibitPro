import { supabase } from './supabaseClient';

export async function getMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function markMessageRead(id, is_read = true) {
  const { error } = await supabase
    .from('messages')
    .update({ is_read })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteMessage(id) {
  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) throw error;
}

export async function getUnreadCount() {
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);
  if (error) throw error;
  return count ?? 0;
}
