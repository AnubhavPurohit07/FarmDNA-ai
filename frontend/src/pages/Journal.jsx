import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Journal() {
  return (
    <div>
      <Navbar />

      <main className="px-6 py-10">
        <h1 className="text-3xl font-bold mb-3">Decision Journal</h1>
        <p className="text-gray-600 mb-8">
          Record and track your farming decisions here. This page will let you log crop
          selection, irrigation methods, fertiliser usage, and the reasoning behind each choice.
        </p>

        {/* Placeholder content */}
        <div className="border border-dashed border-gray-300 rounded p-8 text-center text-gray-400">
          Journal entries will appear here.
        </div>
      </main>

      <Footer />
    </div>
  )
}
