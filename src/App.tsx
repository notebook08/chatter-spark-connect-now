import { Routes, Route } from 'react-router-dom'
import Index from './pages/Index'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/not-found" element={<div>404 - Page Not Found</div>} />
    </Routes>
  )
}

export default App