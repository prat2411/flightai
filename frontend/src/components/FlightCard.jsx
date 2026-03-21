import "./FlightCard.css";
import { Link } from "react-router-dom";

const formatFlightDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return parsed.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const FlightCard = ({ flight }) => {
  const hasSeats = Number(flight.seats) > 0;

  return (
    <article className="flight-card">
      <div className="flight-card-top">
        <h3>
          {flight.from} to {flight.to}
        </h3>
        <span className="flight-airline">{flight.airline}</span>
      </div>

      <p className="flight-date">{formatFlightDate(flight.date)}</p>

      <div className="flight-metrics">
        <div>
          <span className="metric-label">Price</span>
          <strong className="metric-value">Rs {flight.price}</strong>
        </div>
        <div>
          <span className="metric-label">Seats</span>
          <strong className="metric-value">{flight.seats}</strong>
        </div>
      </div>

      <div className="flight-actions">
        {hasSeats ? (
          <Link
            className="flight-book-btn"
            to={flight._id ? `/booking?flightId=${encodeURIComponent(flight._id)}` : "/booking"}
            state={{ flight }}
          >
            Book Now
          </Link>
        ) : (
          <span className="flight-sold-out">Sold out</span>
        )}
      </div>
    </article>
  );
};

export default FlightCard;
