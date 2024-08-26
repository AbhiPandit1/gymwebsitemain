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
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className=" p-6 rounded-lg shadow-md min-h-[60vh]"
      style={{
        backgroundImage: `url('https://s3-alpha-sig.figma.com/img/107a/fdde/7049acfb657f7d72134e3f7f6b63fd48?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Pfw7g0lOoOtSwq0BWljUrfEggvh-cePwdVOX9rL4CduQw95pE6f4rmw9AdgJStRh46LsPuMgUAsHBGl~LGWjA0wODPBiFnAbNBqU44SG4LhKRnETWX0H~DW9t0DkGh8nweOfNZaG3-GNDJTzfdYzR3ZS5~TdcufAm1NxVfzju-fsvLCzXQ~QjeJqke3e~uRXYHzYi5U8F6UQux4ULTECqfzJrdlBRnDJyUzOOqkZWZB5QJdhBXmt8hdNQjNYOykdvi6pwLpN0KfF~NJlV9XpMZn7sm-V1cNsQZ3heWVBRzPeMg4PWeaKapdbbUz8lGtAz162sZIvwP5s1JtPBMsxKg__')`,
      }}
    >
      <h2 className="text-2xl font-bold text-center text-white mb-6">
        Frequently Asked Questions
      </h2>
      {faqData.map((item, index) => (
        <div key={index} className="mb-4">
          <div
            onClick={() => handleToggle(index)}
            className="flex items-center justify-between p-4 bg-orange-500 text-white rounded-lg cursor-pointer"
          >
            <span className="font-semibold">{item.question}</span>
            {openIndex === index ? (
              <FaArrowUp size={20} />
            ) : (
              <FaArrowDown size={20} />
            )}
          </div>
          {openIndex === index && (
            <div className="p-4  rounded-lg mt-2 border text-primary border-b-2 border-orange-500 bg-white border-gray-200">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Faq;
