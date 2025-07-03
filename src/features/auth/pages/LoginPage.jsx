import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../../stores/authStore'
import api from '../../../lib/api'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Card from '../../../components/ui/Card'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const loginMutation = useMutation(
    async (data) => {
      const response = await api.post('/auth/login', data)
      return response.data
    },
    {
      onSuccess: (data) => {
        login(data, data.accessToken)
        toast.success('Login successful!')
        
        // Redirect based on role
        switch (data.role) {
          case 'Admin':
            navigate('/admin/dashboard')
            break
          case 'Staff':
            navigate('/staff/dashboard')
            break
          default:
            navigate('/dashboard')
        }
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Login failed')
      }
    }
  )

  const onSubmit = (data) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-red-600 hover:text-red-500">
            create a new account
          </Link>
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
              label="Password"
              type="password"
              required
              {...register('password', {
                required: 'Password is required'
              })}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              className="w-full"
              loading={loginMutation.isLoading}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to our platform?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50 border-gray-300"
              >
                Create an account
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage