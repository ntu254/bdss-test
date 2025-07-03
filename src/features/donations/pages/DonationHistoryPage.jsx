import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import { Heart, Calendar, Clock, CheckCircle, Plus } from 'lucide-react'

const DonationHistoryPage = () => {
  const queryClient = useQueryClient()

  // Fetch donation history
  const { data: donations = [], isLoading } = useQuery(
    'myDonations',
    async () => {
      const response = await api.get('/donations/my-history')
      return response.data
    }
  )

  // Create donation request mutation
  const createDonationMutation = useMutation(
    async () => {
      const response = await api.post('/donations/request')
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('myDonations')
        toast.success('Donation request submitted successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit donation request')
      }
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
      case 'REJECTED':
        return 'text-red-600 bg-red-100'
      case 'HEALTH_CHECK_FAILED':
        return 'text-red-600 bg-red-100'
      case 'TESTING_FAILED':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const handleCreateDonation = () => {
    createDonationMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Donation History</h1>
          <p className="text-gray-600">Track your donation journey and impact</p>
        </div>
        <Button onClick={handleCreateDonation} loading={createDonationMutation.isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Request to Donate
        </Button>
      </div>

      {donations.length > 0 ? (
        <div className="space-y-6">
          {donations.map((donation) => (
            <Card key={donation.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 rounded-full p-2">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Donation #{donation.id}</h3>
                    <p className="text-gray-600">
                      Submitted on {new Date(donation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(donation.status)}`}>
                  {formatStatus(donation.status)}
                </span>
              </div>

              {donation.note && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{donation.note}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Appointment Info */}
                {donation.appointment && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <div>
                        {new Date(donation.appointment.appointmentDateTime).toLocaleDateString()}
                      </div>
                      <div className="text-xs">
                        {new Date(donation.appointment.appointmentDateTime).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Health Check Info */}
                {donation.healthCheck && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className={`h-4 w-4 ${donation.healthCheck.isEligible ? 'text-green-600' : 'text-red-600'}`} />
                    <div>
                      <div>Health Check: {donation.healthCheck.isEligible ? 'Passed' : 'Failed'}</div>
                      {donation.healthCheck.weight && (
                        <div className="text-xs">Weight: {donation.healthCheck.weight}kg</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Collection Info */}
                {donation.collectedVolumeMl && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Heart className="h-4 w-4 text-red-600" />
                    <div>
                      <div>Collected: {donation.collectedVolumeMl}ml</div>
                      <div className="text-xs">Blood volume</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Appointment Location */}
              {donation.appointment?.location && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <strong>Location:</strong> {donation.appointment.location}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No donations yet</h3>
          <p className="text-gray-600 mb-6">
            Start your journey as a blood donor and help save lives
          </p>
          <Button onClick={handleCreateDonation} loading={createDonationMutation.isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Request to Donate
          </Button>
        </Card>
      )}
    </div>
  )
}

export default DonationHistoryPage