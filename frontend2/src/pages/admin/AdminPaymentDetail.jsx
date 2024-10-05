import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { BiSolidRightArrow } from 'react-icons/bi';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';

const backendapi = import.meta.env.VITE_BACKEND_URL;

const AdminPaymentDetail = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [selectedPaymentIds, setSelectedPaymentIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [emailFilter, setEmailFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [programmeIdFilter, setProgrammeIdFilter] = useState('');
  const dashboardLink = useDashboardLinks();

  const { user } = useSelector((state) => state.user);
  const [hoverDashboard, setHoverDashboard] = useState(false);

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          `${backendapi}/api/admin/route/payments/detail`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setPayments(response.data.data);
        setFilteredPayments(response.data.data); // Initialize with fetched data
        console.log(response.data.data); // Log fetched data
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error('Error fetching payments');
      }
    };

    fetchPayments();
  }, [user.token]);

  useEffect(() => {
    let filtered = payments;

    if (emailFilter) {
      filtered = filtered.filter((payment) =>
        payment.userId?.email?.toLowerCase().includes(emailFilter.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((payment) =>
        payment.programmes?.some((programme) =>
          programme.category
            .toLowerCase()
            .includes(categoryFilter.toLowerCase())
        )
      );
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter).toLocaleDateString();
      filtered = filtered.filter(
        (payment) =>
          new Date(payment.paymentDate).toLocaleDateString() === filterDate
      );
    }

    if (programmeIdFilter) {
      filtered = filtered.filter((payment) =>
        payment.programmes?.some((programme) =>
          programme._id.toLowerCase().includes(programmeIdFilter.toLowerCase())
        )
      );
    }

    setFilteredPayments(filtered);
  }, [emailFilter, categoryFilter, dateFilter, programmeIdFilter, payments]);

  const handleSelectPayment = (paymentId) => {
    setSelectedPaymentIds((prevSelectedPaymentIds) => {
      const updatedSelectedPaymentIds = new Set(prevSelectedPaymentIds);
      if (updatedSelectedPaymentIds.has(paymentId)) {
        updatedSelectedPaymentIds.delete(paymentId);
      } else {
        updatedSelectedPaymentIds.add(paymentId);
      }
      return updatedSelectedPaymentIds;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPaymentIds(new Set());
    } else {
      setSelectedPaymentIds(
        new Set(filteredPayments.map((payment) => payment._id))
      );
    }
    setSelectAll(!selectAll);
  };

  return (
    <div
      className="grid grid-cols-9 max-w-[100vw] text-white font-sans"
      style={{
        background:
          'linear-gradient(180deg, #050c1e 0%, #050c1e 40%, #050c1e 70%, #050c1e 100%)',
      }}
    >
      <div className="col-span-9 sticky top-0 z-50">
        <DashboardHeader />
      </div>

      <div className=" min-h-screen min-w-[100vw]">
        <h1 className="text-2xl font-bold mb-4">Admin Payment Details</h1>
        <div className="flex flex-col mb-4 gap-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex sm:flex-row items-center gap-4 mb-4 left-0 ">
            <input
              type="text"
              placeholder="Filter by Email"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
            <input
              type="text"
              placeholder="Filter by Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
            <input
              type="text"
              placeholder="Filter by Programme ID"
              value={programmeIdFilter}
              onChange={(e) => setProgrammeIdFilter(e.target.value)}
              className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="checkbox"
              id="selectAll"
              checked={selectAll}
              onChange={handleSelectAll}
              className="form-checkbox h-5 w-5 text-white"
            />
            <label htmlFor="selectAll" className="text-sm">
              Select All
            </label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-black divide-y divide-white">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="form-checkbox h-5 w-5 text-white"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                  User
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                  Currency
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                  Payment Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                  Programmes
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                  Payment Intent ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium uppercase">
                  Programme IDs
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white ">
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-secondary">
                  <td className="px-4 py-4 whitespace-nowrap ">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-white"
                      checked={selectedPaymentIds.has(payment._id)}
                      onChange={() => handleSelectPayment(payment._id)}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {payment.userId ? (
                      <div>
                        <div className="font-medium">{payment.userId.name}</div>
                        <div className="text-sm text-gray-400">
                          {payment.userId.email}
                        </div>
                      </div>
                    ) : (
                      'No User Information'
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    ${payment.amount}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {payment.currency}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {payment.programmes.length > 0 ? (
                      <ul>
                        {payment.programmes.map((programme) => (
                          <li key={programme._id}>
                            {programme.category} - ${programme.price}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'Cancelled'
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {payment.paymentIntentId || 'No Payment Intent ID'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {payment.programmes.length > 0 ? (
                      <ul>
                        {payment.programmes.map((programme) => (
                          <li key={programme._id}>{programme._id}</li>
                        ))}
                      </ul>
                    ) : (
                      'No Programme IDs'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentDetail;
