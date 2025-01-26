import Homepage from "./components/Homepage";
import { createBrowserRouter, RouterProvider} from "react-router";
import Signup from "./components/signup";
import Login from "./components/Login";
import { ModeToggle } from "./components/mode-toggle";
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
    }
  ])

  return (
    <>
    <ModeToggle/>
    <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App;
