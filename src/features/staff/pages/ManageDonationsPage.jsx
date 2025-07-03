import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { Heart, Calendar, User, CheckCircle, X, Clock } from 'lucide-react'

const ManageDonationsPage = () => {
  const queryClient = useQueryClient()
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [showHealthCheckModal, setShowHealthCheckModal] = useState(false)
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [showTestResultModal, setShowTestResultModal] = useState(false)

  // Fetch all donation requests
  const { data: donations = [], isLoading } = useQuery(
    'staffDonations',
    async () => {
      const response = await api.get('/staff/donations/requests')
      return response.data
    }
  )

  // Update donation status mutation
  const updateStatusMutation = useMutation(
    async ({ id, newStatus, note }) => {
      const response = await api.put(`/staff/donations/requests/${id}/status`, {
        newStatus,
        note
      })
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('staffDonations')
        toast.success('Donation status updated successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update status')
      }
    }
  )

  // Health check mutation
  const healthCheckMutation = useMutation(
    async ({ processId, healthData }) => {
      const response = await api.post(`/staff/donations/${processId}/health-check`, healthData)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('staffDonations')
        setShowHealthCheckModal(false)
        setSelectedDonation(null)
        toast.success('Health check recorded successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to record health check')
      }
    }
  )

  // Collection mutation
  const collectionMutation = useMutation(
    async ({ processId, collectionData }) => {
      const response = await api.post(`/staff/donations/${processId}/collect`, collectionData)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('staffDonations')
        setShowCollectionModal(false)
        setSelectedDonation(null)
        toast.success('Blood collection recorded successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to record collection')
      }
    }
  )

  // Test result mutation
  const testResultMutation = useMutation(
    async ({ processId, testData }) => {
      const response = await api.post(`/staff/donations/${processId}/test-result`, testData)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('staffDonations')
        setShowTestResultModal(false)
        setSelectedDonation(null)
        toast.success('Test result recorded successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to record test result')
      }
    }
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return 'bg-yellow-100 text-yellow-800'
      case 'APPOINTMENT_SCHEDULED':
        return 'bg-blue-100 text-blue-800'
      case 'HEALTH_CHECK_PASSED':
        return 'bg-green-100 text-green-800'
      case 'BLOOD_COLLECTED':
        return 'bg-purple-100 text-purple-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleApprove = (donation) => {
    updateStatusMutation.mutate({
      id: donation.id,
      newStatus: 'APPOINTMENT_PENDING',
      note: 'Approved for donation'
    })
  }

  const handleReject = (donation) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (reason) {
      updateStatusMutation.mutate({
        id: donation.id,
        newStatus: 'REJECTED',
        note: reason
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Donations</h1>
        <p className="text-gray-600">Review and process donation requests</p>
      </div>

      <div className="space-y-6">
        {donations.map((donation) => (
          <Card key={donation.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 rounded-full p-2">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {donation.donor?.fullName}
                  </h3>
                  <p className="text-gray-600">
                    Donation #{donation.id} • {new Date(donation.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(donation.status)}`}>
                {donation.status.replace(/_/g, ' ').toLowerCase()}
              </span>
            </div>

            {donation.note && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{donation.note}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-4 w-4" />
                <span className="text-sm">{donation.donor?.email}</span>
              </div>
              
              {donation.appointment && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {new Date(donation.appointment.appointmentDateTime).toLocaleDateString()}
                  </span>
                </div>
              )}

              {donation.collectedVolumeMl && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">
                    {donation.collectedVolumeMl}ml collected
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons based on status */}
            <div className="flex flex-wrap gap-2">
              {donation.status === 'PENDING_APPROVAL' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(donation)}
                    loading={updateStatusMutation.isLoading}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleReject(donation)}
                    loading={updateStatusMutation.isLoading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </>
              )}

              {donation.status === 'APPOINTMENT_SCHEDULED' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedDonation(donation)
                    setShowHealthCheckModal(true)
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Record Health Check
                </Button>
              )}

              {donation.status === 'HEALTH_CHECK_PASSED' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedDonation(donation)
                    setShowCollectionModal(true)
                  }}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Record Collection
                </Button>
              )}

              {donation.status === 'BLOOD_COLLECTED' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedDonation(donation)
                    setShowTestResultModal(true)
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Record Test Result
                </Button>
              )}
            </div>
          </Card>
        ))}

        {donations.length === 0 && (
          <Card className="p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No donation requests</h3>
            <p className="text-gray-600">
              All donation requests have been processed
            </p>
          </Card>
        )}
      </div>

      {/* Health Check Modal */}
      {showHealthCheckModal && selectedDonation && (
        <HealthCheckModal
          donation={selectedDonation}
          onClose={() => {
            setShowHealthCheckModal(false)
            setSelectedDonation(null)
          }}
          onSubmit={(data) => {
            healthCheckMutation.mutate({
              processId: selectedDonation.id,
              healthData: data
            })
          }}
          loading={healthCheckMutation.isLoading}
        />
      )}

      {/* Collection Modal */}
      {showCollectionModal && selectedDonation && (
        <CollectionModal
          donation={selectedDonation}
          onClose={() => {
            setShowCollectionModal(false)
            setSelectedDonation(null)
          }}
          onSubmit={(data) => {
            collectionMutation.mutate({
              processId: selectedDonation.id,
              collectionData: data
            })
          }}
          loading={collectionMutation.isLoading}
        />
      )}

      {/* Test Result Modal */}
      {showTestResultModal && selectedDonation && (
        <TestResultModal
          donation={selectedDonation}
          onClose={() => {
            setShowTestResultModal(false)
            setSelectedDonation(null)
          }}
          onSubmit={(data) => {
            testResultMutation.mutate({
              processId: selectedDonation.id,
              testData: data
            })
          }}
          loading={testResultMutation.isLoading}
        />
      )}
    </div>
  )
}

// Health Check Modal Component
const HealthCheckModal = ({ donation, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    isEligible: true,
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    hemoglobinLevel: '',
    weight: '',
    heartRate: '',
    temperature: '',
    notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      isEligible: formData.isEligible === 'true',
      bloodPressureSystolic: parseInt(formData.bloodPressureSystolic),
      bloodPressureDiastolic: parseInt(formData.bloodPressureDiastolic),
      hemoglobinLevel: parseFloat(formData.hemoglobinLevel),
      weight: parseFloat(formData.weight),
      heartRate: parseInt(formData.heartRate),
      temperature: parseFloat(formData.temperature)
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Health Check - {donation.donor?.fullName}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Systolic BP (mmHg)"
                type="number"
                required
                value={formData.bloodPressureSystolic}
                onChange={(e) => setFormData({...formData, bloodPressureSystolic: e.target.value})}
              />
              <Input
                label="Diastolic BP (mmHg)"
                type="number"
                required
                value={formData.bloodPressureDiastolic}
                onChange={(e) => setFormData({...formData, bloodPressureDiastolic: e.target.value})}
              />
              <Input
                label="Hemoglobin (g/dL)"
                type="number"
                step="0.1"
                required
                value={formData.hemoglobinLevel}
                onChange={(e) => setFormData({...formData, hemoglobinLevel: e.target.value})}
              />
              <Input
                label="Weight (kg)"
                type="number"
                step="0.1"
                required
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
              />
              <Input
                label="Heart Rate (bpm)"
                type="number"
                required
                value={formData.heartRate}
                onChange={(e) => setFormData({...formData, heartRate: e.target.value})}
              />
              <Input
                label="Temperature (°C)"
                type="number"
                step="0.1"
                required
                value={formData.temperature}
                onChange={(e) => setFormData({...formData, temperature: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Eligibility Result
              </label>
              <select
                value={formData.isEligible}
                onChange={(e) => setFormData({...formData, isEligible: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="true">Eligible</option>
                <option value="false">Not Eligible</option>
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
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Record Health Check
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Collection Modal Component
const CollectionModal = ({ donation, onClose, onSubmit, loading }) => {
  const [volume, setVolume] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      collectedVolumeMl: parseInt(volume)
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Record Blood Collection - {donation.donor?.fullName}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Collected Volume (ml)"
              type="number"
              required
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder="e.g., 450"
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Record Collection
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Test Result Modal Component
const TestResultModal = ({ donation, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    bloodUnitId: '',
    isSafe: true,
    notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      isSafe: formData.isSafe === 'true'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Record Test Result - {donation.donor?.fullName}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Blood Unit ID"
              required
              value={formData.bloodUnitId}
              onChange={(e) => setFormData({...formData, bloodUnitId: e.target.value})}
              placeholder="e.g., BU-2025-001"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Result
              </label>
              <select
                value={formData.isSafe}
                onChange={(e) => setFormData({...formData, isSafe: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="true">Safe for Use</option>
                <option value="false">Not Safe for Use</option>
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
                placeholder="Additional notes about the test results..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Record Test Result
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ManageDonationsPage