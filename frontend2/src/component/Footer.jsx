import { useEffect, useState } from 'react';
import Modal from 'react-modal'; // Import Modal
import Logo from './Logo';
import footerImage from '../assets/NewLogo.png';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import SiteMap from './SiteMap';
import site from '../data/siteMapData';
import legal from '../data/legalData';
import FooterSkeleton from '../pages/skeletons/FooterSkeleton';
import { Link } from 'react-router-dom';

// Set up Modal accessibility
Modal.setAppElement('#root');

const Footer = () => {
  const [data, setData] = useState([]);
  const [legaldata, setLegalData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'privacy' or 'terms'
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setData(site);
      setLegalData(legal);
      setLoading(false);
    }, 2000); // Adjust time as needed

    return () => clearTimeout(timer);
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
    <footer className="flex flex-col min-h-[85vh] p-6 sm:p-10 w-full  text-white">
      {loading ? (
        <FooterSkeleton />
      ) : (
        <>
          {/* First Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-10 sm:py-20 border-b border-gray-600">
            <div className="flex flex-col items-start sm:items-center">
              <Logo backgroundImage={footerImage}/>
            </div>
            <div className="flex space-x-5 mt-10 sm:mt-0">
              <a
                href="https://www.instagram.com/programpanda"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-[60px] w-[60px] flex justify-center items-center bg-footerColor border-2 border-paraColor rounded-full transition duration-300 hover:bg-orange-600"
              >
                <FaInstagram size={30} color="white" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61565627881781"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-[60px] w-[60px] flex justify-center items-center bg-footerColor border-2 border-paraColor rounded-full transition duration-300 hover:bg-orange-600"
              >
                <FaFacebook size={30} color="white" />
              </a>
              <a
                href="https://www.youtube.com/@ProgramPanda"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="h-[60px] w-[60px] flex justify-center items-center bg-footerColor border-2 border-paraColor rounded-full transition duration-300 hover:bg-orange-600"
              >
                <FaYoutube size={30} color="white" />
              </a>
            </div>
          </div>

          {/* Second Section */}
          <div className="flex flex-col sm:flex-row justify-between gap-10 mt-10 border-t border-gray-600 pt-10">
            <div className="sm:ml-20">
              <div className="flex space-x-4">
                <Link to="/programpanda/privacy/policy">
                  <p className="text-white hover:text-orange-800 font-sans text-xl ">
                    Privacy Policy
                  </p>
                </Link>
                <Link to="/programpanda/privacy/terms">
                  <p className="text-white hover:text-orange-800 font-sans text-xl">
                    Terms of Service
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modals */}

      <div className="text-center py-6 text-xs border-t border-gray-700 mt-auto">
        <p>© 2024 ProgramPanda. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
