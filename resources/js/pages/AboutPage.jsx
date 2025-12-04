import React from "react";

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1 className="about-title">About MyTicket.am</h1>

        <p className="about-text">
          MyTicket.am is a modern platform designed for booking tickets to the
          most exciting movies, concerts, theatre performances, and standup shows
          across Armenia. Our mission is to give users a fast, simple, and secure
          way to discover upcoming events and reserve their seats without any
          hassle.
        </p>

        <p className="about-text">
          This project was created to bring all entertainment categories into one
          unified system where users can easily browse events, explore details,
          check schedules, and purchase tickets anytime. We aim to make event
          discovery effortless and enjoyable for everyone — whether you're a movie
          fan, a concert lover, or someone looking for a fun night out.
        </p>

        <p className="about-text">
          From a technical perspective, MyTicket.am is built using React.js for
          the frontend, Laravel (PHP) for the backend, and MySQL as the database.
          This modern tech stack ensures strong performance, stable operations, and
          flexibility for future expansions as the platform grows.
        </p>

        <p className="about-text">
          The project reflects our goal to improve Armenia’s digital entertainment
          landscape and provide a user-friendly, reliable ticketing experience for
          everyone.
        </p>

        <p className="about-thanks">
          Thank you for choosing MyTicket.am!
        </p>
      </div>
    </div>
  );
}
