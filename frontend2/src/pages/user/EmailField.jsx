import LoginLogo from '../../component/LoginLogo';
import { useState } from 'react';
import { FaLongArrowAltRight } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdEmail } from 'react-icons/md';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import CSS for Skeleton

const backendapi = import.meta.env.VITE_BACKEND_URL;

const EmailField = () => {
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmail = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const res = await axios.post(`${backendapi}/api/forgot/password`, {
        email: userEmail,
      });

      if (res.data.success) {
        toast.success('Email sent successfully');
      } else {
        toast.error('Error sending email');
      }
    } catch (err) {
      console.log(err);
      toast.error('Internal Error');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div
      className="min-h-[100vh] w-full pt-5 flex flex-col gap-10"
      style={{
        background:
          'linear-gradient(180deg, #050c1e 0%, #050c1e 40%, #050c1e 70%, #050c1e 100%)',
      }}
    >
      <div>
        <LoginLogo />
      </div>

      <div className="gap-20 max-w-[100vw]">
        <div className="flex flex-col justify-center items-center mt-4 max-w-[100vw]">
          <label htmlFor="" className="w-full sm:w-[30%] text-white h-[2.5rem] sm:h-[3rem] rounded-[32px] text-lg font-semibold flex items-center">
            Email
          </label>
          <div className="relative flex w-[80%] justify-center">
            {loading ? (
              <Skeleton className="w-full sm:w-[40%] h-[2.5rem] sm:h-[3rem] rounded-[32px] pl-[20%] sm:pl-[8%]" />
            ) : (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  className="flex w-full sm:w-[40%] justify-center items-center text-white bg-tertiary h-[2.5rem] sm:h-[3rem] rounded-[32px] pl-[20%] sm:pl-[8%] font-sans"
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                <div className="absolute top-[20%] left-[10%] sm:left-[33%]">
                  <MdEmail color="white" size={25} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <button
          className="h-[4rem] w-[10rem] rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 hover:bg-orange-500 text-white flex justify-center items-center gap-2"
          onClick={handleEmail}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <Skeleton className="w-full h-[2rem]" />
          ) : (
            <>
              <div className="font-sans font-semibold text-lg">Submit</div>
              <FaLongArrowAltRight size={30} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EmailField;
