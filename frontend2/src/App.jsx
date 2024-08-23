import { useEffect, useState, Suspense, lazy } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './component/Header';
import Footer from './component/Footer';
import LoadingSpinner from '../LoadingSpinner';
import NotFound from '../NotFound';
import EditTrainerProgramme from './pages/trainer/EditTrainerProgramme';
import Setting from './pages/Setting/Setting';
import AdminProgrammePage from './pages/admin/AdminProgrammePage';
import AdminPaymentDetail from './pages/admin/AdminPaymentDetail';
import AdminSendMail from './pages/admin/AdminSendMail';
import ProgrammeKind from './pages/trainer/trainerProgrammeCreation/ProgrammeKind';
import DietPlan from './pages/trainer/trainerProgrammeCreation/trainerProgrammes/DietPlan';
import SevenDayPlan from './pages/trainer/trainerProgrammeCreation/trainerProgrammes/DayPlan';

import DynamicDayPlanComponent from './pages/trainer/trainerProgrammeCreation/trainerProgrammes/DynamicDayPlanComponent';

import DynamicDietPlanComponent from './pages/trainer/trainerProgrammeCreation/trainerProgrammes/DynamicDietPlanComponent';
import useToastHook from '../hook/useToastHook';
import DayPlan from './pages/trainer/trainerProgrammeCreation/trainerProgrammes/DayPlan';
import TrainerProfile from './pages/trainer/TrainerProfile';

const Home = lazy(() => import('./pages/Home'));
const Trainers = lazy(() => import('./pages/trainer/Trainers'));
const ProgramsCategories = lazy(() => import('./pages/ProgramsCategories'));
const Programmes = lazy(() => import('./pages/Programmes'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const UserDetails = lazy(() => import('./pages/user/UserDetails'));
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const Login = lazy(() => import('./pages/Login'));
const Signin = lazy(() => import('./pages/SignIn'));
const AdminCreatingNewProgramme = lazy(() =>
  import('./pages/trainer/trainerProgrammeCreation/AdminCreatingNewProgramme')
);
const StripePayment = lazy(() => import('./pages/payment/StripePayment'));

const UserProgramme = lazy(() => import('./pages/user/UserProgramme'));
const ProductPage = lazy(() => import('./component/ProductPage'));
const ForgortPassword = lazy(() => import('./pages/user/ForgotPassword'));
const EmailField = lazy(() => import('./pages/user/EmailField'));
const ProgrammeDetail = lazy(() => import('./pages/user/ProgrammeDetail'));
const StripePaymentSuccess = lazy(() =>
  import('./pages/payment/StripePaymentSuccess')
);
const StripePaymentFailure = lazy(() =>
  import('./pages/payment/StripePaymentFailure')
);
const PersonalTrainerProgramme = lazy(() =>
  import('./pages/trainer/PersonalTrainerProgramme')
);
const PersonalUserProgramme = lazy(() =>
  import('./pages/user/PerosnalUserProgramme')
);
const PaymentInvoice = lazy(() => import('./pages/payment/PaymentInvoice'));

function App() {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const token = user?.token;
  const { showToast } = useToastHook();

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
    '/admin/programmes',
    '/user/forgot',
    '/resetpassword',
    '/payment/success',
    '/payment/failure',
    '/trainer/programmes',
    '/user/programmes',
    '/user/payment/detail',
    '/settings',
    '/admin/invoices',
    '/admin/user',
    '/admin/ads/mail',
    '/trainer/profile/',
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
      <Suspense fallback={<LoadingSpinner />}>
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

          <Route
            path="/admin/user/"
            element={
              token && user.user.role === 'admin' ? (
                <AdminPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin/ads/mail"
            element={
              token && user.user.role === 'admin' ? (
                <AdminSendMail />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin/programmes"
            element={
              token && user.user.role === 'admin' ? (
                <AdminProgrammePage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin/invoices"
            element={
              token && user.user.role === 'admin' ? (
                <AdminPaymentDetail />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/settings"
            element={token ? <Setting /> : <Navigate to="/login" />}
          />

          <Route
            path="/trainer/create/programme/:id"
            element={
              token ? <AdminCreatingNewProgramme /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/trainer/profile/:id/:trainerId"
            element={token ? <TrainerProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="/trainer/create/programme/type/:id"
            element={token ? <ProgrammeKind /> : <Navigate to="/login" />}
          />
          <Route
            path="/trainer/create/programme/diet/plan/:id/:programmeId"
            element={token ? <DietPlan /> : <Navigate to="/login" />}
          />
          <Route
            path="/trainer/programme/diet/plan/:id/:programmeId"
            element={
              token ? <DynamicDietPlanComponent /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/trainer/create/programme/day/plan/:id/:programmeId"
            element={token ? <DayPlan /> : <Navigate to="/login" />}
          />
          <Route
            path="/trainer/create/programme/both/:id"
            element={token ? <SevenDayPlan /> : <Navigate to="/login" />}
          />
          <Route
            path="/trainer/programme/day/plan/:id/:programmeId"
            element={
              token ? <DynamicDayPlanComponent /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/user/detail/:id"
            element={token ? <UserDetails /> : <Navigate to="/login" />}
          />

          <Route
            path="/payment/success"
            element={
              token ? <StripePaymentSuccess /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/payment/failure"
            element={
              token ? <StripePaymentFailure /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/programmes/:id"
            element={token ? <ProductPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/user/dashboard/:id"
            element={token ? <UserDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/trainer/programmes/:id"
            element={
              token ? <PersonalTrainerProgramme /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/user/programmes"
            element={
              token ? <PersonalUserProgramme /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/trainer/programme/edit/:id"
            element={
              token ? <EditTrainerProgramme /> : <Navigate to="/login" />
            }
          />
          <Route path="/home" element={<Home />} />
          <Route path="/user/programme/:id" element={<UserProgramme />} />
          <Route path="/user/payment/checkout/id" element={<StripePayment />} />
          <Route path="/user/payment/detail/:id" element={<PaymentInvoice />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {showHeaderFooter && <Footer />}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="toast-container fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
      />
      <button onClick={() => showToast('Success!', 'success')}>
        Show Success Toast
      </button>
      <button onClick={() => showToast('Error!', 'error')}>
        Show Error Toast
      </button>

      {loading && <LoadingSpinner />}
    </div>
  );
}

export default App;
