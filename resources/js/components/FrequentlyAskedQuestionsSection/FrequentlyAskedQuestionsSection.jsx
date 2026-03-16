import React, { useState } from 'react';
import { ChevronDownIcon } from "lucide-react";

const faqItems = [
  {
    id: 1,
    question: "When Exclusive Private Market for Event ticket sale Opportunities ?",
    answer: "Our exclusive private market opens periodically for premium event ticket sales. Members get early access to high-demand events and special pricing opportunities."
  },
  {
    id: 2,
    question: "If Easy to find subscription And Tickets purchase?",
    answer: "Yes! Our platform is designed for simplicity. You can easily browse events, subscribe to notifications, and purchase tickets in just a few clicks."
  },
  {
    id: 3,
    question: "Why Raise Your more Event & ticket?",
    answer: "We continuously expand our event catalog to offer you more variety and opportunities. Our growing network ensures you have access to the best events in your area."
  },
  {
    id: 4,
    question: "I haven't received my e-ticket. What should I do?",
    answer: "If you haven't received your e-ticket within 24 hours of purchase, please check your spam folder first. Then contact our support team with your order number for immediate assistance."
  },
  {
    id: 5,
    question: "How More Supply and more Event for future ?",
    answer: "We're constantly working with event organizers to bring you more options. Our platform grows daily with new events, concerts, and experiences for you to enjoy."
  },
  {
    id: 6,
    question: "How Comprehensive Compliance for Event Ticket Purchase?",
    answer: "We ensure full compliance with all local regulations and industry standards. Every transaction is secure, verified, and protected by our comprehensive compliance framework."
  }
];

function FrequentlyAskedQuestionsSection() {
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (id) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="relative w-full py-20 px-[108px] flex flex-col items-center gap-8">
      <header className="flex flex-col items-center gap-2 max-w-2xl">
        <h2 className="[font-family:'Inter',Helvetica] font-semibold text-4xl leading-[48px] text-center">
          <span className="text-[#ffffff]">Frequently Asked </span>
          <span className="text-[#E4AFF8]">Questions</span>
        </h2>
        <p className="text-center text-[#999999] text-base leading-6 mt-2">
          Explore the most common questions and detailed answers about our events or concerts, and security to help guide your journey in the MyTicket.
        </p>
      </header>

      {/* FAQ Items */}
      <div className="w-full max-w-4xl flex flex-col gap-4">
        {faqItems.map((item) => {
          const isOpen = openItems.includes(item.id);
          
          return (
            <div
              key={item.id}
              className="bg-[#1B1B1B] rounded-xl border border-[#303030] overflow-hidden transition-all duration-300 hover:border-[#404040]"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full p-6 flex items-center gap-4 cursor-pointer focus:outline-none"
              >
                <div className="size-6 rounded-full bg-[#2A2A2A] border-white border-2 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm leading-none font-semibold">?</span>
                </div>

                <div className="flex-1 text-left">
                  <p className="[font-family:'Inter',Helvetica] font-medium text-base leading-6 text-[#ffffff]">
                    {item.question}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <ChevronDownIcon 
                    className={`w-5 h-5 text-white transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pl-[72px]">
                  <p className="[font-family:'Inter',Helvetica] font-normal text-sm leading-6 text-[#999999]">
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
