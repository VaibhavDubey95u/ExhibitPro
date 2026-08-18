import { supabase } from './supabaseClient';

/** Fetch published projects with optional filters */
export async function getProjects({ eventType, city, year, boothSize } = {}) {
  let query = supabase
    .from('projects')
    .select('*, project_media(*)')
    .eq('is_published', true)
    .order('year', { ascending: false });

  if (eventType) query = query.eq('event_type', eventType);
  if (city)      query = query.eq('city', city);
  if (year)      query = query.eq('year', year);
  if (boothSize) query = query.eq('booth_size', boothSize);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/** Fetch single project by slug (public) */
export async function getProjectBySlug(slug) {
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_media(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (error) throw error;
  return data;
}

/** Fetch ALL projects (admin) */
export async function getAllProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_media(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/** Create or update a project (admin) */
export async function upsertProject(project) {
  const { id, project_media, ...rest } = project;
  if (id) {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...rest, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('projects')
      .insert(rest)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

/** Delete a project (admin) */
export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

/** Toggle publish state */
export async function toggleProjectPublish(id, is_published) {
  const { error } = await supabase
    .from('projects')
    .update({ is_published, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

/** Upload project media file, insert into project_media */
export async function uploadProjectMedia(projectId, file, type = 'image') {
  const ext = file.name.split('.').pop();
  const path = `projects/${projectId}/${Date.now()}.${ext}`;
  const { error: uploadErr } = await supabase.storage
    .from('project-media')
    .upload(path, file, { upsert: false });
  if (uploadErr) throw uploadErr;

  const { data: urlData } = supabase.storage.from('project-media').getPublicUrl(path);
  const url = urlData.publicUrl;

  // Get current max order
  const { data: existing } = await supabase
    .from('project_media')
    .select('order')
    .eq('project_id', projectId)
    .order('order', { ascending: false })
    .limit(1);

  const order = existing && existing.length > 0 ? existing[0].order + 1 : 0;

  const { data, error } = await supabase
    .from('project_media')
    .insert({ project_id: projectId, type, url, order })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Delete a single media item */
export async function deleteProjectMedia(mediaId) {
  const { error } = await supabase.from('project_media').delete().eq('id', mediaId);
  if (error) throw error;
}

/** Reorder media items */
export async function reorderProjectMedia(updates) {
  for (const u of updates) {
    await supabase.from('project_media').update({ order: u.order }).eq('id', u.id);
  }
}

/** Get unique filter values from published projects */
export async function getFilterOptions() {
  const { data, error } = await supabase
    .from('projects')
    .select('event_type, city, year, booth_size')
    .eq('is_published', true);
  if (error) throw error;

  return {
    eventTypes: [...new Set(data.map(p => p.event_type).filter(Boolean))].sort(),
    cities:     [...new Set(data.map(p => p.city).filter(Boolean))].sort(),
    years:      [...new Set(data.map(p => p.year).filter(Boolean))].sort((a, b) => b - a),
    boothSizes: [...new Set(data.map(p => p.booth_size).filter(Boolean))].sort(),
  };
}
