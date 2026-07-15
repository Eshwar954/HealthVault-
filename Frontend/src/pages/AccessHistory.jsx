import { useEffect, useState } from "react";
import { Activity, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/client";
import "../styles/care-workflows.css";

const labelAction = (action) => action?.replaceAll("_", " ") || "Activity";

const AccessHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get("/api/audit/me").then((response) => setLogs(response.data.logs || [])).catch((error) => toast.error(error.response?.data?.message || "Could not load activity history.")).finally(() => setLoading(false)); }, []);

  return <main className="app-page"><div className="content-width"><header className="page-header"><div><p className="page-kicker">Patient workspace</p><h1 className="page-title">Record activity</h1><p className="page-subtitle">Review when records were viewed, uploaded, or removed from your vault.</p></div></header><section className="surface audit-panel">{loading ? <p className="surface-help">Loading activity...</p> : logs.length === 0 ? <div className="empty-state"><ShieldCheck size={26} /><h3>No record activity yet</h3><p>When someone uses an approved appointment or diagnostic order to interact with records, it will appear here.</p></div> : <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Who</th><th>Action</th><th>Resource</th><th>Time</th></tr></thead><tbody>{logs.map((log) => <tr key={log._id}><td>{log.actorId?.name || "System"}</td><td><span className="audit-action"><Activity size={14} />{labelAction(log.action)}</span></td><td>{log.resourceType || "Record"}</td><td>{new Date(log.createdAt).toLocaleString()}</td></tr>)}</tbody></table></div>}</section></div></main>;
};

export default AccessHistory;
