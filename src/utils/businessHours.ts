/**
 * Horário de funcionamento em formato numérico (fuso America/Sao_Paulo).
 * Fonte de verdade para o indicador "Aberto agora". Os textos exibidos
 * continuam em SPA_BUSINESS_DATA.schedule — mantenha os dois em sincronia.
 *
 * Índice = dia da semana (0 = domingo). null = fechado.
 */
const HORARIOS: ReadonlyArray<{ abre: number; fecha: number } | null> = [
  { abre: 8, fecha: 13 }, // domingo
  null, // segunda
  { abre: 8, fecha: 19 }, // terça
  { abre: 8, fecha: 19 }, // quarta
  { abre: 8, fecha: 19 }, // quinta
  { abre: 8, fecha: 19 }, // sexta
  { abre: 8, fecha: 19 }, // sábado
];

export const isAbertoAgora = (agora: Date = new Date()): boolean => {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(agora);

  const get = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? '';
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const horaDecimal = Number(get('hour')) + Number(get('minute')) / 60;

  const horario = HORARIOS[dia];
  if (!horario) return false;
  return horaDecimal >= horario.abre && horaDecimal < horario.fecha;
};
