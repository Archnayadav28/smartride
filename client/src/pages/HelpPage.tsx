import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, MessageSquare, Mail, AlertTriangle, Send, CheckCircle2, Bot, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import EmergencyCard from '../components/EmergencyCard';
import FAQAccordion from '../components/FAQAccordion';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { mockEmergencyContacts, mockFAQs } from '../data/mockData';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export default function HelpPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const countryCode = user?.countryCode || 'IN';
  
  // Use user's country code, fallback to IN, then default
  const emergencyContacts = mockEmergencyContacts[countryCode] || mockEmergencyContacts['IN'] || mockEmergencyContacts['default'];

  // Report issue state
  const [reportData, setReportData] = useState({ category: '', description: '' });
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // SOS state
  const [showSosConfirm, setShowSosConfirm] = useState(false);
  const [sosSuccess, setSosSuccess] = useState(false);

  // Chat Support state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I am your Smart-Ride Support Assistant. How can we help you with your journey today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  // Handle SOS confirmation
  const handleConfirmSos = () => {
    setShowSosConfirm(false);
    setSosSuccess(true);
  };

  // Bot response generator
  const getBotResponse = (queryText: string): string => {
    const q = queryText.toLowerCase();
    if (q.includes('emergency') || q.includes('sos') || q.includes('police') || q.includes('help') || q.includes('danger')) {
      return 'For immediate emergency assistance, click the red "Emergency Assistance SOS" button on the Help page, or directly dial 100 (Police), 102 (Ambulance), or 1363 (Tourist Helpline).';
    }
    if (q.includes('book') || q.includes('ticket') || q.includes('ride')) {
      return 'To book a ride or ticket, head to the "Bookings" tab in the bottom navigation. You can reserve Cabs, Intercity Buses, and Heritage Hotel stays with instant confirmation.';
    }
    if (q.includes('hotel') || q.includes('stay') || q.includes('room')) {
      return 'Verified tourist hotels and homestays can be booked directly from Bookings > Hotels, featuring government-approved safety certifications.';
    }
    if (q.includes('bus') || q.includes('transit')) {
      return 'Rajasthan State Road Transport and Jaipur city bus services are available under Bookings > Buses with real-time seat availability.';
    }
    if (q.includes('cab') || q.includes('taxi') || q.includes('driver')) {
      return 'Smart-Ride authorized tourist cabs with verified commercial drivers and live GPS tracking are available under Bookings > Cabs.';
    }
    if (q.includes('map') || q.includes('offline') || q.includes('route')) {
      return 'You can preload offline regional maps for Jaipur routes from your Home screen or Settings page to travel smoothly even without internet connectivity.';
    }
    if (q.includes('cancel') || q.includes('refund')) {
      return 'You can manage or cancel your existing bookings under the Bookings tab. Standard cancellation permits refunds up to 24 hours prior to departure.';
    }
    if (q.includes('hi') || q.includes('hello') || q.includes('namaste')) {
      return 'Hello! How can I help make your Jaipur visit and travels safer and easier? Feel free to ask about bookings, offline maps, or safety helplines.';
    }
    return 'Thank you for reaching out! Our 24x7 tourist support desk is always at your service. For immediate live agent assistance, please use "Call Support" to dial 1363 or email us at support@smartride.com.';
  };

  // Handle send message
  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || chatInput;
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: content.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');

    // Automated bot reply
    setTimeout(() => {
      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: getBotResponse(content),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botReply]);
    }, 500);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportData.description.trim()) return;
    setReportSubmitted(true);
    setTimeout(() => {
      setReportData({ category: '', description: '' });
      setReportSubmitted(false);
    }, 4000);
  };

  return (
    <div className="pb-20 pt-6 px-4 max-w-lg mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen space-y-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('help.title')}</h1>

        {/* SOS Success Banner */}
        {sosSuccess && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200 px-4 py-3.5 rounded-2xl flex items-start space-x-3 text-sm animate-fade-in shadow-sm mb-6">
            <CheckCircle2 size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Emergency SOS alert sent successfully.</p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
                (Demo SOS alert broadcasted to your emergency contacts & Rajasthan Tourist Safety Control Room).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSosSuccess(false)}
              className="text-red-600 dark:text-red-400 hover:underline text-xs font-semibold ml-2"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* 1. Emergency Assistance SOS Button */}
        <button 
          type="button"
          onClick={() => setShowSosConfirm(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center space-x-3 transition-transform active:scale-95 mb-8"
        >
          <AlertTriangle className="w-6 h-6" />
          <span className="text-lg">Emergency Assistance SOS</span>
        </button>

        {/* Emergency Contacts Section */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Emergency Contacts</h2>
          <div className="grid gap-3">
            {emergencyContacts.map((contact, idx) => (
              <EmergencyCard 
                key={idx} 
                service={contact.service} 
                number={contact.number} 
                description={contact.description} 
              />
            ))}
          </div>
        </section>

        {/* 2, 3, 4. Tourist Support Helpline Options */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tourist Support Helpline</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm grid grid-cols-3 gap-4 text-center border border-gray-100 dark:border-gray-700">
            {/* Call Support -> tel:1363 */}
            <a 
              href="tel:1363" 
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity group"
              title="Call Tourist Helpline (1363)"
            >
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 p-3 rounded-full mb-2 group-hover:scale-105 transition-transform">
                <Phone size={24} />
              </div>
              <span className="text-xs font-medium dark:text-gray-300">Call Support</span>
              <span className="text-[10px] text-gray-400 mt-0.5">1363</span>
            </a>

            {/* Chat Support -> Open Chat Modal */}
            <button 
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity group"
              title="Open Chat Support"
            >
              <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 p-3 rounded-full mb-2 group-hover:scale-105 transition-transform">
                <MessageSquare size={24} />
              </div>
              <span className="text-xs font-medium dark:text-gray-300">Chat Support</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">Chatbot (Demo)</span>
            </button>

            {/* Email Support -> mailto:support@smartride.com */}
            <a 
              href="mailto:support@smartride.com?subject=Smart-Ride%20Tourist%20Support" 
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity group"
              title="Email Tourist Support (support@smartride.com)"
            >
              <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 p-3 rounded-full mb-2 group-hover:scale-105 transition-transform">
                <Mail size={24} />
              </div>
              <span className="text-xs font-medium dark:text-gray-300">Email Support</span>
              <span className="text-[10px] text-gray-400 mt-0.5">support@smartride</span>
            </a>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
          <ol className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-4 border border-gray-100 dark:border-gray-700">
            {[
              'Create your account',
              'Verify your mobile number',
              'Add your trip',
              'Download your offline map',
              'Use the map while travelling',
              'Access emergency support when needed'
            ].map((step, idx) => (
              <li key={idx} className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-bold mr-3 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {mockFAQs.map((faq, idx) => (
              <FAQAccordion 
                key={idx} 
                question={faq.question} 
                answer={faq.answer} 
              />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Report an Issue</h2>
          {reportSubmitted ? (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 p-5 rounded-2xl flex items-center space-x-3 text-sm animate-fade-in shadow-sm">
              <CheckCircle2 size={22} className="text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <p className="font-bold">Issue reported successfully!</p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">Ticket #SR-{Date.now().toString().slice(-6)} created. Support team will review shortly.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
              <Select
                label="Issue Category"
                value={reportData.category}
                onChange={(e) => setReportData({ ...reportData, category: e.target.value })}
                options={[
                  { value: 'app', label: 'App Problem' },
                  { value: 'booking', label: 'Booking Issue' },
                  { value: 'driver', label: 'Driver/Service Issue' },
                  { value: 'other', label: 'Other' }
                ]}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  value={reportData.description}
                  onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                  placeholder="Describe your issue..."
                  required
                />
              </div>
              <Button type="submit" className="w-full">Submit Report</Button>
            </form>
          )}
        </section>
      </div>

      {/* 1. Emergency SOS Confirmation Modal */}
      <Modal
        isOpen={showSosConfirm}
        onClose={() => setShowSosConfirm(false)}
        title="Emergency SOS Alert"
        size="sm"
      >
        <div className="space-y-4 text-center">
          <div className="w-14 h-14 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle size={28} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-base">
              Are you sure you want to send an emergency SOS alert?
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              This will broadcast your location coordinates and urgent safety alert to your emergency contacts and local tourist authorities.
            </p>
          </div>
          <div className="flex space-x-3 pt-3">
            <button
              type="button"
              onClick={() => setShowSosConfirm(false)}
              className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSos}
              className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition text-sm shadow-md"
            >
              Send SOS
            </button>
          </div>
        </div>
      </Modal>

      {/* 4. Chat Support Modal */}
      <Modal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        title="Smart-Ride Support Assistant"
        size="md"
      >
        <div className="flex flex-col h-[480px]">
          {/* Header indicator */}
          <div className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-xl flex items-center justify-between text-xs text-blue-700 dark:text-blue-300 mb-3 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="font-semibold">Support Chatbot (Demo)</span>
            </div>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">24/7 Available</span>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end space-x-2 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400 dark:text-gray-400'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center flex-shrink-0">
                    <UserIcon size={16} />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Query Suggestions */}
          <div className="pt-2 pb-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-1.5 overflow-x-auto py-1 text-xs">
              <span className="text-[11px] text-gray-400 flex-shrink-0">Common:</span>
              {['Booking', 'Emergency', 'Hotel', 'Bus', 'Cab', 'Maps'].map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleSendMessage(topic)}
                  className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap text-[11px]"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2 pt-1"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors shadow-sm"
              aria-label="Send Message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
