import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const Signup = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  const handleSignup = async () => {
    try {
      const response = await fetch('https://dbpproyecto-production.up.railway.app/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          email,
          dni,
          contrasenia,
          puntos: 0,
          isAdmin: false,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Joined successfully');
        console.log('Data sent successfully');
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      console.error('Error in request:', error);
    }
  };
  
  return (
    <View>
      <TextInput placeholder="Nombre de usuario" value={nombre} onChangeText={setNombre} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Dni" value={dni} onChangeText={setDni} />
      <TextInput placeholder="Contraseña" value={contrasenia} onChangeText={setContrasenia} secureTextEntry />
      <Button title="Quiero unirme" onPress={handleSignup} />
    </View>
  );
};

export default Signup;
