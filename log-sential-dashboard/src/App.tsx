import { Route, Routes } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import DashboardPage from "./pages/DashboardPage"
import CreateProjectPage from "./pages/CreateProjectPage"

const App = () => {
  return (
    <Routes>

      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="create-project" element={<CreateProjectPage />} />
    </Routes>
  )
}

export default App