import { Link } from 'react-router-dom';
import { 
  MapPin, 
  BarChart3, 
  Shield, 
  Smartphone, 
  Monitor, 
  Battery, 
  Tablet, 
  Printer, 
  Tv, 
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const wasteTypes = [
    { name: 'Smartphones', icon: Smartphone, color: 'bg-blue-100 text-blue-600' },
    { name: 'Computers', icon: Monitor, color: 'bg-purple-100 text-purple-600' },
    { name: 'Batteries', icon: Battery, color: 'bg-green-100 text-green-600' },
    { name: 'Tablets', icon: Tablet, color: 'bg-indigo-100 text-indigo-600' },
    { name: 'Printers', icon: Printer, color: 'bg-gray-100 text-gray-600' },
    { name: 'TVs', icon: Tv, color: 'bg-red-100 text-red-600' },
  ];

  const features = [
    {
      title: 'Find Nearby Centers',
      description: 'Locate certified recycling centers in your area with real-time availability',
      icon: MapPin
    },
    {
      title: 'Track Your Impact',
      description: 'Monitor your environmental contribution with detailed analytics and progress tracking.',
      icon: BarChart3
    },
    {
      title: 'Secure & Certified',
      description: 'All centers are verified and certified to ensure safe and proper e-waste disposal.',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-32 left-20 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-40 left-16 w-3 h-3 bg-white rounded-full"></div>
          <div className="absolute top-60 right-20 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-80 right-32 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-96 right-16 w-3 h-3 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute bottom-40 left-1/3 w-1 h-1 bg-white rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                <span className="text-sm font-medium">🌱 Join the Green Revolution</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-emerald-200 via-green-100 to-teal-200 bg-clip-text text-transparent animate-pulse">
                E-Waste Into Impact
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-green-50 leading-relaxed max-w-3xl mx-auto">
              Discover nearby recycling centers, track your environmental contribution, 
              and join the movement towards a sustainable digital future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/register"
                className="group relative px-8 py-4 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                to="/search"
                className="group relative px-8 py-4 border-2 border-white/80 text-white rounded-xl font-semibold hover:bg-white/10 backdrop-blur-sm transition-all duration-300 flex items-center justify-center space-x-3 hover:border-white"
              >
                <span>Find Centers</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-8 text-green-100 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <span>Real-time tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse delay-300"></div>
                <span>Certified centers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse delay-700"></div>
                <span>Environmental impact</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Smooth transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-50 via-green-50/50 to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gradient-to-b from-emerald-50 via-green-50/30 to-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-1/4 w-1 h-1 bg-green-600 rounded-full"></div>
          <div className="absolute top-20 right-1/3 w-2 h-2 bg-emerald-500 rounded-full"></div>
          <div className="absolute top-40 left-1/2 w-1 h-1 bg-teal-600 rounded-full"></div>
          <div className="absolute bottom-20 right-1/4 w-1 h-1 bg-green-500 rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Making a Real Impact
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of environmentally conscious individuals making a positive difference
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100/50">
                  <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">
                    50M+
                  </div>
                  <div className="text-gray-600 font-medium">Tons of E-waste Recycled</div>
                  <div className="mt-4 text-sm text-green-500">♻️ Saving our planet together</div>
                </div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100/50">
                  <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
                    10K+
                  </div>
                  <div className="text-gray-600 font-medium">Active Users</div>
                  <div className="mt-4 text-sm text-green-500">👥 Growing community</div>
                </div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100/50">
                  <div className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                    2,500+
                  </div>
                  <div className="text-gray-600 font-medium">Certified Centers</div>
                  <div className="mt-4 text-sm text-green-500">🏢 Nationwide network</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-gradient-to-b from-white to-gray-50/50">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-1/4 w-1 h-1 bg-green-600 rounded-full"></div>
          <div className="absolute top-20 right-1/3 w-2 h-2 bg-emerald-500 rounded-full"></div>
          <div className="absolute top-40 left-1/2 w-1 h-1 bg-teal-600 rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose EcoTracker?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make e-waste recycling simple, trackable, and impactful for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100/50">
                  <div className="bg-gradient-to-r from-emerald-100 to-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waste Types Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Can You Recycle?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We accept all types of electronic waste for proper recycling and environmental protection.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {wasteTypes.map((type, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${type.color}`}>
                  <type.icon className="h-8 w-8" />
                </div>
                <span className="text-gray-800 font-medium">{type.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute bottom-40 left-1/3 w-3 h-3 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-white rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <span className="text-sm font-medium">🌍 Make a Difference Today</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            Ready to Make a
            <span className="block bg-gradient-to-r from-emerald-200 via-green-100 to-teal-200 bg-clip-text text-transparent">
              Difference?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-10 text-green-50 leading-relaxed max-w-3xl mx-auto">
            Join thousands of environmentally conscious individuals making a positive impact on our planet.
          </p>
          
          <Link
            to="/register"
            className="group relative inline-flex items-center px-10 py-5 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl space-x-3"
          >
            <span className="relative z-10">Start Your Journey</span>
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </Link>
          
          <div className="mt-12 flex items-center justify-center space-x-8 text-green-100 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span>Free to join</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse delay-300"></div>
              <span>Instant access</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse delay-700"></div>
              <span>Track your impact</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}