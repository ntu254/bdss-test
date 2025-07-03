import React from 'react';
import { Heart, Users, MapPin, Shield, ArrowRight, Droplet, Calendar, Phone, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/common/Button';
import PageContainer from '../components/layout/PageContainer';

const HomePage = () => {
  const features = [
    {
      icon: Heart,
      title: "Hiến máu dễ dàng",
      description: "Đăng ký và đặt lịch hiến máu chỉ với vài thao tác đơn giản.",
      color: "text-red-500"
    },
    {
      icon: Users,
      title: "Cộng đồng lớn mạnh",
      description: "Kết nối với hàng ngàn người hiến máu tình nguyện trên cả nước.",
      color: "text-blue-500"
    },
    {
      icon: MapPin,
      title: "Tìm kiếm nhanh chóng",
      description: "Dễ dàng tìm kiếm các địa điểm hiến máu hoặc người cần máu gần bạn.",
      color: "text-green-500"
    },
    {
      icon: Shield,
      title: "An toàn & Bảo mật",
      description: "Thông tin cá nhân của bạn được bảo vệ và bảo mật tuyệt đối.",
      color: "text-purple-500"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Người hiến máu", icon: Users },
    { number: "5,000+", label: "Lượt hiến máu thành công", icon: Droplet },
    { number: "50+", label: "Bệnh viện & Đối tác", icon: Heart }
  ];

  const testimonials = [
    {
      name: "Nguyễn Văn An",
      role: "Người hiến máu tình nguyện",
      content: "BloodConnect đã giúp tôi dễ dàng tìm được những người cần máu gần nhà. Cảm giác được giúp đỡ người khác thật tuyệt vời!",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Trần Thị Bình",
      role: "Bác sĩ tại BV Chợ Rẫy",
      content: "Hệ thống này đã giúp chúng tôi kết nối nhanh chóng với những người hiến máu khi cần thiết. Rất hữu ích cho công việc cứu chữa bệnh nhân.",
      avatar: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Lê Minh Châu",
      role: "Người nhận máu",
      content: "Nhờ có BloodConnect, gia đình tôi đã tìm được máu kịp thời cho ca phẫu thuật khẩn cấp. Cảm ơn tất cả những người hiến máu tình nguyện!",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-pink-600/5"></div>
          <PageContainer className="relative section-padding">
            <div className="text-center animate-fade-in-up">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6 animate-bounce-gentle">
                  <Droplet className="w-10 h-10 text-red-600" />
                </div>
              </div>
              
              <h1 className="heading-1 mb-6">
                Kết nối yêu thương, <br />
                <span className="text-red-600 relative">
                  Chia sẻ sự sống
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-red-200 rounded-full"></div>
                </span>
              </h1>
              
              <p className="text-body-large mb-10 max-w-3xl mx-auto">
                BloodConnect là nền tảng kết nối người hiến máu tình nguyện với những người đang cần máu,
                góp phần lan tỏa giá trị nhân ái và mang lại hy vọng cho cộng đồng.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="btn-primary group">
                    Tham gia ngay
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/blood-compatibility">
                  <Button variant="outline" size="lg">
                    Tìm hiểu thêm
                  </Button>
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* Features Section */}
        <section className="section-padding bg-gray-50">
          <PageContainer>
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="heading-2 mb-4">
                Tại sao chọn BloodConnect?
              </h2>
              <p className="text-body-large max-w-2xl mx-auto">
                Chúng tôi cung cấp một nền tảng an toàn, minh bạch và tiện lợi để kết nối cộng đồng hiến máu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={feature.title} hover className="text-center group animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-50 group-hover:bg-red-50 transition-colors ${feature.color}`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Stats Section */}
        <section className="section-padding bg-red-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/20 to-pink-600/20"></div>
          <PageContainer className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={stat.label} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="mb-4">
                    <stat.icon className="w-12 h-12 mx-auto mb-2 text-red-200" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold mb-2 animate-pulse-soft">{stat.stat}</div>
                  <div className="text-red-100 text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Testimonials Section */}
        <section className="section-padding">
          <PageContainer>
            <div className="text-center mb-16">
              <h2 className="heading-2 mb-4">
                Câu chuyện từ cộng đồng
              </h2>
              <p className="text-body-large max-w-2xl mx-auto">
                Những chia sẻ chân thực từ những người đã tham gia vào hành trình lan tỏa yêu thương.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={testimonial.name} hover className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Quick Actions Section */}
        <section className="section-padding bg-gray-50">
          <PageContainer>
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">
                Bắt đầu ngay hôm nay
              </h2>
              <p className="text-body-large max-w-2xl mx-auto">
                Chọn hành động phù hợp với bạn để tham gia vào cộng đồng hiến máu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card hover className="text-center group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                    <Calendar className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Đặt lịch hiến máu</h3>
                  <p className="text-gray-600 mb-6">Chọn thời gian và địa điểm phù hợp để hiến máu</p>
                  <Link to="/request-donation">
                    <Button variant="outline" className="w-full">
                      Đặt lịch ngay
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card hover className="text-center group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Heart className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Tìm người cần máu</h3>
                  <p className="text-gray-600 mb-6">Xem các yêu cầu máu khẩn cấp trong khu vực</p>
                  <Link to="/blood-requests">
                    <Button variant="outline" className="w-full">
                      Xem yêu cầu
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card hover className="text-center group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <Phone className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Liên hệ hỗ trợ</h3>
                  <p className="text-gray-600 mb-6">Cần hỗ trợ? Chúng tôi luôn sẵn sàng giúp đỡ bạn</p>
                  <Button variant="outline" className="w-full">
                    Liên hệ ngay
                  </Button>
                </CardContent>
              </Card>
            </div>
          </PageContainer>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-r from-red-600 to-pink-600 text-white">
          <PageContainer>
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-5">
                Sẵn sàng sẻ chia giọt máu, cứu sống một cuộc đời?
              </h2>
              <p className="text-red-100 mb-10 text-lg max-w-3xl mx-auto">
                Tham gia cộng đồng BloodConnect ngay hôm nay và trở thành một phần của những điều kỳ diệu,
                mang lại hy vọng và sự sống cho những người cần giúp đỡ.
              </p>
              <Link to="/register">
                <Button size="lg" className="bg-red-600 text-red-600 hover:bg-gray-100 font-semibold group">
                  Đăng ký hiến máu
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </PageContainer>
        </section>
      </main>
    </div>
  );
};

export default HomePage;