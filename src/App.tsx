import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/Admin/ProtectedRoute'
import HomePage from './pages/HomePage'
import JourneyPage from './pages/JourneyPage'
import ProgressPage from './pages/ProgressPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}
