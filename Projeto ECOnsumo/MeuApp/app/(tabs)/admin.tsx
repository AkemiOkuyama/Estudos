import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function AdminScreen() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  const buscarUsuarios = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const lista: any[] = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setUsuarios(lista);
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Painel Admin ⚙️</Text>
        <TouchableOpacity style={styles.botaoSair} onPress={() => signOut(auth)}>
          <Text style={styles.botaoSairTexto}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitulo}>Usuários Cadastrados:</Text>

      {carregando ? (
        <ActivityIndicator color="#4CAF50" size="large" />
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardUsuario}>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text style={[styles.userRole, item.role === 'admin' ? styles.roleAdmin : styles.roleClient]}>
                Cargos: {item.role?.toUpperCase()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  subtitulo: { fontSize: 16, color: '#aaa', marginBottom: 15 },
  botaoSair: { backgroundColor: '#d32f2f', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 6, justifyContent: 'center' },
  botaoSairTexto: { color: '#fff', fontWeight: 'bold' },
  cardUsuario: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 8, marginBottom: 10 },
  userEmail: { color: '#fff', fontSize: 16, fontWeight: '600' },
  userRole: { fontSize: 12, marginTop: 5, fontWeight: 'bold' },
  roleAdmin: { color: '#e57373' },
  roleClient: { color: '#81C784' }
});