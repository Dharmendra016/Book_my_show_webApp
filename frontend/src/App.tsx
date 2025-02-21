import Homepage from "./components/Homepage";
import { createBrowserRouter, RouterProvider} from "react-router";
import Signup from "./components/signup";
import Login from "./components/Login";
function App() {

  const browserRouter = createBrowserRouter([
    {
      path:"/",
      element: <Homepage/> ,
    },
    {
      path:"/signup",
      element:<Signup/>
    },
    {
      path:"/login",
      element:<Login/>
    },
  ])

  return (
    <>
    <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App;
