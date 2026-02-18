import dayjs from 'dayjs';

export const formatDate = (value?: string | number | Date | null) => {
  if (!value) {
    return '-';
  }
  return dayjs(value).format('YYYY-MM-DD');
};

export const formatDateTime = (value?: string | number | Date | null) => {
  if (!value) {
    return '-';
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm');
};
