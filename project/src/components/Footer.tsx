import React from 'react';
import { Recycle, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Recycle className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold">EcoTracker</span>
            </div>
            <p className="text-gray-300 text-sm">
              Empowering communities to make sustainable choices through intelligent e-waste management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/search" className="text-gray-300 hover:text-green-400 transition-colors">Find Centers</a></li>
              <li><a href="/activities" className="text-gray-300 hover:text-green-400 transition-colors">My Activities</a></li>
              <li><a href="/dashboard" className="text-gray-300 hover:text-green-400 transition-colors">Dashboard</a></li>
              <li><a href="/profile" className="text-gray-300 hover:text-green-400 transition-colors">Profile</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">E-waste Guide</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Environmental Impact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Recycling Tips</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">hello@ecotracker.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 EcoTracker. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
            <p className="flex items-center space-x-1 text-gray-300 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for the Planet</span>
            </p>
            <span className="text-xs text-green-300 bg-green-900/30 px-2 py-1 rounded">
              Built for DigiGreen Hackathon 2025
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}