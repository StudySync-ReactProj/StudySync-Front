import React, { useState, useMemo } from "react";
import { useApi } from "../../hooks/useApi";

// Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Example component using useApi hook
 * Displays a list of tasks with pagination and filtering
 * No fetch/useEffect logic - all delegated to the hook
 */
const TasksListExample = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const LIMIT = 5;

  // Memoize params so they're only recreated when page/status actually change
  const params = useMemo(
    () =>
      status === "all"
        ? { _page: page, _limit: LIMIT }
        : { _page: page, _limit: LIMIT, completed: status === "completed" },
    [page, status]
  );

  // Single hook call - handles all data fetching with dynamic params
  const { data: tasks, loading, error, refetch } = useApi(
    `${API_BASE_URL}/api/stats`,
    params
  );

  const handleRefresh = () => {
    refetch();
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleFilterChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1); // Reset to first page when filter changes
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Tasks List Example</h2>

      {/* Filters */}
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => handleFilterChange("all")}
          style={{
            padding: "8px 12px",
            backgroundColor: status === "all" ? "#007bff" : "#f0f0f0",
            color: status === "all" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange("completed")}
          style={{
            padding: "8px 12px",
            backgroundColor: status === "completed" ? "#28a745" : "#f0f0f0",
            color: status === "completed" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Completed
        </button>
        <button
          onClick={() => handleFilterChange("pending")}
          style={{
            padding: "8px 12px",
            backgroundColor: status === "pending" ? "#ffc107" : "#f0f0f0",
            color: status === "pending" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Pending
        </button>
        <button
          onClick={handleRefresh}
          style={{
            padding: "8px 12px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Loading State */}
      {loading && <p style={{ textAlign: "center", color: "#666" }}>Loading tasks...</p>}

      {/* Error State */}
      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          Error: {error}
        </div>
      )}

      {/* Tasks List */}
      {!loading && !error && tasks && (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {tasks.map((task) => (
              <li
                key={task.id}
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  disabled
                  style={{ cursor: "default" }}
                />
                <span
                  style={{
                    flex: 1,
                    textDecoration: task.completed ? "line-through" : "none",
                    color: task.completed ? "#999" : "black",
                  }}
                >
                  {task.title}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    backgroundColor: task.completed ? "#d4edda" : "#fff3cd",
                    padding: "4px 8px",
                    borderRadius: "3px",
                  }}
                >
                  {task.completed ? "Done" : "Pending"}
                </span>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              style={{
                padding: "8px 12px",
                backgroundColor: page === 1 ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>
            <span style={{ padding: "8px 12px" }}>Page {page}</span>
            <button
              onClick={handleNextPage}
              style={{
                padding: "8px 12px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TasksListExample;
