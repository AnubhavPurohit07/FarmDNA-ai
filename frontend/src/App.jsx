import { Routes, Route } from 'react-router-dom'
import Home      from './pages/Home'
import Journal   from './pages/Journal'
import Community from './pages/Community'
import Archive   from './pages/Archive'

function App() {
  return (
    <Routes>
      <Route path="/"          element={<Home />}      />
      <Route path="/journal"   element={<Journal />}   />
      <Route path="/community" element={<Community />} />
      <Route path="/archive"   element={<Archive />}   />
    </Routes>
  )
}

export default App
