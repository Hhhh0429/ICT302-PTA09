import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./InstrumentDetail.css";

interface AssociatedInstrument {
  _id: string;
  instrumentName: string;
}

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
  associatedInstruments: AssociatedInstrument[];
  accessRoles: string[];
  keywords: string[];
  layout: string;
  version: number;
}

interface InstrumentDetailProps {
  isStaff: boolean;
  isAdmin: boolean;
}

const InstrumentDetail: React.FC<InstrumentDetailProps> = ({
  isStaff,
  isAdmin,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInstrument = async () => {
      try {
        console.log("Fetching instrument with ID:", id);
        const response = await fetch(
          `http://localhost:3000/api/instruments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Received instrument data:", data);
        setInstrument(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching instrument details:", err);
        setError(`Failed to fetch instrument details: ${err}`);
        setLoading(false);
      }
    };

    fetchInstrument();
  }, [id]);

  const openPDFInNewTab = () => {
    if (instrument && instrument.fileURL) {
      window.open(instrument.fileURL, "_blank");
    }
  };

  const backLink = isAdmin ? "/manage-instruments" : "/search";

  const canAccessInstrument = (roles: string[]) => {
    if (isAdmin) return true;
    if (isStaff && roles.includes("staff")) return true;
    return roles.includes("student");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!instrument) return <div>No instrument found</div>;
  if (!canAccessInstrument(instrument.accessRoles)) {
    return (
      <div>
        You are not authorized to view this instrument.<br></br>
        <Link to={backLink}>Back to Instruments List</Link>
      </div>
    );
  }

  return (
    <div className="instrument-detail">
      <h1>{instrument.instrumentName}</h1>
      <Link to={backLink}>Back to Instruments List</Link>
      <div className="detail-grid">
        <div>
          <strong>Class:</strong> {instrument.className || "N/A"}
        </div>
        <div>
          <strong>Owner:</strong> {instrument.Owner}
        </div>
        <div>
          <strong>Date Published:</strong>{" "}
          {instrument.firstCreatedDate
            ? new Date(instrument.firstCreatedDate).toLocaleDateString()
            : "N/A"}
        </div>
        <div>
          <strong>Last Modified:</strong>{" "}
          {instrument.lastModifiedDate
            ? new Date(instrument.lastModifiedDate).toLocaleDateString()
            : "N/A"}
        </div>
        <div>
          <strong>Next Review Date:</strong>{" "}
          {instrument.nextReviewDate
            ? new Date(instrument.nextReviewDate).toLocaleDateString()
            : "N/A"}
        </div>
        <div>
          <strong>Associated Instruments:</strong>
          {instrument.associatedInstruments &&
          instrument.associatedInstruments.length > 0 ? (
            <ul>
              {instrument.associatedInstruments.map((assoc) => (
                <li key={assoc._id}>
                  <Link
                    to={`/instrument/${assoc._id}`}
                    onClick={(e) => {
                      if (!canAccessInstrument(instrument.accessRoles)) {
                        e.preventDefault();
                        alert(
                          "You do not have permission to view this associated instrument."
                        );
                      }
                    }}
                  >
                    {assoc.instrumentName}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            "N/A"
          )}
        </div>
        <div>
          <strong>Access Roles:</strong> {instrument.accessRoles.join(", ")}
        </div>
        <div>
          <strong>Keywords:</strong> {instrument.keywords.join(", ") || "N/A"}
        </div>
        <div>
          <strong>Layout:</strong> {instrument.layout}
        </div>
        <div>
          <strong>Version:</strong> {instrument.version}
        </div>
      </div>
      {instrument.fileURL && (
        <div className="file-preview">
          <h2>File Preview</h2>
          <p>PDF preview is not available for OneDrive links.</p>
          <button onClick={openPDFInNewTab}>Check Full PDF</button>
        </div>
      )}
    </div>
  );
};

export default InstrumentDetail;
