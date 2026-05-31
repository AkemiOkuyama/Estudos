import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, deleteDoc, doc, increment, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebaseConfig';

const AparelhoItem = ({ item, onExcluir }: { item: any, onExcluir: (id: string) => void }) => (
  <View style={styles.card}>
    {item.imagemUri && <Image source={{ uri: item.imagemUri }} style={styles.imagemCard} />}
    <View style={styles.cardConteudo}>
      <Text style={styles.nomeCard}>{item.nome}</Text>
      <Text style={styles.infoCard}>{item.potenciaWatts}W • {item.horasPorDia}h/dia</Text>
    </View>
    <TouchableOpacity style={styles.botaoExcluir} onPress={() => onExcluir(item.id)}>
      <Ionicons name="trash" size={22} color="#ef5350" />
    </TouchableOpacity>
  </View>
);

export default function AddDeviceScreen() {
  const [nome, setNome] = useState('');
  const [potencia, setPotencia] = useState('');
  const [horasPorDia, setHorasPorDia] = useState('');
  const [imagemUri, setImagemUri] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [aparelhos, setAparelhos] = useState<any[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, 'eletrodomesticos'), where('userId', '==', user.uid));
    return onSnapshot(q, (snapshot) => {
      setAparelhos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const capturarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permissão', 'Precisamos de acesso à câmera.');

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) setImagemUri(result.assets[0].uri);
  };

  const handleSalvar = async () => {
    Keyboard.dismiss();
    const p = parseFloat(potencia.replace(',', '.'));
    const h = parseFloat(horasPorDia.replace(',', '.'));
    if (!nome || isNaN(p) || isNaN(h)) return Alert.alert('Aviso', 'Preencha os campos corretamente.');
    
    setSalvando(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'eletrodomesticos'), { userId: user.uid, nome, potenciaWatts: p, horasPorDia: h, imagemUri, criadoEm: new Date() });
        await updateDoc(doc(db, 'users', user.uid), { pontosTotais: increment(50) });
        Alert.alert('Sucesso 🎉', `${nome} cadastrado!`);
        setNome(''); setPotencia(''); setHorasPorDia(''); setImagemUri(null);
      }
    } catch { Alert.alert('Erro', 'Falha ao salvar no banco.'); } finally { setSalvando(false); }
  };

  const excluirAparelho = (id: string) => {
    Alert.alert('Excluir', 'Confirmar exclusão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteDoc(doc(db, 'eletrodomesticos', id)) }
    ]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Novo Aparelho 🔌</Text>
        
        <TouchableOpacity style={styles.botaoFoto} onPress={capturarFoto}>
          {imagemUri ? <Image source={{ uri: imagemUri }} style={styles.imagemPreview} /> : <Ionicons name="camera" size={40} color="#4CAF50" />}
        </TouchableOpacity>

        <TextInput style={styles.input} placeholder="Nome do aparelho" placeholderTextColor="#888" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="Potência (W)" placeholderTextColor="#888" keyboardType="numeric" value={potencia} onChangeText={setPotencia} />
        <TextInput style={styles.input} placeholder="Horas por dia" placeholderTextColor="#888" keyboardType="numeric" value={horasPorDia} onChangeText={setHorasPorDia} />
        
        <TouchableOpacity style={styles.botao} onPress={handleSalvar} disabled={salvando}>
          {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Salvar Aparelho</Text>}
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
  titulo: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  botaoFoto: { height: 160, backgroundColor: '#1E1E1E', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  imagemPreview: { width: '100%', height: '100%', borderRadius: 10 },
  input: { backgroundColor: '#1E1E1E', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#333', fontSize: 16 },
  botao: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  divisor: { height: 1, backgroundColor: '#333', marginVertical: 25 },
  subtitulo: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  card: { flexDirection: 'row', backgroundColor: '#1E1E1E', padding: 10, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  imagemCard: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
  cardConteudo: { flex: 1 },
  nomeCard: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  infoCard: { color: '#4CAF50', fontSize: 13, marginTop: 2 },
  botaoExcluir: { padding: 10 }
});