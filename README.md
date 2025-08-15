# Smart E-Waste Locator & Tracker

A comprehensive web application that helps users find nearby e-waste recycling centers, log their recycling activities, and track their environmental impact.

![EcoTracker Screenshot](https://images.pexels.com/photos/9324379/pexels-photo-9324379.jpeg?auto=compress&cs=tinysrgb&w=800)

## 🌟 Features

### User Features
- **Authentication**: Secure signup/login with JWT tokens
- **Search**: Find nearby recycling centers using location or address
- **Interactive Map**: View centers on Google Maps with detailed information
- **Activity Logging**: Track recycled items with categories and quantities
- **Impact Tracking**: Calculate CO₂ saved and environmental benefits
- **Personal Dashboard**: Visualize recycling statistics with charts
- **Profile Management**: Update personal information and preferences

### Admin Features
- **Center Management**: Add, edit, and delete recycling centers
- **User Management**: View and manage user accounts
- **Analytics**: Monitor platform usage and environmental impact
- **Verification**: Verify user activities and center information

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live data synchronization
- **Search & Filtering**: Advanced search with multiple filters
- **Data Visualization**: Interactive charts with Recharts
- **Geolocation**: Browser location services integration
- **Export**: CSV export functionality for data analysis

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **Google Maps API** integration

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Rate Limit** for API protection
- **Helmet** for security headers
- **CORS** for cross-origin requests

### Deployment
- **Frontend**: Vercel (recommended)
- **Backend**: Render, Railway, or Heroku
- **Database**: MongoDB Atlas

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Maps API key (optional, for map features)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd smart-ewaste-tracker
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Environment Setup**

Frontend (`.env`):
```env
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Backend (`.env`):
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ewaste-tracker
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

5. **Seed the database** (optional, for demo data)
```bash
cd backend
npm run seed
```

6. **Start the development servers** (concurrently)
```bash
npm run dev:all
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
smart-ewaste-tracker/
├── public/                 # Static assets
├── src/                   # Frontend source code
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── utils/            # Utility functions
├── backend/              # Backend API
│   ├── src/
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   └── scripts/      # Database scripts
│   └── package.json
└── README.md
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Recycling Centers
- `GET /api/centers` - Get all centers with filters
- `GET /api/centers/:id` - Get single center
- `POST /api/centers` - Create center (Admin)
- `PUT /api/centers/:id` - Update center (Admin)
- `DELETE /api/centers/:id` - Delete center (Admin)

### Activities
- `GET /api/activities` - Get user activities
- `POST /api/activities` - Log new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `GET /api/activities/summary/stats` - Get statistics

## 🔐 Authentication

The application uses JWT tokens for authentication:

- **Demo Accounts**:
  - Admin: `admin@example.com` / `admin123`
  - User: `user@example.com` / `user123`

## 📊 Environmental Impact Calculation

CO₂ savings are calculated based on:
- Device category and estimated weight
- Industry-standard emission factors
- Material recovery rates
- Energy savings from recycling vs. new production

## 🌍 Deployment

### Frontend (Vercel)

1. **Build the project**
```bash
npm run build
```

2. **Deploy to Vercel**
```bash
npx vercel --prod
```

### Backend (Render)

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Set environment variables**
4. **Deploy with build command**: `npm install && npm start`

### Environment Variables

Create `.env` files using the provided examples:

- Frontend `.env`:
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

- Backend `.env`:
```
NODE_ENV=production
PORT=3001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_super_secret_jwt_key
CORS_ORIGINS=https://your-frontend.vercel.app
```

### Database (MongoDB Atlas)

1. **Create a MongoDB Atlas cluster**
2. **Get connection string**
3. **Update `MONGODB_URI` in environment variables**
4. **Run seed script on production database**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Pexels** for providing stock photos
- **Lucide** for the beautiful icons
- **Tailwind CSS** for the utility-first CSS framework
- **MongoDB** for the flexible database
- **Vercel** for seamless deployment

## 📧 Contact

For questions or support, please contact:
- Email: support@ecotracker.com
- GitHub: [Your GitHub Profile]

---

**Made with 💚 for the Planet** 🌍