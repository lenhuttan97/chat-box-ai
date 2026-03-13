import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Routes>
        <Route path="/" element={<div>Chat App</div>} />
      </Routes>
    </div>
  );
}

export default App;
