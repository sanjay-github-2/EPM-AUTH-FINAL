// utils/crypto.js

import CryptoJS from "crypto-js";
require("dotenv").config();

const SECRET_KEY = "TlXuTchUilgxPjnOUHeG6wvefxnwxIg";
console.log(SECRET_KEY);
// Replace with your own secret key

// Function to encrypt data
export const encryptData = (data) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();
  return encryptedData;
};

// Function to decrypt data
export const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};
