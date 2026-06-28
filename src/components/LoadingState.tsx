// A focused component with one job: show the loading screen
export function LoadingState() {
  return (
    <div className="app-wrapper">
      <div className="app-container">
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading tasks...</p>
        </div>
      </div>
    </div>
  )
}