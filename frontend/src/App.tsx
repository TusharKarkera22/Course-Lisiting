
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import Home from './pages/Home';
import CourseDetails from './pages/CourseDetails';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignUp';
import CreateCourse from './pages/CreateCourse';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/create-course" element={<CreateCourse />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
