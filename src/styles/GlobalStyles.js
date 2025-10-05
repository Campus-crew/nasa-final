import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
  
  :root {
    --primary-bg: #000000;
    --secondary-bg: #111111;
    --tertiary-bg: #1a1a1a;
    --accent-bg: #2a2a2a;
    --light-bg: #333333;
    --primary-text: #ffffff;
    --secondary-text: #cccccc;
    --tertiary-text: #999999;
    --accent-text: #666666;
    --border-color: #333333;
    --hover-bg: #222222;
    --shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.5);
    --shadow-strong: 0 8px 40px rgba(0, 0, 0, 0.8);
    --border-radius: 16px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --nasa-font: 'Orbitron', monospace;
  }

  html {
    scroll-behavior: smooth;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: var(--nasa-font);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--primary-bg);
    color: var(--primary-text);
    min-height: 100vh;
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--nasa-font);
    font-weight: 700;
  }

  p, span, div, button, input, select, textarea {
    font-family: var(--nasa-font);
  }

  /* Custom animations */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  /* Utility classes */
  .fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }

  .fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .pulse {
    animation: pulse 2s infinite;
  }

  .float {
    animation: float 3s ease-in-out infinite;
  }

  /* Focus styles */
  button:focus,
  input:focus,
  select:focus,
  textarea:focus {
    outline: 2px solid var(--accent-blue);
    outline-offset: 2px;
  }

  /* Selection styles */
  ::selection {
    background: var(--light-bg);
    color: var(--primary-text);
  }
`;

export default GlobalStyles;
