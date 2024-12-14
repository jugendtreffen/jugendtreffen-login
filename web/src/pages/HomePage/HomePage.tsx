// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import routes from "src/Routes";
import { Link } from "@redwoodjs/router";

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#e7f3ff' }}>
      <header style={{ backgroundColor: '#cce7ff', padding: '10px 0', borderBottom: '1px solid #99ccff' }}>
        <h1>Welcome to My Website</h1>
      </header>

      <main style={{ padding: '20px' }}>
        <p>
          This is a simple homepage built with React. Explore the features and learn more about what we have to offer.
        </p>

        <div style={{ margin: '20px 0' }}>
          <Link to={routes.signup()}>Signup</Link>
        </div>
      </main>

      <footer style={{ backgroundColor: '#cce7ff', padding: '10px 0', borderTop: '1px solid #99ccff' }}>
        <p>&copy; 2024 My Website. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default HomePage
