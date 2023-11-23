import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const AuthForm = ({ data, onDataChange, onSubmit, buttonText }) => {
  return (
    <>
      <Text>{buttonText}</Text>
      {Object.keys(data).map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={data[field]}
          onChangeText={(text) => onDataChange({ ...data, [field]: text })}
          secureTextEntry={field.toLowerCase().includes('password')}
        />
      ))}
      <Button title={buttonText} onPress={onSubmit} />
    </>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', dni: '', password: '' });
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

       

  const handleLogin = async () => {
    try {
      const response = await fetch('http://dbpbackdeployment-production.up.railway.app/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
      //  mode: 'no-cors',
      });

      const data = await response.json();

      if (response.ok) {
        setUser({ username: loginData.username, email: loginData.email });
        setToken(data.token);
        setMessage('Inicio de sesión exitoso');
      } else {
        console.error('Error en la solicitud de inicio de sesión:', data.error || 'Error desconocido');
        setMessage('Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en la solicitud de inicio de sesión:', error.message || 'Error desconocido');
      setMessage('Error al iniciar sesión');
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch('http://dbpbackdeployment-production.up.railway.app/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: signupData.username,
          email: signupData.email,
          dni: signupData.dni,
          contrasenia: signupData.password,
        }),
      //  mode: 'no-cors',
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

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setMessage('');
  };

  const handlePostComic = async () => {
    try {
      const formData = new FormData();
      formData.append('title', comicData.title);
      formData.append('description', comicData.description);
      formData.append('image', {
        uri: comicData.image.uri,
        type: 'image/jpeg', 
        name: 'comic_image.jpg',
      });
  
      const response = await fetch('http://dbpbackdeployment-production.up.railway.app/api/comics', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Comic publicado con éxito');
        setMessage('Comic publicado con éxito');
      } else {
        console.error('Error en la solicitud de publicación de cómic:', data.error || 'Error desconocido');
        setMessage('Error al publicar el cómic');
      }
    } catch (error) {
      console.error('Error en la solicitud de publicación de cómic:', error.message || 'Error desconocido');
      setMessage('Error al publicar el cómic');
    }
  };
  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.cancelled) {
      setComicData({ ...comicData, image: result });
    }
  };
  

  return (
    
    <View style={styles.container}>
      {!user && !showSignup && (
        <>
          <Text>Iniciar Sesión</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            value={loginData.username}
            onChangeText={(text) => setLoginData({ ...loginData, username: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={loginData.password}
            onChangeText={(text) => setLoginData({ ...loginData, password: text })}
            secureTextEntry
          />
          <Button title="Iniciar Sesión" onPress={handleLogin} />
          <Button title="Registrarse" onPress={() => setShowSignup(true)} />
          {message ? <Text>{message}</Text> : null}
        </>
      )}

      {showSignup && (
        <>
          <Text>Registrarse</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            value={signupData.username}
            onChangeText={(text) => setSignupData({ ...signupData, username: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={signupData.email}
            onChangeText={(text) => setSignupData({ ...signupData, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="DNI"
            value={signupData.dni}
            onChangeText={(text) => setSignupData({ ...signupData, dni: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={signupData.password}
            onChangeText={(text) => setSignupData({ ...signupData, password: text })}
            secureTextEntry
          />
          <Button title="Registrarse" onPress={handleSignup} />
          <Button title="Volver" onPress={() => setShowSignup(false)} />
          {message ? <Text>{message}</Text> : null}
        </>
      )}
      

      {user && (
        <>
          <Text>Bienvenido, {user.username} ({user.email})</Text>
          <Button title="Cerrar Sesión" onPress={handleLogout} />
          <TextInput
            style={styles.input}
            placeholder="Título"
            value={comicData.title}
            onChangeText={(text) => setComicData({ ...comicData, title: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={comicData.description}
            onChangeText={(text) => setComicData({ ...comicData, description: text })}
          />
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.imagePicker}>
              {comicData.imageUrl ? (
                <Image source={{ uri: comicData.imageUrl }} style={styles.image} />
              ) : (
                <Text>Elegir Imagen</Text>
              )}
            </View>
          </TouchableOpacity>
          <Button title="Publicar Comic" onPress={handlePostComic} />
          {message ? <Text>{message}</Text> : null}
        </>
      )}
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '80%',
  },
  imagePicker: {
    backgroundColor: '#ddd',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default App;
