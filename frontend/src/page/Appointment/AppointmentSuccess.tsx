import { Link } from 'react-router-dom';

const SuccessAppointment = () => {
  return (
    <div className="bg-[#fff7f0] min-h-screen px-4 py-16 flex justify-center">
      <div
        className="bg-[#eaf4eb] rounded-2xl shadow-xl flex flex-col items-center justify-start text-center px-6 pt-24"
        style={{ width: '1496px', height: '1438px' }}
      >
        {/* <CheckCircle
          className="text-green-700 mb-10"
          style={{ width: '395px', height: '395px' }}
          strokeWidth={1.5}
        /> */}

        <h2 className="text-xl font-semibold mb-6">Appointment Submitted!</h2>

        <p className="text-gray-700 text-base leading-relaxed max-w-xl mb-10">
          We will process your appointment and update you through email once it’s confirmed. See you soon!
        </p>

        <Link
          to="/"
          className="text-green-700 underline font-medium hover:text-green-900"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SuccessAppointment;
