import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Card from '../../../components/ui/Card'
import { ArrowLeft, Trash2 } from 'lucide-react'

const EditBlogPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  // Fetch blog post details
  const { data: post, isLoading } = useQuery(
    ['blog', id],
    async () => {
      const response = await api.get(`/blog-posts/${id}`)
      return response.data
    },
    {
      onSuccess: (data) => {
        reset(data)
      }
    }
  )

  const updatePostMutation = useMutation(
    async (data) => {
      const response = await api.put(`/blog-posts/${id}`, data)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['blog', id])
        queryClient.invalidateQueries('myBlogs')
        toast.success('Blog post updated successfully!')
        navigate('/my-blogs')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update blog post')
      }
    }
  )

  const deletePostMutation = useMutation(
    async () => {
      await api.delete(`/blog-posts/${id}`)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('myBlogs')
        toast.success('Blog post deleted successfully!')
        navigate('/my-blogs')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete blog post')
      }
    }
  )

  const onSubmit = (data) => {
    updatePostMutation.mutate(data)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      deletePostMutation.mutate()
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Blog Post</h1>
          <p className="text-gray-600">
            Update your blog post content and settings
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

            {post?.status && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.status === 'PUBLISHED' 
                      ? 'bg-green-100 text-green-800'
                      : post.status === 'PENDING_APPROVAL'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {post.status.replace('_', ' ').toLowerCase()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                loading={deletePostMutation.isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Post
              </Button>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/my-blogs')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={updatePostMutation.isLoading}
                >
                  Update Post
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default EditBlogPage