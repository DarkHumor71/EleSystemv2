import React from "react";
import { Link } from "react-router-dom";
const Landing = () => {
  return (
    <section
      className="landing"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div className="dark-overlay">
        <Link
          to="/login"
          className="btn btn-light btn-xlarge"
          style={{ fontSize: "2rem", padding: "1rem 2rem" }}
        >
          Login
        </Link>
      </div>
    </section>
  );
};

export default Landing;
// {
//   path: "/jobs", // Independent route for JobsPage
//   element: <JobsPage />,
// },
// {
//   path: "/add-job", // Independent route for JobsPage
//   element: <AddJobPage AddJobSubmit={addJob} />,
// },
// {
//   path: "/jobs/:id",
//   element: <JobPage deleteJob={deleteJob} />,
//   loader: jobLoader,
// }, // Added loader here
// {
//   path: "/edit-job/:id",
//   element: <EditJobPage UpdateJobSubmit={updateJob} />,
//   loader: jobLoader,
// }, // Added loader here

// {
//   path: "*", // Catch-all for undefined routes
//   element: <NotFoundPage />,
// },
