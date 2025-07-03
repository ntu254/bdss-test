import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../../stores/authStore'
import api from '../../../lib/api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { Heart, MapPin, Clock, Users, AlertTriangle } from 'lucide-react'

const BloodRequestsPage = () => {
  const { isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()

  // Fetch active blood requests
  const { data: bloodRequests = [], isLoading } = useQuery(
    'activeBloodRequests',
    async () => {
      const response = await api.get('/blood-requests/search/active')
      return response.data
    }
  )

  const pledgeMutation = useMutation(
    async (requestId) => {
      const response = await api.post(`/blood-requests/${requestId}/pledge`)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('activeBloodRequests')
        toast.success('Thank you for pledging to donate! We will contact you soon.')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to pledge for donation')
      }
    }
  )

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'URGENT':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'NORMAL':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return <AlertTriangle className="h-4 w-4" />
      case 'URGENT':
        return <Clock className="h-4 w-4" />
      default:
        return <Heart className="h-4 w-4" />
    }
  }

  const handlePledge = (requestId) => {
    if (!isAuthenticated) {
      toast.error('Please login to pledge for blood donation')
      return
    }
    pledgeMutation.mutate(requestId)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Blood Requests</h1>
        <p className="text-gray-600">
          Help save lives by responding to urgent blood donation requests
        </p>
      </div>

      {bloodRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bloodRequests.map((request) => (
            <Card key={request.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <Card.Content className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-red-100 rounded-full p-2">
                      <Heart className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.bloodType.bloodGroup}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {request.bloodType.componentType}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                    {getUrgencyIcon(request.urgency)}
                    <span>{request.urgency}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Patient: {request.patientName}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{request.hospital}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">Needed: {request.quantityInUnits} units</span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      Posted: {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Pledges received:</span>
                    <span className="font-medium">{request.pledgeCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((request.pledgeCount / (request.quantityInUnits + 1)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => handlePledge(request.id)}
                  loading={pledgeMutation.isLoading}
                  disabled={!isAuthenticated}
                >
                  {isAuthenticated ? 'Pledge to Donate' : 'Login to Pledge'}
                </Button>

                {request.createdBy && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Requested by: {request.createdBy.fullName}
                    </p>
                  </div>
                )}
              </Card.Content>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No active blood requests</h3>
          <p className="text-gray-600">
            There are currently no urgent blood requests. Check back later or consider becoming a regular donor.
          </p>
        </Card>
      )}
    </div>
  )
}

export default BloodRequestsPage