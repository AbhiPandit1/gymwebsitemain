import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './component/Header';
import Home from './pages/Home';
import Trainers from './pages/Trainers';
import ProgramsCategories from './pages/ProgramsCategories';
import Footer from './component/Footer';
import Programmes from './pages/Programmes';
import AdminPage from './pages/admin/AdminPage';
import UserDetails from './pages/user/UserDetails';
import UserDashboard from './pages/user/UserDashboard';
import Login from './pages/Login';
import Signin from './pages/SignIn';
import './App.css';
import AdminCreatingNewProgramme from './pages/admin/AdminCreatingNewProgramme';
import StripePayment from './pages/payment/StripePayment';
import ShowProgramme from './pages/trainer/ShowProgramme';
import UserProgramme from './pages/user/UserProgramme';
import ProductPage from './component/ProductPage';
import ForgortPassword from './pages/user/ForgotPassword';
import EmailField from './pages/user/EmailField';
import ProgrammeDetail from './pages/user/ProgrammeDetail';
import StripePaymentSuccess from './pages/payment/StripePaymentSuccess';
import StripePaymentFailure from './pages/payment/StripePaymentFailure';
import PersonalTrainerProgramme from './pages/trainer/PersonalTrainerProgramme';
import PersonalUserProgramme from './pages/user/PerosnalUserProgramme';
import PaymentInvoice from './pages/payment/PaymentInvoice';
import LoadingSpinner from '../LoadingSpinner';
import NotFound from '../NotFound';

function App() {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const token = user?.token;

  const noHeaderFooterPaths = [
    '/signin',
    '/login',
    '/admin/page/',
    '/user/detail/',
    '/user/detail/payment',
    '/user/dashboard/',
    '/admin/create/programme',
    '/trainer/programmes',
    '/user/programme',
    '/programme/',
    '/user/forgot',
    '/resetpassword',
    '/payment/success',
    '/payment/failure',
    '/trainer/programmes',
    '/user/programmes',
    '/user/payment/detail',
  ];

  const showHeaderFooter = !noHeaderFooterPaths.some((path) =>
    location.pathname.includes(path)
  );

  // State to handle loading state for routes that are not explicitly handled
  const [loading, setLoading] = useState(false);

  // Use effect to detect when route changes
  useEffect(() => {
    setLoading(false); // Reset loading state on route change
  }, [location.pathname]);

  return (
    <div className="bg-primary">
      {showHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/categories" element={<ProgramsCategories />} />
        <Route path="/programmes" element={<Programmes />} />
        <Route path="/resetpassword/:token" element={<ForgortPassword />} />
        <Route path="/user/forgot/email" element={<EmailField />} />
        <Route path="/programme/:programmeId" element={<ProgrammeDetail />} />

        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signin"
          element={!token ? <Signin /> : <Navigate to="/" />}
        />

        {/*Admin can check user  */}
        <Route
          path="/admin/page/:id"
          element={token ? <AdminPage /> : <Navigate to="/login" />}
        />

        {/*Programme create krne ke lie trainer ke lie he  */}

        <Route
          path="/trainer/create/programme/:id"
          element={
            token ? <AdminCreatingNewProgramme /> : <Navigate to="/login" />
          }
        />

        {/*User detail edit krne ke lie ya update krne ke lie */}
        <Route
          path="/user/detail/:id"
          element={token ? <UserDetails /> : <Navigate to="/login" />}
        />

        <Route
          path="/payment/success"
          element={token ? <StripePaymentSuccess /> : <Navigate to="/login" />}
        />
        <Route
          path="/payment/failure"
          element={token ? <StripePaymentFailure /> : <Navigate to="/login" />}
        />
        <Route
          path="/programmes/:id"
          element={token ? <ProductPage /> : <Navigate to="/login" />}
        />

        {/*User Dash board  */}
        <Route
          path="/user/dashboard/:id"
          element={token ? <UserDashboard /> : <Navigate to="/login" />}
        />
        {/*Trainer ke saare programme jo usne banaaye he */}
        <Route
          path="/trainer/programmes"
          element={
            token ? <PersonalTrainerProgramme /> : <Navigate to="/login" />
          }
        />
        {/*User ke saare programme jo usne khreede he */}
        <Route
          path="/user/programmes"
          element={token ? <PersonalUserProgramme /> : <Navigate to="/login" />}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/user/programme/:id" element={<UserProgramme />} />
        <Route path="/user/payment/checkout/id" element={<StripePayment />} />
        <Route path="/user/payment/detail/:id" element={<PaymentInvoice />} />

        {/*Trainer Programmes */}
        <Route path="/trainer/programmes/:id" element={<ShowProgramme />} />

        {/* Route for handling other paths that are not explicitly handled */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showHeaderFooter && <Footer />}
      <ToastContainer />
      {loading && <LoadingSpinner />}{' '}
      {/* Display loading spinner when loading is true */}
    </div>
  );
}

export default App;
