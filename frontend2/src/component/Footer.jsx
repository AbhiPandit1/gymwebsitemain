import { useEffect, useState } from 'react';
import Modal from 'react-modal'; // Import Modal
import Logo from './Logo';
import footerImage from '../assets/NewLogo.png';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import SiteMap from './SiteMap';
import site from '../data/siteMapData';
import legal from '../data/legalData';

// Set up Modal accessibility
Modal.setAppElement('#root');

const Footer = () => {
  const [data, setData] = useState([]);
  const [legaldata, setLegalData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'privacy' or 'terms'

  useEffect(() => {
    setData(site);
  }, []);

  useEffect(() => {
    setLegalData(legal);
  }, []);

  const openModal = (type) => {
    setModalType(type);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalType('');
  };

  return (
    <div
      className="flex flex-col gap-10 h-[85vh] p-2 sm:p-10 w-full"
      style={{
        backgroundColor: 'linear-gradient(90deg, #18171A 0%, #18171A 100%)',
      }}
    >
      {/* First Division */}
      <div className="flex flex-col sm:flex sm:flex-row justify-between">
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
          <div className="text-copyrightColor font-sans font-semibold mt-10">
            Copyright ©2024, All Rights Reserved
          </div>
        </div>

        {/* Data Content */}
        <div className="flex justify-between sm:w-[40vw] font-extrabold">
          <div>
            <div className="mt-10 flex flex-col ">
              <button
                onClick={() => openModal('privacy')}
                className="text-white hover:text-orange-800 font-sans text-[3rem] mt-2 sm:mt-0 ml-0 sm:ml-4"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => openModal('terms')}
                className="text-white hover:text-orange-800 font-sans text-[3rem] mt-2 sm:mt-0 ml-0 sm:ml-4"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center w-[80vw] m-auto h-full bg-transparent rounded-lg p-6 shadow-lg"
        overlayClassName="fixed bg-white bg-opacity-5"
      >
        <div className="relative w-full h-full">
          <button
            onClick={closeModal}
            className="absolute top-10 right-10 text-4xl font-bold text-orange-700"
          >
            ×
          </button>
          <iframe
            src={
              modalType === 'privacy'
                ? 'https://coral-chad-43.tiiny.site/' // Replace with actual Privacy Policy URL
                : 'https://drive.google.com/file/d/1UqMF3nxv4qzGL5382ojk_2l_bCQXaWAT/preview' // Replace with actual Terms of Service URL
            }
            className="w-full h-[100vh]"
            title={
              modalType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'
            }
          />
        </div>
      </Modal>
    </div>
  );
};

export default Footer;
