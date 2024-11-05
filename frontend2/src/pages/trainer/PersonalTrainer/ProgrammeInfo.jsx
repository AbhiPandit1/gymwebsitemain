import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FaInfoCircle } from 'react-icons/fa';
import { BiSolidRightArrow } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';

const ProgrammeInfo = ({
  descriptionImage,
  description,
  orderPara = 1,
  orderImage = 2,
  trainerName,
  topHeading,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Function to render paragraphs and unordered lists with validation checks
  const renderDescription = (descriptionContent) => {
    if (
      typeof descriptionContent === 'string' &&
      /<\/?[a-z][\s\S]*>/i.test(descriptionContent)
    ) {
      return (
        <div
          className="mb-4"
          dangerouslySetInnerHTML={{ __html: descriptionContent }}
        />
      );
    }

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
        }
        if (typeof item === 'string') {
          return (
            <p key={index} className="mb-4">
              {item}
            </p>
          );
        }
        return null;
      });
    }

    return null;
  };

  return (
    <>
      <h3
        className="text-3xl font-bebes  text-center text-white pt-5 pb-5"
        style={{
          background:
            'linear-gradient(180deg, #050c1e 0%, #050c1e 40%, #050c1e 70%, #050c1e 100%)',
        }} 
      >
        {topHeading}
      </h3>
      <div
        className=" text-white"
        style={{
          background:
            'linear-gradient(180deg, #050c1e 0%, #050c1e 40%, #050c1e 70%, #050c1e 100%)',
        }}
      >
        <div
          className="flex flex-col lg:flex-row w-[80vw] m-auto overflow-hidden"
          style={{
            background:
              'linear-gradient(180deg, #050c1e 0%, #050c1e 40%, #050c1e 70%, #050c1e 100%)',
          }}
        >
          {descriptionImage ? (
            <div className="w-full lg:w-1/3 h-[40vh] lg:h-[80vh]">
              <img
                src={descriptionImage}
                alt="Program Description"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full lg:w-1/3 h-[40vh] lg:h-[80vh] flex justify-center items-center bg-gray-100">
              <FaInfoCircle size={80} className="text-gray-400" />
            </div>
          )}
          <div className="h-auto lg:h-[80vh] lg:w-2/3 overflow-auto p-4 leading-loose bg-white scrollbar-hide max-h-[40vh] sm:max-h-full">
            <h1 className="text-3xl font-bold mb-6 text-start text-gray-950">
              {trainerName}
            </h1>
            <h2 className="text-gray-500">
              {description && renderDescription(description)}
            </h2>
          </div>
        </div>
        <div className="flex justify-center mt-8 mb-6">
          <button
            onClick={openModal}
            className="px-6 py-3 bg-transparent text-white border-2 border-orange-600 shadow-lg flex items-center justify-center hover:bg-orange-700 transition duration-300"
          >
            See More
            <BiSolidRightArrow className="ml-2" />
          </button>
        </div>

        {/* Modal */}
        <Dialog
          open={isOpen}
          onClose={closeModal}
          className="fixed inset-0 flex items-center justify-center p-4"
        >
          <Dialog.Panel className="relative p-6 rounded-lg shadow-lg max-w-2xl w-full overflow-y-auto bg-gray-100 h-[60vh] scrollbar-hide">
            <h1 className="text-2xl font-bold mb-4">About the Program</h1>
            <div className="text-gray-700 space-y-4 scrollbar-hide">
              {description && renderDescription(description)}
            </div>
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-white shadow-lg transition duration-300"
            >
              <RxCross2 size={30} color="black" />
            </button>
          </Dialog.Panel>
        </Dialog>
      </div>
    </>
  );
};

export default ProgrammeInfo;
