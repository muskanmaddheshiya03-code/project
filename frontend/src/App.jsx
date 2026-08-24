import { Routes, Route, Link } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DiseaseDetection from './pages/DiseaseDetection.jsx'
import SoilNutrition from './pages/SoilNutrition.jsx'
import CropAdvisory from './pages/CropAdvisory.jsx'
import CropRecommendation from './pages/CropRecommendation.jsx'
import MarketPrice from './pages/MarketPrice.jsx'
import Weather from './pages/Weather.jsx'
import AIAssistant from './pages/AIAssistant.jsx'
import MyFarms from './pages/MyFarms.jsx'
import History from './pages/History.jsx'
import SavedReports from './pages/SavedReports.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import SellDashboard from './pages/sell/SellDashboard.jsx'
import MyProduce from './pages/sell/MyProduce.jsx'
import AddProduce from './pages/sell/AddProduce.jsx'
import Marketplace from './pages/sell/Marketplace.jsx'
import ProductDetails from './pages/sell/ProductDetails.jsx'
import Reservations from './pages/sell/Reservations.jsx'
import Orders from './pages/sell/Orders.jsx'
import OrderDetails from './pages/sell/OrderDetails.jsx'
import HarvestConfirm from './pages/sell/HarvestConfirm.jsx'

function NotFound() {
  return (
    <div className="empty" style={{ minHeight: '60vh' }}>
      <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 28 }}>404</h2>
      <p>This page could not be found.</p>
      <Link className="btn btn-primary" to="/">
        Back to Dashboard
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/disease-detection" element={<DiseaseDetection />} />
        <Route path="/soil-nutrition" element={<SoilNutrition />} />
        <Route path="/crop-advisory" element={<CropAdvisory />} />
        <Route path="/crop-recommendation" element={<CropRecommendation />} />
        <Route path="/market-price" element={<MarketPrice />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/my-farms" element={<MyFarms />} />
        <Route path="/history" element={<History />} />
        <Route path="/saved-reports" element={<SavedReports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        {/* Sell Mode — Direct Farmer → Consumer (additive, does not affect Farmer Mode) */}
        <Route path="/sell" element={<SellDashboard />} />
        <Route path="/sell/my-produce" element={<MyProduce />} />
        <Route path="/sell/add-produce" element={<AddProduce />} />
        <Route path="/sell/marketplace" element={<Marketplace />} />
        <Route path="/sell/product/:id" element={<ProductDetails />} />
        <Route path="/sell/reservations" element={<Reservations />} />
        <Route path="/sell/orders" element={<Orders />} />
        <Route path="/sell/order/:id" element={<OrderDetails />} />
        <Route path="/sell/harvest/:id" element={<HarvestConfirm />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
