import "../App.css"

export default function Profile() {
  return (
    <div className="app-wrapper">
      <div className="app-container">

        <div className="app-header">
          <h1 className="app-title">Profile</h1>
          <p className="app-subtitle">
            User information
          </p>
        </div>

        <div className="empty-state">

          <h2>👩 Name</h2>
          <p>Nilisha Maharjan</p>

          <br />

          <h2>📧 Email</h2>
          <p>nili.mhj@gmail.com</p>

          <br />

          <h2>🎓 Role</h2>
          <p>Computer Engineering Student</p>

          <br />

          <h2>📅 Joined</h2>
          <p>July 2024</p>

        </div>

      </div>
    </div>
  )
}