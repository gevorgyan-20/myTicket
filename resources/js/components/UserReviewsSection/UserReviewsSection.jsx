import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "../UI/Card";
import { Star } from 'lucide-react';
import "./UserReviewsSection.css";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={14} fill="#A855F7" stroke="none" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star key="half" size={14} fill="#A855F7" stroke="none" style={{ clipPath: 'inset(0 50% 0 0)' }} />
          <Star key="half-empty" size={14} stroke="#A855F7" strokeWidth={1} className="absolute top-0 left-0 opacity-30" style={{ clipPath: 'inset(0 0 0 50%)' }} />
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={14} stroke="#A855F7" strokeWidth={1} className="opacity-30" />
      ))}
    </div>
  );
};

const userReviewsRow1 = [
  { name: "Esther Howard", text: "Truly a seamless experience. Booking my favorite concert was never this easy!", image: "https://i.pravatar.cc/150?u=esther", rating: 5 },
  { name: "Jane Cooper", text: "The interface is beautiful and the support team is incredibly helpful. Highly recommended!", image: "https://i.pravatar.cc/150?u=jane", rating: 4.5 },
  { name: "Leslie Alexander", text: "Found amazing deals for the upcoming film festival. The mobile experience is top-notch.", image: "https://i.pravatar.cc/150?u=leslie", rating: 4 },
  { name: "Jenny Wilson", text: "Quick, reliable, and modern. My go-to platform for all entertainment tickets.", image: "https://i.pravatar.cc/150?u=jenny", rating: 5 },
];

const userReviewsRow2 = [
  { name: "Ralph Edwards", text: "I love the new design updates. It feels like a premium service every time I visit.", image: "https://i.pravatar.cc/150?u=ralph", rating: 4 },
  { name: "Jerome Bell", text: "The best ticket platform in the country. Simple, fast, and very secure.", image: "https://i.pravatar.cc/150?u=jerome", rating: 5 },
  { name: "Kristin Watson", text: "I never miss a show thanks to their notifications. Great user experience!", image: "https://i.pravatar.cc/150?u=kristin", rating: 4.5 },
  { name: "Bessie Cooper", text: "The seat selection process is so intuitive. It's the little details that matter.", image: "https://i.pravatar.cc/150?u=bessie", rating: 4 },
];

function UserReviewsSection() {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const row1 = [...userReviewsRow1, ...userReviewsRow1, ...userReviewsRow1];
  const row2 = [...userReviewsRow2, ...userReviewsRow2, ...userReviewsRow2];

  return (
    <section className="flex flex-col w-full items-center gap-12 py-24 relative overflow-hidden">
      <header className="flex flex-col items-center gap-4 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
          {t('reviews.title')}
        </h2>
        <p className="text-gray-500 max-w-lg text-sm md:text-base">
          {t('reviews.subtitle')}
        </p>
      </header>
    
      <div 
        className="relative w-full flex flex-col gap-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex w-full overflow-hidden">
            <div className={`flex gap-6 animate-marquee-right ${isHovered ? 'paused' : ''} py-2`}>
                {row1.map((review, index) => (
                    <Card key={`row1-${index}`} className="flex-shrink-0 w-80 bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl">
                        <CardContent className="flex flex-col gap-5 p-6">
                            <p className="text-gray-300 text-sm leading-relaxed italic">
                                "{review.text}"
                            </p>
                            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                <img className="w-10 h-10 rounded-full ring-2 ring-purple-500/20" alt={review.name} src={review.image} />
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-sm">{review.name}</span>
                                    <StarRating rating={review.rating} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        <div className="flex w-full overflow-hidden">
            <div className={`flex gap-6 animate-marquee-left ${isHovered ? 'paused' : ''} py-2`}>
                {row2.map((review, index) => (
                    <Card key={`row2-${index}`} className="flex-shrink-0 w-80 bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl">
                        <CardContent className="flex flex-col gap-5 p-6">
                            <p className="text-gray-300 text-sm leading-relaxed italic">
                                "{review.text}"
                            </p>
                            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                <img className="w-10 h-10 rounded-full ring-2 ring-purple-500/20" alt={review.name} src={review.image} />
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-sm">{review.name}</span>
                                    <StarRating rating={review.rating} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default UserReviewsSection;