import { useEffect, useState } from "react";
import { CalendarDays, Check, Clock3, ExternalLink, X } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";
import "../styles/care-workflows.css";

const formatDateTime = (value) => new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = async () => {
    const response = await api.get("/api/appointments/doctor");
    setAppointments(response.data.appointments || []);
  };

  useEffect(() => { fetchAppointments().catch((error) => toast.error(error.response?.data?.message || "Could not load appointments.")).finally(() => setLoading(false)); }, []);

  const updateAppointment = async (id, decision) => {
    setUpdatingId(id);
    try {
      await api.post(`/api/appointments/${id}/${decision}`);
      await fetchAppointments();
      toast.success(decision === "accept" ? "Appointment accepted. Access is time-bound." : "Appointment declined.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update the appointment.");
    } finally { setUpdatingId(null); }
  };

  return <main className="app-page"><div className="content-width"><header className="page-header"><div><p className="page-kicker">Doctor workspace</p><h1 className="page-title">Appointment requests</h1><p className="page-subtitle">Accept a consultation to receive a limited record-access window for that patient.</p></div></header><section className="surface care-list-panel"><div className="access-callout"><Clock3 size={19} /><div><strong>Access is appointment-bound</strong>Accepting a request creates a 24-hour record-access window starting from the scheduled appointment time. It can be withdrawn by the patient at any point.</div></div>{loading ? <p className="surface-help">Loading appointments...</p> : appointments.length === 0 ? <div className="empty-state"><CalendarDays size={26} /><h3>No appointment requests</h3><p>New appointment requests from patients will appear here.</p></div> : <div className="appointment-stack">{appointments.map((appointment) => <article className="appointment-item" key={appointment._id}><div><div className="appointment-title-row"><h2 className="appointment-title">{appointment.patientId?.name || "Patient"}</h2><span className={`status status-${appointment.status}`}>{appointment.status}</span></div><div className="appointment-meta"><span><CalendarDays size={14} />{formatDateTime(appointment.scheduledAt)}</span></div>{appointment.reason && <p className="appointment-reason">{appointment.reason}</p>}{appointment.status === "accepted" && appointment.accessValidUntil && <p className="access-expiry">Records available until {formatDateTime(appointment.accessValidUntil)}</p>}</div><div className="appointment-actions">{appointment.status === "requested" && <><button type="button" className="btn btn-primary" disabled={updatingId === appointment._id} onClick={() => updateAppointment(appointment._id, "accept")}><Check size={16} />Accept</button><button type="button" className="btn btn-secondary" disabled={updatingId === appointment._id} onClick={() => updateAppointment(appointment._id, "reject")}><X size={16} />Decline</button></>}{appointment.status === "accepted" && <Link className="btn btn-secondary" to={`/doctor/appointments/${appointment._id}/records`}><ExternalLink size={16} />Open records</Link>}</div></article>)}</div>}</section></div></main>;
};

export default DoctorAppointments;
