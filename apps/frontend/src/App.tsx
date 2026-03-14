import { Routes, Route } from 'react-router-dom'
import { ChatPage } from './pages/ChatPage'

function App() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Routes>
        <Route path="/" element={<ChatPage />} />
      </Routes>
    </div>
  )
}

export default App
