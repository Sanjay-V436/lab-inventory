import { format, isValid, parseISO } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = parseISO(dateString);
  if (!isValid(date)) return 'Invalid date';
  return format(date, 'dd-MMM-yyyy');
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = parseISO(dateString);
  if (!isValid(date)) return 'Invalid date';
  return format(date, 'dd-MMM-yyyy hh:mm a');
};

export const isOverdue = (dateString) => {
  if (!dateString) return false;
  const date = parseISO(dateString);
  return date < new Date();
};