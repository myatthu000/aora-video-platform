import { Alert } from "react-native";

const { useEffect, useState } = require("react");

const useAppwrite = (fn) => {
    
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try{
          const response = await fn();
          setData(response)
        }catch(error){
          Alert.alert('Error: ', error.message)
        } finally {
          setLoading(false)
        }
    }
  
    useEffect(()=>{  
        fetchData();
    },[])

    const refetch = async () => await fetchData();

    return {
        data,
        refetch,
    }
}

export default useAppwrite;