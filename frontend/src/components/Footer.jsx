export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between gap-6">

        {/* Links */}
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>

        {/* Social Icons (placeholder) */}
        <div className="flex gap-4 text-sm">
          <a href="#" className="hover:underline">Twitter</a>
          <a href="#" className="hover:underline">LinkedIn</a>
          <a href="#" className="hover:underline">GitHub</a>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-gray-400 text-sm mt-6">© 2025 FarmDNA. All rights reserved.</p>
    </footer>
  )
}
