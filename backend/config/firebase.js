import admin from 'firebase-admin';


const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_KEY_BASE64, 'base64').toString('utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
export { db };