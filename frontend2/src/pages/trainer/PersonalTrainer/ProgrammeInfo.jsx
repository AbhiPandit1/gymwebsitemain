import React, { useState } from 'react';
import { Dialog } from '@headlessui/react'; // Import Dialog from @headlessui/react
import { FaInfoCircle } from 'react-icons/fa'; // Import FaInfoCircle from react-icons

const ProgrammeInfo = ({ description, paragraphs, orderPara, orderImage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      <div className="my-8 p-8 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">
          What Will You Get
        </h1>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-8"
          style={{ gridTemplateAreas: `"para image"` }}
        >
          <ul
            className={`list-disc list-inside text-gray-200 space-y-4 h-[40vh] overflow-hidden`}
            style={{ gridArea: 'para', order: orderPara }}
          >
            {paragraphs.map((para, index) => (
              <li key={index}>{para}</li>
            ))}
          </ul>
          <img
            src="https://via.placeholder.com/300"
            alt="Program"
            className={`object-cover w-full h-[50vh] rounded-lg shadow-lg hidden sm:grid`}
            style={{ gridArea: 'image', order: orderImage }}
          />
        </div>
      </div>
      {/* Button to open modal */}
      <div className="flex justify-center mb-8">
        <button
          onClick={openModal}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg flex items-center justify-center hover:bg-blue-700 transition duration-300"
        >
          <FaInfoCircle className="mr-2" /> See More
        </button>
      </div>
      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={closeModal}
        className="fixed inset-0 flex items-center justify-center p-4"
      >
        <Dialog.Panel className="p-6 rounded-lg shadow-lg max-w-2xl w-full overflow-y-auto bg-orange-300 h-[60vh] overflow-scroll scrollbar-hide">
          <h1 className="text-2xl font-bold mb-4">About the Program</h1>
          <ul className="list-disc list-inside text-gray-700 space-y-4 ">
            {description.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>
          <button
            onClick={closeModal}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
          >
            Close
          </button>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default ProgrammeInfo;
