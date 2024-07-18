import React, { useState, useEffect } from "react";
import "./ManageInstruments.css";
import FilterModal from "./FilterModal";
import { useNavigate } from "react-router-dom";

interface Instrument {
  _id: string;
  instrumentName: string;
  classID: string;
  className?: string;
  fileURL: string;
  Owner: string;
  firstCreatedDate: string | null;
  lastModifiedDate: string | null;
  nextReviewDate: string | null;
  associatedInstruments: string[];
  accessRoles: string[];
  keywords: string[];
  layout: string;
  version: number;
}

const ManageInstruments: React.FC = () => {
  const navigate = useNavigate();

  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [filteredInstruments, setFilteredInstruments] = useState<Instrument[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [activePopover, setActivePopover] = useState<string | null>(null);

  useEffect(() => {
    fetchInstruments();
  }, []);

  const fetchInstruments = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/instruments");
      if (!response.ok) {
        throw new Error("Failed to fetch instruments");
      }
      const data = await response.json();

      setInstruments(data);
      setFilteredInstruments(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch instruments");
      setLoading(false);
    }
  };

  /*const handleViewClick = (fileURL: string) => {
    if (fileURL) {
      window.open(fileURL, "_blank");
    } else {
      alert("File URL is not available");
    }
  };
  */
  //direct to the instrument detail page.
  const handleViewClick = (instrumentId: string) => {
    navigate(`/instrument/${instrumentId}`);
  };

  const handleDeleteClick = (instrumentId: string) => {
    // Implement delete functionality here
    console.log(`Delete instrument with ID: ${instrumentId}`);
  };

  const handleFilterClick = () => {
    setFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setFilterModalOpen(false);
  };

  const handleFilterApply = (name: string, cls: string) => {
    setFilterName(name);
    setFilterClass(cls);

    const filtered = instruments.filter((instrument) => {
      const matchesName =
        name === "" ||
        instrument.instrumentName.toLowerCase().includes(name.toLowerCase());
      const matchesClass =
        cls === "" || instrument.className?.toLowerCase() === cls.toLowerCase();
      return matchesName && matchesClass;
    });

    setFilteredInstruments(filtered);
  };

  const handleFilterReset = () => {
    setFilterName("");
    setFilterClass("");
    setFilteredInstruments(instruments);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const togglePopover = (instrumentId: string) => {
    setActivePopover(activePopover === instrumentId ? null : instrumentId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="manage-instruments">
      <h1>Manage Instruments</h1>
      <button className="filter-btn" onClick={handleFilterClick}>
        <span className="icon">🔍</span> Filter
      </button>
      <div className="instrument-count">
        Found {filteredInstruments.length} instrument
        {filteredInstruments.length !== 1 ? "s" : ""}
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Title of Instruments</th>
              <th>Owner</th>
              <th>Date of Published</th>
              <th>Last Modified</th>
              <th>Next Review Date</th>
              <th>Associated Instruments</th>
              <th>Access Roles</th>
              <th>Keywords</th>
              <th>Layout</th>
              <th>Version</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstruments.map((instrument) => (
              <tr key={instrument._id}>
                <td>{instrument.className || "N/A"}</td>
                <td>{instrument.instrumentName}</td>
                <td>{instrument.Owner}</td>
                <td>{formatDate(instrument.firstCreatedDate)}</td>
                <td>{formatDate(instrument.lastModifiedDate)}</td>
                <td>{formatDate(instrument.nextReviewDate)}</td>
                <td>
                  {instrument.associatedInstruments &&
                  instrument.associatedInstruments.length > 0
                    ? instrument.associatedInstruments.join(", ")
                    : "N/A"}
                </td>
                <td>{instrument.accessRoles.join(", ")}</td>
                <td>
                  {instrument.keywords && instrument.keywords.length > 0
                    ? instrument.keywords.join(", ")
                    : "N/A"}
                </td>
                <td>{instrument.layout}</td>
                <td>{instrument.version}</td>
                <td>
                  <div className="actions-container">
                    <button
                      className="more-btn"
                      onClick={() => togglePopover(instrument._id)}
                    >
                      &#8942; {/* Unicode for vertical ellipsis */}
                    </button>
                    {activePopover === instrument._id && (
                      <div className="popover">
                        {/*                         <button
                          onClick={() => handleViewClick(instrument.fileURL)}
                        >
                          View
                        </button> */}
                        <button onClick={() => handleViewClick(instrument._id)}>
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteClick(instrument._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filterModalOpen && (
        <FilterModal
          isOpen={filterModalOpen}
          onClose={handleCloseFilterModal}
          onApply={handleFilterApply}
          onReset={handleFilterReset}
        />
      )}
    </div>
  );
};

export default ManageInstruments;

/*
import React, { useState, useEffect } from "react";
import "./ManageInstruments.css";
import FilterModal from "./FilterModal";

interface Instrument {
  _id: string;
  instrumentName: string;
  classID: string;
  className?: string;
  fileURL: string;
  fileName: string;
  firstCreatedDate: string;
  lastModifiedDate: string;
  accessRoles: string[];
}

const ManageInstruments: React.FC = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [filteredInstruments, setFilteredInstruments] = useState<Instrument[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterClass, setFilterClass] = useState("");

  useEffect(() => {
    fetchInstruments();
  }, []);

  const fetchInstruments = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/instruments");
      if (!response.ok) {
        throw new Error("Failed to fetch instruments");
      }
      const data = await response.json();

      // Fetch class names for each instrument
      const instrumentsWithClassNames = await Promise.all(
        data.map(async (instrument: Instrument) => {
          if (instrument.classID) {
            const classResponse = await fetch(
              `http://localhost:3000/api/classes/${instrument.classID}`
            );
            if (!classResponse.ok) {
              return instrument;
            }
            const classData = await classResponse.json();
            return { ...instrument, className: classData.className };
          } else {
            return instrument;
          }
        })
      );

      setInstruments(instrumentsWithClassNames);
      setFilteredInstruments(instrumentsWithClassNames);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch instruments");
      setLoading(false);
    }
  };

  const handleViewClick = (fileURL: string) => {
    if (fileURL) {
      window.location.href = fileURL;
    } else {
      alert("File URL is not available");
    }
  };

  const handleFilterClick = () => {
    setFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setFilterModalOpen(false);
  };

  const handleFilterApply = (name: string, cls: string) => {
    setFilterName(name);
    setFilterClass(cls);

    const filtered = instruments.filter((instrument) => {
      const matchesName =
        name === "" ||
        instrument.instrumentName.toLowerCase().includes(name.toLowerCase());
      const matchesClass =
        cls === "" || instrument.className?.toLowerCase() === cls.toLowerCase();
      return matchesName && matchesClass;
    });

    setFilteredInstruments(filtered);
  };

  const handleFilterReset = () => {
    setFilterName("");
    setFilterClass("");
    setFilteredInstruments(instruments);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="manage-instruments">
      <h1>Manage Instruments</h1>
      <button className="filter-btn" onClick={handleFilterClick}>
        <span className="icon">🔍</span> Filter
      </button>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Title of Instruments</th>
              <th>Date of Published</th>
              <th>Last Modified</th>
              <th>Access Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstruments.map((instrument) => (
              <tr key={instrument._id}>
                <td>{instrument.className || "N/A"}</td>
                <td>{instrument.instrumentName}</td>
                <td>
                  {new Date(instrument.firstCreatedDate).toLocaleDateString()}
                </td>
                <td>
                  {new Date(instrument.lastModifiedDate).toLocaleDateString()}
                </td>
                <td>{instrument.accessRoles.join(", ")}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => handleViewClick(instrument.fileURL)}
                  >
                    View
                  </button>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filterModalOpen && (
        <FilterModal
          isOpen={filterModalOpen}
          onClose={handleCloseFilterModal}
          onApply={handleFilterApply}
          onReset={handleFilterReset}
        />
      )}
    </div>
  );
};

export default ManageInstruments;

*/
