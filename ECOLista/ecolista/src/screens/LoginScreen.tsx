// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isRegistrando, setIsRegistrando] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAutenticacao = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha o e-mail e a senha!');
      return;
    }

    setLoading(true);
    try {
      if (isRegistrando) {
        await createUserWithEmailAndPassword(auth, email.trim(), senha);
        Alert.alert('Sucesso! 🎉', 'Conta criada com sucesso!');
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), senha);
      }
    } catch (error: any) {
      console.error(error);
      let mensagem = 'Ocorreu um erro na autenticação.';
      if (error.code === 'auth/invalid-email') mensagem = 'E-mail inválido.';
      if (error.code === 'auth/user-not-found') mensagem = 'Usuário não encontrado.';
      if (error.code === 'auth/wrong-password') mensagem = 'Senha incorreta.';
      if (error.code === 'auth/email-already-in-use') mensagem = 'Este e-mail já está cadastrado.';
      if (error.code === 'auth/weak-password') mensagem = 'A senha deve ter pelo menos 6 caracteres.';
      
      Alert.alert('Erro', mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <View style={styles.sproutBadge}>
              <Text style={{ fontSize: 40 }}>🌱</Text>
            </View>
            <Text style={styles.appTitle}>EcoLista</Text>
            <Text style={styles.appSubtitle}>Planejamento e consumo consciente</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.sectionHeader}>{isRegistrando ? 'Criar Nova Conta' : 'Acessar o Sistema'}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Seu e-mail"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              placeholderTextColor="#888"
              secureTextEntry
              autoCapitalize="none"
              value={senha}
              onChangeText={setSenha}
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleAutenticacao} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Aguarde...' : isRegistrando ? 'Cadastrar Conta' : 'Entrar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setIsRegistrando(!isRegistrando)} 
              style={{ marginTop: 16, alignItems: 'center' }}
            >
              <Text style={{ color: '#64748b', fontSize: 14 }}>
                {isRegistrando ? 'Já tem uma conta? ' : 'Não tem uma conta? '}
                <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>
                  {isRegistrando ? 'Faça login' : 'Cadastre-se'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fafafa' },
  sproutBadge: { backgroundColor: '#22c55e', borderRadius: 45, width: 90, height: 90, alignItems: 'center', justifyContent: 'center', elevation: 4, marginBottom: 12 },
  appTitle: { fontSize: 28, fontWeight: 'bold', color: '#22c55e', marginBottom: 4 },
  appSubtitle: { fontSize: 14, color: '#64748b' },
  formContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#e0e0e0', elevation: 2 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 16, textAlign: 'center' },
  input: { minHeight: 48, backgroundColor: '#fafafa', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 14, borderWidth: 1, borderColor: '#ddd', fontSize: 15, color: '#333' },
  primaryButton: { height: 48, backgroundColor: '#22c55e', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});