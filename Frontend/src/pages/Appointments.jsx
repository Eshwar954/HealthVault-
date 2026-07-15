import { useEffect, useState } from "react";
import { CalendarDays, FlaskConical, ShieldCheck, Stethoscope, Undo2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/client";
import "../styles/care-workflows.css";

const formatDateTime = (value) => new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

const Appointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [centers, setCenters] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ doctorId: "", scheduledAt: "", reason: "" });
  const [orderData, setOrderData] = useState({ diagnosticCenterId: "", tests: "", notes: "" });

  const fetchData = async () => {
    const [doctorRes, centerRes, appointmentRes] = await Promise.all([
      api.get("/api/doctors"),
      api.get("/api/diagnostic-orders/centers"),
      api.get("/api/appointments/me"),
    ]);
    setDoctors(doctorRes.data.doctors || []);
    setCenters(centerRes.data.centers || []);
    setAppointments(appointmentRes.data.appointments || []);
  };

  useEffect(() => {
    fetchData()
      .catch((error) => toast.error(error.response?.data?.message || "Could not load care access."))
      .finally(() => setLoading(false));
  }, []);

  const bookAppointment = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/appointments", formData);
      setFormData({ doctorId: "", scheduledAt: "", reason: "" });
      await fetchData();
      toast.success("Appointment request sent.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not request the appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  const revokeAccess = async (appointmentId) => {
    try {
      await api.post(`/api/appointments/${appointmentId}/revoke-access`);
      await fetchData();
      toast.success("Record access revoked.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not revoke access.");
    }
  };

  const createDiagnosticOrder = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/diagnostic-orders", {
        diagnosticCenterId: orderData.diagnosticCenterId,
        tests: orderData.tests.split(",").map((test) => test.trim()).filter(Boolean),
        notes: orderData.notes,
      });
      setOrderData({ diagnosticCenterId: "", tests: "", notes: "" });
      toast.success("Diagnostic order sent to the centre.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create the diagnostic order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="app-page">
      <div className="content-width">
        <header className="page-header">
          <div>
            <p className="page-kicker">Patient workspace</p>
            <h1 className="page-title">Care access</h1>
            <p className="page-subtitle">Arrange care and stay in control of who can see your medical records.</p>
          </div>
        </header>

        <div className="care-layout">
          <div className="care-stack">
            <section className="surface care-form-panel">
              <div className="surface-heading">
                <div>
                  <h2 className="surface-title">Request an appointment</h2>
                  <p className="surface-help">Choose a doctor and proposed consultation time.</p>
                </div>
                <CalendarDays size={22} color="#087c73" />
              </div>
              <div className="access-callout"><ShieldCheck size={19} /><div><strong>Time-bound record access</strong>When a doctor accepts, their record access lasts for 24 hours from the appointment time. You can revoke it early.</div></div>
              <form className="care-form" onSubmit={bookAppointment}>
                <div className="field"><label htmlFor="doctorId">Doctor</label><select id="doctorId" value={formData.doctorId} onChange={(event) => setFormData({ ...formData, doctorId: event.target.value })} required><option value="">Select a doctor</option>{doctors.map((doctor) => <option key={doctor._id} value={doctor._id}>Dr. {doctor.name} - {doctor.specialization || "General medicine"}</option>)}</select></div>
                <div className="field"><label htmlFor="scheduledAt">Preferred time</label><input id="scheduledAt" type="datetime-local" min={new Date().toISOString().slice(0, 16)} value={formData.scheduledAt} onChange={(event) => setFormData({ ...formData, scheduledAt: event.target.value })} required /></div>
                <div className="field"><label htmlFor="reason">Reason for visit</label><textarea id="reason" value={formData.reason} onChange={(event) => setFormData({ ...formData, reason: event.target.value })} placeholder="Optional context for your doctor" /></div>
                <button className="btn btn-primary" type="submit" disabled={submitting}><Stethoscope size={17} />{submitting ? "Sending request..." : "Request appointment"}</button>
              </form>
            </section>

            <section className="surface care-form-panel">
              <div className="surface-heading">
                <div><h2 className="surface-title">Request diagnostics</h2><p className="surface-help">Send a test request directly to an approved diagnostic centre.</p></div>
                <FlaskConical size={22} color="#3159be" />
              </div>
              <form className="care-form" onSubmit={createDiagnosticOrder}>
                <div className="field"><label htmlFor="center">Diagnostic centre</label><select id="center" value={orderData.diagnosticCenterId} onChange={(event) => setOrderData({ ...orderData, diagnosticCenterId: event.target.value })} required><option value="">Select a diagnostic centre</option>{centers.map((center) => <option key={center._id} value={center._id}>{center.name}</option>)}</select></div>
                <div className="field"><label htmlFor="tests">Requested tests</label><input id="tests" value={orderData.tests} onChange={(event) => setOrderData({ ...orderData, tests: event.target.value })} placeholder="CBC, X-Ray, Thyroid Profile" required /></div>
                <div className="field"><label htmlFor="notes">Instructions</label><textarea id="notes" value={orderData.notes} onChange={(event) => setOrderData({ ...orderData, notes: event.target.value })} placeholder="Optional notes for the centre" /></div>
                <button className="btn btn-secondary" type="submit" disabled={submitting}><FlaskConical size={17} />{submitting ? "Creating order..." : "Create diagnostic order"}</button>
              </form>
            </section>
          </div>

          <section className="surface care-list-panel">
            <div className="surface-heading"><div><h2 className="surface-title">Your appointments</h2><p className="surface-help">Doctor access only starts after an appointment is accepted.</p></div></div>
            {loading ? <p className="surface-help">Loading appointments...</p> : appointments.length === 0 ? <div className="empty-state"><CalendarDays size={26} /><h3>No appointments yet</h3><p>Your upcoming consultations will appear here after you request one.</p></div> : <div className="appointment-stack">{appointments.map((appointment) => <article className="appointment-item" key={appointment._id}><div><div className="appointment-title-row"><h3 className="appointment-title">Dr. {appointment.doctorId?.name || "Doctor"}</h3><span className={`status status-${appointment.status}`}>{appointment.status}</span></div><div className="appointment-meta"><span><CalendarDays size={14} />{formatDateTime(appointment.scheduledAt)}</span></div>{appointment.reason && <p className="appointment-reason">{appointment.reason}</p>}{appointment.status === "accepted" && appointment.accessValidUntil && <p className="access-expiry">Record access ends {formatDateTime(appointment.accessValidUntil)}</p>}</div>{appointment.status === "accepted" && <div className="appointment-actions"><button type="button" className="btn btn-danger" onClick={() => revokeAccess(appointment._id)}><Undo2 size={15} />Revoke access</button></div>}</article>)}</div>}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Appointments;
