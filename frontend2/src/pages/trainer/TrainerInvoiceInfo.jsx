import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import { BiSolidRightArrow } from 'react-icons/bi';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';
import { useParams } from 'react-router-dom';

const TrainerInvoiceInfo = () => {
  const { user } = useSelector((state) => state.user);
  const [invoiceData, setInvoiceData] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [titleFilter, setTitleFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const dashBoardLink = useDashboardLinks();
  const { trainerId } = useParams();

  useEffect(() => {
    const getInvoice = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/trainer/payment/${trainerId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const invoiceData = response.data;
        setInvoiceData(invoiceData);

        const total = invoiceData.programmes.reduce(
          (acc, programme) => acc + programme.programme.price,
          0
        );
        setTotalRevenue(total);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (user && user.token) {
      getInvoice();
    }
  }, [user]);

  const handleFilter = (programmes) =>
    (programmes || []).filter(
      (programme) =>
        programme.programme?.title &&
        programme.programme.title
          .toLowerCase()
          .includes(titleFilter.toLowerCase()) &&
        (programme.users || []).some(
          (user) =>
            (user.name &&
              user.name.toLowerCase().includes(nameFilter.toLowerCase())) ||
            (user.email &&
              user.email.toLowerCase().includes(emailFilter.toLowerCase()))
        )
    );

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  if (loading) {
    return (
      <div className="min-h-[100vh] flex items-center justify-center bg-gray-950 text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[100vh] bg-gray-950 text-white">Error: {error}</div>
    );
  }

  return (
    <div
      className="grid grid-cols-9 max-w-[100vw] text-white font-sans"
      style={{
        background: 'linear-gradient(180deg, #050c1e 0%, #050c1e 100%)',
      }}
    >
      <div className="col-span-9 sticky top-0 z-50">
        <DashboardHeader />
      </div>

      <div className="min-h-screen min-w-[100vw]">
        {/* Toggle Dashboard Visibility on Small Screens */}
        {hoverDashboard && (
          <div
            className="absolute left-0 z-10 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300"
            onClick={() => setHoverDashboard(false)}
          >
            <BiSolidRightArrow size={40} color="orange" />
          </div>
        )}

        <div className="p-8">
          <div className="bg-gradient-to-r from-orange-650 to-yellow-500 text-white p-4 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold">Total Revenue Till Date</h2>
            <p className="text-xl">${totalRevenue}</p>
          </div>

          <h1 className="text-3xl font-bold mb-4">
            Trainer Invoice Information
          </h1>

          <div className="mb-4">
            <div className="mb-2">
              <input
                type="text"
                className="p-2 w-full rounded-lg border border-gray-700 bg-gray-800 text-white"
                placeholder="Filter by title"
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="p-2 w-full rounded-lg border border-gray-700 bg-gray-800 text-white"
                placeholder="Filter by name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                className="p-2 w-full rounded-lg border border-gray-700 bg-gray-800 text-white"
                placeholder="Filter by email"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
              />
            </div>
          </div>

          {invoiceData &&
          invoiceData.programmes &&
          invoiceData.programmes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left text-white">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-650 to-red-500">
                    <th className="px-4 py-2">Programme Category</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Users</th>
                  </tr>
                </thead>
                <tbody>
                  {handleFilter(invoiceData.programmes).map(
                    (programme, index) => (
                      <InvoiceRow
                        key={index}
                        programme={programme.programme}
                        users={programme.users || []}
                      />
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div>No invoice data available</div>
          )}
        </div>
      </div>

      {hoverDashboard && (
        <div className="absolute left-0 z-10 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300">
          <BiSolidRightArrow size={40} color="orange" onClick={handleClick} />
        </div>
      )}
    </div>
  );
};

const InvoiceRow = ({ programme, users }) => {
  return (
    <tr className="bg-gray-800 border-b border-gray-700">
      <td className="px-4 py-2">{programme?.title}</td>
      <td className="px-4 py-2">${programme.price}</td>
      <td className="px-4 py-2">
        {users.length > 0 ? (
          <table className="table-auto w-full text-left text-gray-300">
            <thead>
              <tr className="bg-gradient-to-r from-orange-650 to-yellow-500">
                <th className="px-2 py-1">Name</th>
                <th className="px-2 py-1">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-600">
                  <td className="px-2 py-1">{user.name}</td>
                  <td className="px-2 py-1">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Name available for this user.</p>
        )}
      </td>
    </tr>
  );
};

export default TrainerInvoiceInfo;
