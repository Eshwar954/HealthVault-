import { useEffect, useState } from "react";
import { CalendarDays, Clock3, FileText, LockKeyhole } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import api from "../api/client";
import "../styles/care-workflows.css";

const DoctorPatientRecords = () => {
  const { appointmentId } = useParams();
  const [records, setRecords] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await api.get(`/api/appointments/${appointmentId}/records`);
        setAppointment(response.data.appointment);
        setRecords(response.data.records || []);
      } catch (requestError) {
        const message = requestError.response?.data?.message || "Records are not available for this appointment.";
        setError(message);
        toast.error(message);
      } finally { setLoading(false); }
    };
    fetchRecords();
  }, [appointmentId]);

  const expiry = appointment?.accessValidUntil ? new Date(appointment.accessValidUntil).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : null;
  return <main className="app-page"><div className="content-width"><header className="page-header"><div><p className="page-kicker">Doctor workspace</p><h1 className="page-title">Patient records</h1><p className="page-subtitle">Records are visible only within the access window created by this appointment.</p></div></header><section className="surface record-panel">{loading ? <p className="surface-help">Checking record access...</p> : error ? <div className="empty-state"><LockKeyhole size={26} /><h3>Records unavailable</h3><p>{error}</p></div> : <>{expiry && <div className="access-callout"><Clock3 size={19} /><div><strong>Access expires {expiry}</strong>The patient can withdraw access earlier. Opening a file is recorded in the patient&apos;s activity history.</div></div>}{records.length === 0 ? <div className="empty-state"><FileText size={26} /><h3>No records shared</h3><p>This patient has not uploaded records to their vault yet.</p></div> : <div className="records-grid">{records.map((file) => <article className="record-item" key={file._id}><span className="record-icon"><FileText size={18} /></span><h3 title={file.fileName}>{file.fileName}</h3><p>{file.reportType || "Medical record"}</p><p><CalendarDays size={13} /> {new Date(file.createdAt).toLocaleDateString()}</p><a href={file.fileUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">Open document</a></article>)}</div>}</>}</section></div></main>;
};

export default DoctorPatientRecords;
