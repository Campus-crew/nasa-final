const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');

// NASA API configuration
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const NASA_IMAGE_API = 'https://images-api.nasa.gov/search';

// Directory for saving images
const MEDIA_DIR = path.join(__dirname, '../public/media/galaxies');

// Ensure media directory exists
if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

// Galaxy search terms for better results
const GALAXY_QUERIES = [
  'andromeda galaxy',
  'spiral galaxy',
  'elliptical galaxy',
  'whirlpool galaxy',
  'sombrero galaxy',
  'pinwheel galaxy',
  'cartwheel galaxy',
  'antennae galaxies',
  'stephan quintet',
  'galaxy cluster',
  'hubble galaxy',
  'messier galaxy',
  'ngc galaxy'
];

// Function to download image from URL
const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(MEDIA_DIR, filename));
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve(filename);
      });
      
      file.on('error', (err) => {
        fs.unlink(path.join(MEDIA_DIR, filename), () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

// Function to get high-resolution image URL
const getHighResImageUrl = async (nasaId) => {
  try {
    const response = await axios.get(`https://images-api.nasa.gov/asset/${nasaId}`);
    const assets = response.data.collection.items;
    
    // Find the highest resolution image (usually the largest file)
    const imageAssets = assets.filter(asset => 
      asset.href.includes('.jpg') || asset.href.includes('.png')
    );
    
    if (imageAssets.length === 0) return null;
    
    // Sort by URL to get the highest quality (orig or large)
    const highResAsset = imageAssets.find(asset => 
      asset.href.includes('orig') || asset.href.includes('large')
    ) || imageAssets[imageAssets.length - 1];
    
    return highResAsset.href;
  } catch (error) {
    console.error(`Error getting high-res URL for ${nasaId}:`, error.message);
    return null;
  }
};

// Function to search and download galaxy images
const searchAndDownloadGalaxies = async (query, maxResults = 5) => {
  try {
    console.log(`🔍 Searching for: "${query}"`);
    
    const response = await axios.get(NASA_IMAGE_API, {
      params: {
        q: query,
        media_type: 'image',
        year_start: 2000, // Focus on newer, higher quality images
        page_size: 20 // Get more results to filter from
      }
    });
    
    const items = response.data.collection.items;
    
    if (!items || items.length === 0) {
      console.log(`❌ No results found for: "${query}"`);
      return [];
    }
    
    console.log(`📸 Found ${items.length} images for: "${query}"`);
    
    const downloaded = [];
    let count = 0;
    
    for (const item of items) {
      if (count >= maxResults) break;
      
      const data = item.data[0];
      const nasaId = data.nasa_id;
      
      // Skip if not a galaxy image (basic filtering)
      const title = data.title.toLowerCase();
      const description = (data.description || '').toLowerCase();
      
      if (!title.includes('galaxy') && !description.includes('galaxy')) {
        continue;
      }
      
      try {
        console.log(`📥 Processing: ${data.title}`);
        
        const highResUrl = await getHighResImageUrl(nasaId);
        
        if (!highResUrl) {
          console.log(`❌ No high-res URL found for: ${data.title}`);
          continue;
        }
        
        // Create safe filename
        const safeTitle = data.title
          .replace(/[^a-zA-Z0-9\s-]/g, '')
          .replace(/\s+/g, '_')
          .substring(0, 50);
        
        const extension = path.extname(highResUrl).split('?')[0] || '.jpg';
        const filename = `${safeTitle}_${nasaId}${extension}`;
        
        // Check if file already exists
        const filePath = path.join(MEDIA_DIR, filename);
        if (fs.existsSync(filePath)) {
          console.log(`⏭️  Already exists: ${filename}`);
          downloaded.push({
            filename,
            title: data.title,
            description: data.description,
            nasaId,
            dateCreated: data.date_created,
            center: data.center
          });
          count++;
          continue;
        }
        
        await downloadImage(highResUrl, filename);
        
        downloaded.push({
          filename,
          title: data.title,
          description: data.description,
          nasaId,
          dateCreated: data.date_created,
          center: data.center,
          originalUrl: highResUrl
        });
        
        count++;
        
        // Add delay to be respectful to NASA's servers
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error downloading ${data.title}:`, error.message);
      }
    }
    
    return downloaded;
    
  } catch (error) {
    console.error(`❌ Error searching for "${query}":`, error.message);
    return [];
  }
};

// Main function
const main = async () => {
  console.log('🚀 Starting NASA Galaxy Image Download...\n');
  
  const allDownloaded = [];
  
  for (const query of GALAXY_QUERIES) {
    try {
      const downloaded = await searchAndDownloadGalaxies(query, 3);
      allDownloaded.push(...downloaded);
      
      // Add delay between queries
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ Error processing query "${query}":`, error.message);
    }
  }
  
  // Save metadata
  const metadataPath = path.join(MEDIA_DIR, 'galaxies_metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(allDownloaded, null, 2));
  
  console.log(`\n✅ Download complete!`);
  console.log(`📁 Images saved to: ${MEDIA_DIR}`);
  console.log(`📋 Metadata saved to: ${metadataPath}`);
  console.log(`🖼️  Total images downloaded: ${allDownloaded.length}`);
  
  // Print summary
  console.log('\n📊 Summary:');
  allDownloaded.forEach((item, index) => {
    console.log(`${index + 1}. ${item.title} (${item.filename})`);
  });
};

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { searchAndDownloadGalaxies, downloadImage };
