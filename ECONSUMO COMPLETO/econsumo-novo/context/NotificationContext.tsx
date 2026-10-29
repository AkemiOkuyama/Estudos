import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

interface NotificacaoProps {
  id: string;
  title: string | null;
  body: string | null;
  horario: string;
}

interface NotificationContextType {
  historicoNotificacoes: NotificacaoProps[];
}

const DICAS_CONSCIENTIZACAO = [
  { title: "🚿 Banho rápido!", body: "Pare de dançar no chuveiro 🤭 e reduza seu banho em 5 minutos." },
  { title: "💡 Já viu o filme 'Quando as luzes se apagam'?", body: "Fique tranquilo pois fantasmas não vão te atacar! Evite deixar lâmpadas acesas em cômodos vazios." },
  { title: " 🧛 Alerta de Vampiro de Energia!", body: "Aparelhos em standby consomem até 12% sua energia. Tire-os da tomada!"},
  { title: "🌞 O sol é nosso amigo, aproveite a luz natural", body: "Abra as cortinas durante o dia para economizar energia." },
  { title: "🔥Nunca coloque alimentos quentes na geladeira!", body: "Deixe os alimentos esfriarem antes de guardar para economizar energia." },
  { title: "Você tem ar-condicionado?❄️ Use-o com moderação!", body: "Mantenha a temperatura entre 23-25°C para economizar energia e desligue quando você sair." },
  { title: "Faça uso consciente dos eletrodomésticos! ", body: "Ligue o ferro de passar, máquina de lavar roupa e outros eletrodomésticos somente quando necessário." },
  { title: "📺 A TV tá assistindo você?", body: "Se ninguém está vendo, desligue! Até a televisão merece descansar." },
  { title: "🧊 Sua geladeira não é portal dimensional", body: "Abrir a porta toda hora faz ela gastar mais energia tentando resfriar de novo." },
  { title: "🌀 Ventilador não refresca fantasma", body: "Saiu do quarto? Desligue o ventilador também 👻" },
  { title: "👕 Máquina de lavar não é Uber", body: "Espere juntar mais roupas antes de lavar. Uma viagem só já resolve!" },
  { title: "💵 Secadora gratuita??", body: "O varal ainda é uma das invenções mais econômicas da humanidade." },
  { title: "🛁 Demorando no banho?", body: "Cuidado! Cantar 3 álbuns completos no chuveiro pode assustar sua conta de energia." },
];

const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [historicoNotificacoes, setHistoricoNotificacoes] = useState<NotificacaoProps[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const dica = DICAS_CONSCIENTIZACAO[Math.floor(Math.random() * DICAS_CONSCIENTIZACAO.length)];
      const nova: NotificacaoProps = {
        id: Date.now().toString(),
        title: dica.title,
        body: dica.body,
        horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      Alert.alert(nova.title || "Dica ECOnsumo", nova.body || "");
      setHistoricoNotificacoes(prev => [nova, ...prev].slice(0, 20));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{ historicoNotificacoes }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications deve ser usado dentro de um NotificationProvider");
  }
  return context;
}