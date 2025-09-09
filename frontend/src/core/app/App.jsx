import { createContext, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '../routes/routes'




export const Detail = createContext()



function App() {
  const [data, setData] = useState([])

  return (
    <>
      <RouterProvider router={router}>
        <Detail.Provider value={{ data, setData }} />
      </RouterProvider>
    </>
  )
}

export default App
