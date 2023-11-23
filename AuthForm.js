// AuthForm.js
import React from 'react';
import { View, TextInput, Button, Text } from 'react-native';

const AuthForm = ({ data, onDataChange, onSubmit, buttonText }) => {
  return (
    <View>
      <Text>{buttonText}</Text>
      {Object.keys(data).map((field) => (
        <TextInput
          key={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={data[field]}
          onChangeText={(text) => onDataChange({ ...data, [field]: text })}
          secureTextEntry={field.toLowerCase().includes('password')}
        />
      ))}
      <Button title={buttonText} onPress={onSubmit} />
    </View>
  );
};

export default AuthForm;
