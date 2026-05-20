import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('admin@gmail.com');
  const [senha, setSenha] = useState('123456');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha do Firebase precisa ter no mínimo 6 caracteres.');
      return;
    }
    
    setCarregando(true);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        try {
          await createUserWithEmailAndPassword(auth, email, senha);
          Alert.alert('Sucesso 🎉', 'Conta admin criada e logada automaticamente!');
          return; 
        } catch (createError: any) {
          Alert.alert('Erro ao criar a conta no banco', createError.message);
        }
      } else {
        let mensagem = 'Ocorreu um erro ao tentar entrar.';
        if (error.code === 'auth/invalid-email') {
          mensagem = 'Formato de e-mail inválido.';
        }
        Alert.alert('Falha no Login', mensagem);
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌱 ECOnsumo</Text>
      <Text style={styles.subtitulo}>Controle seus gastos de energia</Text>

      <TextInput 
        style={styles.input} 
        placeholder="E-mail" 
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Senha (mín. 6 dígitos)" 
        placeholderTextColor="#888"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.botao} onPress={handleLogin} disabled={carregando}>
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botaoTexto}>Entrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 20 },
  logo: { fontSize: 38, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center' },
  subtitulo: { fontSize: 16, color: '#aaa', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#1E1E1E', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  botao: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, height: 55, justifyContent: 'center' },
  botaoTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});