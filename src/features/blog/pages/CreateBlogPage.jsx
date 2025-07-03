import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Card from '../../../components/ui/Card'
import { ArrowLeft } from 'lucide-react'

const CreateBlogPage = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const createPostMutation = useMutation(
    async (data) => {
      const response = await api.post('/blog-posts', data)
      return response.data
    },
    {
      onSuccess: () => {
        toast.success('Blog post created successfully!')
        navigate('/my-blogs')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create blog post')
      }
    }
  )

  const onSubmit = (data) => {
    createPostMutation.mutate(data)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Blog Post</h1>
          <p className="text-gray-600">
            Share your story and help inspire others in the blood donation community
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Title"
              required
              placeholder="Enter a compelling title for your post"
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 5,
                  message: 'Title must be at least 5 characters'
                },
                maxLength: {
                  value: 255,
                  message: 'Title must not exceed 255 characters'
                }
              })}
              error={errors.title?.message}
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('content', {
                  required: 'Content is required',
                  minLength: {
                    value: 50,
                    message: 'Content must be at least 50 characters'
                  }
                })}
                rows={15}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Write your blog post content here..."
              />
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Your post will be reviewed by our staff before being published. 
                    Admin and Staff posts are published immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/my-blogs')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={createPostMutation.isLoading}
              >
                Create Post
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default CreateBlogPage