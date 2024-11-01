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
import Login from "./pages/Login";

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
        path: "/login", 
        element: <Login/>
      }
    ]
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