import Logo from './Logo';
import footerImage from '../assets/NewLogo.png';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

import SiteMap from './SiteMap';
import { useEffect, useState } from 'react';
import site from '../data/siteMapData';
import legal from '../data/legalData';

const Footer = () => {
  const [data, setData] = useState([]);
  const [legaldata, setLegalData] = useState([]);

  useEffect(() => {
    setData(site);
  }, []);

  useEffect(() => {
    setLegalData(legal);
  }, []);

  return (
    <div className="flex flex-col gap-10 h-[85vh] p-2 sm:p-10 w-full ">
      {/* First Division */}
      <div className="flex flex-col sm:flex sm:flex-row justify-between ">
        <div className="mt-20 mb-10 sm:m-20">
          <Logo backgroundImage={footerImage} />
        </div>
        <div className="text-white font-sans text-[24px] w-[95%] sm:w-[40%] sm:m-20">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </div>
      </div>
      {/* Second Division */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-10">
        <div className="ml-5 sm:ml-20">
          <div className="flex">
            <div className="h-[60px] w-[60px] flex justify-center items-center bg-footerColor border-2 border-x-paraColor rounded-[15px]">
              <FaInstagram size={25} color="white" />
            </div>
            <div className="h-[60px] w-[60px] flex justify-center items-center bg-footerColor border-2 border-x-paraColor rounded-[15px]">
              <FaFacebook size={25} color="white" />
            </div>
            <div className="h-[60px] w-[60px] flex justify-center items-center bg-footerColor border-2 border-x-paraColor rounded-[15px]">
              <FaYoutube size={25} color="white" />
            </div>
          </div>
          {/* Commented Out Newsletter Section */}
          {/* <div className="flex flex-col gap-1">
            <div className="text-white font-sans font-semibold mt-10">
              Subscribe to news letter
            </div>
            <div className="flex font-sans relative">
              <IoMdMail size={30} color="white" className="absolute top-4 left-5" />
              <input
                type="email"
                placeholder="          Enter Your email....."
                className="w-[80%] sm:w-[35rem] h-[4rem] font-sans rounded-l-[1rem] rounded-r-[1rem] p-4 bg-tertiary border-secondary border-[1px]"
              />
              <PiArrowRightLight size={30} color="white" className="absolute right-[30%] sm:right-[5%] top-5" />
            </div>
          </div> */}
          <div className="text-copyrightColor font-sans font-semibold mt-10">
            Copyright ©2024, All Rights Reserved
          </div>
        </div>

        {/* Data Content */}
        <div className="flex justify-between  sm:w-[40vw] font-extrabold">
          <div>
            <SiteMap data={legaldata} header="Legal" />
          </div>
        </div>
      </div>

      {/* Commented Out Button Third Division */}
      {/* <div className="w-full flex justify-between items-center relative sm:static mt-10 sm:mt-0">
        <button className="w-[40%] sm:w-[12%] h-[4rem] flex justify-between p-3 bg-secondary text-white items-center ml-4 mr-2 rounded-l-[1rem] rounded-r-[1rem]">
          <span className="ml-4 text-white font-sans">Play Store</span>
          <FiDownload color="white" size={30} />
        </button>
        <button className="w-[25%] absolute bottom-[120%] left-[35%] sm:static sm:w-[8%] h-[4rem] flex justify-center bg-secondary text-white items-center ml-4 mr-2 rounded-l-[1rem] rounded-r-[1rem]">
          <a href="#">
            <IoIosArrowRoundUp color="white" className="w-14 h-10" />
          </a>
        </button>
        <button className="w-[40%] sm:w-[15%] h-[4rem] flex justify-between p-3 bg-secondary text-white items-center ml-4 mr-2 rounded-l-[1rem] rounded-r-[1rem]">
          <span className="ml-4 text-white font-sans">Apple Store</span>
          <FiDownload color="white" size={30} />
        </button>
      </div> */}
    </div>
  );
};

export default Footer;
