import { useEffect, useState } from 'react';
import Modal from 'react-modal'; // Import Modal
import Logo from './Logo';
import footerImage from '../assets/NewLogo.png';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import SiteMap from './SiteMap';
import site from '../data/siteMapData';
import legal from '../data/legalData';
import FooterSkeleton from '../pages/skeletons/FooterSkeleton';

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

  const getPdfUrl = () => {
    if (modalType === 'privacy') {
      return 'https://drive.google.com/file/d/1UqMF3nxv4qzGL5382ojk_2l_bCQXaWAT/preview';
    }
    if (modalType === 'terms') {
      return 'https://drive.google.com/file/d/1SbW_QMZVnrpWcvaMJj65JixuO0GTqcZT/preview';
    }
    return '';
  };

  return (
    <footer
      className="flex flex-col min-h-[85vh] p-6 sm:p-10 w-full  text-white"
      style={{
        background:
          'linear-gradient(270deg, #172438 0%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)',
      }}
    >
      {loading ? (
        <FooterSkeleton />
      ) : (
        <>
          {/* First Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-10 sm:py-20 border-b border-gray-600">
            <div className="flex flex-col items-start sm:items-center">
              <Logo backgroundImage={footerImage} />
              <p className="text-white mt-4 max-w-sm text-lg font-light leading-relaxed">
                Empowering developers with modern tools and resources to build
                seamless digital experiences.
              </p>
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
                <button
                  onClick={() => openModal('privacy')}
                  className="text-white hover:text-orange-800 font-sans text-xl "
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => openModal('terms')}
                  className="text-white hover:text-orange-800 font-sans text-xl"
                >
                  Terms of Service
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-4 sm:mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 p-2 text-gray-600 hover:text-gray-800 text-2xl font-bold"
          >
            ×
          </button>
          {modalType && (
            <iframe
              src={getPdfUrl()}
              width="100%"
              height="80vh"
              frameBorder="0"
              title={
                modalType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'
              }
              className="w-full h-full"
            ></iframe>
          )}
        </div>
      </Modal>

      <div className="text-center py-6 text-xs border-t border-gray-700 mt-auto">
        <p>© 2024 ProgramPanda. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
