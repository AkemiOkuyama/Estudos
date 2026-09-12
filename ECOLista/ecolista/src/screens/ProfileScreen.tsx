// src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export function ProfileScreen() {
  const [budget, setBudget] = useState(2000);
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [ecoMode, setEcoMode] = useState(true);

  const usuarioAtual = auth.currentUser;

  useEffect(() => {
    const carregarConfiguracao = async () => {
      try {
        const docRef = doc(db, 'configuracoes', 'usuario');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().monthlyBudget) {
          setBudget(Number(docSnap.data().monthlyBudget));
        }
      } catch (error) {
        console.error('Erro ao carregar configuração: ', error);
      }
    };
    carregarConfiguracao();
  }, []);

  const handleSaveBudget = async () => {
    try {
      const novoOrcamento = Number(String(budget).replace(',', '.'));
      await setDoc(doc(db, 'configuracoes', 'usuario'), {
        monthlyBudget: novoOrcamento,
      }, { merge: true });

      setIsEditing(false);
      Alert.alert('Sucesso', 'Limite de gastos atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar orçamento: ', error);
      Alert.alert('Erro', 'Não foi possível salvar o novo limite.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao sair da conta:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.flatListContent}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>Gerencie suas preferências e dados</Text>

        <View style={[styles.heroCard, { marginBottom: 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 22, color: '#fff', fontWeight: 'bold' }}>GA</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>gabrieleakemimokuyama</Text>
              <Text style={{ fontSize: 12, color: '#e8f5e9' }}>{usuarioAtual?.email || 'gabriele.okuyama@eduvale.br'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 }}>Limite de gastos mensal</Text>
          {isEditing ? (
            <View>
              <TextInput 
                style={[styles.input, { backgroundColor: '#fff', marginBottom: 10 }]} 
                keyboardType="numeric" 
                value={String(budget)} 
                onChangeText={(t) => setBudget(Number(t))} 
              />
              <TouchableOpacity style={[styles.primaryButton, { height: 44 }]} onPress={handleSaveBudget}>
                <Text style={styles.buttonText}>Salvar no Banco</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)} style={{ backgroundColor: '#fefce8', borderWidth: 1, borderColor: '#eab308', borderRadius: 10, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1e293b' }}>R$ {Number(budget).toFixed(2)}</Text>
              <Text>✏️</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.formContainer, { padding: 0, overflow: 'hidden' }]}>
          <View style={styles.menuRow}>
            <Text style={{ flex: 1, fontWeight: 'bold', color: '#1e293b' }}>🔔 Notificações</Text>
            <TouchableOpacity onPress={() => setNotifications(!notifications)}><Text style={{ fontSize: 20 }}>{notifications ? '🟢' : '⚪'}</Text></TouchableOpacity>
          </View>
          <View style={styles.menuDivider} />
          <View style={styles.menuRow}>
            <Text style={{ flex: 1, fontWeight: 'bold', color: '#1e293b' }}>🌿 Modo Eco</Text>
            <TouchableOpacity onPress={() => setEcoMode(!ecoMode)}><Text style={{ fontSize: 20 }}>{ecoMode ? '🟢' : '⚪'}</Text></TouchableOpacity>
          </View>
        </View>

        <View style={{ backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#22c55e', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 }}>🌱 Seu impacto ambiental</Text>
          <Text style={{ fontSize: 13, color: '#475569', lineHeight: 18 }}>Ao escolher produtos sustentáveis, você ajudou a reduzir <Text style={{ fontWeight: 'bold' }}>2.4kg de CO₂</Text> este mês!</Text>
        </View>

        {/* Botão de Sair da Conta */}
        <TouchableOpacity 
          style={{ backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#f87171', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 20 }}
          onPress={handleLogout}
        >
          <Text style={{ color: '#dc2626', fontWeight: 'bold', fontSize: 16 }}>🚪 Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fafafa' },
  flatListContent: { padding: 20, paddingBottom: 50 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#22c55e', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 16 },
  heroCard: { backgroundColor: '#22c55e', padding: 20, borderRadius: 14, marginBottom: 20, elevation: 3 },
  formContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#e0e0e0', elevation: 2 },
  input: { minHeight: 48, backgroundColor: '#fafafa', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ddd', fontSize: 15, color: '#333' },
  primaryButton: { height: 48, backgroundColor: '#22c55e', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  menuDivider: { height: 1, backgroundColor: '#f1f5f9', marginHorizontal: 16 },
});