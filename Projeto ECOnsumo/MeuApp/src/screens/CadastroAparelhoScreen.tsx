
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as Haptics from 'expo-haptics';

export default function CadastroAparelhoScreen() {
  const [nome, setNome] = useState('');
  const [potencia, setPotencia] = useState('');
  const [tipo, setTipo] = useState<'constante' | 'variavel'>('variavel');
  const [imagem, setImagem] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const tirarFoto = async () => {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) return Alert.alert('Permissão', 'Precisamos de acesso à câmera.');

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!resultado.canceled) setImagem(resultado.assets[0].uri);
  };

  const salvarAparelho = async () => {
    if (!nome || !potencia) return Alert.alert('Aviso', 'Preencha os campos obrigatórios.');
    setSalvando(true);

    try {
      let urlArmazenada = '';

      if (imagem) {
        const resposta = await fetch(imagem);
        const blob = await resposta.blob();
        const storageRef = ref(storage, `aparelhos/${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
        urlArmazenada = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'aparelhos'), {
        nome,
        potenciaWatts: Number(potencia),
        tipo,
        imageUrl: urlArmazenada,
        tempoUsoHoras: tipo === 'variavel' ? 30 : 0 
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert('Sucesso!', 'Eletrodoméstico monitorado.');
      setNome(''); setPotencia(''); setImagem(null);
    } catch (e) {
      Alert.alert('Erro', 'Falha ao salvar dados.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Novo Aparelho 🔌</Text>

      <TextInput style={styles.input} placeholder="Nome (Ex: Micro-ondas)" placeholderTextColor="#888" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Potência em Watts (Ex: 1200)" placeholderTextColor="#888" keyboardType="numeric" value={potencia} onChangeText={setPotencia} />

      <View style={styles.row}>
        <TouchableOpacity style={[styles.switchBotao, tipo === 'variavel' && styles.switchAtivo]} onPress={() => setTipo('variavel')}>
          <Text style={styles.switchTexto}>Uso Variável</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.switchBotao, tipo === 'constante' && styles.switchAtivo]} onPress={() => setTipo('constante')}>
          <Text style={styles.switchTexto}>24h Ligado</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botaoFoto} onPress={tirarFoto}>
        <Text style={styles.botaoFotoTexto}>📸 Tirar Foto do Aparelho</Text>
      </TouchableOpacity>

      {imagem && <Image source={{ uri: imagem }} style={styles.preview} />}

      {salvando ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.botaoSalvar} onPress={salvarAparelho}>
          <Text style={styles.botaoSalvarTexto}>Cadastrar no Sistema</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 50 },
  titulo: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#1E1E1E', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  switchBotao: { flex: 1, padding: 12, backgroundColor: '#1E1E1E', alignItems: 'center', borderRadius: 8, mx: 5, marginHorizontal: 5 },
  switchAtivo: { backgroundColor: '#4CAF50' },
  switchTexto: { color: '#fff', fontWeight: 'bold' },
  botaoFoto: { backgroundColor: '#333', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  botaoFotoTexto: { color: '#fff' },
  preview: { width: '100%', height: 150, borderRadius: 8, marginBottom: 20 },
  botaoSalvar: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center' },
  botaoSalvarTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});