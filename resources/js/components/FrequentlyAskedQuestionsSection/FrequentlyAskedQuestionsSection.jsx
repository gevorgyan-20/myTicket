import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Minus, HelpCircle } from "lucide-react";

function FrequentlyAskedQuestionsSection() {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState([]);

  const faqItems = [
    { id: 1, question: t('faq.questions.q1.q'), answer: t('faq.questions.q1.a') },
    { id: 3, question: t('faq.questions.q3.q'), answer: t('faq.questions.q3.a') },
    { id: 4, question: t('faq.questions.q4.q'), answer: t('faq.questions.q4.a') },
    { id: 5, question: t('faq.questions.q5.q'), answer: t('faq.questions.q5.a') },
    { id: 6, question: t('faq.questions.q6.q'), answer: t('faq.questions.q6.a') },
  ];

  const toggleItem = (id) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="w-full py-24 flex flex-col items-center gap-16">
      <header className="flex flex-col items-center gap-4 text-center px-4">
        <h2 className="font-poppins text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
          {t('faq.title1')} <span className="text-purple-500">{t('faq.title2')}</span>
        </h2>
        <p className="text-gray-500 max-w-xl text-sm md:text-base">
          {t('faq.subtitle')}
        </p>
      </header>

      <div className="w-full max-w-4xl flex flex-col gap-4">
        {faqItems.map((item) => {
          const isOpen = openItems.includes(item.id);
          
          return (
            <div
              key={item.id}
              className={`group rounded-3xl border transition-all duration-500 ${
                isOpen 
                    ? "bg-white/5 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)]" 
                    : "bg-transparent border-white/10 hover:border-white/20"
              }`}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full p-6 md:p-8 flex items-center gap-6 cursor-pointer focus:outline-none"
              >
                <div className={`flex-shrink-0 p-3 rounded-2xl transition-colors duration-500 ${isOpen ? "bg-purple-600 text-white" : "bg-white/5 text-purple-400"}`}>
                  <HelpCircle size={24} />
                </div>

                <span className={`flex-1 text-left text-lg md:text-xl font-bold transition-colors duration-500 ${isOpen ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
                  {item.question}
                </span>

                <div className={`flex-shrink-0 transition-transform duration-500 ${isOpen ? "rotate-0" : "rotate-90"}`}>
                  {isOpen ? <Minus size={20} className="text-purple-400" /> : <Plus size={20} className="text-gray-500" />}
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-8 md:px-8 md:pb-10 md:pl-[92px]">
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FrequentlyAskedQuestionsSection;
