import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function AddDeviceScreen() {
  const [nome, setNome] = useState('');
  const [potencia, setPotencia] = useState('');
  const [imagem, setImagem] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const selecionarImagem = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às fotos.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!resultado.canceled) setImagem(resultado.assets[0].uri);
  };

  const handleSalvar = async () => {
    if (!nome || !potencia) {
      Alert.alert('Erro', 'Preencha o nome e a potência!');
      return;
    }
    setSalvando(true);
    try {
      await addDoc(collection(db, 'eletrodomesticos'), {
        nome, potenciaWatts: Number(potencia), fotoUri: imagem || 'sem-foto', dataCriacao: new Date()
      });
      Alert.alert('Sucesso 🎉', 'Aparelho cadastrado!');
      setNome(''); setPotencia(''); setImagem(null);
    } catch (error: any) {
      Alert.alert('Erro ao salvar', error.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Novo Aparelho 🔌</Text>

      <TouchableOpacity style={styles.areaFoto} onPress={selecionarImagem}>
        {imagem ? <Image source={{ uri: imagem }} style={styles.fotoExibida} /> : <Text style={styles.areaFotoTexto}>📷 Adicionar Foto</Text>}
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Nome do Aparelho" placeholderTextColor="#888" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Potência em Watts" placeholderTextColor="#888" keyboardType="numeric" value={potencia} onChangeText={setPotencia} />

      <TouchableOpacity style={styles.botao} onPress={handleSalvar} disabled={salvando}>
        {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Salvar Aparelho</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#121212', padding: 20, justifyContent: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  areaFoto: { height: 160, backgroundColor: '#1E1E1E', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#333', overflow: 'hidden' },
  areaFotoTexto: { color: '#aaa', fontSize: 14 },
  fotoExibida: { width: '100%', height: '100%' },
  input: { backgroundColor: '#1E1E1E', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  botao: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', height: 55, justifyContent: 'center', marginTop: 10 },
  botaoTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});