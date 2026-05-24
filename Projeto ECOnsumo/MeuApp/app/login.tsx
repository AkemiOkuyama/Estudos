import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    
    setCarregando(true);
    try {
      const resultadoAuth = await signInWithEmailAndPassword(auth, email, senha);
      const uid = resultadoAuth.user.uid;

      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dadosUsuario = docSnap.data();
        if (dadosUsuario.role === 'admin') {
          router.replace('/(tabs)/admin');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      Alert.alert('Erro no Login', 'E-mail ou senha incorretos.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌱 ECOnsumo </Text>
      <Text style={styles.subtitulo}>O futuro é consciente, o consumo é inteligente. Faça login para continuar</Text>

      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#888" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#888" secureTextEntry value={senha} onChangeText={setSenha} />

      <TouchableOpacity style={styles.botao} onPress={handleLogin} disabled={carregando}>
        {carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Entrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')} style={styles.link}>
        <Text style={styles.linkTexto}>Não tem conta? Cadastre-se aqui</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 25 },
  logo: { fontSize: 38, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center' },
  subtitulo: { fontSize: 16, color: '#aaa', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#1E1E1E', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  botao: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', height: 55, justifyContent: 'center', marginTop: 10 },
  botaoTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 25 },
  linkTexto: { color: '#4CAF50', textAlign: 'center', fontSize: 15 }
});