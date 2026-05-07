// src/hooks/useUsers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';

export const useUsers = (page = 0, size = 20, sort = 'createdAt,desc') => {
  return useQuery({
    queryKey: ['users', page, size, sort],
    queryFn: () => userService.getAllUsers(page, size, sort),
  });
};

export const useUser = (userId) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
  });
};

export const useSearchUsers = (keyword, page = 0, size = 20) => {
  return useQuery({
    queryKey: ['users', 'search', keyword, page, size],
    queryFn: () => userService.searchUsers(keyword, page, size),
    enabled: !!keyword && keyword.length > 0,
  });
};

export const useUserStatistics = () => {
  return useQuery({
    queryKey: ['users', 'statistics'],
    queryFn: userService.getUserStatistics,
  });
};

export const useUserShippingAddresses = (userId) => {
  return useQuery({
    queryKey: ['users', userId, 'shipping-addresses'],
    queryFn: () => userService.getUserShippingAddresses(userId),
    enabled: !!userId,
  });
};

export const useUserFavorites = (userId) => {
  return useQuery({
    queryKey: ['users', userId, 'favorites'],
    queryFn: () => userService.getUserFavorites(userId),
    enabled: !!userId,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }) => userService.updateUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['users', variables.userId]);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};
