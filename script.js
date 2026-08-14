/**
 * PANITIA 17 AGUSTUS - SISTEM PENDAFTARAN & BAGAN PERTANDINGAN
 * File konfigurasi dan utilitas Firebase Firestore modular
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyDxdZn5Gq9qGl-Ds5UoU79e71O9CUhDxLE",
  authDomain: "list-lomba.firebaseapp.com",
  projectId: "list-lomba",
  storageBucket: "list-lomba.firebasestorage.app",
  messagingSenderId: "448630145151",
  appId: "1:448630145151:web:c94c35b50414d378be7f4a",
  measurementId: "G-TDZBM327P7"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
