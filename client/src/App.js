import logo from './logo.svg';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Outlet,
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import MyNavbar from './components/Navbar';
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Edit from "./pages/Edit";

const Layout = () => {
  return(
    <>
      <MyNavbar/>
      <Outlet/>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <Home/>,
      }, 
      {
        path:"/browse",
        element: <Browse/>
      },
      {
        path:"/edit",
        element: <Edit/>
      }
    ]
  }, 
  {
    path: "/login", 
    element: <Login/>
  }, 
  {
    path: "/register", 
    element: <Register/>
  }
]);

function App() {
  return (
    <div className='App'>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;