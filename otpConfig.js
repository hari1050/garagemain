import axios from 'axios';

const username = 'DG35-classiccar';
const password = 'digimile';
const type = '0';
const dlr = '1';
const source = 'CLSCAR';
const entityid = '1701171828107767374';
const tempid = '1707171932098937701';

const generateOTP = () => {
    return Math.floor(1000*Math.random()*9000).toString().slice(0,4);
}

const sendOTPToPhoneNumber = async (phoneNumber) => {
    const OTP = generateOTP(); // Generate the OTP 

    const message = `Dear Customer, Your OTP for login on CLASSIC CAR CARE app is ${OTP} and do not share it with anyone. Thank you.`;
    const url = `https://rslri.connectbind.com:8443/bulksms/bulksms?username=${username}&password=${password}&type=${type}&dlr=${dlr}&destination=${phoneNumber}&source=${source}&message=${encodeURIComponent(message)}&entityid=${entityid}&tempid=${tempid}`;

    try {
      await axios.get(url); // Send the OTP via Axios
      console.log('SMS Sent'); // Log success message (optional)
    } catch (error) {
      console.error('Error sending SMS', error); // Handle any errors
    }
  
    return OTP; // Return the generated OTP
  };
  
  export { sendOTPToPhoneNumber };