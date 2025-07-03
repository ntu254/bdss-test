import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../../stores/authStore'
import api from '../../../lib/api'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Card from '../../../components/ui/Card'
import { User, Upload, Camera } from 'lucide-react'

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('profile')
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  // Fetch blood types
  const { data: bloodTypes = [] } = useQuery(
    'bloodTypes',
    async () => {
      const response = await api.get('/blood-types')
      return response.data
    }
  )

  // Fetch current user profile
  const { data: profile, isLoading } = useQuery(
    'userProfile',
    async () => {
      const response = await api.get('/users/me/profile')
      return response.data
    },
    {
      onSuccess: (data) => {
        reset(data)
      }
    }
  )

  const updateProfileMutation = useMutation(
    async (data) => {
      const response = await api.put('/users/me/profile', data)
      return response.data
    },
    {
      onSuccess: (data) => {
        updateUser(data)
        queryClient.invalidateQueries('userProfile')
        toast.success('Profile updated successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update profile')
      }
    }
  )

  const uploadIdCardMutation = useMutation(
    async (formData) => {
      const response = await api.post('/users/me/upload-id-card', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userProfile')
        toast.success('ID card uploaded and verified successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to upload ID card')
      }
    }
  )

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      bloodTypeId: data.bloodTypeId ? parseInt(data.bloodTypeId) : null,
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
      dateOfBirth: data.dateOfBirth || null,
      lastDonationDate: data.lastDonationDate || null,
    }
    updateProfileMutation.mutate(formattedData)
  }

  const handleIdCardUpload = (event) => {
    const frontImage = event.target.files[0]
    const backImage = event.target.files[1]

    if (!frontImage || !backImage) {
      toast.error('Please select both front and back images of your ID card')
      return
    }

    const formData = new FormData()
    formData.append('frontImage', frontImage)
    formData.append('backImage', backImage)

    uploadIdCardMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User className="h-4 w-4 inline mr-2" />
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'verification'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Camera className="h-4 w-4 inline mr-2" />
            ID Verification
          </button>
        </nav>
      </div>

      {activeTab === 'profile' && (
        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                required
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: {
                    value: 3,
                    message: 'Full name must be at least 3 characters'
                  }
                })}
                error={errors.fullName?.message}
              />

              <Input
                label="Phone Number"
                {...register('phone')}
                error={errors.phone?.message}
              />

              <Input
                label="Date of Birth"
                type="date"
                {...register('dateOfBirth')}
                error={errors.dateOfBirth?.message}
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  {...register('gender')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Blood Type
                </label>
                <select
                  {...register('bloodTypeId')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select blood type</option>
                  {bloodTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.bloodGroup} - {type.componentType}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Emergency Contact"
                {...register('emergencyContact')}
                error={errors.emergencyContact?.message}
              />
            </div>

            <Input
              label="Address"
              {...register('address')}
              error={errors.address?.message}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Latitude"
                type="number"
                step="any"
                {...register('latitude')}
                error={errors.latitude?.message}
              />

              <Input
                label="Longitude"
                type="number"
                step="any"
                {...register('longitude')}
                error={errors.longitude?.message}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Medical Conditions
              </label>
              <textarea
                {...register('medicalConditions')}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Any medical conditions or allergies..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Last Donation Date"
                type="date"
                {...register('lastDonationDate')}
                error={errors.lastDonationDate?.message}
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Ready to Donate
                </label>
                <select
                  {...register('isReadyToDonate')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                loading={updateProfileMutation.isLoading}
              >
                Update Profile
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'verification' && (
        <Card className="p-8">
          <div className="text-center mb-8">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ID Card Verification
            </h3>
            <p className="text-gray-600">
              Upload both sides of your ID card for verification
            </p>
          </div>

          {profile?.idCardVerified ? (
            <div className="text-center py-8">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-green-900 mb-2">
                ID Card Verified
              </h3>
              <p className="text-green-600">
                Your ID card has been successfully verified
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-sm text-gray-600 mb-4">
                    <label htmlFor="id-card-upload" className="cursor-pointer">
                      <span className="font-medium text-red-600 hover:text-red-500">
                        Click to upload
                      </span>
                      <span> both sides of your ID card</span>
                    </label>
                    <input
                      id="id-card-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="sr-only"
                      onChange={handleIdCardUpload}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB each
                  </p>
                </div>
              </div>

              {uploadIdCardMutation.isLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">
                    Uploading and verifying your ID card...
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

export default ProfilePage