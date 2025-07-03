import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Card from '../../../components/ui/Card'

const VerifyPage = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const verifyMutation = useMutation(
    async (data) => {
      const response = await api.post('/auth/register/verify', data)
      return response.data
    },
    {
      onSuccess: () => {
        toast.success('Account verified successfully! Please login.')
        navigate('/login')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Verification failed')
      }
    }
  )

  const resendMutation = useMutation(
    async (data) => {
      const response = await api.post('/auth/register/resend-otp', data)
      return response.data
    },
    {
      onSuccess: () => {
        toast.success('New verification code sent to your email!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to resend code')
      }
    }
  )

  const onSubmit = (data) => {
    verifyMutation.mutate(data)
  }

  const handleResend = (data) => {
    resendMutation.mutate({ email: data.email })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter the verification code sent to your email address
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email address"
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
              label="Verification Code"
              required
              placeholder="Enter 6-digit code"
              {...register('otp', {
                required: 'Verification code is required',
                pattern: {
                  value: /^\d{6}$/,
                  message: 'Code must be 6 digits'
                }
              })}
              error={errors.otp?.message}
            />

            <Button
              type="submit"
              className="w-full"
              loading={verifyMutation.isLoading}
            >
              Verify Account
            </Button>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <span className="text-sm text-gray-600">Didn't receive the code? </span>
              <button
                type="button"
                onClick={handleSubmit(handleResend)}
                disabled={resendMutation.isLoading}
                className="text-sm font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
              >
                {resendMutation.isLoading ? 'Sending...' : 'Resend'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default VerifyPage