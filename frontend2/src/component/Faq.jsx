import React, { useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const faqData = [
  {
    question: 'What qualifications do your trainers have?',
    answer:
      'Our trainers are certified by reputable fitness organizations and have extensive experience in personal training and fitness coaching.',
  },
  {
    question: 'What types of fitness programs do you offer?',
    answer:
      'We offer a variety of fitness programs including weight training, cardio workouts, group classes, and personalized training plans.',
  },
  {
    question: 'Do you offer any products for sale?',
    answer:
      'Yes, we offer a range of fitness products including protein supplements, workout gear, and branded gym apparel.',
  },
  {
    question: 'How can I book a session with a trainer?',
    answer:
      'You can book a session with a trainer through our website or by visiting our front desk. We offer flexible scheduling to fit your needs.',
  },
  {
    question: 'What is your cancellation policy?',
    answer:
      'We require a 24-hour notice for cancellations. If you cancel less than 24 hours before your session, you may incur a cancellation fee.',
  },
  {
    question: 'How much does it cost to start?',
    answer:
      'It is completely free to start. We only take a small commission based on your success.',
  },
  {
    question: 'What is Program Panda?',
    answer:
      'Program Panda is a platform meant to help anyone create their own fitness program and sell it. It helps everyone in fitness achieve their goals by finding the right program for them.',
  },
  {
    question:
      'Why should I go with Program Panda when I can sell my program on my own?',
    answer:
      'You can do both if you’d like! We offer an extra channel for sales, an additional revenue stream, and more exposure. Program Panda markets the site as a whole, giving your programs more visibility. Plus, other creators on the platform bring traction to your program, giving you the opportunity to benefit from their exposure as well.',
  },
  {
    question: 'Who can sell on Program Panda?',
    answer:
      'Anyone can sell on Program Panda. It’s designed for influencers, trainers, and fitness enthusiasts to organize and sell their programs on one platform.',
  },
  {
    question: 'Is it okay to do two programs at the same time?',
    answer:
      'Yes, if you find two programs you like, feel free to combine them, or use one for workouts and another for diet.',
  },
  {
    question:
      'Does Program Panda offer any support for sales, marketing, and program creation?',
    answer:
      'Yes, we offer guides to help with your marketing process, depending on your sales goals, and support with creating and personalizing your fitness programs. Program Panda is here to make your experience easier, even if you’re new to writing fitness programs.',
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-6 rounded-lg shadow-md min-h-[60vh]">
      <h2 className="text-2xl font-bold text-center text-gray-300 mb-6">
        Frequently Asked Questions
      </h2>
      {faqData.map((item, index) => (
        <div key={index} className="mb-4">
          <div
            onClick={() => handleToggle(index)}
            className="flex items-center justify-between text-[1.5rem] p-6 border-b-4 border-white text-gray-400 cursor-pointer"
          >
            <span className="font-semibold">{item.question}</span>
            {openIndex === index ? (
              <FaArrowUp size={20} />
            ) : (
              <FaArrowDown size={20} />
            )}
          </div>
          {openIndex === index && (
            <div
              className="p-12 bg-gray-800 mt-2  text-white border-4 border-orange-600 rounded-r-lg rounded-l-lg"
              style={{
                width: '100%',
                height: '100%',
                transform: 'skew(0deg)',
                zIndex: -1, // Ensures the skewed background does not overlay the text
              }}
            >
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Faq;
