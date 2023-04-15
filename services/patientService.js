const axios = require("axios");
const _Patient = require("../models/patient.js");
const _Reservation = require("../models/reservation.js");

const getPatients = async () => {
  const patient = await _Patient.find({ status: true }).populate({
    path: "reservations",
    populate: "doctor",
  });
  return patient;
};

const getPatientById = async (id) => {
  const patient = _Patient.findOne({ $and: [{ id: id }, { status: true }] });
  return patient;
};

const postPatient = async (name, mobile, dob) => {
  const patient = new _Patient({
    name,
    mobile,
    dob,
  });

  // verifyMobile(mobile, "Hello World");
  generateOtp(mobile);

  const res = await patient.save();
  return res;
};

const deletePatient = async (id) => {
  const res = await _Patient.findByIdAndUpdate(id, {
    status: false,
  });

  return res;
};

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

const generateOtp = (mobile) => {
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

  axios
    .request(options)
    .then(function (response) {
      // output otpId
      console.log(response.data);
      // response.data.otpId to be saved in patient/doctor
    })
    .catch(function (error) {
      console.error(error);
    });
};

const resendOtp = (otpId) => {
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
    data: `{"otp_id":"${otpId}"}`,
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

const verifyOtp = (otpId, otpCode) => {
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
    data: `{"otp_id":"${otpId}","otp_code":"${otpCode}"}`,
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

module.exports = {
  getPatients,
  postPatient,
  deletePatient,
  getPatientById,
};
