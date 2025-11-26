import { Route, Routes } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import DashboardPage from "./pages/DashboardPage"
import CreateProjectPage from "./pages/CreateProjectPage"
import LogsPage from "./pages/LogsPage"
import AlertPage from "./pages/AlertPage"
import HomePage from "./pages/HomePage"

const App = () => {
  return (
    <Routes>

      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="create-project" element={<CreateProjectPage />} />
      <Route path="/logs/:projectId" element={<LogsPage />} />
      <Route path="/alerts/:projectId" element={<AlertPage />} />
    </Routes>
  )
}

export default App