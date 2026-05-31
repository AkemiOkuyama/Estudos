import React, { createContext, useContext, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";

interface NotificacaoProps {
  id: string;
  title: string | null;
  body: string | null;
  horario: string;
}

interface NotificationContextData {
  historicoNotificacoes: NotificacaoProps[];
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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

function embaralharDicas(array: typeof DICAS_CONSCIENTIZACAO) {
  const novoArray = [...array];
  for (let i = novoArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
  }
  return novoArray;
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [historicoNotificacoes, setHistoricoNotificacoes] = useState<NotificacaoProps[]>([]);

  useEffect(() => {
    async function setupNotifications() {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Permissão para notificações não concedida!");
        return;
      }

      let historicoRecuperado: NotificacaoProps[] = [];

      try {
        const notificacoesNoSistema = await Notifications.getPresentedNotificationsAsync();
        historicoRecuperado = notificacoesNoSistema
          .map((notification) => ({
            id: notification.request.identifier,
            title: notification.request.content.title,
            body: notification.request.content.body,
            horario: new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }))
          .filter((notificacao) => notificacao.title || notificacao.body);
        
        setHistoricoNotificacoes(historicoRecuperado);
      } catch (error) {
        console.log("Erro ao buscar notificações antigas:", error);
      }

      try {
        await Notifications.cancelAllScheduledNotificationsAsync();

        const titulosJaExibidos = historicoRecuperado.map((n) => n.title);

        let dicasRestantes = DICAS_CONSCIENTIZACAO.filter(
          (dica) => !titulosJaExibidos.includes(dica.title)
        );

        if (dicasRestantes.length === 0) {
          const ultimaDicaNoTopo = historicoRecuperado[0]?.title;
          dicasRestantes = DICAS_CONSCIENTIZACAO.filter((dica) => dica.title !== ultimaDicaNoTopo);
        }

        const listaSorteada = embaralharDicas(dicasRestantes);

        const INTERVALO = 10; 

        for (let i = 0; i < listaSorteada.length; i++) {
          const dica = listaSorteada[i];
          const tempoDisparo = (i + 1) * INTERVALO;

          await Notifications.scheduleNotificationAsync({
            content: {
              title: dica.title,
              body: dica.body,
            },
            trigger: {
              type: SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: tempoDisparo, 
              repeats: false,        
            },
          });
        }
      } catch (error) {
        console.log("Erro ao agendar o lote de dicas:", error);
      }
      
    }

    setupNotifications();

    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      if (!notification.request.content.title && !notification.request.content.body) {
        return;
      }

      const novaNotificacao: NotificacaoProps = {
        id: notification.request.identifier,
        title: notification.request.content.title,
        body: notification.request.content.body,
        horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setHistoricoNotificacoes((prev) => {
        const jaExiste = prev.some((n) => n.id === novaNotificacao.id);
        if (jaExiste) return prev; 
        return [novaNotificacao, ...prev];
      });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ historicoNotificacoes }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}