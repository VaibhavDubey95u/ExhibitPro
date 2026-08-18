import { useEffect, useState } from 'react';
import { getServiceAreas } from '@services/serviceAreasApi';

export function useServiceAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getServiceAreas()
      .then(setAreas)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { areas, loading, error };
}
