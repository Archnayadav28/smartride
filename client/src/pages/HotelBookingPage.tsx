import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Star, Wifi, Coffee, MapPin } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

export default function HotelBookingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  const [formData, setFormData] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    rooms: '1'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1200);
  };

  const mockHotels = [
    { id: 1, name: 'Grand Plaza Hotel', rating: 4.8, price: 3500, loc: 'City Center', amenities: ['wifi', 'breakfast'] },
    { id: 2, name: 'Comfort Inn', rating: 4.2, price: 1800, loc: 'Near Railway Station', amenities: ['wifi'] },
    { id: 3, name: 'Luxury Palace', rating: 5.0, price: 8500, loc: 'Lake View', amenities: ['wifi', 'breakfast', 'pool'] },
  ];

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-purple-600 text-white p-4 pt-8 sticky top-0 z-10 shadow-md flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-purple-700 rounded-full mr-2">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Book a Hotel</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto">
        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm mb-6 space-y-4">
          <Input label="City or Location" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required placeholder="e.g. Udaipur" />
          <div className="grid grid-cols-2 gap-4">
            <Input type="date" label="Check-in" value={formData.checkIn} onChange={(e) => setFormData({...formData, checkIn: e.target.value})} required />
            <Input type="date" label="Check-out" value={formData.checkOut} onChange={(e) => setFormData({...formData, checkOut: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input type="number" label="Guests" min="1" max="10" value={formData.guests} onChange={(e) => setFormData({...formData, guests: e.target.value})} required />
            <Input type="number" label="Rooms" min="1" max="5" value={formData.rooms} onChange={(e) => setFormData({...formData, rooms: e.target.value})} required />
          </div>
          <Button type="submit" className="w-full mt-2 bg-purple-600 hover:bg-purple-700" disabled={loading}>
            {loading ? 'Searching...' : <span className="flex items-center justify-center"><Search size={18} className="mr-2" /> Search Hotels</span>}
          </Button>
        </form>

        {showResults && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white px-2">Available Hotels in {formData.city || 'City'}</h3>
            {mockHotels.map((hotel) => (
              <div key={hotel.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 w-full relative">
                  <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm font-bold flex items-center shadow">
                    <Star size={14} className="text-yellow-500 mr-1 fill-current" /> {hotel.rating}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{hotel.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-3">
                    <MapPin size={14} className="mr-1" /> {hotel.loc}
                  </p>
                  
                  <div className="flex items-center space-x-3 mb-4 text-gray-400">
                    {hotel.amenities.includes('wifi') && <Wifi size={16} />}
                    {hotel.amenities.includes('breakfast') && <Coffee size={16} />}
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                    <div>
                      <span className="font-bold text-xl dark:text-white">₹{hotel.price}</span>
                      <span className="text-xs text-gray-500 block">per night</span>
                    </div>
                    <Button onClick={() => { setSelectedHotel(hotel); setShowModal(true); }} className="bg-purple-600 hover:bg-purple-700">Book Now</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirm Booking">
        {selectedHotel && (
          <div className="space-y-4 pt-2">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
              <p className="font-bold text-lg dark:text-white">{selectedHotel.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{formData.city}</p>
              <div className="text-sm dark:text-gray-300">
                <p>{formData.checkIn} to {formData.checkOut}</p>
                <p>{formData.rooms} Room(s) • {formData.guests} Guest(s)</p>
              </div>
            </div>
            
            <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-4">
              <span className="dark:text-white">Total Amount</span>
              <span className="text-purple-600 dark:text-purple-400">₹{selectedHotel.price}</span>
            </div>
            
            <Button onClick={() => { setShowModal(false); navigate('/bookings'); }} className="w-full bg-purple-600 hover:bg-purple-700">Confirm & Pay</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
