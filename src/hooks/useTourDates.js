import { useState, useEffect } from 'react';

const WORKER_URL = import.meta.env.VITE_TOUR_WORKER_URL || 'https://tour-dates-worker.your-subdomain.workers.dev';

/**
 * Hook to fetch tour dates from Cloudflare Worker
 * @returns {{ tourDates: Array, banner: string|null, loading: boolean, error: string|null }}
 */
export function useTourDates() {
  const [tourDates, setTourDates] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchTourDates() {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching tour dates from:', `${WORKER_URL}/tour`);
        const response = await fetch(`${WORKER_URL}/tour`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tour dates: ${response.status}`);
        }

        const data = await response.json();
        console.log('Tour dates response:', data);

        if (!cancelled) {
          setTourDates(data.tourDates || []);
          setBanner(data.banner || null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching tour dates:', err);
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchTourDates();

    return () => {
      cancelled = true;
    };
  }, []);

  return { tourDates, banner, loading, error };
}
