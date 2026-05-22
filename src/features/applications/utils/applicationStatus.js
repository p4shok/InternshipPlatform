export const APPLICATION_STATUS_OPTIONS = [
  { value: 1, label: "На рассмотрении" },
  { value: 2, label: "Приглашение на интервью" },
  { value: 3, label: "Отказ" },
  { value: 4, label: "Получен оффер" },
  { value: 5, label: "Принято" },
  { value: 6, label: "Трудоустроен" },
  { value: 7, label: "Отозвано" },
];

export const APPLICATION_STATUS_LABELS = APPLICATION_STATUS_OPTIONS.reduce(
  (accumulator, item) => ({
    ...accumulator,
    [item.value]: item.label,
  }),
  {}
);

export const getApplicationStatusLabel = (status) =>
  APPLICATION_STATUS_LABELS[status] || status || "Неизвестно";
