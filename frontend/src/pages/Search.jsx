import { useState } from "react";

import { buildApiUrl } from "../api/config";
import FlightCard from "../components/FlightCard";
import "./Search.css";

const Search = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      if (from.trim()) {
        queryParams.append("from", from.trim());
      }
      if (to.trim()) {
        queryParams.append("to", to.trim());
      }
      if (date) {
        queryParams.append("date", date);
      }

      const query = queryParams.toString();
      const url = query ? buildApiUrl(`/api/flights?${query}`) : buildApiUrl("/api/flights");

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch flights");
      }

      setFlights(Array.isArray(data) ? data : []);
      setSearched(true);
    } catch (requestError) {
      setFlights([]);
      setSearched(true);
      setError(requestError.message || "Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="search-page">
      <header className="search-header">
        <h1>Search Flights</h1>
        <p>Find flights by source, destination, and travel date.</p>
      </header>

      <form className="search-form" onSubmit={handleSearch}>
        <label htmlFor="search-from">
          From
          <input
            id="search-from"
            type="text"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            placeholder="Delhi"
          />
        </label>

        <label htmlFor="search-to">
          To
          <input
            id="search-to"
            type="text"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            placeholder="Mumbai"
          />
        </label>

        <label htmlFor="search-date">
          Date
          <input
            id="search-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search Flights"}
        </button>
      </form>

      {error ? <p className="search-error">{error}</p> : null}

      {searched && !loading && !error && flights.length === 0 ? (
        <p className="search-empty">No flights found for the selected filters.</p>
      ) : null}

      <div className="search-results">
        {flights.map((flight) => (
          <FlightCard key={flight._id || `${flight.from}-${flight.to}-${flight.date}`} flight={flight} />
        ))}
      </div>
    </section>
  );
};

export default Search;
