import axios from "axios";
const authToken =import.meta.env.VITE_AuthorizationKey;
const fcmEndpoint = 'https://fcm.googleapis.com/fcm/send';

export const sendNotificationToTopic = async (fromData) => {
  let statusCode
  const topics=["Todos","TarjetaAzul","TarjetaBlanca"]
  const notification = {
    title: fromData.title,
    body: fromData.description,
  }
  
    try {
    const response = await axios.post(
      fcmEndpoint,
      {
        to: `/topics/${topics[fromData.topico]}`,
        notification: notification
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    ).then((response) => {
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
      statusCode = response.status
    }).catch((error) => {
      statusCode = error
    });

   
  } catch (error) {
    console.error('Error al enviar la notificación a usuario:', error);
  }
  return statusCode
};

