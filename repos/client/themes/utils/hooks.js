import { useState, useRef, useEffect, useCallback } from 'react';

export const useAsyncFetch = (shouldFetch, fetcher, initialPayload) => {
  const [isLoading, setLoading] = useState(shouldFetch);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [response, setResponse] = useState({});

  const memoizedFetcher = useCallback((payload = initialPayload) => {
    setLoading(true);
    setSuccess(false);
    fetcher(payload)
      .then(response => {
        setResponse(response);
        setLoading(false);
        setSuccess(true);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (shouldFetch) {
      memoizedFetcher();
    }

    return () => {
      setLoading(false);
      setResponse({});
      setSuccess(false);
      setError(null);
    };
  }, [memoizedFetcher, shouldFetch]);

  const refetch = useCallback(payload => {
    memoizedFetcher(payload);
  }, [memoizedFetcher]);

  return { isLoading, error, response, success, refetch };
};