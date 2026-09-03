import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Search } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

export default function CabBookingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCab, setSelectedCab] = useState<any>(null);

  const [formData, setFormData] = useState({
    pickup: '',
    drop: '',
    date: '',
    time: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1500);
  };

  const mockCabs = [
    { id: 1, type: 'Mini', desc: 'Comfy, economical cars', eta: '5 mins', price: 150 },
    { id: 2, type: 'Sedan', desc: 'Spacious sedans, top drivers', eta: '8 mins', price: 220 },
    { id: 3, type: 'SUV', desc: 'Spacious SUVs for groups', eta: '12 mins', price: 350 },
  ];

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-green-600 text-white p-4 pt-8 sticky top-0 z-10 shadow-md flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-green-700 rounded-full mr-2">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Book a Cab</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto">
        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm mb-6 space-y-4">
          <Input label="Pickup Location" value={formData.pickup} onChange={(e) => setFormData({...formData, pickup: e.target.value})} required placeholder="Enter pickup point" />
          <Input label="Drop Location" value={formData.drop} onChange={(e) => setFormData({...formData, drop: e.target.value})} required placeholder="Enter destination" />
          <div className="grid grid-cols-2 gap-4">
            <Input type="date" label="Date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
            <Input type="time" label="Time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required />
          </div>
          <Button type="submit" className="w-full mt-2 bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? 'Locating Cabs...' : <span className="flex items-center justify-center"><Search size={18} className="mr-2" /> Find Cabs</span>}
          </Button>
        </form>

        {showResults && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white px-2">Available Cabs</h3>
            {mockCabs.map((cab) => (
              <div key={cab.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{cab.type}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{cab.desc}</p>
                  <span className="inline-block bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                    ETA: {cab.eta}
                  </span>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="font-bold text-lg dark:text-white mb-2">₹{cab.price}</span>
                  <Button size="sm" onClick={() => { setSelectedCab(cab); setShowModal(true); }} className="bg-green-600 hover:bg-green-700">Book</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirm Cab">
        {selectedCab && (
          <div className="space-y-4 pt-2">
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-start mb-4">
                <MapPin className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Pickup</p>
                  <p className="font-medium dark:text-white">{formData.pickup}</p>
                </div>
              </div>
              <div className="flex items-start border-t border-gray-100 dark:border-gray-700 pt-4">
                <MapPin className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Drop</p>
                  <p className="font-medium dark:text-white">{formData.drop}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold dark:text-white">{selectedCab.type}</p>
                <p className="text-sm text-gray-500">Estimated Total</p>
              </div>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">₹{selectedCab.price}</span>
            </div>
            
            <Button onClick={() => { setShowModal(false); navigate('/bookings'); }} className="w-full bg-green-600 hover:bg-green-700">Confirm Booking</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
