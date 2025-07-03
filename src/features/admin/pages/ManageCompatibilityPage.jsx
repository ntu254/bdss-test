import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { Plus, Edit, Trash2, TrendingUp, CheckCircle, X } from 'lucide-react'

const ManageCompatibilityPage = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedRule, setSelectedRule] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const pageSize = 10

  // Fetch compatibility rules
  const { data: rulesData, isLoading } = useQuery(
    ['adminCompatibilityRules', page],
    async () => {
      const response = await api.get(`/blood-compatibility?page=${page}&size=${pageSize}`)
      return response.data
    },
    {
      keepPreviousData: true
    }
  )

  // Fetch blood types for forms
  const { data: bloodTypes = [] } = useQuery(
    'bloodTypes',
    async () => {
      const response = await api.get('/blood-types')
      return response.data
    }
  )

  // Create compatibility rule mutation
  const createRuleMutation = useMutation(
    async (ruleData) => {
      const response = await api.post('/blood-compatibility', ruleData)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminCompatibilityRules')
        setShowCreateModal(false)
        toast.success('Compatibility rule created successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create compatibility rule')
      }
    }
  )

  // Update compatibility rule mutation
  const updateRuleMutation = useMutation(
    async ({ id, ruleData }) => {
      const response = await api.put(`/blood-compatibility/${id}`, ruleData)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminCompatibilityRules')
        setShowEditModal(false)
        setSelectedRule(null)
        toast.success('Compatibility rule updated successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update compatibility rule')
      }
    }
  )

  // Delete compatibility rule mutation
  const deleteRuleMutation = useMutation(
    async (ruleId) => {
      await api.delete(`/blood-compatibility/${ruleId}`)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminCompatibilityRules')
        toast.success('Compatibility rule deleted successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete compatibility rule')
      }
    }
  )

  const rules = rulesData?.content || []
  const totalPages = rulesData?.totalPages || 0

  const handleEdit = (rule) => {
    setSelectedRule(rule)
    setShowEditModal(true)
  }

  const handleDelete = (rule) => {
    if (window.confirm('Are you sure you want to delete this compatibility rule?')) {
      deleteRuleMutation.mutate(rule.id)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Blood Compatibility</h1>
          <p className="text-gray-600">Configure blood compatibility rules and relationships</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Compatibility Rule
        </Button>
      </div>

      {/* Compatibility Rules Table */}
      <Card>
        <Card.Content className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor Blood Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient Blood Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compatible
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rules.map((rule) => (
                  <tr key={rule.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {rule.donorBloodType.bloodGroup}
                      </div>
                      <div className="text-sm text-gray-500">
                        {rule.donorBloodType.componentType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {rule.recipientBloodType.bloodGroup}
                      </div>
                      <div className="text-sm text-gray-500">
                        {rule.recipientBloodType.componentType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {rule.isCompatible ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className={`text-sm font-medium ${
                          rule.isCompatible ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {rule.isCompatible ? 'Compatible' : 'Not Compatible'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rule.notes || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(rule.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(rule)}
                          loading={deleteRuleMutation.isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>

      {rules.length === 0 && (
        <Card className="p-12 text-center mt-8">
          <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No compatibility rules configured</h3>
          <p className="text-gray-600 mb-6">
            Start by adding blood compatibility rules to define donor-recipient relationships
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Rule
          </Button>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
          >
            Previous
          </Button>
          
          <span className="flex items-center px-4 py-2 text-sm text-gray-700">
            Page {page + 1} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}

      {/* Create Compatibility Rule Modal */}
      {showCreateModal && (
        <CreateCompatibilityModal
          bloodTypes={bloodTypes}
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => createRuleMutation.mutate(data)}
          loading={createRuleMutation.isLoading}
        />
      )}

      {/* Edit Compatibility Rule Modal */}
      {showEditModal && selectedRule && (
        <EditCompatibilityModal
          rule={selectedRule}
          bloodTypes={bloodTypes}
          onClose={() => {
            setShowEditModal(false)
            setSelectedRule(null)
          }}
          onSubmit={(data) => updateRuleMutation.mutate({ id: selectedRule.id, ruleData: data })}
          loading={updateRuleMutation.isLoading}
        />
      )}
    </div>
  )
}

// Create Compatibility Rule Modal Component
const CreateCompatibilityModal = ({ bloodTypes, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    donorBloodTypeId: '',
    recipientBloodTypeId: '',
    isCompatible: true,
    notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      donorBloodTypeId: parseInt(formData.donorBloodTypeId),
      recipientBloodTypeId: parseInt(formData.recipientBloodTypeId),
      isCompatible: formData.isCompatible === 'true'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Create Compatibility Rule</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Donor Blood Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.donorBloodTypeId}
                onChange={(e) => setFormData({...formData, donorBloodTypeId: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select donor blood type</option>
                {bloodTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.bloodGroup} - {type.componentType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Blood Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.recipientBloodTypeId}
                onChange={(e) => setFormData({...formData, recipientBloodTypeId: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select recipient blood type</option>
                {bloodTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.bloodGroup} - {type.componentType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compatibility <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.isCompatible}
                onChange={(e) => setFormData({...formData, isCompatible: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="true">Compatible</option>
                <option value="false">Not Compatible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Additional notes about this compatibility rule..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Create Rule
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Edit Compatibility Rule Modal Component
const EditCompatibilityModal = ({ rule, bloodTypes, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    isCompatible: rule.isCompatible,
    notes: rule.notes || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      isCompatible: formData.isCompatible === 'true'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Edit Compatibility Rule</h3>
          
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <div className="text-sm text-gray-600">
              <div><strong>Donor:</strong> {rule.donorBloodType.bloodGroup} - {rule.donorBloodType.componentType}</div>
              <div><strong>Recipient:</strong> {rule.recipientBloodType.bloodGroup} - {rule.recipientBloodType.componentType}</div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compatibility <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.isCompatible}
                onChange={(e) => setFormData({...formData, isCompatible: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="true">Compatible</option>
                <option value="false">Not Compatible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Additional notes about this compatibility rule..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Update Rule
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ManageCompatibilityPage