import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore'
import api from '../../../lib/api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { Heart, Calendar, FileText, User, Clock, CheckCircle } from 'lucide-react'

const DashboardPage = () => {
  const { user } = useAuthStore()

  // Fetch user's donation history
  const { data: donations = [] } = useQuery(
    'myDonations',
    async () => {
      const response = await api.get('/donations/my-history')
      return response.data
    }
  )

  // Fetch user's appointments
  const { data: appointments = [] } = useQuery(
    'myAppointments',
    async () => {
      const response = await api.get('/appointments/my-appointments')
      return response.data
    }
  )

  // Fetch active blood requests
  const { data: bloodRequests = [] } = useQuery(
    'activeBloodRequests',
    async () => {
      const response = await api.get('/blood-requests/search/active')
      return response.data
    }
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100'
      case 'PENDING_APPROVAL':
        return 'text-yellow-600 bg-yellow-100'
      case 'APPOINTMENT_SCHEDULED':
        return 'text-blue-600 bg-blue-100'
      case 'HEALTH_CHECK_PASSED':
        return 'text-green-600 bg-green-100'
      case 'BLOOD_COLLECTED':
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-gray-600">
          Thank you for being part of our life-saving community.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Donate Blood</h3>
          <Button size="sm" asChild>
            <Link to="/donations">Request to Donate</Link>
          </Button>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Appointments</h3>
          <Button size="sm" variant="outline" asChild>
            <Link to="/appointments">View Schedule</Link>
          </Button>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">My Blogs</h3>
          <Button size="sm" variant="outline" asChild>
            <Link to="/my-blogs">Manage Posts</Link>
          </Button>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <User className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Profile</h3>
          <Button size="sm" variant="outline" asChild>
            <Link to="/profile">Update Info</Link>
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Donations */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold flex items-center">
              <Heart className="h-5 w-5 text-red-600 mr-2" />
              Recent Donations
            </h2>
          </Card.Header>
          <Card.Content>
            {donations.length > 0 ? (
              <div className="space-y-4">
                {donations.slice(0, 3).map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Donation #{donation.id}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                      {formatStatus(donation.status)}
                    </span>
                  </div>
                ))}
                <div className="pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/donations">View All</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No donations yet</p>
                <Button size="sm" className="mt-4" asChild>
                  <Link to="/donations">Start Donating</Link>
                </Button>
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              Upcoming Appointments
            </h2>
          </Card.Header>
          <Card.Content>
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">
                        {new Date(appointment.appointmentDateTime).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(appointment.appointmentDateTime).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      📍 {appointment.location}
                    </div>
                  </div>
                ))}
                <div className="pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/appointments">View All</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No upcoming appointments</p>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Active Blood Requests */}
      <Card className="mt-8">
        <Card.Header>
          <h2 className="text-xl font-semibold flex items-center">
            <Clock className="h-5 w-5 text-orange-600 mr-2" />
            Active Blood Requests
          </h2>
        </Card.Header>
        <Card.Content>
          {bloodRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bloodRequests.slice(0, 6).map((request) => (
                <div key={request.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{request.bloodType.bloodGroup}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.urgency === 'CRITICAL' ? 'bg-red-100 text-red-600' :
                      request.urgency === 'URGENT' ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {request.urgency}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Patient: {request.patientName}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    Hospital: {request.hospital}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    Needed: {request.quantityInUnits} units
                  </div>
                  <Button size="sm" className="w-full" asChild>
                    <Link to="/blood-requests">View Details</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No active blood requests at the moment</p>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  )
}

export default DashboardPage