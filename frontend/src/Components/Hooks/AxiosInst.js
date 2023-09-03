import axios from "axios";
import { useCookies } from "react-cookie";


export const axiosSecureInstance = () => {
  
  const [cookies] = useCookies(['jwt']);
  const secureInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
      Authorization: `Bearer ${cookies['jwt'].access}`
    }
})

  return secureInstance
}



export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
})