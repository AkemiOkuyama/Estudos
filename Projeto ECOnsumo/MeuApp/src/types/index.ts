export interface Eletrodomestico {
  id?: string;
  nome: string;
  potenciaWatts: number;
  tipo: 'constante' | 'variavel';
  imageUrl?: string;
  tempoUsoHoras?: number; 
}

export interface InfoTarifa {
  bandeira: 'Verde' | 'Amarela' | 'Vermelha';
  valorKwh: number;
}