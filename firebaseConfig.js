// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsukI4ryAIKORIKKnVIe1VjSxbBgP7TnY",
  authDomain: "garage-b0641.firebaseapp.com",
  projectId: "garage-b0641",
  storageBucket: "garage-b0641.appspot.com",
  messagingSenderId: "198648130914",
  appId: "1:198648130914:web:f704e6ff8bcd657232503b",
  measurementId: "G-ER37MMKMCE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);