import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const formatDateTime = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return parsed.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/bookings/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch bookings");
        }

        setBookings(Array.isArray(data) ? data : []);
      } catch (requestError) {
        setBookings([]);
        setError(requestError.message || "Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate, token]);

  const activeBookings = useMemo(
    () => bookings.filter((booking) => booking.status !== "cancelled"),
    [bookings]
  );

  const handleCancel = async (bookingId) => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setCancelingId(bookingId);
    setError("");

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to cancel booking");
      }

      setBookings((previous) => previous.filter((booking) => booking._id !== bookingId));
    } catch (requestError) {
      setError(requestError.message || "Failed to cancel booking.");
    } finally {
      setCancelingId("");
    }
  };

  return (
    <section className="dashboard-page">
      <header className="dashboard-header">
        <h1>{user?.name ? `${user.name}'s Dashboard` : "Dashboard"}</h1>
        <p>Review all your upcoming bookings and cancel if your plans change.</p>
      </header>

      {loading ? <p className="dashboard-muted">Loading bookings...</p> : null}
      {error ? <p className="dashboard-error">{error}</p> : null}

      {!loading && !error && activeBookings.length === 0 ? (
        <p className="dashboard-muted">No bookings found yet. Book your first flight from Search.</p>
      ) : null}

      <div className="booking-grid">
        {activeBookings.map((booking) => {
          const flight = booking.flightId && typeof booking.flightId === "object" ? booking.flightId : null;

          return (
            <article key={booking._id} className="booking-card">
              <div className="booking-card-top">
                <h3>{flight ? `${flight.from} to ${flight.to}` : "Flight details unavailable"}</h3>
                <span className="booking-status">{booking.status}</span>
              </div>

              <p className="booking-meta">
                {flight ? formatDateTime(flight.date) : "Date unavailable"}
              </p>

              <div className="booking-tags">
                <span>{flight?.airline || "Unknown airline"}</span>
                <span>{booking.passengers} passenger(s)</span>
                <span>Booked on {formatDateTime(booking.bookingDate)}</span>
              </div>

              <button
                type="button"
                className="booking-cancel-btn"
                onClick={() => handleCancel(booking._id)}
                disabled={cancelingId === booking._id}
              >
                {cancelingId === booking._id ? "Canceling..." : "Cancel Booking"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Dashboard;
