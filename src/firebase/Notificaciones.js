import axios from "axios";
import {getUsers, db,getUsersTopic, updateUsersNotificationTopic,updateUsersNotification} from "./firebase"
const authToken =import.meta.env.VITE_AuthorizationKey;
const fcmEndpoint = 'https://fcm.googleapis.com/fcm/send';

const topics=["todos","subAzul","subBlanca"]
const topicsFirebase=["Todos","TarjetaAzul","TarjetaBlanca"]

export const sendNotificationToTopic = async (fromData) => {

  const users=await getUsersTopic(topics[fromData.topico-1])
  let statusCode
  const topicFirebase=topicsFirebase[fromData.topico-1]
  const notification = {
    title: fromData.title,
    body: fromData.description,
    topic: topicFirebase,
    date:Date.now()
  }
  
    try {
    const response = await axios.post(
      fcmEndpoint,
      {
        to: `/topics/${topicFirebase}`,
        notification: notification
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    ).then((response) => {
      
      updateUsersNotificationTopic(topics[fromData.topico-1],notification)
      statusCode = response.status
      
    }).catch((error) => {
      statusCode = error
    });
  } catch (error) {
    console.error('Error al enviar la notificación a tópico:', error);
  }
  return statusCode
};

export const sendNotificationToUser = async (fromData) => {
  let statusCode
  const notification = {
    title: fromData.title,
    body: fromData.description,
    date:Date.now()
  }
  try {
    const response = await axios.post(
      fcmEndpoint,
      {
        to: fromData.Token,
        notification: notification
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    ).then((response) => {
      updateUsersNotification(notification,fromData.DNI)
      statusCode = response.status
    }).catch((error) => {
      statusCode = error
    });

   
  } catch (error) {
    console.error('Error al enviar la notificación a usuario:', error);
  }
  return statusCode
};

