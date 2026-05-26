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
    onMutate: async ({ userId, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] });
      
      // Snapshot the previous value
      const previousUsers = queryClient.getQueriesData({ queryKey: ['users'] });
      
      // Optimistically update to the new value
      queryClient.setQueriesData({ queryKey: ['users'] }, (old) => {
        if (!old) return old;
        
        // Handle paginated data
        if (old.content && Array.isArray(old.content)) {
          return {
            ...old,
            content: old.content.map(user => 
              user.id === userId ? { ...user, ...data } : user
            )
          };
        }
        
        return old;
      });
      
      // Return a context object with the snapshotted value
      return { previousUsers };
    },
    onError: (err, variables, context) => {
      console.error('Update user mutation failed, rolling back...', err);
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousUsers) {
        context.previousUsers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: (serverData, variables) => {
      console.log('Update user mutation succeeded:', serverData);
      
      // Update all user queries with the server response
      queryClient.setQueriesData({ queryKey: ['users'] }, (old) => {
        if (!old) return old;
        
        // Handle paginated data
        if (old.content && Array.isArray(old.content)) {
          return {
            ...old,
            content: old.content.map(user => 
              user.id === variables.userId ? serverData : user
            )
          };
        }
        
        return old;
      });
      
      // Update the specific user query if it exists
      queryClient.setQueryData(['users', variables.userId], serverData);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['users'] });
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
