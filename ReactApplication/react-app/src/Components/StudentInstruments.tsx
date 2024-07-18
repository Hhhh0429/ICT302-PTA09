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
  accessRoles: string[];
  layout: string;
  version: number;
}

interface StudentInstrumentsProps {
  isStaff: boolean;
  isAdmin: boolean;
}

const StudentInstruments: React.FC<StudentInstrumentsProps> = ({
  isStaff,
  isAdmin,
}) => {
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
  }, [isStaff, isAdmin]);

  const fetchInstruments = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/instruments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch instruments");
      }
      const data = await response.json();

      const filteredInstruments = data.filter((instrument: Instrument) => {
        if (isStaff || isAdmin) {
          return instrument.accessRoles.includes("staff");
        } else {
          return instrument.accessRoles.includes("student");
        }
      });

      setInstruments(filteredInstruments);
      setFilteredInstruments(filteredInstruments);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch instruments");
      setLoading(false);
    }
  };

  const handleViewClick = (instrumentId: string) => {
    navigate(`/instrument/${instrumentId}`);
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
      <h1>{isStaff || isAdmin ? "All Instruments" : "Student Instruments"}</h1>
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
                <td>{instrument.layout}</td>
                <td>{instrument.version}</td>
                <td>
                  <div className="actions-container">
                    <button
                      className="more-btn"
                      onClick={() => togglePopover(instrument._id)}
                    >
                      &#8942;
                    </button>
                    {activePopover === instrument._id && (
                      <div className="popover">
                        <button onClick={() => handleViewClick(instrument._id)}>
                          View
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

export default StudentInstruments;
