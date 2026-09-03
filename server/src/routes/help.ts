import { Router, Request, Response } from 'express';

const router = Router();

const emergencyContacts = {
  india: {
    police: '100',
    ambulance: '102',
    fire: '101',
    women: '1091',
    tourist: '1363'
  },
  international: {
    us: { emergency: '911' },
    uk: { emergency: '999' }
  }
};

const faqs = [
  { question: 'How to book a ride?', answer: 'Go to bookings tab and click new.' },
  { question: 'Is my data safe?', answer: 'Yes, we encrypt all personal data.' },
  { question: 'How to contact support?', answer: 'Use the help section in the app.' },
  { question: 'Can I cancel my trip?', answer: 'Yes, up to 24 hours before departure.' },
  { question: 'What forms of ID are accepted?', answer: 'Aadhaar and Passport.' },
  { question: 'Are there student discounts?', answer: 'Check our offers section.' },
  { question: 'How does emergency SOS work?', answer: 'It alerts your contacts and local authorities.' },
  { question: 'Can I share my route?', answer: 'Yes, from the maps screen.' }
];

router.get('/emergency-contacts', (req: Request, res: Response) => {
  res.json(emergencyContacts);
});

router.get('/faqs', (req: Request, res: Response) => {
  res.json(faqs);
});

export default router;
