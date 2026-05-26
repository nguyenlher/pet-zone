// src/hooks/useOrders.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

export const useOrders = (page = 0, size = 20, sort = 'createdAt,desc') => {
  return useQuery({
    queryKey: ['orders', page, size, sort],
    queryFn: () => orderService.getAllOrders(page, size, sort),
  });
};

export const useOrder = (orderId) => {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId,
  });
};

export const useOrdersByStatus = (status, page = 0, size = 20) => {
  return useQuery({
    queryKey: ['orders', 'status', status, page, size],
    queryFn: () => orderService.getOrdersByStatus(status, page, size),
    enabled: !!status,
  });
};

export const useOrdersByUser = (userId, page = 0, size = 20) => {
  return useQuery({
    queryKey: ['orders', 'user', userId, page, size],
    queryFn: () => orderService.getOrdersByUserId(userId, page, size),
    enabled: !!userId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }) => orderService.cancelOrder(orderId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['orders', variables.orderId]);
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }) => orderService.updateOrderStatus(orderId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['orders', variables.orderId]);
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId) => orderService.deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
    },
  });
};
