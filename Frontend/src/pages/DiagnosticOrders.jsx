import { useEffect, useState } from "react";
import { FileUp, FlaskConical, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/client";
import "../styles/care-workflows.css";

const DiagnosticOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadingOrderId, setUploadingOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const response = await api.get("/api/diagnostic-orders/assigned");
    setOrders(response.data.orders || []);
  };

  useEffect(() => { fetchOrders().catch((error) => toast.error(error.response?.data?.message || "Could not load orders.")).finally(() => setLoading(false)); }, []);

  const uploadReport = async (orderId) => {
    const file = selectedFiles[orderId];
    if (!file) { toast.error("Choose a report file first."); return; }
    const formData = new FormData();
    formData.append("file", file);
    setUploadingOrderId(orderId);
    try {
      await api.post(`/api/diagnostic-orders/${orderId}/upload-report`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setSelectedFiles((previous) => ({ ...previous, [orderId]: null }));
      await fetchOrders();
      toast.success("Report uploaded to the patient's vault.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not upload the report.");
    } finally { setUploadingOrderId(null); }
  };

  return <main className="app-page"><div className="content-width"><header className="page-header"><div><p className="page-kicker">Diagnostic centre workspace</p><h1 className="page-title">Assigned diagnostic orders</h1><p className="page-subtitle">Upload reports only against an order assigned to your centre. The completed report is delivered to the patient record.</p></div></header><section className="surface care-list-panel">{loading ? <p className="surface-help">Loading assigned orders...</p> : orders.length === 0 ? <div className="empty-state"><FlaskConical size={26} /><h3>No assigned orders</h3><p>New patient requests will appear here when they select your centre.</p></div> : <div className="appointment-stack">{orders.map((order) => <article className="appointment-item" key={order._id}><div><div className="appointment-title-row"><h2 className="appointment-title">{order.patientId?.name || "Patient"}</h2><span className={`status status-${order.status}`}>{order.status}</span></div><div className="appointment-meta"><span><UserRound size={14} />Requested by Dr. {order.doctorId?.name || "the patient"}</span></div><div className="order-tests">{(order.tests || []).map((test) => <span className="test-chip" key={test}>{test}</span>)}</div>{order.notes && <p className="appointment-reason">{order.notes}</p>}</div>{order.status !== "completed" && order.status !== "cancelled" && <div className="appointment-actions"><div className="file-picker"><input id={`file-${order._id}`} type="file" accept=".pdf,.doc,.docx,image/jpeg,image/png" onChange={(event) => setSelectedFiles((previous) => ({ ...previous, [order._id]: event.target.files?.[0] }))} /><label htmlFor={`file-${order._id}`}><FileUp size={16} />Choose report</label><span className="file-picker-name">{selectedFiles[order._id]?.name || "No file selected"}</span></div><button type="button" className="btn btn-primary" onClick={() => uploadReport(order._id)} disabled={uploadingOrderId === order._id}>{uploadingOrderId === order._id ? "Uploading..." : "Upload report"}</button></div>}</article>)}</div>}</section></div></main>;
};

export default DiagnosticOrders;
