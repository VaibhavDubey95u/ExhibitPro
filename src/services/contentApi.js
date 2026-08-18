import { supabase } from './supabaseClient';

/** Fetch all visible blocks for a page, ordered */
export async function getPageBlocks(page) {
  const { data, error } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('page', page)
    .eq('is_visible', true)
    .order('order', { ascending: true });
  if (error) throw error;
  return data;
}

/** Fetch ALL blocks for a page (admin — includes hidden) */
export async function getPageBlocksAdmin(page) {
  const { data, error } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('page', page)
    .order('order', { ascending: true });
  if (error) throw error;
  return data;
}

/** Fetch a specific block by page + block key */
export async function getBlock(page, block) {
  const { data, error } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('page', page)
    .eq('block', block)
    .single();
  if (error) throw error;
  return data;
}

/** Upsert a content block (admin) */
export async function upsertBlock({ page, block, data, order, is_visible }) {
  const { data: result, error } = await supabase
    .from('content_blocks')
    .upsert({ page, block, data, order, is_visible, updated_at: new Date().toISOString() }, { onConflict: 'page,block' })
    .select()
    .single();
  if (error) throw error;
  return result;
}

/** Toggle visibility of a block */
export async function toggleBlockVisibility(id, is_visible) {
  const { error } = await supabase
    .from('content_blocks')
    .update({ is_visible, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

/** Reorder blocks */
export async function reorderBlocks(updates) {
  // updates = [{ id, order }]
  for (const u of updates) {
    await supabase.from('content_blocks').update({ order: u.order }).eq('id', u.id);
  }
}

/** Upload a media file to content-media bucket */
export async function uploadContentMedia(page, block, file) {
  const ext = file.name.split('.').pop();
  const path = `content/${page}/${block}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('content-media').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('content-media').getPublicUrl(path);
  return data.publicUrl;
}
