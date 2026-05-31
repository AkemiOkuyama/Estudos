import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { collection, addDoc, query, where, deleteDoc, doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';

const AparelhoItem = ({ item, onExcluir }: { item: any, onExcluir: (id: string) => void }) => (
  <View style={styles.card}>
    <Text style={styles.nomeCard}>{item.nome}</Text>
    <Text style={styles.infoCard}>{item.potenciaWatts}W • {item.horasPorDia}h/dia</Text>
    <TouchableOpacity style={styles.botaoExcluir} onPress={() => onExcluir(item.id)}>
      <Text style={styles.textoExcluir}>Remover</Text>
    </TouchableOpacity>
  </View>
);

export default function AddDeviceScreen() {
  const [nome, setNome] = useState('');
  const [potencia, setPotencia] = useState('');
  const [horasPorDia, setHorasPorDia] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [aparelhos, setAparelhos] = useState<any[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    
    const q = query(collection(db, 'eletrodomesticos'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAparelhos(lista);
    });
    return () => unsubscribe();
  }, []);

  const excluirAparelho = useCallback((id: string) => {
    Alert.alert('Excluir', 'Deseja excluir este aparelho?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await deleteDoc(doc(db, 'eletrodomesticos', id));
          } catch (e) {
            Alert.alert('Erro', 'Não foi possível excluir.');
          }
        } 
      }
    ]);
  }, []);

  const handleSalvar = async () => {
    Keyboard.dismiss();
    const p = parseFloat(potencia.replace(',', '.'));
    const h = parseFloat(horasPorDia.replace(',', '.'));

    if (!nome || isNaN(p) || isNaN(h) || p <= 0) {
      return Alert.alert('Aviso', 'Preencha campos válidos.');
    }
    
    setSalvando(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, 'eletrodomesticos'), {
        userId: user.uid, 
        nome: nome.trim(), 
        potenciaWatts: p, 
        horasPorDia: h, 
        criadoEm: new Date(),
      });

      await updateDoc(doc(db, 'users', user.uid), { pontosTotais: increment(50) });

      Alert.alert('Sucesso 🎉', `${nome} cadastrado!`);
      setNome(''); setPotencia(''); setHorasPorDia('');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar dados.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Novo Aparelho 🔌</Text>
        
        <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#888" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="Potência (W)" placeholderTextColor="#888" keyboardType="numeric" value={potencia} onChangeText={setPotencia} />
        <TextInput style={styles.input} placeholder="Horas por dia" placeholderTextColor="#888" keyboardType="numeric" value={horasPorDia} onChangeText={setHorasPorDia} />
        
        <TouchableOpacity style={styles.botao} onPress={handleSalvar} disabled={salvando}>
          {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Salvar</Text>}
        </TouchableOpacity>

        <View style={styles.divisor} />
        <Text style={styles.subtitulo}>Aparelhos cadastrados</Text>
        
        {aparelhos.map((item) => <AparelhoItem key={item.id} item={item} onExcluir={excluirAparelho} />)}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#121212', padding: 20 },
  titulo: { color: '#fff', fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#1E1E1E', color: '#fff', padding: 16, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#2c2c2c' },
  botao: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 10, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  divisor: { height: 1, backgroundColor: '#333', marginVertical: 30 },
  subtitulo: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  card: { backgroundColor: '#1E1E1E', padding: 16, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#2c2c2c' },
  nomeCard: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  infoCard: { color: '#4CAF50', marginTop: 4, fontWeight: '600' },
  botaoExcluir: { marginTop: 15, backgroundColor: 'rgba(211, 47, 47, 0.1)', paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#d32f2f' },
  textoExcluir: { color: '#ef5350', fontWeight: 'bold' },
});