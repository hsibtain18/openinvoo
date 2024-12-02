const apiKey = 'b5012636c81dde3475ff4c99dba14ec9'

export const fetchData = async (seriesID : string,observation_start: string,observation_end: string) => {
    try {
        const response = await fetch(
            `/api/fred/series/observations?api_key=${apiKey}&file_type=json&series_id=${seriesID}&observation_start=${observation_start}&observation_end=${observation_end}`
          );
          const data = await response.json();
           return data;
        
    } catch (error) {
        console.log(error);
        
    }
}
export const filterSeriesByName = async (seriesID : string) => {
    try {
        const response = await fetch(
            `/api/fred/series/search?api_key=${apiKey}&file_type=json&search_text=${seriesID}`
          );
          const data = await response.json();
           return data;
        
    } catch (error) {
        console.log(error);
        
    }
}

 
