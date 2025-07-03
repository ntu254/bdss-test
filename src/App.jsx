import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Public pages
import HomePage from './features/public/pages/HomePage'
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'
import VerifyPage from './features/auth/pages/VerifyPage'
import BlogListPage from './features/blog/pages/BlogListPage'
import BlogDetailPage from './features/blog/pages/BlogDetailPage'
import BloodRequestsPage from './features/blood-requests/pages/BloodRequestsPage'

// User pages
import DashboardPage from './features/dashboard/pages/DashboardPage'
import ProfilePage from './features/profile/pages/ProfilePage'
import DonationHistoryPage from './features/donations/pages/DonationHistoryPage'
import MyBlogsPage from './features/blog/pages/MyBlogsPage'
import CreateBlogPage from './features/blog/pages/CreateBlogPage'
import EditBlogPage from './features/blog/pages/EditBlogPage'
import AppointmentsPage from './features/appointments/pages/AppointmentsPage'

// Staff pages
import StaffDashboardPage from './features/staff/pages/StaffDashboardPage'
import ManageDonationsPage from './features/staff/pages/ManageDonationsPage'
import ManageInventoryPage from './features/staff/pages/ManageInventoryPage'
import ManageBlogPostsPage from './features/staff/pages/ManageBlogPostsPage'

// Admin pages
import AdminDashboardPage from './features/admin/pages/AdminDashboardPage'
import ManageUsersPage from './features/admin/pages/ManageUsersPage'
import ManageBloodTypesPage from './features/admin/pages/ManageBloodTypesPage'
import ManageCompatibilityPage from './features/admin/pages/ManageCompatibilityPage'

function App() {
  const { user } = useAuthStore()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify" element={<VerifyPage />} />
        <Route path="blogs" element={<BlogListPage />} />
        <Route path="blogs/:id" element={<BlogDetailPage />} />
        <Route path="blood-requests" element={<BloodRequestsPage />} />

        {/* Protected routes for authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="donations" element={<DonationHistoryPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="my-blogs" element={<MyBlogsPage />} />
          <Route path="blogs/create" element={<CreateBlogPage />} />
          <Route path="blogs/edit/:id" element={<EditBlogPage />} />
        </Route>

        {/* Staff routes */}
        <Route element={<ProtectedRoute allowedRoles={['Staff', 'Admin']} />}>
          <Route path="staff/dashboard" element={<StaffDashboardPage />} />
          <Route path="staff/donations" element={<ManageDonationsPage />} />
          <Route path="staff/inventory" element={<ManageInventoryPage />} />
          <Route path="staff/blog-posts" element={<ManageBlogPostsPage />} />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="admin/users" element={<ManageUsersPage />} />
          <Route path="admin/blood-types" element={<ManageBloodTypesPage />} />
          <Route path="admin/compatibility" element={<ManageCompatibilityPage />} />
        </Route>
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App