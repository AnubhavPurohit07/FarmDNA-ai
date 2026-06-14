import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex items-center justify-between">
      {/* Logo / App Name */}
      <div className="text-xl font-bold">FarmDNA</div>

      {/* Navigation Links */}
      <div className="flex gap-6">
        <Link to="/"          className="hover:underline">Home</Link>
        <Link to="/journal"   className="hover:underline">Journal</Link>
        <Link to="/community" className="hover:underline">Community</Link>
        <Link to="/archive"   className="hover:underline">Archive</Link>
      </div>

      {/* Profile / Menu Icon */}
      <div className="text-sm border border-white px-3 py-1 rounded">Menu</div>
    </nav>
  )
}
