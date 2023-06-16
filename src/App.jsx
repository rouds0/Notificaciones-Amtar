import { useEffect, useState } from "react";
import "./App.css";
import { getUsers } from "./firebase/firebase.js";
import {sendNotificationToUser,sendNotificationToTopic} from "./firebase/Notificaciones.js";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { NavBar } from "./nav.jsx";
import Container from "react-bootstrap/Container";
import Select from "react-select";
import { CSSTransition,Transition } from 'react-transition-group';
import { AlertComponent } from "./modal";
import { Snackbar,Alert } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.css';
import "./index.css"

import {
  OpcionTemas,
  LabelTemas,
  ColourPersonOption,
  ColorPersona,
} from "./docs/dataColour.js";
import chroma from "chroma-js";
function App() {
  
  const [users, setUsers] = useState([]);
  const [dni, setDNI] = useState("");
  const [userData, setUserData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("1");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topico: "",
    DNI: "",
    Token:"",

  });
  const [SelectedOptionTopics,setSelectedOptionTopics]=useState([])
  const [statusCode, setStatusCode] = useState(0);
 
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  

  const dot = (color = "transparent") => ({
    alignItems: "center",
    display: "flex",

    ":before": {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: "block",
      marginRight: 8,
      height: 10,
      width: 10,
    },
  });

  const colourStyles = {
    control: (styles) =>
      Object.assign({}, styles, { backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return Object.assign({}, styles, {
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : undefined,
        color: isDisabled
          ? "#ccc"
          : isSelected
          ? chroma.contrast(color, "white") > 2
            ? "white"
            : "black"
          : data.color,
        cursor: isDisabled ? "not-allowed" : "default",

        ":active": Object.assign({}, styles[":active"], {
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : color.alpha(0.3).css()
            : undefined,
        }),
      });
    },
    input: (styles) => Object.assign({}, styles, dot()),
    placeholder: (styles) => Object.assign({}, styles, dot("#ccc")),
    singleValue: (styles, { data }) =>
      Object.assign({}, styles, dot(data.color)),
  };
  useEffect(() => {
    const fetchData = async () => {
      const userList = await getUsers();

      setUsers(userList);
    };
    fetchData();
  }, []);
  const resetValues=()=>{
    formData["DNI"]=""
    formData["Token"]=""
    formData["topico"]=undefined
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    formData["DNI"]=dni
    formData["Token"]=userData.Token
    formData["topico"]=SelectedOptionTopics.value
 
    if(formData["topico"]!==undefined&&selectedOption.value!=="1"){
      
      sendNotificationToTopic(formData).then((res)=>{
        setStatusCode(res)
        
      }).catch(()=>{
        setStatusCode(400)
      
      }).finally(()=>{
        resetValues()
      })
      
    
    }
    else{
      
      sendNotificationToUser(formData).then((res)=>{
        setStatusCode(res)
        
      }).catch(()=>{
        setStatusCode(400)
       
      }).finally(()=>{
        resetValues()
      })
     
    }
  
  };
  const handleSearch = async () => {
    try {
      const documentData = users.find((user) => user.DNI === dni);
      if (documentData && documentData.Token) {
        setUserData(documentData);
      } else {
        setUserData("info");
      }
    } catch (error) {
      console.log("Error al buscar el usuario:", error);
      setUserData("danger");
    }
  };
  const handleInputChange = ({ target }) => {
    setDNI(target.value);
  };
  const handleInputChangeNotificacion = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
   
  };
  useEffect(() => {
    if (statusCode === 200) {
      setSuccessVisible(true);
    } else if (statusCode !== 0) {
      setErrorVisible(true);
    }
  }, [statusCode]);

  const handleCloseSuccess = () => {
    setSuccessVisible(false);
    setStatusCode(0); 
  };

  const handleCloseError = () => {
    setErrorVisible(false);
    setStatusCode(0); 
  };
  return (
    <>
     <Snackbar
        open={successVisible}
        autoHideDuration={2000}
        onClose={handleCloseSuccess}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Mensaje enviado correctamente!
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorVisible}
        autoHideDuration={2000}
        onClose={handleCloseError}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          Sucedio un error al enviar el mensaje
        </Alert>
      </Snackbar>
      
    <NavBar />

      <Container >
        <Form onSubmit={handleSubmit}>
          <h2>Enviar mensaje</h2>

          {selectedOption.value === "1" ? (
            <div>
              <input
                inputMode="numeric"
                type="number"
                className="no-spinner textInput field"
                value={dni}
                onChange={handleInputChange}
                pattern="[0-9]*"
                placeholder="Ingrese el Dni"
              />

              <Select
                value={selectedOption}
                onChange={setSelectedOption}
                defaultValue={ColorPersona[2]}
                options={ColourPersonOption}
                styles={colourStyles}
                placeholder="Seleccione a que/quienes desea mandar la notificacion"
              />
            </div>
          ) : (
            <div>
              <Select
                value={selectedOption}
                onChange={setSelectedOption}
                defaultValue={ColorPersona[2]}
                options={ColourPersonOption}
                styles={colourStyles}
                placeholder="Seleccione a que/quienes desea mandar la notificacion"
              />
              <div>
                <Select
                  placeholder="Seleccione su grupo de personas"
                  className="selectPersonas"
                  defaultValue={LabelTemas[2]}
                  options={OpcionTemas}
                  styles={colourStyles}
                  onChange={setSelectedOptionTopics}
                />
              </div>
            </div>
          )}
          <input type="text"  name="title" class="title-input" placeholder="Ingresa un título" value={formData.title} onChange={handleInputChangeNotificacion}></input>
          <textarea  name="description" class="custom-textarea" placeholder="Escribe aquí un mensaje" value={formData.description} onChange={handleInputChangeNotificacion}></textarea>
          <Button onClick={()=>{handleSearch()}}  type="submit" variant="warning">
            Enviar Notificación
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default App;
