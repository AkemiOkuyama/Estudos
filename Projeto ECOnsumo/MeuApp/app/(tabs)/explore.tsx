import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function AddDeviceScreen() {
  const [nome, setNome] = useState('');
  const [potencia, setPotencia] = useState('');
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    if (!nome || !potencia) {
      Alert.alert('Campos vazios', 'Por favor, preencha o nome e a potência em Watts!');
      return;
    }

    setSalvando(true);
    try {
      await addDoc(collection(db, 'eletrodomesticos'), {
        nome: nome,
        potenciaWatts: Number(potencia),
        dataCriacao: new Date()
      });
      Alert.alert('Sucesso 🎉', `${nome} foi cadastrado com sucesso!`);
      setNome('');
      setPotencia('');
    } catch (error: any) {
      Alert.alert('Erro ao salvar', 'Não foi possível salvar no Firebase: ' + error.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Adicionar Aparelho 🔌</Text>
      <Text style={styles.descricao}>Monitore o impacto de novos eletrodomésticos no seu consumo mensal.</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Aparelho (ex: Geladeira Consul)"
        placeholderTextColor="#888"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Potência aproximada em Watts (ex: 350)"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={potencia}
        onChangeText={setPotencia}
      />

      <TouchableOpacity style={styles.botao} onPress={handleSalvar} disabled={salvando}>
        {salvando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botaoTexto}>Salvar no Banco</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, justifyContent: 'center' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 10, textAlign: 'center' },
  descricao: { color: '#aaa', fontSize: 14, textAlign: 'center', marginBottom: 30, paddingHorizontal: 10 },
  input: { backgroundColor: '#1E1E1E', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  botao: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, height: 55, justifyContent: 'center' },
  botaoTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});