import React, { useState } from 'react';
import { Card, CardContent } from "../UI/Card";
import "./UserReviewsSection.css";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const gradientId = `half-fill-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 0L10.163 5.52786L16 6.11146L12 10.0557L12.9443 16L8 13.163L3.05573 16L4 10.0557L0 6.11146L5.83704 5.52786L8 0Z" fill="#E4AFF8"/>
        </svg>
      ))}
      {hasHalfStar && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="#E4AFF8"/>
              <stop offset="50%" stopColor="transparent" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M8 0L10.163 5.52786L16 6.11146L12 10.0557L12.9443 16L8 13.163L3.05573 16L4 10.0557L0 6.11146L5.83704 5.52786L8 0Z" fill={`url(#${gradientId})`} stroke="#E4AFF8" strokeWidth="0.5"/>
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 0L10.163 5.52786L16 6.11146L12 10.0557L12.9443 16L8 13.163L3.05573 16L4 10.0557L0 6.11146L5.83704 5.52786L8 0Z" fill="none" stroke="#E4AFF8" strokeWidth="1" opacity="0.3"/>
        </svg>
      ))}
    </div>
  );
};

const userReviewsRow1 = [
  { 
    name: "Esther Howard", 
    text: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat. Morbi in orci risus. Donec pretium f", 
    image: "/image-292-35.png",
    rating: 4
  },
  { 
    name: "Jane Cooper", 
    text: "Vestibulum eu quam nec neque pellentesque efficitur id eget nisl. Proin porta est convallis lacus bl", 
    image: "/image-292-15.png",
    rating: 4
  },
  { 
    name: "Leslie Alexander", 
    text: "Aliquam porta nisl dolor, molestie pellentesque elit molestie in. Morbi metus neque, elementum ullam", 
    image: "/image-292-16.png",
    rating: 4
  },
  {
    name: "Jenny Wilson",
    text: "Aliquam porta nisl dolor, molestie pellentesque elit molestie in. Morbi metus neque, elementum ullam",
    image: "/image-292-17.png",
    rating: 3
  },
  {
    name: "Ari Zelmanow",
    text: "tely love using Evenjo! I tickets for Adele's concert in and the whole process was so",
    image: "/image-292-18.png",
    rating: 4
  },
  {
    name: "Jerome Bell",
    text: "Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus. P",
    image: "/image-292-19.png",
    rating: 4
  },
  {
    name: "Kristin Watson",
    text: "Vestibulum eu quam nec neque pellentesque efficitur id eget nisl. Proin porta est convallis lacus bl",
    image: "/image-292-20.png",
    rating: 3.5
  },
  {
    name: "Bessie Cooper",
    text: "In a laoreet purus. Integer turpis quam, laoreet id orci nec, ultrices lacinia nunc. Aliquam erat vo",
    image: "/image-292-35.png",
    rating: 4
  },
  { 
    name: "Esther Howard", 
    text: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat. Morbi in orci risus. Donec pretium f", 
    image: "/image-292-35.png",
    rating: 4
  },
  { 
    name: "Jane Cooper", 
    text: "Vestibulum eu quam nec neque pellentesque efficitur id eget nisl. Proin porta est convallis lacus bl", 
    image: "/image-292-15.png",
    rating: 4
  },
  { 
    name: "Leslie Alexander", 
    text: "Aliquam porta nisl dolor, molestie pellentesque elit molestie in. Morbi metus neque, elementum ullam", 
    image: "/image-292-16.png",
    rating: 4
  },
  {
    name: "Jenny Wilson",
    text: "Aliquam porta nisl dolor, molestie pellentesque elit molestie in. Morbi metus neque, elementum ullam",
    image: "/image-292-17.png",
    rating: 3
  },
  {
    name: "Ari Zelmanow",
    text: "tely love using Evenjo! I tickets for Adele's concert in and the whole process was so",
    image: "/image-292-18.png",
    rating: 4
  },
  {
    name: "Jerome Bell",
    text: "Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus. P",
    image: "/image-292-19.png",
    rating: 4
  },
  {
    name: "Kristin Watson",
    text: "Vestibulum eu quam nec neque pellentesque efficitur id eget nisl. Proin porta est convallis lacus bl",
    image: "/image-292-20.png",
    rating: 3.5
  },
  {
    name: "Bessie Cooper",
    text: "In a laoreet purus. Integer turpis quam, laoreet id orci nec, ultrices lacinia nunc. Aliquam erat vo",
    image: "/image-292-35.png",
    rating: 4
  },
];

const userReviewsRow2 = [
  {
    name: "Ralph Edwards",
    text: "In a laoreet purus. Integer laoreet id orci nec, ultrices nunc. Aliquam erat vo",
    image: "/image-292-36.png",
    rating: 4
  },
  { 
    name: "Esther Howard", 
    text: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat. Morbi in orci risus. Donec pretium f", 
    image: "/image-292-37.png",
    rating: 4
  },
  { 
    name: "Jane Cooper", 
    text: "Vestibulum eu quam nec neque pellentesque efficitur id eget nisl. Proin porta est convallis lacus bl", 
    image: "/image-292-38.png",
    rating: 4
  },
  {
    name: "Leslie Alexander",
    text: "Aliquam porta nisl dolor, molestie pellentesque elit molestie in. Morbi metus neque, elementum ullam",
    image: "/image-292-39.png",
    rating: 4
  },
  {
    name: "Jenny Wilson",
    text: "Aliquam porta nisl dolor, molestie pellentesque elit molestie in. Morbi metus neque, elementum ullam",
    image: "/image-292-40.png",
    rating: 3
  },
  {
    name: "Ari Zelmanow",
    text: "tely love using Evenjo! I tickets for Adele's concert in and the whole process was so",
    image: "/image-292-41.png",
    rating: 4
  },
  {
    name: "Jerome Bell",
    text: "Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus. P",
    image: "/image-292-35.png",
    rating: 4
  },
  {
    name: "Kristin Watson",
    text: "Vestibulum eu quam nec neque pellentesque efficitur id eget nisl. Proin porta est convallis lacus bl",
    image: "/image-292-15.png",
    rating: 3.5
  },
  {
    name: "Bessie Cooper",
    text: "In a laoreet purus. Integer turpis quam, laoreet id orci nec, ultrices lacinia nunc. Aliquam erat vo",
    image: "/image-292-16.png",
    rating: 4
  },
  {
    name: "Ralph Edwards",
    text: "In a laoreet purus. Integer laoreet id orci nec, ultrices nunc. Aliquam erat vo",
    image: "/image-292-17.png",
    rating: 4
  },
  { 
    name: "Esther Howard", 
    text: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat. Morbi in orci risus. Donec pretium f", 
    image: "/image-292-18.png",
    rating: 4
  },
  { 
    name: "Jane Cooper", 
    text: "Vestibulum eu quam nec neque pellentesque efficitur id eget nisl. Proin porta est convallis lacus bl", 
    image: "/image-292-19.png",
    rating: 4
  },
  {
    name: "Leslie Alexander",
    text: "Aliquam porta nisl dolor, molestie pellentesque elit molestie in. Morbi metus neque, elementum ullam",
    image: "/image-292-20.png",
    rating: 4
  },
  {
    name: "Jenny Wilson",
    text: "Aliquam porta nisl dolor, molestie pellentesque elit molestie in. Morbi metus neque, elementum ullam",
    image: "/image-292-35.png",
    rating: 3
  },
  {
    name: "Ari Zelmanow",
    text: "tely love using Evenjo! I tickets for Adele's concert in and the whole process was so",
    image: "/image-292-36.png",
    rating: 4
  },
  {
    name: "Jerome Bell",
    text: "Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus. P",
    image: "/image-292-37.png",
    rating: 4
  },
];

function UserReviewsSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="flex flex-col w-full items-center gap-8 pb-[98px] relative">
      <header className="flex flex-col max-w-[461px] items-center gap-2">
        <h2 className="[font-family:'Inter', Helvetica] font-medium leading-[34px] text-[#ffffff] text-[28px] text-center">
          Loved by Thousands
        </h2>

        <p className="text-center leading-[19px]">
          <span className="text-[#999999]">
            Smooth, easy ticket buying — hear it from our happy users.
          </span>
        </p>
      </header>
    
      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-[120px] z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #0D0D0D 0%, rgba(13, 13, 13, 0.8) 50%, transparent 100%)'
          }}
        />
        
        <div className="absolute right-0 top-0 bottom-0 w-[120px] z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #0D0D0D 0%, rgba(13, 13, 13, 0.8) 50%, transparent 100%)'
          }}
        />

        <div
            className="w-screen flex flex-col gap-4 relative -left-[108px] overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
            className={`flex gap-4 animate-marquee-right ${isHovered ? 'paused' : ''}`}
            style={{ width: "max-content" }}
            >
            {[...userReviewsRow1, ...userReviewsRow1].map((review, index) => (
                <Card
                key={`row1-${index}`}
                className="flex-shrink-0 w-[320px] bg-[#191919] rounded-xl border border-solid border-[#303030] hover:border-[#404040] transition-colors"
                >
                <CardContent className="flex flex-col gap-4 p-4">
                    <p className="[font-family:'Inter',Helvetica] font-normal text-[#ffffff] text-sm leading-[20px] line-clamp-3">
                        {review.text}
                    </p>
                    <div className="flex items-center gap-3">
                        <img
                        className="w-10 h-10 rounded-full object-cover"
                        alt={review.name}
                        src={review.image}
                        />
                        <div className="flex flex-col gap-1">
                            <div className="[font-family:'Inter',Helvetica] font-medium text-[#ffffff] text-base tracking-[0] leading-[normal]">
                                {review.name}
                            </div>
                            <StarRating rating={review.rating} />
                        </div>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>

            <div
            className={`flex gap-4 animate-marquee-left ${isHovered ? 'paused' : ''}`}
            style={{ width: "max-content" }}
            >
            {[...userReviewsRow2, ...userReviewsRow2].map((review, index) => (
                <Card
                key={`row2-${index}`}
                className="flex-shrink-0 w-[320px] bg-[#191919] rounded-xl border border-solid border-[#303030] hover:border-[#404040] transition-colors"
                >
                <CardContent className="flex flex-col gap-4 p-4">
                    <p className="[font-family:'Inter',Helvetica] font-normal text-[#ffffff] text-sm leading-[20px] line-clamp-3">
                        {review.text}
                    </p>
                    <div className="flex items-center gap-3">
                        <img
                        className="w-10 h-10 rounded-full object-cover"
                        alt={review.name}
                        src={review.image}
                        />
                        <div className="flex flex-col gap-1">
                            <div className="[font-family:'Inter',Helvetica] font-medium text-[#ffffff] text-base tracking-[0] leading-[normal]">
                                {review.name}
                            </div>
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