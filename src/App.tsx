import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import DashboardPage from './pages/DashboardPage'
import NewQuotePage from './pages/NewQuotePage'
import QuoteEditorPage from './pages/QuoteEditorPage'

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/new" element={<NewQuotePage />} />
          <Route path="/quote/:id" element={<QuoteEditorPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}
