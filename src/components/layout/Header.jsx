import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Heart, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getDashboardLink = () => {
    if (!user) return '/dashboard'
    
    switch (user.role) {
      case 'Admin':
        return '/admin/dashboard'
      case 'Staff':
        return '/staff/dashboard'
      default:
        return '/dashboard'
    }
  }

  return (
    <header className="bg-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <Heart className="h-8 w-8" />
            <span>BloodDonation</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-red-200 transition-colors">
              Home
            </Link>
            <Link to="/blogs" className="hover:text-red-200 transition-colors">
              Blog
            </Link>
            <Link to="/blood-requests" className="hover:text-red-200 transition-colors">
              Blood Requests
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={getDashboardLink()} 
                  className="hover:text-red-200 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 hover:text-red-200 transition-colors">
                    <User className="h-5 w-5" />
                    <span>{user?.fullName}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="hover:text-red-200 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-red-600 px-4 py-2 rounded-md hover:bg-red-50 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-red-500">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="py-2 hover:text-red-200 transition-colors">
                Home
              </Link>
              <Link to="/blogs" className="py-2 hover:text-red-200 transition-colors">
                Blog
              </Link>
              <Link to="/blood-requests" className="py-2 hover:text-red-200 transition-colors">
                Blood Requests
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to={getDashboardLink()} 
                    className="py-2 hover:text-red-200 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link to="/profile" className="py-2 hover:text-red-200 transition-colors">
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-left py-2 hover:text-red-200 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="py-2 hover:text-red-200 transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="py-2 hover:text-red-200 transition-colors">
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header