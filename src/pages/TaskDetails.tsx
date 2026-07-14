export default function TaskDetails() {

    console.log("Page reloadeddddddd")
  return (
    <div className="app-wrapper">
      <div className="app-container">

        <h1 className="app-title">Task Details Page</h1>

        <div className="empty-state">
          <p>
            This page uses a normal HTML anchor tag instead of React Router's Link component.
          </p>
        </div>

        <div style={{ marginTop: "20px" }}>
          <a href="/dashboard">
            Go Back to Dashboard
          </a>
        </div>

      </div>
    </div>
  )
}

