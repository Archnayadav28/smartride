import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Clock, Users } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

export default function BusBookingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState<any>(null);

  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: '1'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1000);
  };

  const handleSelect = (bus: any) => {
    setSelectedBus(bus);
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    navigate('/bookings');
  };

  const mockBuses = [
    { id: 1, provider: 'RSRTC Express', dept: '08:00 AM', arr: '02:00 PM', duration: '6h', price: 450, seats: 12 },
    { id: 2, provider: 'Greenline Travels', dept: '10:30 AM', arr: '04:15 PM', duration: '5h 45m', price: 600, seats: 4 },
    { id: 3, provider: 'VRL AC Sleeper', dept: '09:00 PM', arr: '05:00 AM', duration: '8h', price: 1200, seats: 20 },
  ];

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-blue-600 text-white p-4 pt-8 sticky top-0 z-10 shadow-md flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-blue-700 rounded-full mr-2">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Book a Bus</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto">
        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm mb-6 space-y-4">
          <Input label="From City" value={formData.from} onChange={(e) => setFormData({...formData, from: e.target.value})} required placeholder="e.g. Jaipur" />
          <Input label="To City" value={formData.to} onChange={(e) => setFormData({...formData, to: e.target.value})} required placeholder="e.g. Delhi" />
          <div className="grid grid-cols-2 gap-4">
            <Input type="date" label="Travel Date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
            <Input type="number" label="Passengers" min="1" max="6" value={formData.passengers} onChange={(e) => setFormData({...formData, passengers: e.target.value})} required />
          </div>
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? 'Searching...' : <span className="flex items-center justify-center"><Search size={18} className="mr-2" /> Search Buses</span>}
          </Button>
        </form>

        {showResults && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white px-2">Available Buses</h3>
            {mockBuses.map((bus) => (
              <div key={bus.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-gray-900 dark:text-white">{bus.provider}</h4>
                  <span className="font-bold text-blue-600 dark:text-blue-400">₹{bus.price}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div className="text-center">
                    <p className="font-semibold">{bus.dept}</p>
                  </div>
                  <div className="flex-1 px-4 flex flex-col items-center">
                    <span className="text-xs text-gray-400 mb-1 flex items-center"><Clock size={12} className="mr-1" />{bus.duration}</span>
                    <div className="w-full border-t border-dashed border-gray-300 dark:border-gray-600 relative">
                      <div className="absolute w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full -top-1 -left-1"></div>
                      <div className="absolute w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full -top-1 -right-1"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{bus.arr}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-green-600 dark:text-green-400 flex items-center font-medium">
                    <Users size={14} className="mr-1" /> {bus.seats} seats left
                  </span>
                  <Button size="sm" onClick={() => handleSelect(bus)}>Select</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirm Booking">
        {selectedBus && (
          <div className="space-y-4 pt-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400">Journey Details</p>
              <p className="font-bold text-lg dark:text-white">{formData.from} to {formData.to}</p>
              <p className="text-sm dark:text-gray-300">{formData.date} • {formData.passengers} Passenger(s)</p>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <p className="font-semibold dark:text-white mb-2">{selectedBus.provider}</p>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Departure:</span>
                <span className="dark:text-white">{selectedBus.dept}</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-500">Arrival:</span>
                <span className="dark:text-white">{selectedBus.arr}</span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold">
                <span className="dark:text-white">Total Amount</span>
                <span className="text-blue-600 dark:text-blue-400">₹{selectedBus.price * parseInt(formData.passengers)}</span>
              </div>
            </div>
            
            <Button onClick={handleConfirm} className="w-full">Confirm & Pay</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
