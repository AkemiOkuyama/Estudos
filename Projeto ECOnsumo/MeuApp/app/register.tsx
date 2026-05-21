import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState<'client' | 'admin'>('client');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    setCarregando(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, senha);
      await setDoc(doc(db, 'users', res.user.uid), {
        email: email,
        role: role,
        criadoEm: new Date()
      });
      Alert.alert('Sucesso 🎉', 'Conta criada!');
    } catch (error: any) {
      Alert.alert('Erro ao cadastrar', error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Criar Conta 🌱</Text>

      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#888" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Senha (mín. 6)" placeholderTextColor="#888" secureTextEntry value={senha} onChangeText={setSenha} />

      <View style={styles.roleContainer}>
        <TouchableOpacity style={[styles.roleBotao, role === 'client' && styles.roleAtivo]} onPress={() => setRole('client')}>
          <Text style={styles.roleTexto}>Sou Cliente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.roleBotao, role === 'admin' && styles.roleAtivo]} onPress={() => setRole('admin')}>
          <Text style={styles.roleTexto}>Sou Admin</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botao} onPress={handleRegister} disabled={carregando}>
        {carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Cadastrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={styles.link}>
        <Text style={styles.linkTexto}>Já tem conta? Voltar ao Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 25 },
  logo: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#1E1E1E', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  roleBotao: { flex: 1, padding: 12, backgroundColor: '#222', borderRadius: 8, marginHorizontal: 5, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  roleAtivo: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  roleTexto: { color: '#fff', fontWeight: 'bold' },
  botao: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', height: 55, justifyContent: 'center' },
  botaoTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 25 },
  linkTexto: { color: '#aaa', textAlign: 'center' }
});