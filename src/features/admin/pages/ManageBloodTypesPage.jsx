import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { Plus, Edit, Trash2, Heart } from 'lucide-react'

const ManageBloodTypesPage = () => {
  const queryClient = useQueryClient()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedBloodType, setSelectedBloodType] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // Fetch blood types
  const { data: bloodTypes = [], isLoading } = useQuery(
    'adminBloodTypes',
    async () => {
      const response = await api.get('/blood-types')
      return response.data
    }
  )

  // Create blood type mutation
  const createBloodTypeMutation = useMutation(
    async (bloodTypeData) => {
      const response = await api.post('/blood-types', bloodTypeData)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminBloodTypes')
        setShowCreateModal(false)
        toast.success('Blood type created successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create blood type')
      }
    }
  )

  // Update blood type mutation
  const updateBloodTypeMutation = useMutation(
    async ({ id, bloodTypeData }) => {
      const response = await api.put(`/blood-types/${id}`, bloodTypeData)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminBloodTypes')
        setShowEditModal(false)
        setSelectedBloodType(null)
        toast.success('Blood type updated successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update blood type')
      }
    }
  )

  // Delete blood type mutation
  const deleteBloodTypeMutation = useMutation(
    async (bloodTypeId) => {
      await api.delete(`/blood-types/${bloodTypeId}`)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminBloodTypes')
        toast.success('Blood type deleted successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete blood type')
      }
    }
  )

  const handleEdit = (bloodType) => {
    setSelectedBloodType(bloodType)
    setShowEditModal(true)
  }

  const handleDelete = (bloodType) => {
    if (window.confirm(`Are you sure you want to delete ${bloodType.bloodGroup} - ${bloodType.componentType}?`)) {
      deleteBloodTypeMutation.mutate(bloodType.id)
    }
  }

  const componentTypes = [
    'Whole Blood',
    'Red Blood Cells',
    'Plasma',
    'Platelets',
    'White Blood Cells'
  ]

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Blood Types</h1>
          <p className="text-gray-600">Configure blood types and components</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Blood Type
        </Button>
      </div>

      {/* Blood Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bloodTypes.map((bloodType) => (
          <Card key={bloodType.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 rounded-full p-2">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {bloodType.bloodGroup}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {bloodType.componentType}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(bloodType)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(bloodType)}
                  loading={deleteBloodTypeMutation.isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <strong>Description:</strong> {bloodType.description}
              </div>
              <div>
                <strong>Shelf Life:</strong> {bloodType.shelfLifeDays} days
              </div>
              <div>
                <strong>Created:</strong> {new Date(bloodType.createdAt).toLocaleDateString()}
              </div>
            </div>
          </Card>
        ))}

        {bloodTypes.length === 0 && (
          <div className="col-span-full">
            <Card className="p-12 text-center">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No blood types configured</h3>
              <p className="text-gray-600 mb-6">
                Start by adding blood types and components to the system
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Blood Type
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Create Blood Type Modal */}
      {showCreateModal && (
        <CreateBloodTypeModal
          componentTypes={componentTypes}
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => createBloodTypeMutation.mutate(data)}
          loading={createBloodTypeMutation.isLoading}
        />
      )}

      {/* Edit Blood Type Modal */}
      {showEditModal && selectedBloodType && (
        <EditBloodTypeModal
          bloodType={selectedBloodType}
          componentTypes={componentTypes}
          onClose={() => {
            setShowEditModal(false)
            setSelectedBloodType(null)
          }}
          onSubmit={(data) => updateBloodTypeMutation.mutate({ id: selectedBloodType.id, bloodTypeData: data })}
          loading={updateBloodTypeMutation.isLoading}
        />
      )}
    </div>
  )
}

// Create Blood Type Modal Component
const CreateBloodTypeModal = ({ componentTypes, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    bloodGroup: '',
    componentType: '',
    description: '',
    shelfLifeDays: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      shelfLifeDays: parseInt(formData.shelfLifeDays)
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Create Blood Type</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Blood Group"
              required
              placeholder="e.g., A+, B-, O+, AB-"
              value={formData.bloodGroup}
              onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Component Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.componentType}
                onChange={(e) => setFormData({...formData, componentType: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select component type</option>
                {componentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Description"
              placeholder="Brief description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />

            <Input
              label="Shelf Life (Days)"
              type="number"
              required
              placeholder="e.g., 42"
              value={formData.shelfLifeDays}
              onChange={(e) => setFormData({...formData, shelfLifeDays: e.target.value})}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Create Blood Type
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Edit Blood Type Modal Component
const EditBloodTypeModal = ({ bloodType, componentTypes, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    description: bloodType.description || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Edit Blood Type - {bloodType.bloodGroup} {bloodType.componentType}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">
                <div><strong>Blood Group:</strong> {bloodType.bloodGroup}</div>
                <div><strong>Component:</strong> {bloodType.componentType}</div>
                <div><strong>Shelf Life:</strong> {bloodType.shelfLifeDays} days</div>
              </div>
            </div>

            <Input
              label="Description"
              placeholder="Brief description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Update Blood Type
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ManageBloodTypesPage