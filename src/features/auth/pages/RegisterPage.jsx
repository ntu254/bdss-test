import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Card from '../../../components/ui/Card'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  // Fetch blood types
  const { data: bloodTypes = [] } = useQuery(
    'bloodTypes',
    async () => {
      const response = await api.get('/blood-types')
      return response.data
    }
  )

  const registerMutation = useMutation(
    async (data) => {
      const response = await api.post('/auth/register', data)
      return response.data
    },
    {
      onSuccess: () => {
        toast.success('Registration request sent! Please check your email for verification code.')
        navigate('/verify')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Registration failed')
      }
    }
  )

  const onSubmit = (data) => {
    // Convert date to proper format
    const formattedData = {
      ...data,
      bloodTypeId: data.bloodTypeId ? parseInt(data.bloodTypeId) : null,
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
    }
    registerMutation.mutate(formattedData)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
              Sign in
            </Link>
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                label="Email"
                type="email"
                required
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email?.message}
              />

              <Input
                label="Password"
                type="password"
                required
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                error={errors.password?.message}
              />

              <Input
                label="Phone Number"
                required
                {...register('phone', {
                  required: 'Phone number is required',
                  minLength: {
                    value: 9,
                    message: 'Phone number must be at least 9 characters'
                  }
                })}
                error={errors.phone?.message}
              />

              <Input
                label="Date of Birth"
                type="date"
                required
                {...register('dateOfBirth', {
                  required: 'Date of birth is required'
                })}
                error={errors.dateOfBirth?.message}
              />

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
            </div>

            <Input
              label="Address"
              required
              {...register('address', {
                required: 'Address is required',
                minLength: {
                  value: 10,
                  message: 'Address must be at least 10 characters'
                }
              })}
              error={errors.address?.message}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Latitude (Optional)"
                type="number"
                step="any"
                {...register('latitude')}
                error={errors.latitude?.message}
              />

              <Input
                label="Longitude (Optional)"
                type="number"
                step="any"
                {...register('longitude')}
                error={errors.longitude?.message}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={registerMutation.isLoading}
            >
              Create Account
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default RegisterPage