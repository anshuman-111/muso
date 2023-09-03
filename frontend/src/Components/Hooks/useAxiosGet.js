import { useEffect, useState } from "react";
import { makeRequest } from "../../makeRequest";

const useAxiosGet = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await makeRequest.get(url);
        if(!res.ok) {
          // Logging 
          throw new Error(`Data is not valid ${res.status}`)
        }
      } catch (error) {
        setError(error?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);
  
  return { data, loading, error };
};

export default useAxiosGet;