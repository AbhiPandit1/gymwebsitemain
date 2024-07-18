import LoginLogo from '../../component/LoginLogo';
import { useState } from 'react';
import { FaLongArrowAltRight } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdEmail } from 'react-icons/md';

const EmailField = () => {
  {
    /*/user/forgot/email */
  }
  const [userEmail, setUserEmail] = useState('');

  const handleEmail = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/forgot/password', {
        email: userEmail,
      });

      if (res.data.success) {
        toast.success('Email sent Successfull');
      } else {
        toast.error(res, 'error');
      }
    } catch (err) {
      console.log(err);
      toast.error('Internal Error');
    }
  };

  return (
    <div className="min-h-[100vh] w-full pt-5 flex flex-col gap-10 ">
      <div>
        {' '}
        <LoginLogo />
      </div>

      <div className="gap-20 max-w-[100vw]">
        {' '}
        <div className="flex flex-col justify-center items-center mt-4  max-w-[100vw] ">
          <label htmlFor="" className="text-white">
            Email
          </label>
          <div className="relative flex w-[80%] justify-center ">
            <input
              type="email"
              name="email"
              placeholder="email"
              required
              className="flex  w-full sm:w-[40%] justify-center items-center text-white  bg-tertiary h-[2.5rem] sm:h-[3rem] rounded-[32px] pl-[20%] sm:pl-[8%] font-sans  "
              onChange={(e) => setUserEmail(e.target.value)}
            />

            <div className="absolute top-[20%] left-[10%] sm:left-[33%] ">
              <MdEmail color="white" size={25} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center ">
        <button
          className="h-[4rem] w-[20rem] rounded-3xl bg-secondary text-white flex justify-center items-center gap-5 "
          onClick={handleEmail}
        >
          <div className="font-sans font-extrabold"> Submit</div>

          <FaLongArrowAltRight size={30} />
        </button>
      </div>
    </div>
  );
};

export default EmailField;
