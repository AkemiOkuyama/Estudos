import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';

export default function AdminScreen() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  const verificarPermissao = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return router.replace('/login');
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists() || userDoc.data().role !== 'admin') return router.replace('/(tabs)');
      await buscarUsuarios();
    } catch (error) {
      router.replace('/(tabs)');
    }
  };

  const buscarUsuarios = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const lista: any[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        lista.push({ id: docSnap.id, email: data.email, role: data.role, pontosTotais: data.pontosTotais || 0 });
      });
      lista.sort((a, b) => b.pontosTotais - a.pontosTotais);
      setUsuarios(lista);
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { verificarPermissao(); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Painel Admin ⚙️</Text>
        <TouchableOpacity style={styles.botaoSair} onPress={() => signOut(auth)}><Text style={styles.botaoSairTexto}>Sair</Text></TouchableOpacity>
      </View>
      <Text style={styles.subtitulo}>Ranking de Usuários (XP):</Text>
      {carregando ? <ActivityIndicator color="#4CAF50" size="large" /> : (
        <FlatList data={usuarios} keyExtractor={(item) => item.id} renderItem={({ item, index }) => (
          <View style={styles.cardUsuario}>
            <View style={styles.infoRow}>
              <View>
                <Text style={styles.userEmail}>{index === 0 ? '🏆 ' : index === 1 ? '🥈 ' : index === 2 ? '🥉 ' : ''}{item.email}</Text>
                <Text style={[styles.userRole, item.role === 'admin' ? styles.roleAdmin : styles.roleClient]}>Cargo: {item.role?.toUpperCase()}</Text>
              </View>
              <View style={styles.pontosBadge}><Text style={styles.pontosTexto}>{item.pontosTotais} XP</Text></View>
            </View>
          </View>
        )} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  subtitulo: { fontSize: 16, color: '#FFD700', marginBottom: 15, fontWeight: 'bold' },
  botaoSair: { backgroundColor: '#d32f2f', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 6, justifyContent: 'center' },
  botaoSairTexto: { color: '#fff', fontWeight: 'bold' },
  cardUsuario: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#2c2c2c' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userEmail: { color: '#fff', fontSize: 16, fontWeight: '600' },
  userRole: { fontSize: 12, marginTop: 5, fontWeight: 'bold' },
  roleAdmin: { color: '#e57373' },
  roleClient: { color: '#81C784' },
  pontosBadge: { backgroundColor: '#2e3d2e', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: '#4CAF50' },
  pontosTexto: { color: '#4CAF50', fontWeight: 'bold', fontSize: 14 }
});