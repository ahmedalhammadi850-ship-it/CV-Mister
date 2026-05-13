import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CVProvider } from './context/CVContext'
import { TemplateConfigProvider } from './context/TemplateConfigContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TemplateConfigProvider>
          <CVProvider>
            <App />
          </CVProvider>
        </TemplateConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
