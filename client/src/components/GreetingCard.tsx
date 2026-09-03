import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Sunrise, Sunset } from 'lucide-react';

interface GreetingCardProps {
  name?: string;
}

export default function GreetingCard({ name }: GreetingCardProps) {
  const { t, i18n } = useTranslation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: t('home.goodMorning'), Icon: Sunrise };
    if (hour < 17) return { text: t('home.goodAfternoon'), Icon: Sun };
    if (hour < 20) return { text: t('home.goodEvening'), Icon: Sunset };
    return { text: t('home.goodNight'), Icon: Moon };
  };

  const { text, Icon } = getGreeting();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-US', dateOptions);

  return (
    <div className="bg-transparent pt-4 pb-2 flex flex-col md:flex-row md:items-end justify-between border-b border-primary-100 dark:border-primary-800">
      <div>
        <div className="flex items-center space-x-3 text-accent-dark dark:text-accent mb-2">
          <Icon strokeWidth={1.5} size={20} />
          <span className="text-sm font-medium tracking-widest uppercase">{text}</span>
        </div>
        <h1 className="text-4xl md:text-5xl text-primary-950 dark:text-white leading-tight font-bold">
          {name ? t('home.welcomeBack', { name }) : t('home.welcomeBackGuest')}
        </h1>
        <p className="text-primary-500 dark:text-primary-400 mt-2 font-light">{t('home.curatedJourneys')}</p>
      </div>
      <div className="mt-6 md:mt-0 text-sm tracking-wide text-primary-400 dark:text-primary-500 uppercase">
        {currentDate}
      </div>
    </div>
  );
}
