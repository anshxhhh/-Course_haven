import dotenv from "dotenv";
dotenv.config();

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
const JWT_ADMIN_PASSWORD=process.env.JWT_ADMIN_PASSWORD;
const STRIPE_SECRET_KEY ="sk_test_51QjIEmGYRleAdR6N9ALEBglSle04mowz36GUaZbotiQdSfIuTZRZ4gQyiVeDPTCR6Grq3r54TfJKe1wsoP5OYVVN00xecUjpvA";


export default {
  JWT_USER_PASSWORD,
  STRIPE_SECRET_KEY,
  JWT_ADMIN_PASSWORD
 
}