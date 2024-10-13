import React from 'react'
import "../App.css"
const LandingPage = () => {
  return (
    <div className='landingPageContainer'>
      {/* navabar  */}
      <nav>
        <div className="navHeader"><h2>Zoomify</h2></div>
        <div className="navlist">
          <p>Join as guest</p>
          <p>Register</p>
          <div role='button'><p>Login</p></div>
        </div>
      </nav>

      {/* body */}

      <div className="landingPageMain">
        <div className="mainText">
          <h1> <span style={{color:'orange'}}>Connect </span>with your loved ones</h1>
          <p>Cover a distance by Zoomify</p>
          <a href='/'><button >Get Started</button></a>
        </div>
        <div className="mainImage"><img src="/background.jpg" alt="Background" /></div>
      </div>
    </div>
  )
}

export default LandingPage
