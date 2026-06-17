export default function FilterBar({
  
  originCountry,
  setOriginCountry,
  destinationCountry,
  setDestinationCountry,
  maxDistance,
  setMaxDistance,
  sortBy,
  setSortBy,
  countries,
  startDate,
setStartDate,
endDate,
setEndDate,
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* Search
        <input
          type="text"
          placeholder="Search postcard ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2"
        /> */}
        {/* Start Date */}
<input
  type="date"
  value={startDate}
 
  onChange={(e) =>
    setStartDate(e.target.value)
  }
  className="border rounded-lg p-2"
/>

{/* End Date */}
<input
  type="date"
  value={endDate}
  onChange={(e) =>
    setEndDate(e.target.value)
  }
  className="border rounded-lg p-2"
/>

        {/* Origin Country */}
        <select
          value={originCountry}
          onChange={(e) =>
            setOriginCountry(e.target.value)
          }
          className="border rounded-lg p-2"
        >
          <option value="">
            All Origin Countries
          </option>

          {countries.map((country) => (
            <option
              key={country}
              value={country}
            >
              {country}
            </option>
          ))}
        </select>
        

        {/* Destination Country */}
        <select
          value={destinationCountry}
          onChange={(e) =>
            setDestinationCountry(e.target.value)
          }
          className="border rounded-lg p-2"
        >
          <option value="">
            All Destination Countries
          </option>

          {countries.map((country) => (
            <option
              key={country}
              value={country}
            >
              {country}
            </option>
          ))}
        </select>

        {/* Distance */}
        <input
          type="number"
          placeholder="Max distance (km)"
          value={maxDistance}
          onChange={(e) =>
            setMaxDistance(e.target.value)
          }
          className="border rounded-lg p-2"
        />

        {/* Sorting */}
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
          className="border rounded-lg p-2"
        >
          <option value="">
            Sort By
          </option>

          <option value="distanceAsc">
            Distance ↑
          </option>

          <option value="distanceDesc">
            Distance ↓
          </option>

          <option value="timeAsc">
            Travel Time ↑
          </option>

          <option value="timeDesc">
            Travel Time ↓
          </option>
        </select>
      </div>
    </div>
  );
}