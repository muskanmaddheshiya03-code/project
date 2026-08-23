import Hero from '../components/dashboard/Hero.jsx'
import FeatureCards from '../components/dashboard/FeatureCards.jsx'
import RecentReports from '../components/dashboard/RecentReports.jsx'
import AssistantBar from '../components/dashboard/AssistantBar.jsx'
import WeatherCard from '../components/dashboard/WeatherCard.jsx'
import MarketPricesCard from '../components/dashboard/MarketPricesCard.jsx'
import AlertsCard from '../components/dashboard/AlertsCard.jsx'

export default function Dashboard() {
  return (
    <div className="page dash-grid">
      <div className="dash-main">
        <Hero />
        <FeatureCards />
        <RecentReports />
        <AssistantBar />
      </div>
      <aside className="dash-side">
        <WeatherCard />
        <MarketPricesCard />
        <AlertsCard />
      </aside>
    </div>
  )
}
