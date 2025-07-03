import { useQuery } from 'react-query'
import api from '../../../lib/api'
import Card from '../../../components/ui/Card'
import { Calendar, MapPin, Clock, User } from 'lucide-react'

const AppointmentsPage = () => {
  // Fetch user's appointments
  const { data: appointments = [], isLoading } = useQuery(
    'myAppointments',
    async () => {
      const response = await api.get('/appointments/my-appointments')
      return response.data
    }
  )

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
        <p className="text-gray-600">View and manage your donation appointments</p>
      </div>

      {appointments.length > 0 ? (
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Appointment #{appointment.id}
                    </h3>
                    <p className="text-gray-600">
                      Process ID: {appointment.processId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {new Date(appointment.appointmentDateTime).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(appointment.appointmentDateTime).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{appointment.location}</span>
                </div>

                {appointment.staff && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Staff: {appointment.staff.fullName}</span>
                  </div>
                )}
              </div>

              {appointment.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Notes:</strong> {appointment.notes}
                  </p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(appointment.appointmentDateTime) > new Date() 
                      ? 'Upcoming appointment' 
                      : 'Past appointment'
                    }
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments scheduled</h3>
          <p className="text-gray-600">
            Your donation appointments will appear here once scheduled by our staff
          </p>
        </Card>
      )}
    </div>
  )
}

export default AppointmentsPage