import { useEffect, useState } from "react";
import { axiosInstance } from "./AxiosInst";

const useAxiosPost = (url, data) => {
  const [response, setResponse] = useState()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.post(url, data);
        setResponse(res)
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchData();
  
  return { response, loading, error };
};

export default useAxiosPost;