import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { WatchlistProvider } from './context/WatchlistContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <WatchlistProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </WatchlistProvider>
    </ThemeProvider>
  </StrictMode>,
)