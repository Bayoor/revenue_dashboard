import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";

export const useFetch = (fetchFn, immediate = true) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

 

  const fetchData = useCallback(async (...args) => {
      setLoading(true);
    setError(null);
    try {
      const response = await fetchFn(...args);
      setData(response);
      setError(null);
      return response;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]); 

  return { data, error, loading, fetchData };
};

