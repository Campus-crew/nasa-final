import axios from 'axios';

const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY || 'DEMO_KEY';
const NASA_BASE_URL = 'https://api.nasa.gov';

export const nasaApiService = {
  // NASA Image and Video Library API
  searchImages: async (query = 'space', page = 1) => {
    try {
      const response = await axios.get(`https://images-api.nasa.gov/search`, {
        params: {
          q: query,
          page,
          media_type: 'image',
          year_start: 1990,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching NASA images:', error);
      throw error;
    }
  },

  // Get specific NASA asset by ID
  getAssetById: async (nasaId) => {
    try {
      const response = await axios.get(`https://images-api.nasa.gov/search`, {
        params: {
          nasa_id: nasaId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching NASA asset by ID:', error);
      throw error;
    }
  },

  // NASA Video Library API
  searchVideos: async (query = 'space', page = 1) => {
    try {
      // Filter for astronomical content only, exclude human-focused content
      const astronomicalQuery = query || 'galaxy planet nebula star solar system comet asteroid meteor';
      
      const response = await axios.get(`https://images-api.nasa.gov/search`, {
        params: {
          q: astronomicalQuery,
          page,
          media_type: 'video',
          year_start: 2000,
        },
      });
      
      // Filter out videos with people/human content
      if (response.data && response.data.collection && response.data.collection.items) {
        const filteredItems = response.data.collection.items.filter(item => {
          const title = item.data[0]?.title?.toLowerCase() || '';
          const description = item.data[0]?.description?.toLowerCase() || '';
          
          // Exclude videos with human-related keywords
          const humanKeywords = [
            'astronaut', 'crew', 'interview', 'message', 'speech', 'talk',
            'administrator', 'director', 'scientist', 'engineer', 'people',
            'person', 'human', 'man', 'woman', 'team', 'staff', 'conference',
            'meeting', 'announcement', 'press', 'briefing', 'ceremony'
          ];
          
          const hasHumanContent = humanKeywords.some(keyword => 
            title.includes(keyword) || description.includes(keyword)
          );
          
          // Include videos with astronomical keywords
          const astronomicalKeywords = [
            'galaxy', 'planet', 'star', 'nebula', 'comet', 'asteroid', 'meteor',
            'solar system', 'universe', 'cosmos', 'space', 'celestial', 'orbit',
            'rotation', 'eclipse', 'aurora', 'satellite', 'telescope', 'hubble',
            'webb', 'mars', 'jupiter', 'saturn', 'venus', 'mercury', 'earth',
            'moon', 'sun', 'milky way', 'andromeda', 'supernova', 'black hole'
          ];
          
          const hasAstronomicalContent = astronomicalKeywords.some(keyword => 
            title.includes(keyword) || description.includes(keyword)
          );
          
          return !hasHumanContent && hasAstronomicalContent;
        });
        
        response.data.collection.items = filteredItems;
        response.data.collection.metadata.total_hits = filteredItems.length;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error searching NASA videos:', error);
      throw error;
    }
  },

  // Exoplanet Archive API
  searchExoplanets: async (query = '', limit = 1000) => {
    try {
      let sqlQuery = `SELECT pl_name,hostname,disc_year,pl_orbper,pl_rade,pl_masse,st_dist,pl_eqt FROM ps`;
      
      if (query && query.trim()) {
        sqlQuery += ` WHERE pl_name LIKE '%${query.trim()}%'`;
      }
      
      sqlQuery += ` ORDER BY disc_year DESC LIMIT ${limit}`;
      
      const response = await axios.get(`https://exoplanetarchive.ipac.caltech.edu/TAP/sync`, {
        params: {
          query: sqlQuery,
          format: 'json',
        },
        timeout: 15000,
      });
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error searching exoplanets:', error);
      // Return extensive mock data if API fails
      return [
        {
          pl_name: 'Kepler-452b',
          hostname: 'Kepler-452',
          disc_year: 2015,
          pl_orbper: 384.8,
          pl_rade: 1.6,
          pl_masse: null,
          st_dist: 430.0,
          pl_eqt: 265
        },
        {
          pl_name: 'TRAPPIST-1e',
          hostname: 'TRAPPIST-1',
          disc_year: 2017,
          pl_orbper: 6.1,
          pl_rade: 0.92,
          pl_masse: 0.77,
          st_dist: 12.4,
          pl_eqt: 251
        },
        {
          pl_name: 'Proxima Centauri b',
          hostname: 'Proxima Centauri',
          disc_year: 2016,
          pl_orbper: 11.2,
          pl_rade: 1.1,
          pl_masse: 1.27,
          st_dist: 1.3,
          pl_eqt: 234
        },
        {
          pl_name: 'TOI-715 b',
          hostname: 'TOI-715',
          disc_year: 2024,
          pl_orbper: 19.3,
          pl_rade: 1.55,
          pl_masse: null,
          st_dist: 137.0,
          pl_eqt: 280
        },
        {
          pl_name: 'K2-18 b',
          hostname: 'K2-18',
          disc_year: 2015,
          pl_orbper: 32.9,
          pl_rade: 2.3,
          pl_masse: 8.6,
          st_dist: 34.0,
          pl_eqt: 279
        },
        {
          pl_name: 'HD 40307 g',
          hostname: 'HD 40307',
          disc_year: 2012,
          pl_orbper: 197.8,
          pl_rade: null,
          pl_masse: 7.1,
          st_dist: 12.8,
          pl_eqt: 227
        },
        {
          pl_name: 'Gliese 667C c',
          hostname: 'Gliese 667C',
          disc_year: 2011,
          pl_orbper: 28.1,
          pl_rade: null,
          pl_masse: 3.8,
          st_dist: 6.8,
          pl_eqt: 277
        },
        {
          pl_name: 'Kepler-186f',
          hostname: 'Kepler-186',
          disc_year: 2014,
          pl_orbper: 129.9,
          pl_rade: 1.1,
          pl_masse: null,
          st_dist: 178.0,
          pl_eqt: 188
        },
        {
          pl_name: 'Wolf 1061c',
          hostname: 'Wolf 1061',
          disc_year: 2015,
          pl_orbper: 17.9,
          pl_rade: null,
          pl_masse: 4.3,
          st_dist: 4.3,
          pl_eqt: 223
        },
        {
          pl_name: 'LHS 1140 b',
          hostname: 'LHS 1140',
          disc_year: 2017,
          pl_orbper: 24.7,
          pl_rade: 1.4,
          pl_masse: 6.6,
          st_dist: 12.5,
          pl_eqt: 230
        }
      ];
    }
  },

  // Astronomy Picture of the Day
  getAPOD: async (date = null, count = null) => {
    try {
      const params = {};
      if (date) params.date = date;
      if (count) params.count = count;
      
      const response = await axios.get(`${NASA_BASE_URL}/planetary/apod`, {
        params: {
          api_key: NASA_API_KEY,
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching APOD:', error);
      // Fallback APOD data
      return {
        title: "Hubble's View of Galaxy NGC 1300",
        explanation: "This stunning image from the Hubble Space Telescope shows the barred spiral galaxy NGC 1300, located about 61 million light-years away in the constellation Eridanus.",
        url: "https://apod.nasa.gov/apod/image/2301/NGC1300_HubbleSchmidt_1080.jpg",
        media_type: "image",
        date: new Date().toISOString().split('T')[0]
      };
    }
  },

  // Mars Rover Photos
  getMarsPhotos: async (sol = 1000, camera = 'fhaz', rover = 'curiosity') => {
    try {
      const response = await axios.get(`${NASA_BASE_URL}/mars-photos/api/v1/rovers/${rover}/photos`, {
        params: {
          sol,
          camera,
          api_key: NASA_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Mars photos:', error);
      throw error;
    }
  },

  // Near Earth Objects
  getNEOs: async (startDate, endDate) => {
    try {
      const response = await axios.get(`${NASA_BASE_URL}/neo/rest/v1/feed`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          api_key: NASA_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching NEOs:', error);
      throw error;
    }
  },
};
