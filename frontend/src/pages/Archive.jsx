import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Archive() {
  return (
    <div>
      <Navbar />

      <main className="px-6 py-10">
        <h1 className="text-3xl font-bold mb-3">Wisdom Archive</h1>
        <p className="text-gray-600 mb-8">
          A searchable digital repository of farming knowledge. Preserving valuable
          experience and traditional agricultural practices for future generations.
        </p>

        {/* Placeholder content */}
        <div className="border border-dashed border-gray-300 rounded p-8 text-center text-gray-400">
          Archived farming knowledge will appear here.
        </div>
      </main>

      <Footer />
    </div>
  )
}
