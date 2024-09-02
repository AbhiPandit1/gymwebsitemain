import { useState } from 'react';
import ProgrammeInfo from './ProgrammeInfo';
import TrainerAbout from './TrainerAbout';
import PersonalInfoTrainer from './PersonalInfoTrainer';
import ReviewCard from '../../../component/ReviewCard';
import Footer from '../../../component/Footer';

const PersonalTrainer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const paragraphs = [
    'Praesentium dolorum. Recusandae itaque dolorum laudantium reprehenderit nesciunt facilis id architecto.',
    'Tempore minima porro sequi in modi reiciendis delectus placeat, rem quidem deserunt fuga quasi.',
    'Exercitationem enim quos illum suscipit cumque! Voluptatum autem nulla, ducimus maiores voluptate repellendus.',
    'Eveniet cum harum impedit voluptatem tempora commodi velit quae! Modi nihil possimus, labore voluptas ducimus commodi.',
    'Magni distinctio iste accusamus, suscipit impedit laboriosam sed placeat, quas dignissimos voluptates assumenda ad?',
    'Blanditiis obcaecati dolor soluta, veniam laudantium sint velit, ea enim adipisci sunt saepe reprehenderit vero.',
    'Cupiditate minima. Eaque molestias quibusdam corrupti? Ad magnam iure provident. Cum similique dolorum saepe voluptatum.',
  ];

  const description = [
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint rerum voluptas commodi dolorum.',
    'Praesentium dolorum. Recusandae itaque dolorum laudantium reprehenderit nesciunt facilis id architecto.',
    'Tempore minima porro sequi in modi reiciendis delectus placeat, rem quidem deserunt fuga quasi.',
    'Exercitationem enim quos illum suscipit cumque! Voluptatum autem nulla, ducimus maiores voluptate repellendus.',
    'Eveniet cum harum impedit voluptatem tempora commodi velit quae! Modi nihil possimus, labore voluptas ducimus commodi.',
    'Magni distinctio iste accusamus, suscipit impedit laboriosam sed placeat, quas dignissimos voluptates assumenda ad?',
    'Blanditiis obcaecati dolor soluta, veniam laudantium sint velit, ea enim adipisci sunt saepe reprehenderit vero.',
    'Cupiditate minima. Eaque molestias quibusdam corrupti? Ad magnam iure provident. Cum similique dolorum saepe voluptatum.',
  ];
  return (
    <>
      <TrainerAbout />
      <div
        style={{
          background:
            'linear-gradient(270deg, #172438 0%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)',
        }}
      >
        <ProgrammeInfo
          description={description}
          paragraphs={paragraphs}
          orderPara={1}
          orderImage={2}
        />
      </div>
      <div>
        <PersonalInfoTrainer />
      </div>
      <div>
        <ReviewCard />
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
};

export default PersonalTrainer;
