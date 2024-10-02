import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

const TermsAndConditon = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    // Open the modal as soon as the page loads
    setModalIsOpen(true);
  }, []);

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {}}
        className="fixed inset-0 flex items-center justify-center w-full h-full bg-transparent rounded-none"
        overlayClassName="fixed bg-white bg-opacity-50"
        shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
      >
        <div className="relative w-full h-full ">
          <iframe
            src="https://drive.google.com/file/d/1UqMF3nxv4qzGL5382ojk_2l_bCQXaWAT/preview" // Updated link
            className="w-[100vw] h-[100vh]"
            title="Privacy Policy"
          />
        </div>
      </Modal>
    </div>
  );
};

export default TermsAndConditon;
