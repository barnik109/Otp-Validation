import React, { useState } from 'react'
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs"
import {CgSpinner} from 'react-icons/cg'
import OtpInput from 'otp-input-react'
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { auth } from "./firebase.config"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { toast, Toaster } from "react-hot-toast";
import './css/main.css'


const App = () => {
  const [otp, setOtp] = useState("")
  const [user,setUser]=useState(null)
  const [ph,setPh]=useState("")
  const [loading, setLoading] = useState(false)
  const [showOtp, setShowOtp] = useState(false)

  function OnCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {
        'size': 'invisible',
        'callback': (response) => {
          onSignup()
        },
        'expired-callback': () => {

        }
      }, auth);
    }
  }

  
  function onSignup() {
    setLoading(true)
    OnCaptchVerify()

    const appVerifier = window.recaptchaVerifier

    const formatPh = '+' + ph
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false)
        setShowOtp(true)
        toast.success("OTP sended successfully!")
      }).catch((error) => {
        console.log(error)
        setLoading(false)
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }



  return (<section className='outer'>
    <div>
      <Toaster toastOptions={{duration:4000}}/>
     <div id="recaptcha-container"></div>
      {user ? (
        <h2>
          &#x1F44D; Login Success
        </h2>
      ) : (
          <div className='heading'>
            <h1 className='mainhd'>
              Please validate <br /> your Phone 
            </h1>

            {showOtp ?
              (<>
                <div className='logo'>
                  <BsFillShieldLockFill size={30} />
                </div>
                <label htmlFor="otp" className='phone'>
                  Enter Your OTP
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                className='opt-container'></OtpInput>
                <button className='verfOtp2' onClick={onOTPVerify}>
                  {loading && (<CgSpinner size={20} className='spinner'/>)}
                  <span>Verify OTP</span>
                </button>
              </>) : (
                <>
                  <div className='logo'>
                    <BsTelephoneFill size={30} />
                  </div>
                  <label className='phone' htmlFor="" >
                    Verify your phone no.
                  </label>
                  <PhoneInput className='phninp' country={"in"} value={ph} onChange={setPh} />
                  <button className='verfOtp' onClick={onSignup}>
                    {loading && (<CgSpinner size={20} />)}
                    <span>Send code via SMS</span>
                  </button>
                </>
              )}

          </div>
      )}
      
    </div>
  </section>
  );
}

export default App