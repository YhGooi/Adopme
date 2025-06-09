import { useHomeStore } from '../store/home.store';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import '../css/home.css';

import Banner from '../assets/png/Banner.png';
import ApplyNow from '../assets/png/ApplyNow.png';
import SupportUs from '../assets/png/SupportUs.png';

const Home: React.FC = () => {
  const { pets, fetchPets } = useHomeStore((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPets();
  }, []);

  console.log("Pets fetched:", pets);

  return (
    <div className="page-content">
    <section className="hero-section">
        <img
            src={Banner}
            alt="Banner"
            className="hero-image w-full h-auto object-cover block"
        />
        <div className="hero-button-container">
            <button className="hero-button" onClick={() => navigate('/pet-listing')}>
            ADOPT ME
            </button>
        </div>
    </section>


    {/* Featured Pets */}
    <section className="polaroid-section">
      {/* Left Text Block */}
      <div className="polaroid-text">
        <h3>LOOKING FOR<br />MORE?</h3>
        <button className="link-button" onClick={() => navigate('/pet-listing')}>
          VIEW LISTING
        </button>

      </div>

      {/* Right Overlapping Cards */}
      <div className="polaroid-wrapper">
        <div className="polaroid-cards">
          {pets.slice(0, 4).map((pet, index) => (
            <div
              key={pet.id}
              className="polaroid-card"
              style={{
                left: `${index * 140}px`,
                zIndex: 10 - index,
                transform: `rotate(${(index % 2 === 0 ? -1 : 1) * (2 + index)}deg)`
              }}
            >
              <div className="image-container">
                <img src={pet.petImageUrl || ''} alt={pet.name} />
              </div>
              <p>{pet.name}, {pet.age}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* Ready to Adopt */}
      <section className="ready-adopt-section">
        <img src={ApplyNow} alt="Ready to Adopt" className="bg-image" />

        <div className="overlay" />

        <div className="content">
          <h2>READY<br />TO<br />ADOPT?</h2>
          <button className="white-link" onClick={() => navigate('/pet-listing')}>
            APPLY NOW
          </button>
        </div>
      </section>

      {/* Support Us */}
      <section className="support-us-section">
      <img src={SupportUs} alt="Support Us" className="support-us-bg" />

      {/* Overlay content */}
      <div className="support-us-content">
        <div className="text-block">
          <h3>SUPPORT<br />US</h3>
          <button className="white-link" onClick={() => navigate('/donation')}>
            SEE HOW CAN YOU HELP
          </button>
        </div>
      </div>
    </section>

    </div>
  );
};

export default Home;
