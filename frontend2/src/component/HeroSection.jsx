import { IoIosArrowRoundDown } from 'react-icons/io';
import trainerMainImage from '../assets/trainerMainImage.jpeg';
import Header from './Header';

const HeroSection = ({ category, para, searchCategory }) => {
  return (
    <div className="relative w-[100vw] h-[60vh] sm:h-[80vh] overflow-hidden">
      <div
        style={{
          backgroundImage: `url('https://s3-alpha-sig.figma.com/img/9bd8/f0ae/36079d2205a505187afdc2b0a66b9f98?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=g0KX0Fs2mzigMBkv13F4RhSqzTMNqob-j4hZteIbjZ-4Y5xCm2C9hfnzjR9BNoIreB7nzj9fKlrJnZngeGEPqt8V1TT0hSd9r0KpJGsd0huAvvoQ6UtpAHeEL~ISfORyKftpn0PHlxWSTk8S5Sp2alFTQvTCKQvKRUkKo2Z72te9tG61aNCgzRKzV99GydX~8dcLcms0i4NX2vA-LYlREWkx2NG6nyj7MV78hcQBywmOeqmWlnimU3bPRwv0sbWEmN48OTIXeSUPulwXe7wgRsC8Zuroa4PTD7R5s1YtaSVVsnD-uupUNRQ0LXGsKSL0l05Yqa-uLmMR03a9Lc-UwA__')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        className="w-full h-full"
      >
        <div className="absolute inset-x-0 bottom-0 h-[34rem] bg-gradient-to-t from-black to-transparent pointer-events-none" />
        <div className="absolute flex justify-between items-center w-[100vw] z-10">
          <Header />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[34rem] bg-gradient-to-t from-black to-transparent pointer-events-none" />

        <div className="absolute top-1/2 transform -translate-y-1/2 w-full p-[10%] flex flex-col gap-5">
          <div className="text-white font-extrabold text-[3rem] w-[40%] leading-none">
            {category}
          </div>
          <div className="font-sans text-[0.8rem] sm:text-[1.2rem] text-paraColor w-[80%] sm:w-[50%]">
            {para}
          </div>
          <div className="flex justify-start  items-center  right-0">
            <a href="#">
              <button className="h-[3.5rem] w-[16rem] flex justify-center items-center bg-orange-600 text-white  mr-2 rounded-sm">
                {searchCategory}
                <IoIosArrowRoundDown color="white" size={30} />
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
