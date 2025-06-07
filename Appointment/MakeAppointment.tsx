import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ✅ 添加类型定义
type Pet = {
  id: number;
  name: string;
};

const MakeAppointment = () => {
  const [dateTime, setDateTime] = useState('');
  const [petId, setPetId] = useState('');
  const [pets, setPets] = useState<Pet[]>([]); // ✅ 使用 Pet 类型
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/api/pets')
      .then(res => setPets(res.data))
      .catch(err => console.error('Failed to get pet', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = Number(localStorage.getItem('userId') || '0');
    if (!userId) {
      alert('Please log in first');
      return;
    }

    if (new Date(dateTime) <= new Date()) {
      alert('Please select a future time');
      return;
    }

    try {
      const requestData = {
        userId,
        petId: Number(petId),
        appointmentDateTime: dateTime,
      };

      await axios.post('http://localhost:8080/api/appointment', requestData);
      navigate('/appointment/success');
    } catch (error) {
      console.error('Appointment failed：', error);
      alert('Appointment failed, please try again later.');
    }
  };

  return (
    <div className="bg-[#fff7f0] py-16 px-4 flex justify-center">
      <div className="bg-[#eaf4eb] rounded-2xl shadow-lg p-10 w-full max-w-[1496px] flex flex-col md:flex-row gap-10">
        
        {/* 左边：表单区域 */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-6">
          <div>
            <label className="block font-semibold mb-2">Date & Time</label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Any Pet Interested?</label>
            <select
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm"
              required
            >
              <option value="">-- Select Pet --</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>{pet.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700"
          >
            BOOK
          </button>
        </form>

        {/* 中间分隔线 */}
        <div className="hidden md:block w-px bg-gray-300 h-full"></div>

        {/* 右边：地址 + 地图 */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-3">Our Address</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            1, Lorong AdopMe, Taman Adopme,<br />
            12345 Selangor, Malaysia
          </p>
          <iframe
            title="Shelter Location"
            src="https://maps.google.com/maps?q=selangor%20malaysia&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="200"
            className="rounded-md shadow"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default MakeAppointment;
