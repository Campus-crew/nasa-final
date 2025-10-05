import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
  
  :root {
    --primary-bg: #0a0f1c;
    --secondary-bg: #1a1f2e;
    --tertiary-bg: #252a3a;
    --accent-bg: #2d3548;
    --light-bg: #3a4158;
    --primary-text: #e8eaf6;
    --secondary-text: #c5cae9;
    --tertiary-text: #9fa8da;
    --accent-text: #7986cb;
    --border-color: #3f4a5f;
    --hover-bg: #1e2332;
    --shadow-soft: 0 4px 20px rgba(10, 15, 28, 0.6);
    --shadow-strong: 0 8px 40px rgba(10, 15, 28, 0.9);
    --border-radius: 16px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --nasa-font: 'Orbitron', monospace;
    --accent-blue: #5c6bc0;
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
    background: var(--accent-blue);
    color: var(--primary-text);
  }
`;

export default GlobalStyles;
