export function formatDate(dateInput) {
  if (!dateInput) return "Data não informada";

  let date;
  if (typeof dateInput.toDate === 'function') {
    date = dateInput.toDate();
  } 
  else if (dateInput instanceof Date) {
    date = dateInput;
  } 
  else {
    date = new Date(dateInput);
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}