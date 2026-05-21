import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import HeroLanding from './pages/Landing/HeroLanding'
import IntakeWizard from './pages/Intake/IntakeWizard'
import Dashboard from './pages/Dashboard/Dashboard'
import PlanList from './pages/Explorer/PlanList'
import PlanDetail from './pages/Explorer/PlanDetail'
import CompareView from './pages/Compare/CompareView'
import ForecastChart from './pages/Forecast/ForecastChart'
import Simulator from './pages/Forecast/Simulator'
import WatchlistDashboard from './pages/Watchlist/WatchlistDashboard'
import ProfileSetup from './pages/Profile/ProfileSetup'
import ProfilePage from './pages/Profile/ProfilePage'
import AppShell from './components/layout/AppShell'
import ProtectedRoute from './components/layout/ProtectedRoute'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HeroLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Semi-protected (no shell) */}
      <Route path="/intake" element={
        <ProtectedRoute><IntakeWizard /></ProtectedRoute>
      } />
      <Route path="/profile-setup" element={
        <ProtectedRoute><ProfileSetup /></ProtectedRoute>
      } />

      {/* Protected with shell */}
      <Route path="/dashboard" element={
        <ProtectedLayout><Dashboard /></ProtectedLayout>
      } />
      <Route path="/profile" element={
        <ProtectedLayout><ProfilePage /></ProtectedLayout>
      } />
      <Route path="/plans" element={
        <ProtectedLayout><PlanList /></ProtectedLayout>
      } />
      <Route path="/plans/:id" element={
        <ProtectedLayout><PlanDetail /></ProtectedLayout>
      } />
      <Route path="/compare" element={
        <ProtectedLayout><CompareView /></ProtectedLayout>
      } />
      <Route path="/forecast" element={
        <ProtectedLayout><ForecastChart /></ProtectedLayout>
      } />
      <Route path="/forecast/simulator" element={
        <ProtectedLayout><Simulator /></ProtectedLayout>
      } />
      <Route path="/watchlist" element={
        <ProtectedLayout><WatchlistDashboard /></ProtectedLayout>
      } />

      {/* App redirect fallback */}
      <Route path="/app" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

