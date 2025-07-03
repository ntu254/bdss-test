import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import api from '../../../lib/api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { Calendar, User, ArrowLeft } from 'lucide-react'

const BlogDetailPage = () => {
  const { id } = useParams()

  // Fetch blog post details
  const { data: post, isLoading, error } = useQuery(
    ['blog', id],
    async () => {
      const response = await api.get(`/blog-posts/${id}`)
      return response.data
    }
  )

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
          <p className="text-gray-600 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/blogs">Back to Blog</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link to="/blogs" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </Button>
      </div>

      <article className="max-w-4xl mx-auto">
        <Card className="p-8">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{post.author?.fullName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {post.status && post.status !== 'PUBLISHED' && (
              <div className="mt-4">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  post.status === 'PENDING_APPROVAL' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {post.status.replace('_', ' ').toLowerCase()}
                </span>
              </div>
            )}
          </header>

          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {post.updatedAt !== post.createdAt && (
            <footer className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated: {new Date(post.updatedAt).toLocaleDateString()}
              </p>
            </footer>
          )}
        </Card>
      </article>
    </div>
  )
}

export default BlogDetailPage