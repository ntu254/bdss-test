import { useQuery } from 'react-query'
import api from '../../../lib/api'
import Card from '../../../components/ui/Card'
import { Package, Calendar, MapPin, User } from 'lucide-react'

const ManageInventoryPage = () => {
  // Fetch inventory data
  const { data: inventory = [], isLoading: inventoryLoading } = useQuery(
    'staffInventory',
    async () => {
      const response = await api.get('/staff/inventory')
      return response.data
    }
  )

  // Fetch inventory summary
  const { data: summary = [], isLoading: summaryLoading } = useQuery(
    'staffInventorySummary',
    async () => {
      const response = await api.get('/staff/inventory/summary')
      return response.data
    }
  )

  // Fetch recent additions
  const { data: recentAdditions = [], isLoading: recentLoading } = useQuery(
    'staffInventoryRecent',
    async () => {
      const response = await api.get('/staff/inventory/recent')
      return response.data
    }
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800'
      case 'RESERVED':
        return 'bg-blue-100 text-blue-800'
      case 'USED':
        return 'bg-gray-100 text-gray-800'
      case 'EXPIRED':
        return 'bg-red-100 text-red-800'
      case 'DISPOSED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isExpiringSoon = (expiryDate) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  }

  const isExpired = (expiryDate) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    return expiry < today
  }

  if (inventoryLoading || summaryLoading || recentLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
        <p className="text-gray-600">Monitor and manage blood inventory levels</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Blood Types</p>
              <p className="text-2xl font-bold text-gray-900">{summary.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Units</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.reduce((total, item) => total + item.unitCount, 0)}
              </p>
            </div>
            <Package className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.reduce((total, item) => total + item.totalVolumeMl, 0).toLocaleString()}ml
              </p>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Inventory Summary */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Inventory Summary by Blood Type</h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {summary.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">
                      {item.bloodType.bloodGroup} - {item.bloodType.componentType}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.unitCount} units • {item.totalVolumeMl.toLocaleString()}ml
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.unitCount > 10 ? 'bg-green-100 text-green-800' :
                      item.unitCount > 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.unitCount > 10 ? 'Good Stock' :
                       item.unitCount > 5 ? 'Low Stock' : 'Critical'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Recent Additions */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Recent Additions</h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {recentAdditions.map((unit) => (
                <div key={unit.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">
                      {unit.bloodType.bloodGroup} - {unit.bloodType.componentType}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
                      {unit.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Unit ID: {unit.id}</div>
                    <div>Volume: {unit.volumeMl}ml</div>
                    <div>Collected: {new Date(unit.collectionDate).toLocaleDateString()}</div>
                    <div>Donor: {unit.donorName}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Full Inventory List */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Complete Inventory</h2>
        </Card.Header>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Collection Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map((unit) => (
                  <tr key={unit.id} className={
                    isExpired(unit.expiryDate) ? 'bg-red-50' :
                    isExpiringSoon(unit.expiryDate) ? 'bg-yellow-50' : ''
                  }>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {unit.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.bloodType.bloodGroup} - {unit.bloodType.componentType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.volumeMl}ml
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(unit.collectionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className={
                        isExpired(unit.expiryDate) ? 'text-red-600 font-medium' :
                        isExpiringSoon(unit.expiryDate) ? 'text-yellow-600 font-medium' : ''
                      }>
                        {new Date(unit.expiryDate).toLocaleDateString()}
                        {isExpired(unit.expiryDate) && ' (Expired)'}
                        {isExpiringSoon(unit.expiryDate) && !isExpired(unit.expiryDate) && ' (Expiring Soon)'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
                        {unit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.storageLocation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default ManageInventoryPage