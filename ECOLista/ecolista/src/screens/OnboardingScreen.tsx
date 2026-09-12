// src/screens/OnboardingScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function OnboardingScreen({ onFinish }: { onFinish: () => void }) {
  const [etapa, setEtapa] = useState(0);

  const passos = [
    {
      titulo: "🛒 Crie Listas Inteligentes",
      descricao: "Organize suas compras de mercado e atacado separando os produtos por seções e corredores reais para otimizar seu tempo."
    },
    {
      titulo: "📊 Controle de Orçamento",
      descricao: "Defina um teto de gastos. O EcoLista avisa em tempo real e sinaliza visualmente caso você ultrapasse o valor planejado."
    },
    {
      titulo: "🥗 Escolhas Saudáveis",
      descricao: "Identifique o perfil nutricional dos alimentos automaticamente (bom, moderado ou alto em sódio/açúcar) para escolhas conscientes."
    },
    {
      titulo: "🍳 Receitas Antidesperdício",
      descricao: "Aproveite os ingredientes que sobrou na dispensa cruzando dados para criar pratos sustentáveis e evitar o descarte de alimentos."
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', padding: 24 }}>
        
        <View style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={onFinish}>
            <Text style={{ color: '#64748b', fontSize: 14, fontWeight: 'bold' }}>Pular Tutorial</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', marginVertical: 40 }}>
          <View style={styles.sproutBadge}>
            <Text style={{ fontSize: 48 }}>🌱</Text>
          </View>
          <Text style={styles.stepCounter}>Passo {etapa + 1} de {passos.length}</Text>
          
          <Text style={styles.titulo}>{passos[etapa].titulo}</Text>
          <Text style={styles.descricao}>{passos[etapa].descricao}</Text>
        </View>

        <View style={{ gap: 12 }}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => {
              if (etapa < passos.length - 1) {
                setEtapa(etapa + 1);
              } else {
                onFinish();
              }
            }}
          >
            <Text style={styles.buttonText}>
              {etapa < passos.length - 1 ? 'Próximo' : 'Começar a Usar o EcoLista'}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fafafa' },
  sproutBadge: { backgroundColor: '#22c55e', borderRadius: 50, width: 100, height: 100, alignItems: 'center', justifyContent: 'center', elevation: 4, marginBottom: 20 },
  stepCounter: { fontSize: 13, color: '#22c55e', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 12 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: 14 },
  descricao: { fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },
  primaryButton: { height: 50, backgroundColor: '#22c55e', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});