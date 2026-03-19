import "./FlightCard.css";

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
    </article>
  );
};

export default FlightCard;
