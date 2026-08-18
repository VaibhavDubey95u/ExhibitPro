import { useEffect, useState, useCallback } from 'react';
import { getPageBlocks, getPageBlocksAdmin, upsertBlock, toggleBlockVisibility } from '@services/contentApi';

export function useContent(page, adminMode = false) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = adminMode
        ? await getPageBlocksAdmin(page)
        : await getPageBlocks(page);
      setBlocks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, adminMode]);

  useEffect(() => { fetchBlocks(); }, [fetchBlocks]);

  /** Get a specific block's data by block key */
  const getBlock = (blockKey) => blocks.find(b => b.block === blockKey);

  const saveBlock = async (blockData) => {
    await upsertBlock(blockData);
    await fetchBlocks();
  };

  const toggleVisibility = async (id, visible) => {
    await toggleBlockVisibility(id, visible);
    await fetchBlocks();
  };

  return { blocks, loading, error, getBlock, saveBlock, toggleVisibility, refetch: fetchBlocks };
}
