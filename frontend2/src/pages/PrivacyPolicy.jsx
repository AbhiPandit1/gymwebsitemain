import { useState, useEffect } from 'react';
import Modal from 'react-modal';

const PrivacyPolicy = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    // Open the modal as soon as the page loads
    setModalIsOpen(true);
  }, []);

  return (
    <div className="bg-white">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {}}
        className="fixed inset-0 flex items-center justify-center w-full h-full bg-white rounded-none" // Set modal background to white
        overlayClassName="fixed inset-0 bg-gray-950 bg-opacity-50" // Semi-transparent overlay
        shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
      >
        <div className="relative w-full h-full bg-white">
          {' '}
          {/* Inner div background remains white */}
          <iframe
            src="https://drive.google.com/file/d/1SbW_QMZVnrpWcvaMJj65JixuO0GTqcZT/preview"
            className="w-full h-full bg-white"
            title="Privacy Policy"
          />
        </div>
      </Modal>
    </div>
  );
};

export default PrivacyPolicy;
