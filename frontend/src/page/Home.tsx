import { useHomeStore } from '../store/home.store';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import '../css/home.css';
import '../css/polaroid.css';

import Hero from '../assets/png/Hero.png';
import ApplyNow from '../assets/png/ApplyNow.png';
import SupportUs from '../assets/png/SupportUs.png';

const Home: React.FC = () => {
  const { pets, fetchPets } = useHomeStore((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPets();
  }, []);

  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith('/uploads/')) {
      return `http://localhost:8080${url}`;
    }
    return url;
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <img
          src={Hero}
          alt="Hero"
          className="hero-image"
        />
        <div className="hero-button-container">
          <h1 className="hero-title">IF YOU WANT A PET, DON'T BUY</h1>
          <button className="hero-button" onClick={() => navigate('/pet-listing')}>
            ADOPT ME
          </button>
        </div>
      </section>

      <section className={"home-section polaroid-section"}>
        <div className="polaroid-text-container">
          <h2>LOOKING FOR<br />MORE?</h2>
          <button className="pet-listing-button" onClick={() => navigate('/pet-listing')}>
            VIEW LISTING
          </button>
        </div>

        <div className="polaroid-container">
          <div className="polaroid-cards">
            {pets.map((pet) => {
              return (
                <div
                  key={pet.id}
                  className="polaroid-card"
                  onClick={() => navigate('/pet-listing')}
                >
                  <div className="polaroid-image-container">
                    <img src={getImageUrl(pet.petImageUrl) || undefined} alt={pet.name} />
                  </div>
                  <p>{pet.name}, {pet.age}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ready to Adopt */}
      <section className={"home-section home-image-section"}>
        <img src={ApplyNow} alt="Ready to Adopt" className="home-bg-image" />
        <div className="ready-adopt-content">
          <h2>READY<br />TO<br />ADOPT?</h2>
          <button className="white-link" onClick={() => navigate('/pet-listing')}>
            APPLY NOW
          </button>
        </div>
      </section>

      {/* Support Us */}
      <section className={"home-section home-image-section"}>
        <img src={SupportUs} alt="Support Us" className="home-bg-image" />
        <div className="support-us-content">
          <h2>SUPPORT US</h2>
          <button className="white-link" onClick={() => navigate('/donation')}>
            SEE HOW CAN YOU HELP
          </button>
        </div>
      </section>

    </div>
  );
};

export default Home;
