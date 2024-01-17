import './App.css'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import SecretsPage from './pages/SecretsPage'

function App() {

  const router = createBrowserRouter([
    {
      path:'/',
      element:<AuthPage />
    },
    {
      path:'/secrets',
      element: <SecretsPage />
    }
  ])

  return (
    <div className='App'>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
