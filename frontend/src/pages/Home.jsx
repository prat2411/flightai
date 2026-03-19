import { Link } from "react-router-dom";

import "./Home.css";

const features = [
  {
    title: "Smart Fare Insights",
    description: "Track fare movements and book when prices are most favorable for your route.",
  },
  {
    title: "Reliable Schedules",
    description: "Search curated flights with dependable departure windows and transparent details.",
  },
  {
    title: "Secure Booking Flow",
    description: "Complete reservations with protected authentication and fast confirmation.",
  },
];

const Home = () => {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-kicker">FlightAI</p>
          <h1>Book Better Journeys Across India</h1>
          <p>
            Plan your next trip with a modern airline booking experience designed for speed,
            clarity, and confidence.
          </p>
          <div className="home-hero-actions">
            <Link className="home-btn home-btn-solid" to="/search">
              Search Flights
            </Link>
            <Link className="home-btn home-btn-outline" to="/register">
              Create Account
            </Link>
          </div>
        </div>
        <div className="home-hero-panel" aria-hidden="true">
          <p className="panel-title">Next Departure</p>
          <h3>Delhi to Mumbai</h3>
          <p>Boarding in 02h 45m</p>
          <div className="panel-chip-row">
            <span>On-time</span>
            <span>Direct</span>
            <span>From Rs 5,200</span>
          </div>
        </div>
      </section>

      <section className="home-features">
        <header>
          <h2>Why Travelers Choose Us</h2>
          <p>Everything you need to search, compare, and manage your flights in one place.</p>
        </header>

        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div>
          <h2>Ready to take off?</h2>
          <p>Sign in to access your dashboard, bookings, and personalized flight recommendations.</p>
        </div>
        <Link className="home-btn home-btn-solid" to="/login">
          Go to Dashboard
        </Link>
      </section>
    </div>
  );
};

export default Home;
