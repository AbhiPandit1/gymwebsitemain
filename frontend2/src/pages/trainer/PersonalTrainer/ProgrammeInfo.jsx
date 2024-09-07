import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FaInfoCircle } from 'react-icons/fa';

const ProgrammeInfo = ({
  descriptionImage,
  description,
  orderPara,
  orderImage,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Function to render paragraphs and unordered lists with validation checks
  const renderDescription = (descriptionContent) => {
    // Check if the descriptionContent contains HTML tags
    if (
      typeof descriptionContent === 'string' &&
      /<\/?[a-z][\s\S]*>/i.test(descriptionContent)
    ) {
      // Render HTML safely
      return (
        <div
          className="mb-4"
          dangerouslySetInnerHTML={{ __html: descriptionContent }}
        />
      );
    }

    // Handle description as an array of paragraphs or list items (if needed)
    if (Array.isArray(descriptionContent)) {
      return descriptionContent.map((item, index) => {
        if (Array.isArray(item)) {
          return (
            <ul key={index} className="list-disc pl-6 mb-4">
              {item.map((liItem, liIndex) => (
                <li key={liIndex} className="mb-2">
                  {liItem}
                </li>
              ))}
            </ul>
          );
        } else if (typeof item === 'string') {
          return (
            <p key={index} className="mb-4">
              {item}
            </p>
          );
        }
      });
    }

    return null;
  };

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
          <div
            className={`text-gray-200 h-[40vh] overflow-auto`}
            style={{ gridArea: 'para', order: orderPara }}
          >
            {/* Render paragraphs and bullet points */}
            {description && renderDescription(description)}
          </div>
          {descriptionImage && (
            <img
              src={descriptionImage}
              alt="Program"
              className={`object-cover w-full h-[50vh] rounded-lg shadow-lg hidden sm:block`}
              style={{ gridArea: 'image', order: orderImage }}
            />
          )}
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
        <Dialog.Panel className="p-6 rounded-lg shadow-lg max-w-2xl w-full overflow-y-auto bg-orange-300 h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">About the Program</h1>
          <div className="text-gray-700 space-y-4">
            {/* Render paragraphs and bullet points inside modal */}
            {description && renderDescription(description)}
          </div>
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
