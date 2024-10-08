import crypto from "crypto";
import fetch from "node-fetch";

let otps = [];

export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const sendOTPEmail = async (email, otp) => {
  const serviceID = process.env.EMAILJS_SERVICE_ID;
  const templateID = process.env.EMAILJS_TEMPLATE_ID;
  const userID = process.env.EMAILJS_USER_ID;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  const templateParams = {
    to_email: email,
    to_name: email,
    otp: otp,
  };

  const requestBody = {
    service_id: serviceID,
    template_id: templateID,
    user_id: userID,
    template_params: templateParams,
  };

  try {
    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${privateKey}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Email sending failed: ${response.statusText}`);
    }

    console.log("OTP sent!");
  } catch (error) {
    console.error("Failed to send OTP", error);
    throw new Error("Failed to send OTP");
  }
};

export const storeOTP = (email, name, password, otp) => {
  otps.push({ email, name, password, otp, timestamp: Date.now() });
};

export const verifyOTP = (email, otp) => {
  console.log("Verifying OTP for:", email);
  const otpRecord = otps.find(
    (record) => record.email === email && record.otp === otp
  );
  console.log("OTP record found:", otpRecord);
  return otpRecord;
};

export const removeOTP = (email) => {
  otps = otps.filter((record) => record.email !== email);
  console.log("OTP record removed for:", email);
};

export const cleanUpOTPs = () => {
  const now = Date.now();
  otps = otps.filter((otpRecord) => now - otpRecord.timestamp < 10 * 60 * 1000);
};

setInterval(cleanUpOTPs, 60 * 1000);
