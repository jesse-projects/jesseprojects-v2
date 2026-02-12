import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Initialize dark mode from system preference
const initDarkMode = () => {
  const prefersDark = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const storedTheme = localStorage.getItem('theme')

  if (storedTheme === 'dark' || (!storedTheme && systemDark)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

initDarkMode()

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    if (e.matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
