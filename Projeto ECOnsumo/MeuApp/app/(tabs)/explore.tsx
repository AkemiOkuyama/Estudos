import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { auth, db } from '../../firebaseConfig';
import { collection, addDoc, query, where, deleteDoc, doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';

export default function AddDeviceScreen() {
  const [nome, setNome] = useState('');
  const [potencia, setPotencia] = useState('');
  const [horasPorDia, setHorasPorDia] = useState('');
  const [imagem, setImagem] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [cameraAberta, setCameraAberta] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [aparelhos, setAparelhos] = useState<any[]>([]);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, 'eletrodomesticos'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista: any[] = [];
      snapshot.forEach((docSnap) => lista.push({ id: docSnap.id, ...docSnap.data() }));
      setAparelhos(lista);
    });
    return () => unsubscribe();
  }, []);

  const abrirCamera = async () => {
    if (!permission?.granted) {
      const resultado = await requestPermission();
      if (!resultado.granted) {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera.');
        return;
      }
    }
    setCameraAberta(true);
  };

  const tirarFoto = async () => {
    try {
      if (!cameraRef.current) return;
      const foto = await cameraRef.current.takePictureAsync({ quality: 0.3, base64: true });
      setImagem(`data:image/jpeg;base64,${foto.base64}`);
      setCameraAberta(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível capturar a foto.');
    }
  };

  const excluirAparelho = (id: string) => {
    Alert.alert('Excluir', 'Deseja excluir este aparelho?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => { await deleteDoc(doc(db, 'eletrodomesticos', id)); } }
    ]);
  };

  const handleSalvar = async () => {
    Keyboard.dismiss();
    const numPotencia = Number(potencia.replace(',', '.'));
    const numHoras = Number(horasPorDia.replace(',', '.'));

    if (!nome || !potencia || !horasPorDia) return Alert.alert('Aviso', 'Preencha todos os campos.');
    if (isNaN(numPotencia) || isNaN(numHoras)) return Alert.alert('Erro', 'Valores inválidos.');
    
    setSalvando(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, 'eletrodomesticos'), {
        userId: user.uid, nome: nome.trim(), potenciaWatts: numPotencia, horasPorDia: numHoras, fotoUri: imagem || null, criadoEm: new Date(),
      });

      await updateDoc(doc(db, 'users', user.uid), { pontosTotais: increment(50) });

      Alert.alert('Sucesso 🎉', `${nome} cadastrado! +50 XP!`);
      setNome(''); setPotencia(''); setHorasPorDia(''); setImagem(null);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setSalvando(false);
    }
  };

  if (cameraAberta) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
        <View style={styles.cameraBotoesContainer}>
          <TouchableOpacity style={styles.botaoCancelarCamera} onPress={() => setCameraAberta(false)}><Text style={styles.textoBotaoCamera}>Cancelar</Text></TouchableOpacity>
          <TouchableOpacity style={styles.botaoCaptura} onPress={tirarFoto}><View style={styles.mioloBotaoCaptura} /></TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Novo Aparelho 🔌</Text>
        <TouchableOpacity style={styles.areaFoto} onPress={abrirCamera}>
          {imagem ? <Image source={{ uri: imagem }} style={styles.fotoExibida} /> : <View style={{ alignItems: 'center' }}><Text style={{ fontSize: 40 }}>📸</Text><Text style={styles.areaFotoTexto}>Fotografar</Text></View>}
        </TouchableOpacity>
        <TextInput style={styles.input} placeholder="Nome (ex: Geladeira)" placeholderTextColor="#888" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="Potência (W)" placeholderTextColor="#888" keyboardType="numeric" value={potencia} onChangeText={setPotencia} />
        <TextInput style={styles.input} placeholder="Horas por dia" placeholderTextColor="#888" keyboardType="numeric" value={horasPorDia} onChangeText={setHorasPorDia} maxLength={2} />
        <TouchableOpacity style={styles.botao} onPress={handleSalvar} disabled={salvando}>{salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Salvar</Text>}</TouchableOpacity>
        <View style={styles.divisor} />
        <Text style={styles.subtitulo}>Aparelhos cadastrados</Text>
        {aparelhos.map((item) => (
          <View key={item.id} style={styles.card}>
            {item.fotoUri && <Image source={{ uri: item.fotoUri }} style={styles.fotoCard} />}
            <Text style={styles.nomeCard}>{item.nome}</Text>
            <Text style={styles.infoCard}>{item.potenciaWatts}W • {item.horasPorDia}h/dia</Text>
            <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluirAparelho(item.id)}><Text style={styles.textoExcluir}>Remover</Text></TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#121212', padding: 20, paddingBottom: 40 },
  titulo: { color: '#fff', fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  areaFoto: { height: 180, backgroundColor: '#1E1E1E', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 25, borderWidth: 1, borderColor: '#333', borderStyle: 'dashed' },
  fotoExibida: { width: '100%', height: '100%' },
  areaFotoTexto: { color: '#aaa', fontSize: 16 },
  input: { backgroundColor: '#1E1E1E', color: '#fff', padding: 16, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#2c2c2c' },
  botao: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 10, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  divisor: { height: 1, backgroundColor: '#333', marginVertical: 30 },
  subtitulo: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  card: { backgroundColor: '#1E1E1E', padding: 16, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#2c2c2c' },
  fotoCard: { width: '100%', height: 150, borderRadius: 8, marginBottom: 12 },
  nomeCard: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  infoCard: { color: '#4CAF50', marginTop: 4, fontWeight: '600' },
  botaoExcluir: { marginTop: 15, backgroundColor: 'rgba(211, 47, 47, 0.1)', paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#d32f2f' },
  textoExcluir: { color: '#ef5350', fontWeight: 'bold' },
  cameraBotoesContainer: { position: 'absolute', bottom: 40, width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  botaoCancelarCamera: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  textoBotaoCamera: { color: '#fff', fontWeight: 'bold' },
  botaoCaptura: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  mioloBotaoCaptura: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#fff' }
});