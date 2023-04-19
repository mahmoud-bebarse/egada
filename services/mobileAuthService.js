const _Doctor = require('../models/doctor');
const _Patient = require('../models/patient');
const axios = require('axios');

  const validateMobile = (mobile) => {
    const options = {
      method: "GET",
      url: "https://phonenumbervalidatefree.p.rapidapi.com/ts_PhoneNumberValidateTest.jsp",
      params: { number: `+2${mobile}`, country: "EG" },
      headers: {
        "X-RapidAPI-Key": "ad3d23ef5dmshcb7a398cd2ae4f5p1a3529jsn36a4ee3e7b79",
        "X-RapidAPI-Host": "phonenumbervalidatefree.p.rapidapi.com",
      },
    };
  
    axios
      .request(options)
      .then(function (response) {
        console.log("sms", response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  
  const verifyMobile = (mobile, msg) => {
    const data = {
      messages: [
        {
          channel: "sms",
          originator: "D7-RapidAPI",
          recipients: [`+2${mobile}`],
          content: msg,
          data_coding: "text",
        },
      ],
    };
    //`{"messages":[{"channel":"sms","originator":"D7-RapidAPI","recipients":["+2${mobile}"],"content":"Greetings from D7 API ","data_coding":"text"}]}`
    const options = {
      method: "POST",
      url: "https://d7sms.p.rapidapi.com/messages/v1/send",
      headers: {
        "content-type": "application/json",
        Token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoLWJhY2tlbmQ6YXBwIiwic3ViIjoiNGE1MGQ0NTgtNGIyYi00YmQ1LTk5ODktNGNkMmIyYTg4MmI5In0.pJ0aYchEjFokZ8vCgI9C_ZIpG9K2FZboD4dwuZezYVE",
        "X-RapidAPI-Key": "ad3d23ef5dmshcb7a398cd2ae4f5p1a3529jsn36a4ee3e7b79",
        "X-RapidAPI-Host": "d7sms.p.rapidapi.com",
      },
      data: JSON.stringify(data),
    };
  
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  
  const generateOtp = async (mobile) => {
    const data = {
      originator: "Egada",
      recipient: `+2${mobile}`,
      content: "Greetings from  Egada, your mobile verification code is: {}",
      expiry: "600",
      data_coding: "text",
    };
  
    const options = {
      method: "POST",
      url: "https://d7sms.p.rapidapi.com/verify/v1/otp/send-otp",
      headers: {
        "content-type": "application/json",
        Token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoLWJhY2tlbmQ6YXBwIiwic3ViIjoiNGE1MGQ0NTgtNGIyYi00YmQ1LTk5ODktNGNkMmIyYTg4MmI5In0.pJ0aYchEjFokZ8vCgI9C_ZIpG9K2FZboD4dwuZezYVE",
        "X-RapidAPI-Key": "ad3d23ef5dmshcb7a398cd2ae4f5p1a3529jsn36a4ee3e7b79",
        "X-RapidAPI-Host": "d7sms.p.rapidapi.com",
      },
      data: JSON.stringify(data),
    };
  
    return await axios
      .request(options)
    
  };
  
  const resendOtp = async (otpId) => {

    const data = {
        otp_id: `${otpId}`
    };

    const options = {
      method: "POST",
      url: "https://d7sms.p.rapidapi.com/verify/v1/otp/resend-otp",
      headers: {
        "content-type": "application/json",
        Token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoLWJhY2tlbmQ6YXBwIiwic3ViIjoiNGE1MGQ0NTgtNGIyYi00YmQ1LTk5ODktNGNkMmIyYTg4MmI5In0.pJ0aYchEjFokZ8vCgI9C_ZIpG9K2FZboD4dwuZezYVE",
        "X-RapidAPI-Key": "ad3d23ef5dmshcb7a398cd2ae4f5p1a3529jsn36a4ee3e7b79",
        "X-RapidAPI-Host": "d7sms.p.rapidapi.com",
      },
      data: JSON.stringify(data), 
    };
   
    const res = await axios
      .request(options);

    /**
     * res 
     * 
     * success
     * {
     *  otpId,
     *  status,
     *  expiry,
     *  resend_count
     * }
     * 
     * frequent request
     * 
     * {
     *   detail: "Frequent resend request, resend request need minimum 60 seconds delay"
     * }
     * 
     * Time limit expired
     * {
     *   detail: "Resend Failed. OTP time limit expired."
     * }
     */

    return res;
  };
  
  const verifyOtp = async (otpId, otpCode) => {

    const data = {
        otp_id: `${otpId}`,
        otp_code: `${otpCode}`
    };

    const options = {
      method: "POST",
      url: "https://d7sms.p.rapidapi.com/verify/v1/otp/verify-otp",
      headers: {
        "content-type": "application/json", 
        Token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoLWJhY2tlbmQ6YXBwIiwic3ViIjoiNGE1MGQ0NTgtNGIyYi00YmQ1LTk5ODktNGNkMmIyYTg4MmI5In0.pJ0aYchEjFokZ8vCgI9C_ZIpG9K2FZboD4dwuZezYVE",
        "X-RapidAPI-Key": "ad3d23ef5dmshcb7a398cd2ae4f5p1a3529jsn36a4ee3e7b79",
        "X-RapidAPI-Host": "d7sms.p.rapidapi.com",
      },
      data: JSON.stringify(data)
    };
  
    const res = await axios
      .request(options)


    /**
     * response 
     * 
     * approved 
     * {
     *  status: "APPROVED"
     * }
     * 
     * not valid 
     * {
     *  detail:{
     *      code: "INVALID_OTP_CODE",
     *      message: "Invalid OTP code or OTP code expired"
     *  }
     * }
     */
    
    return res;
  };

  module.exports = {
    validateMobile,
    verifyMobile,
    generateOtp,
    resendOtp,
    verifyOtp
  }