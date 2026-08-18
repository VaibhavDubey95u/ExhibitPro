import { useEffect, useState, useCallback } from 'react';
import { getProjects, getFilterOptions } from '@services/projectsApi';

export function useProjects(filters = {}) {
  const [projects, setProjects] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ eventTypes: [], cities: [], years: [], boothSizes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, opts] = await Promise.all([getProjects(filters), getFilterOptions()]);
      setProjects(data);
      setFilterOptions(opts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  return { projects, filterOptions, loading, error, refetch: fetchProjects };
}
