import { RouterProvider } from 'react-router'
import { appRouter } from '@router/index'
import { AuthProvider } from '@/shared/context/AuthContext'
import { CartProvider } from '@/features/cart/CartContext'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={appRouter} />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
