import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import api from '../../../lib/api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { Users, Heart, Package, FileText, Settings, TrendingUp } from 'lucide-react'

const AdminDashboardPage = () => {
  // Fetch users count
  const { data: usersData } = useQuery(
    'adminUsers',
    async () => {
      const response = await api.get('/admin/users?page=0&size=1')
      return response.data
    }
  )

  // Fetch donations count
  const { data: donations = [] } = useQuery(
    'adminDonations',
    async () => {
      const response = await api.get('/donations/requests')
      return response.data
    }
  )

  // Fetch inventory summary
  const { data: inventorySummary = [] } = useQuery(
    'adminInventorySummary',
    async () => {
      const response = await api.get('/inventory/summary')
      return response.data
    }
  )

  // Fetch blood types count
  const { data: bloodTypes = [] } = useQuery(
    'adminBloodTypes',
    async () => {
      const response = await api.get('/blood-types')
      return response.data
    }
  )

  const totalUsers = usersData?.totalElements || 0
  const totalDonations = donations.length
  const totalBloodTypes = bloodTypes.length
  const totalInventoryUnits = inventorySummary.reduce((total, item) => total + item.unitCount, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and management tools</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 text-center">
          <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
          <div className="text-gray-600">Total Users</div>
        </Card>

        <Card className="p-6 text-center">
          <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <div className="text-2xl font-bold text-gray-900">{totalDonations}</div>
          <div className="text-gray-600">Total Donations</div>
        </Card>

        <Card className="p-6 text-center">
          <Package className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <div className="text-2xl font-bold text-gray-900">{totalInventoryUnits}</div>
          <div className="text-gray-600">Inventory Units</div>
        </Card>

        <Card className="p-6 text-center">
          <Settings className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <div className="text-2xl font-bold text-gray-900">{totalBloodTypes}</div>
          <div className="text-gray-600">Blood Types</div>
        </Card>
      </div>

      {/* Management Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">User Management</h3>
          <p className="text-gray-600 mb-4">Manage user accounts and permissions</p>
          <Button size="sm" asChild>
            <Link to="/admin/users">Manage Users</Link>
          </Button>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <Settings className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Blood Types</h3>
          <p className="text-gray-600 mb-4">Configure blood types and components</p>
          <Button size="sm" variant="outline" asChild>
            <Link to="/admin/blood-types">Manage Types</Link>
          </Button>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition-shadow">
          <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Compatibility</h3>
          <p className="text-gray-600 mb-4">Manage blood compatibility rules</p>
          <Button size="sm" variant="outline" asChild>
            <Link to="/admin/compatibility">Manage Rules</Link>
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              System Overview
            </h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Active Users</div>
                  <div className="text-sm text-gray-600">Currently registered</div>
                </div>
                <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Blood Types Configured</div>
                  <div className="text-sm text-gray-600">Available in system</div>
                </div>
                <div className="text-2xl font-bold text-green-600">{totalBloodTypes}</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Inventory Units</div>
                  <div className="text-sm text-gray-600">Total blood units</div>
                </div>
                <div className="text-2xl font-bold text-purple-600">{totalInventoryUnits}</div>
              </div>
            </div>
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
                        {item.totalVolumeMl.toLocaleString()}ml total
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{item.unitCount}</div>
                      <div className="text-sm text-gray-600">units</div>
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
                <p>No inventory data available</p>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboardPage