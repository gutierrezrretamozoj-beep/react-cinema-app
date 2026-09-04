import { RouterProvider } from 'react-router'
import { appRouter } from '@router/index'
import { AuthProvider } from '@/shared/context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={appRouter} />
    </AuthProvider>
  )
}

export default App
