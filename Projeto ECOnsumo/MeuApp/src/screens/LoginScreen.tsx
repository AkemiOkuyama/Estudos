import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) return Alert.alert('Erro', 'Preencha todos os campos.');
    setCarregando(true);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
    } catch (error: any) {
      Alert.alert('Erro no Login', 'E-mail ou senha inválidos.');
    } finally {
      setCarregando(false);
    }
  };

  const handleCadastro = async () => {
    if (!email || !senha) return Alert.alert('Erro', 'Preencha todos os campos.');
    setCarregando(true);
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro no Cadastro', 'Verifique os dados ou se a senha tem 6+ dígitos.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌱 ECOnsumo</Text>
      <Text style={styles.subtitulo}>Monitore e reduza seus gastos de energia</Text>

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
        placeholder="Senha" 
        placeholderTextColor="#888"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {carregando ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <>
          <TouchableOpacity style={styles.botao} onPress={handleLogin}>
            <Text style={styles.botaoTexto}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.botao, styles.botaoSecundario]} onPress={handleCadastro}>
            <Text style={styles.botaoTextoSecundario}>Criar Conta</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 20 },
  logo: { fontSize: 32, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', marginBottom: 5 },
  subtitulo: { fontSize: 14, color: '#aaa', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#1E1E1E', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  botao: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  botaoSecundario: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#4CAF50', marginTop: 15 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  botaoTextoSecundario: { color: '#4CAF50', fontSize: 16, fontWeight: 'bold' }
});