// App.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AuthForm from './AuthForm';
import SolicitudForm from './SolicitudForm';
import * as ImagePicker from 'expo-image-picker';

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', dni: '', password: ''});
  const [showSignup, setShowSignup] = useState(false);
  const [comicData, setComicData] = useState({ title: '', description: '', image: null });
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesita permiso para acceder a la galería.');
      }
    })();
  }, []);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setMessage('');
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('https://dbpbackdeployment-production.up.railway.app/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser({ username: loginData.username, email: loginData.email });
        setToken(data.token);
        console.log("Inicio de sesión adecuado")
        setMessage('Inicio de sesión exitoso');
      } else {
        console.error('Error en la solicitud de inicio de sesión:', data.error || 'Error descocido');
        setMessage('Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en la solicitud de inicio de sesión:', error.message || 'Error desconocido');
      setMessage('Error al iniciar sesión');
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch('https://dbpbackdeployment-production.up.railway.app/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: signupData.username,
          email: signupData.email,
          dni: signupData.dni,
          contrasenia: signupData.password,  
          puntos:0,
          isAdmin:"false",
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setUser({ username: signupData.username, email: signupData.email });
        setToken(data.token);
        setShowSignup(false);
        setMessage('Registro exitoso');
      } else {
        console.error('Error en la solicitud de registro:', data.error || 'Error desconocido');
        setMessage('Error al registrarse');
      }
    } catch (error) {
      console.error('Error en la solicitud de registro:', error.message || 'Error desconocido');
      setMessage('Error al registrarse');
    }
  };
  

  return (
    <View style={styles.container}>
      {!user ? (
        <>
          <AuthForm
            data={showSignup ? signupData : loginData}
            onDataChange={(data) => (showSignup ? setSignupData(data) : setLoginData(data))}
            onSubmit={showSignup ? handleSignup : handleLogin}
            buttonText={showSignup ? "Registrarse" : "Iniciar Sesión"}
          />
          <Button
            title={showSignup ? "Ya tienes una cuenta? Inicia Sesión" : "¿No tienes cuenta? Regístrate"}
            onPress={() => setShowSignup(!showSignup)}
          />
        </>
      ) : (
        <>
          <Text>Bienvenido, {user.username}!</Text>
          <Button title="Cerrar Sesión" onPress={handleLogout} />
          <SolicitudForm user={user} token={token} />
        </>
      )}
      {message ? <Text>{message}</Text> : null}
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default App;
