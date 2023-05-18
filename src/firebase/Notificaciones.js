import axios from "axios";
const authToken =import.meta.env.VITE_AuthorizationKey;
const fcmEndpoint = 'https://fcm.googleapis.com/fcm/send';

export const sendNotificationToTopic = async (fromData) => {
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
    );

    console.log('Notificación enviada a tópico con éxito:', response.data);
  } catch (error) {
    console.error('Error al enviar la notificación a tópico:', error);
  }
};

export const sendNotificationToUser = async (fromData) => {
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
    );

    console.log('Notificación enviada a usuario con éxito:', response.data);
  } catch (error) {
    console.error('Error al enviar la notificación a usuario:', error);
  }
};

