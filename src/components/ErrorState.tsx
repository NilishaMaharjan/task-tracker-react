interface ErrorStateProps {
  message: string
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="app-wrapper">
      <div className="app-container">
        <div className="error-state">
          <p className="error-title">Could not load tasks</p>
          <p className="error-message">{message}</p>
          <p className="error-hint">
            Make sure json-server is running:{" "}
            <code>npm run server</code>
          </p>
        </div>
      </div>
    </div>
  )
}