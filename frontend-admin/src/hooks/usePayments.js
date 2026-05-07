// src/hooks/usePayments.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../services/paymentService';

export const usePayments = (page = 0, size = 20, sort = 'createdAt,desc') => {
  return useQuery({
    queryKey: ['payments', page, size, sort],
    queryFn: () => paymentService.getAllPayments(page, size, sort),
  });
};

export const usePayment = (paymentId) => {
  return useQuery({
    queryKey: ['payments', paymentId],
    queryFn: () => paymentService.getPaymentById(paymentId),
    enabled: !!paymentId,
  });
};

export const usePaymentsByOrder = (orderId) => {
  return useQuery({
    queryKey: ['payments', 'order', orderId],
    queryFn: () => paymentService.getPaymentsByOrderId(orderId),
    enabled: !!orderId,
  });
};

export const usePaymentsByUser = (userId, page = 0, size = 20) => {
  return useQuery({
    queryKey: ['payments', 'user', userId, page, size],
    queryFn: () => paymentService.getPaymentsByUserId(userId, page, size),
    enabled: !!userId,
  });
};

export const usePaymentsByStatus = (status, page = 0, size = 20) => {
  return useQuery({
    queryKey: ['payments', 'status', status, page, size],
    queryFn: () => paymentService.getPaymentsByStatus(status, page, size),
    enabled: !!status,
  });
};

export const usePaymentStatistics = (startDate, endDate) => {
  return useQuery({
    queryKey: ['payments', 'statistics', startDate, endDate],
    queryFn: () => paymentService.getPaymentStatistics(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentService.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
    },
  });
};
