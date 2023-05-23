// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs,doc,updateDoc,arrayUnion   } from 'firebase/firestore/lite';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

export async function getUsers() {
   
    try {
        const userCollection = collection(db, 'Usuarios');
        const querySnapshot = await getDocs(userCollection);
        const usersList = querySnapshot.docs.map((doc) => doc.data());
        return usersList;
      } catch (error) {
        console.error('Error getting documents: ', error);
        return [];
      }
  }

export async function getUsersTopic(topic){
  try {
    let topicUsers=[]
    const userCollection = collection(db, 'Usuarios');
    const querySnapshot = await getDocs(userCollection);
    const usersList = querySnapshot.docs.map((doc) => doc.data());
    usersList.forEach((user) => {
      if (user.Plan) {
        
        const array = Object.entries(user.Plan).flatMap(([key, value]) => [key, value]);
        let position =[]
        position.push(array.indexOf(topic))
        
        for (let index = 0; index < position.length; index++) {
          if (array[position[index]] === topic && array[position[index]+1] === true) {
            topicUsers.push(user);
          }
        }
      }
      
    });
    
    return topicUsers;
  } catch (error) {
    console.error('Error getting documents: ', error);
    
  }
  
}

export async function updateUsersNotificationTopic(topic,notification) {
  try {
    let topicUsers=await getUsersTopic(topic)
    console.log(topicUsers)
    topicUsers.forEach((user) => {
      console.log(user)
      const userRef = doc(db, 'Usuarios', user.DNI);
      updateDoc(userRef, {notificaciones: arrayUnion(notification)});

    });
    

  } catch (error) {
    console.error('Error getting documents: ', error);
    
  }
}
export async function updateUsersNotification(notification,dni) {
  try {
      const userRef = doc(db, 'Usuarios', dni);
      await updateDoc(userRef, {notificaciones: arrayUnion(notification)});
    
   
  } catch (error) {
    console.error('Error getting documents: ', error);
    
  }
}