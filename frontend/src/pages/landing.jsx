import React from 'react'
import "../App.css"
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const router = useNavigate(); 

  return (
    <div className='landingPageContainer'>
      {/* navabar  */}
      <nav>
        <div className="navHeader"><h2>Zoomify</h2></div>
        <div className="navlist">
          <p onClick={()=>{router("/sgas6453")}}>Join as guest</p>
          <a href='/auth'><p>Register</p></a>
          <div role='button'><p><a href='/auth'>Login</a></p></div>
        </div>
      </nav>

      {/* body */}

      <div className="landingPageMain">
        <div className="mainText">
          <h1> <span style={{color:'orange'}}>Connect </span>with your loved ones</h1>
          <p>Cover a distance by Zoomify</p>
          <a href='/auth'><button >Get Started</button></a>
        </div>
        <div className="mainImage"><img src="/background.jpg" alt="Background" /></div>
      </div>
    </div>
  )
}

export default LandingPage
