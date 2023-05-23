import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

export function MyModal({ statusCode }) {
  const [modalVisible, setModalVisible] = useState(true);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [style, setStyle] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');

  useEffect(() => {
    
    if (statusCode === 200) {
      setTitle('Petición exitosa');
      setMessage('La petición se ha completado correctamente.');
      setStyle('valid');
      setBackgroundColor('#55be6e');
    } else {
      setTitle('Error en la petición');
      setMessage('Ha ocurrido un error en la petición.');
      setStyle('error');
      setBackgroundColor('#be5555');
    }
    setModalVisible(true); // Abre el modal cuando se actualizan los valores

    const timer = setTimeout(() => {
      setModalVisible(false);
    }, 3000);

    return () => {
      statusCode=0
      clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta antes de que expire
    };
  }, [statusCode]);



  return (
    <CSSTransition
      in={modalVisible}
      timeout={300}
      classNames="modal-animation"
      unmountOnExit
    
    >
      <div className={`modal show modal-${style}`}>
        <Modal.Dialog>
          <Modal.Body style={{ backgroundColor: `${backgroundColor}` }}>
            <p>{message}</p>
          </Modal.Body>
        </Modal.Dialog>
      </div>
    </CSSTransition>
  );
}