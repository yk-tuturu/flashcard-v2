import './styles/App.scss';
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
import Create from './pages/Create';
import Search from "./pages/Search";
import View from "./pages/View";

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
        path:"/search",
        element: <Search/>
      },
      {
        path:"/edit/:id",
        element: <Edit/>
      }, 
      {
        path: "/create",
        element: <Create/> 
      }, 
      {
        path: "/view/:id",
        element: <View/>
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