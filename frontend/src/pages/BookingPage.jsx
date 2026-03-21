import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { buildApiUrl } from "../api/config";
import { useAuth } from "../context/AuthContext";
import "./BookingPage.css";

const formatDateTime = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return parsed.toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  });
};

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const [flight, setFlight] = useState(location.state?.flight || null);
  const [passengers, setPassengers] = useState(1);
  const [loadingFlight, setLoadingFlight] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const flightIdFromQuery = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return query.get("flightId");
  }, [location.search]);

  useEffect(() => {
    const loadFlight = async () => {
      if (!flightIdFromQuery) {
        return;
      }

      setLoadingFlight(true);
      setError("");

      try {
        const response = await fetch(buildApiUrl(`/api/flights/${flightIdFromQuery}`));
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch flight details");
        }

        setFlight(data);
      } catch (requestError) {
        setFlight(null);
        setError(requestError.message || "Failed to load selected flight.");
      } finally {
        setLoadingFlight(false);
      }
    };

    loadFlight();
  }, [flightIdFromQuery]);

  const handleBook = async () => {
    setError("");
    setSuccess("");

    if (!token) {
      navigate("/login", { replace: true, state: { from: location } });
      return;
    }

    if (!flight?._id) {
      setError("Please select a valid flight before booking.");
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch(buildApiUrl("/api/bookings"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          flightId: flight._id,
          passengers,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to create booking");
      }

      setSuccess("Booking confirmed successfully.");
    } catch (requestError) {
      setError(requestError.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <section className="booking-page">
      <header className="booking-header">
        <h1>Book Flight</h1>
        <p>Review your selected flight and confirm passenger details.</p>
      </header>

      {loadingFlight ? <p className="booking-muted">Loading flight details...</p> : null}

      {!loadingFlight && !flight ? (
        <div className="booking-empty">
          <p>No flight selected yet.</p>
          <Link to="/search">Go to Search Flights</Link>
        </div>
      ) : null}

      {flight ? (
        <div className="booking-layout">
          <article className="booking-flight-card">
            <h2>
              {flight.from} to {flight.to}
            </h2>
            <p>{formatDateTime(flight.date)}</p>
            <div className="booking-flight-meta">
              <span>{flight.airline}</span>
              <span>Rs {flight.price}</span>
              <span>{flight.seats} seats left</span>
            </div>
          </article>

          <div className="booking-form-card">
            <label htmlFor="passenger-count">
              Passenger Count
              <input
                id="passenger-count"
                type="number"
                min={1}
                max={9}
                value={passengers}
                onChange={(event) => setPassengers(Number(event.target.value) || 1)}
              />
            </label>

            <button type="button" onClick={handleBook} disabled={bookingLoading}>
              {bookingLoading ? "Booking..." : "Book Now"}
            </button>

            {error ? <p className="booking-error">{error}</p> : null}
            {success ? <p className="booking-success">{success}</p> : null}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Booking;
