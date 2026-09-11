import { BrowserRouter } from 'react-router'
import { LoginPage } from '@/features/auth/pages/login/LoginPage'

function App() {
  return (
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  )
}

export default App
