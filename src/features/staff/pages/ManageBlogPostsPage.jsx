import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { FileText, Calendar, User, CheckCircle, Eye } from 'lucide-react'

const ManageBlogPostsPage = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const pageSize = 10

  // Fetch pending blog posts
  const { data: blogData, isLoading } = useQuery(
    ['pendingBlogPosts', page],
    async () => {
      const response = await api.get(`/blog-posts/pending?page=${page}&size=${pageSize}`)
      return response.data
    },
    {
      keepPreviousData: true
    }
  )

  // Approve blog post mutation
  const approveMutation = useMutation(
    async (postId) => {
      const response = await api.put(`/blog-posts/${postId}/approve`)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pendingBlogPosts')
        toast.success('Blog post approved and published!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to approve blog post')
      }
    }
  )

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const posts = blogData?.content || []
  const totalPages = blogData?.totalPages || 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Blog Posts</h1>
        <p className="text-gray-600">Review and approve pending blog posts</p>
      </div>

      {posts.length > 0 ? (
        <>
          <div className="space-y-6 mb-8">
            {posts.map((post) => (
              <Card key={post.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h3>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{post.author?.fullName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {post.content.substring(0, 300)}...
                    </p>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/blogs/${post.id}`} className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Link>
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={() => approveMutation.mutate(post.id)}
                        loading={approveMutation.isLoading}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve & Publish
                      </Button>
                    </div>
                  </div>

                  <div className="ml-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      Pending Review
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-600">
                    <strong>Author Email:</strong> {post.author?.email}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
              >
                Previous
              </Button>
              
              <span className="flex items-center px-4 py-2 text-sm text-gray-700">
                Page {page + 1} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="p-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No pending blog posts</h3>
          <p className="text-gray-600">
            All blog posts have been reviewed and approved
          </p>
        </Card>
      )}
    </div>
  )
}

export default ManageBlogPostsPage