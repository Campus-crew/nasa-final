# 🚀 NASA Explorer Web Frontend v2

A modern React web application for exploring NASA's vast universe of data, including exoplanets, space imagery, astronomical content, and **high-resolution interactive galaxy maps**.

## ✨ Features

- **Landing Page**: NASA video background with team section
- **Exoplanet Explorer**: Search and filter thousands of discovered exoplanets
- **NASA Object Library**: Browse stunning space imagery and videos
- **🆕 Andromeda Galaxy Map**: Interactive high-resolution (42K×9K) galaxy exploration
- **Team Section**: Meet our space exploration team
- **Responsive Design**: Works seamlessly on all devices
- **Modern UI**: Grayscale design with NASA Orbitron typography

### 🌌 New in v2: Andromeda Galaxy Explorer

- **Ultra High-Resolution**: 42,208 × 9,870 pixel interactive map
- **Optimized Tiling System**: Viewport-based rendering for smooth performance
- **Progressive Loading**: Seamless transition between quality levels
- **Advanced Navigation**: Zoom, pan, and explore with precision controls
- **Real-time Info**: Live viewport statistics and tile management

## 🛠 Tech Stack

- **Frontend**: React 18 with Hooks
- **Routing**: React Router DOM
- **Styling**: Styled Components with CSS-in-JS
- **Animations**: Framer Motion
- **Data Fetching**: React Query + Axios
- **APIs**: NASA Open APIs, Exoplanet Archive
- **🆕 Image Processing**: Konva.js + React-Konva for high-performance rendering
- **🆕 Optimization**: Debounced updates and progressive image loading
- **Build Tool**: Create React App

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🚀 Getting Started

1. **Navigate to the project**:
   ```bash
   cd x:/nura/nasa/web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   
   If you get port conflicts, try:
   ```bash
   npm run start:safe
   ```

4. **Open your browser** and navigate to `http://localhost:3001`

**Note**: The app includes a NASA API key. For production use, get your own free API key at: https://api.nasa.gov/

## 🌟 Usage

### Landing Page
- **NASA Video Background**: Features official NASA content with overlay
- **Team Section**: Mission team members with their roles
- **Quick Navigation**: Access to planets and library sections

### Planet Search
- Search for exoplanets by name
- Filter by discovery year, habitability, and size
- Sort by various criteria
- Load more results with pagination

### Image Library
- Browse NASA's image and video collection
- Category-based filtering
- Grid and list view options
- Detailed content pages with download options

## 🎨 Design Features

- **Grayscale Color Scheme**: Professional black, gray, and white palette
- **NASA Typography**: Orbitron font for important headings
- **Smooth Animations**: Page transitions and hover effects
- **Responsive Layout**: Mobile-first design approach
- **Accessibility**: Keyboard navigation and screen reader support

## 🔧 Configuration

### Environment Variables
The app uses the existing `.env` file with NASA API key.

### Available Scripts
- `npm start` - Runs the app in development mode
- `npm run start:safe` - Runs with legacy OpenSSL provider
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner

## 🌐 API Integration

- **NASA Image Library**: Browse space imagery and videos
- **Exoplanet Archive**: Search confirmed exoplanets
- **APOD**: Daily astronomy pictures
- **Mars Rover Photos**: Latest images from Mars missions

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

Build the project for production:
```bash
npm run build
```

The build folder contains the optimized production files ready for deployment.

---

**Explore the Universe** 🌌
