import Navbar from '../components/Navbar'
import Hero   from '../components/Hero'
import Card   from '../components/Card'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />

      <main className="px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title="Decision Journal"
            description="Record your farming decisions and the reasons behind them."
            action={{ label: 'Learn more' }}
          />
          <Card
            title="Outcome Tracking"
            description="Log harvest results and measure the success of your decisions."
            action={{ label: 'Learn more' }}
          />
          <Card
            title="AI Pattern Discovery"
            description="AI analyses your records to surface successful practices."
            action={{ label: 'Learn more' }}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
