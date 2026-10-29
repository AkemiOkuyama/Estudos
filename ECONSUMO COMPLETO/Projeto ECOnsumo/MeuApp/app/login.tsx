import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    
    setCarregando(true);
    try {
      const resultadoAuth = await signInWithEmailAndPassword(auth, emailLimpo, senha);
      
      await new Promise(resolve => setTimeout(resolve, 500));

      const uid = resultadoAuth.user.uid;
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dados = docSnap.data();
        
        if (dados.role === 'admin') {
          router.replace('/(tabs)/admin');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        Alert.alert('Erro', 'Perfil de usuário não encontrado no sistema.');
      }
    } catch (error: any) {
      Alert.alert('Erro no Login', 'E-mail ou senha incorretos.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/econsumo.png')} style={styles.logoImage} resizeMode="contain" />
      <Text style={styles.logo}>ECOnsumo</Text>
      <Text style={styles.slogan}>O futuro é consciente, o consumo é inteligente.</Text>
      
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

      <TouchableOpacity style={styles.botao} onPress={handleLogin} disabled={carregando}>
        {carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Entrar</Text>}
      </TouchableOpacity>

      {/* Atalho para Cadastro */}
      <TouchableOpacity onPress={() => router.push('/register')} style={styles.containerLink}>
        <Text style={styles.textoNormal}>
          Ainda não tem uma conta? <Text style={styles.link}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 25 },
  logoImage: { width: 150, height: 150, alignSelf: 'center', marginBottom: 20 },
  logo: { fontSize: 38, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center' },
  slogan: { color: '#888', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#1E1E1E', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  botao: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', height: 55, justifyContent: 'center' },
  botaoTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  containerLink: { marginTop: 25, alignItems: 'center' },
  textoNormal: { color: '#aaa', fontSize: 14 },
  link: { color: '#4CAF50', fontWeight: 'bold' }
});