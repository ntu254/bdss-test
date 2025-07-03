import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import api from '../../../lib/api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { Users, Heart, Calendar, FileText, Package, TrendingUp } from 'lucide-react'

const StaffDashboardPage = () => {
  // Fetch donation requests
  const { data: donations = [] } = useQuery(
    'staffDonations',
    async () => {
      const response = await api.get('/staff/donations/requests')
      return response.data
    }
  )

  // Fetch inventory summary
  const { data: inventorySummary = [] } = useQuery(
    'inventorySummary',
    async () => {
      const response = await api.get('/staff/inventory/summary')
      return response.data
    }
  )

  // Fetch pending blog posts
  const { data: pendingPosts = [] } = useQuery(
    'pendingBlogPosts',
    async () => {
      const response = await api.get('/blog-posts/pending')
      return response.data.content || []
    }
  )

  const pendingDonations = donations.filter(d => d.status === 'PENDING_APPROVAL')
  const scheduledAppointments = donations.filter(d => d.status === 'APPOINTMENT_SCHEDULED')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Dashboard</h1>
        <p className="text-gray-600">Manage donations, inventory, and content</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 text-center">
          <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <div className="text-2xl font-bold text-gray-900">{pendingDonations.length}</div>
          <div className="text-gray-600">Pending Approvals</div>
        </Card>

        <Card className="p-6 text-center">
          <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <div className="text-2xl font-bold text-gray-900">{scheduledAppointments.length}</div>
          <div className="text-gray-600">Scheduled Today</div>
        </Card>

        <Card className="p-6 text-center">
          <Package className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <div className="text-2xl font-bold text-gray-900">{inventorySummary.length}</div>
          <div className="text-gray-600">Blood Types Available</div>
        </Card>

        <Card className="p-6 text-center">
          <FileText className="h-12 w-12 text-orange-600 mx-auto mb-4" />
          <div className="text-2xl font-bold text-gray-900">{pendingPosts.length}</div>
          <div className="text-gray-600">Posts to Review</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Manage Donations</h3>
          <p className="text-gray-600 mb-4">Review and process donation requests</p>
          <Button size="sm" asChild>
            <Link to="/staff/donations">Manage Donations</Link>
          </Button>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <Package className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Inventory</h3>
          <p className="text-gray-600 mb-4">Monitor blood inventory levels</p>
          <Button size="sm" variant="outline" asChild>
            <Link to="/staff/inventory">View Inventory</Link>
          </Button>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <FileText className="h-12 w-12 text-orange-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Blog Posts</h3>
          <p className="text-gray-600 mb-4">Review and approve blog posts</p>
          <Button size="sm" variant="outline" asChild>
            <Link to="/staff/blog-posts">Review Posts</Link>
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Donation Requests */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold flex items-center">
              <Heart className="h-5 w-5 text-red-600 mr-2" />
              Recent Donation Requests
            </h2>
          </Card.Header>
          <Card.Content>
            {donations.length > 0 ? (
              <div className="space-y-4">
                {donations.slice(0, 5).map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{donation.donor?.fullName}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      donation.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                      donation.status === 'APPOINTMENT_SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {donation.status.replace(/_/g, ' ').toLowerCase()}
                    </span>
                  </div>
                ))}
                <div className="pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/staff/donations">View All</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No donation requests</p>
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Inventory Summary */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold flex items-center">
              <Package className="h-5 w-5 text-purple-600 mr-2" />
              Inventory Summary
            </h2>
          </Card.Header>
          <Card.Content>
            {inventorySummary.length > 0 ? (
              <div className="space-y-4">
                {inventorySummary.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">
                        {item.bloodType.bloodGroup} - {item.bloodType.componentType}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.unitCount} units available
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{item.totalVolumeMl}ml</div>
                      <div className="text-sm text-gray-600">Total volume</div>
                    </div>
                  </div>
                ))}
                <div className="pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/staff/inventory">View Full Inventory</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No inventory data</p>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}

export default StaffDashboardPage