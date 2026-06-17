import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import PositionDetail from '@/pages/PositionDetail'
import PostPosition from '@/pages/company/PostPosition'
import ManagePositions from '@/pages/company/ManagePositions'
import Applications from '@/pages/company/Applications'
import Interviews from '@/pages/company/Interviews'
import CompanyAgreements from '@/pages/company/Agreements'
import Evaluations from '@/pages/company/Evaluations'
import Certificates from '@/pages/company/Certificates'
import StudentApplications from '@/pages/student/Applications'
import InternshipLogs from '@/pages/student/InternshipLogs'
import StudentAgreements from '@/pages/student/Agreements'
import StudentCertificates from '@/pages/student/Certificates'
import Reviews from '@/pages/school/Reviews'
import PositionReviews from '@/pages/school/PositionReviews'
import Dashboard from '@/pages/school/Dashboard'
import SchoolAgreements from '@/pages/school/Agreements'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/position/:id" element={<PositionDetail />} />
                <Route path="/company/post" element={<PrivateRoute><PostPosition /></PrivateRoute>} />
                <Route path="/company/positions" element={<PrivateRoute><ManagePositions /></PrivateRoute>} />
                <Route path="/company/applications" element={<PrivateRoute><Applications /></PrivateRoute>} />
                <Route path="/company/interviews" element={<PrivateRoute><Interviews /></PrivateRoute>} />
                <Route path="/company/agreements" element={<PrivateRoute><CompanyAgreements /></PrivateRoute>} />
                <Route path="/company/evaluations" element={<PrivateRoute><Evaluations /></PrivateRoute>} />
                <Route path="/company/certificates" element={<PrivateRoute><Certificates /></PrivateRoute>} />
                <Route path="/student/applications" element={<PrivateRoute><StudentApplications /></PrivateRoute>} />
                <Route path="/student/logs" element={<PrivateRoute><InternshipLogs /></PrivateRoute>} />
                <Route path="/student/agreements" element={<PrivateRoute><StudentAgreements /></PrivateRoute>} />
                <Route path="/student/certificates" element={<PrivateRoute><StudentCertificates /></PrivateRoute>} />
                <Route path="/school/reviews" element={<PrivateRoute><Reviews /></PrivateRoute>} />
                <Route path="/school/position-reviews" element={<PrivateRoute><PositionReviews /></PrivateRoute>} />
                <Route path="/school/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/school/agreements" element={<PrivateRoute><SchoolAgreements /></PrivateRoute>} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  )
}
