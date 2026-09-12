// src/screens/RecipesScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Receita {
  id: string;
  titulo: string;
  ingredientes: string[];
  modoPreparo: string;
}

export function RecipesScreen() {
  const [busca, setBusca] = useState('');
  const receitas: Receita[] = [
    { id: '1', titulo: 'Arroz de Forno Reaproveitado', ingredientes: ['arroz', 'frango', 'queijo', 'tomate'], modoPreparo: 'Misture o arroz cozido com os restos de frango desfiado e queijo. Gratine no forno por 15 minutos.' },
    { id: '2', titulo: 'Omelete Nutritivo de Geladeira', ingredientes: ['ovo', 'tomate', 'cebola', 'queijo'], modoPreparo: 'Bata os ovos e adicione os legumes picados que estão sobrando na geladeira. Frite em fogo baixo.' },
    { id: '3', titulo: 'Torta Rápida de Liquidificador', ingredientes: ['farinha', 'ovo', 'leite', 'frango', 'tomate'], modoPreparo: 'Bata no liquidificador a massa básica e despeje metade em uma forma. Adicione o recheio e cubra com o restante.' }
  ];

  const filtradas = busca.trim() === '' ? receitas : receitas.filter(r => r.ingredientes.some(i => i.toLowerCase().includes(busca.toLowerCase())) || r.titulo.toLowerCase().includes(busca.toLowerCase()));

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filtradas}
        keyExtractor={(r) => r.id}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Receitas Antidesperdício</Text>
            <Text style={styles.subtitle}>Cruze ingredientes da dispensa e crie pratos sustentáveis!</Text>
            <TextInput style={styles.input} placeholder="Busque por ingrediente (ex: arroz, ovo)" placeholderTextColor="#888" value={busca} onChangeText={setBusca} />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Text style={styles.recipeTitle}>{item.titulo}</Text>
            <Text style={styles.recipeIngredients}><Text style={{ fontWeight: 'bold' }}>Ingredientes:</Text> {item.ingredientes.join(', ')}</Text>
            <Text style={styles.recipePrep}><Text style={{ fontWeight: 'bold' }}>Modo de Preparo:</Text> {item.modoPreparo}</Text>
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fafafa' },
  flatListContent: { padding: 20, paddingBottom: 50 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#22c55e', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 16 },
  input: { minHeight: 48, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 20, borderWidth: 1, borderColor: '#ddd', fontSize: 15, color: '#333' },
  recipeCard: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 14, borderWidth: 1, borderColor: '#ddd', borderLeftWidth: 5, borderLeftColor: '#eab308', elevation: 2 },
  recipeTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 6 },
  recipeIngredients: { fontSize: 13, color: '#555', marginBottom: 6 },
  recipePrep: { fontSize: 13, color: '#64748b', lineHeight: 18 },
});