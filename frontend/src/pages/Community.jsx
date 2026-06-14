import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Community() {
  return (
    <div>
      <Navbar />

      <main className="px-6 py-10">
        <h1 className="text-3xl font-bold mb-3">Community</h1>
        <p className="text-gray-600 mb-8">
          Search and learn from farming experiences shared by other users. Find similar
          situations by crop, weather condition, or challenge faced.
        </p>

        {/* Placeholder content */}
        <div className="border border-dashed border-gray-300 rounded p-8 text-center text-gray-400">
          Community posts and search will appear here.
        </div>
      </main>

      <Footer />
    </div>
  )
}
