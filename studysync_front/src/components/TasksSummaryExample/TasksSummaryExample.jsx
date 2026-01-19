import React from "react";
import { useApi } from "../../hooks/useApi";

/**
 * Example component using useApi hook
 * Shows summary statistics of tasks with a refresh button
 * No fetch/useEffect logic - all delegated to the hook
 */
const TasksSummaryExample = () => {
  // Simple hook call with just a URL string
  const { data: tasks, loading, error, refetch } = useApi(
    "https://jsonplaceholder.typicode.com/todos?_limit=20"
  );

  // Calculate statistics
  const stats = {
    total: Array.isArray(tasks) ? tasks.length : 0,
    completed: Array.isArray(tasks) ? tasks.filter((t) => t.completed).length : 0,
    pending: Array.isArray(tasks) ? tasks.filter((t) => !t.completed).length : 0,
    completionRate: Array.isArray(tasks) && tasks.length > 0
      ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)
      : 0,
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Tasks Summary</h2>
        <button
          onClick={refetch}
          disabled={loading}
          style={{
            padding: "10px 15px",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px",
          }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Loading State */}
      {loading && <p style={{ textAlign: "center", color: "#666" }}>Loading summary...</p>}

      {/* Error State */}
      {error && (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          ⚠️ Error: {error}
        </div>
      )}

      {/* Summary Cards */}
      {!loading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          {/* Total Tasks Card */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "#e7f3ff",
              borderLeft: "4px solid #007bff",
              borderRadius: "4px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
              Total Tasks
            </div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#007bff" }}>
              {stats.total}
            </div>
          </div>

          {/* Completed Tasks Card */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "#d4edda",
              borderLeft: "4px solid #28a745",
              borderRadius: "4px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
              Completed
            </div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#28a745" }}>
              {stats.completed}
            </div>
          </div>

          {/* Pending Tasks Card */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fff3cd",
              borderLeft: "4px solid #ffc107",
              borderRadius: "4px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
              Pending
            </div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#ffc107" }}>
              {stats.pending}
            </div>
          </div>

          {/* Completion Rate Card */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f0f0f0",
              borderLeft: "4px solid #6c757d",
              borderRadius: "4px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
              Completion Rate
            </div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#6c757d" }}>
              {stats.completionRate}%
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {!loading && !error && stats.total > 0 && (
        <div style={{ marginTop: "25px" }}>
          <div style={{ fontSize: "12px", marginBottom: "8px", color: "#666" }}>
            Overall Progress
          </div>
          <div
            style={{
              width: "100%",
              height: "24px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${stats.completionRate}%`,
                height: "100%",
                backgroundColor: "#28a745",
                transition: "width 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {stats.completionRate > 10 && `${stats.completionRate}%`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksSummaryExample;
