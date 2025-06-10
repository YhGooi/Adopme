import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '/src/css/appointment/appointment.css';
import { user_details } from '../../store/auth.store';

type Pet = {
  id: number;
  name: string;
};

const Appointment = () => {
  const userStore = user_details((state) => state) as any;

  const [dateTime, setDateTime] = useState('');
  const [petId, setPetId] = useState('');
  const [pets, setPets] = useState<Pet[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch('http://localhost:8080/pet/active')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setPets(data);
        } else {
          console.error('Expected array of pets but got:', data);
          setPets([]);
        }
      })
      .catch(err => {
        console.error('Failed to get pets:', err);
        setPets([]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = userStore.id;
    if (!userId) {
      alert('Please log in first');
      return;
    }

    if (new Date(dateTime) <= new Date()) {
      alert('Please select a future time');
      return;
    } try {
      const requestData = {
        userId,
        petId: Number(petId),
        appointmentDateTime: dateTime,
      };

      const response = await fetch('http://localhost:8080/appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      navigate('/appointment/success');
    } catch (error) {
      console.error('Appointment failed:', error);
      alert('Appointment failed, please try again later.');
    }
  };
  return (
    <div className="appointment-page">
      <div className="appointment-title-bar">
        <h2>APPOINTMENT</h2>
      </div>
      <div className="appointment-container">
        <div className="appointment-content">
          <div className="appointment-form-container">
            <form onSubmit={handleSubmit} className="appointment-form">
              <div className="appointment-form-section">
                <label>Date & Time</label>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="appointment-date-input"
                  required
                />
              </div>

              <div className="appointment-form-section">
                <label>Any Pet Interested?</label>
                <select
                  value={petId}
                  onChange={(e) => setPetId(e.target.value)}
                  className="appointment-pet-input"
                  required
                >
                  <option value="">-- Select Pet --</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>{pet.name}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="book-btn">
                BOOK
              </button>
            </form>

            <div className="vertical-divider"></div>

            <div className="appointment-address">
              <h3>Our Address</h3>
              <p>
                1, Lorong AdopMe, Taman Adopme, 12345 Selangor, Malaysia
              </p>
              <iframe
                title="Shelter Location"
                src="https://maps.google.com/maps?q=selangor%20malaysia&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="map-frame"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
