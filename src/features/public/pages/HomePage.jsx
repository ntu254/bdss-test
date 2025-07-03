import { Link } from 'react-router-dom'
import { Heart, Users, Calendar, Award } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'

const HomePage = () => {
  const stats = [
    { icon: Users, label: 'Active Donors', value: '1,234' },
    { icon: Heart, label: 'Lives Saved', value: '5,678' },
    { icon: Calendar, label: 'Donations This Month', value: '89' },
    { icon: Award, label: 'Years of Service', value: '15' },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Save Lives Through Blood Donation
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              Every drop counts. Join our community of heroes and make a difference today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/register">Become a Donor</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/blood-requests">Find Blood Requests</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6">
              <stat.icon className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform makes blood donation simple, safe, and efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Register as Donor</h3>
              <p className="text-gray-600">
                Sign up with your basic information and complete health verification
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Schedule Appointment</h3>
              <p className="text-gray-600">
                Book a convenient time slot at our medical facility
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Save Lives</h3>
              <p className="text-gray-600">
                Your donation helps save lives and supports emergency medical care
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-red-600 text-white text-center p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Join thousands of donors who are already saving lives
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">Start Your Journey</Link>
          </Button>
        </Card>
      </section>
    </div>
  )
}

export default HomePage