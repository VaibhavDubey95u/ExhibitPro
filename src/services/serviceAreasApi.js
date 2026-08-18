import { supabase } from './supabaseClient';

export async function getServiceAreas() {
  const { data, error } = await supabase
    .from('service_areas')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAllServiceAreas() {
  const { data, error } = await supabase
    .from('service_areas')
    .select('*')
    .order('order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function upsertServiceArea(area) {
  const { id, ...rest } = area;
  if (id) {
    const { data, error } = await supabase
      .from('service_areas')
      .update({ ...rest, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('service_areas')
      .insert(rest)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export async function deleteServiceArea(id) {
  const { error } = await supabase.from('service_areas').delete().eq('id', id);
  if (error) throw error;
}
