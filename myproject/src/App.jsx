import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import Home from './Components/Home'
import About from './Components/About'
import ContactUs from './Components/ContactUs'
import Courses from './Components/Courses'

const App = () => {
  return (
    <BrowserRouter>

      <nav
        style={{
          backgroundColor: 'blue',
          padding: '15px',
          display: 'flex',
          gap: '20px'
        }}
      >
        <Link to="/" style={{ color: 'white' }}>HOME</Link>
        <Link to="/about" style={{ color: 'white' }}>ABOUT US</Link>
        <Link to="/contactus" style={{ color: 'white' }}>CONTACT US</Link>
        <Link to="/courses" style={{ color: 'white' }}>COURSES</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App