// src/hooks/usePets.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petService } from '../services/petService';

export const usePets = (page = 0, size = 12, sort = 'createdAt,desc') => {
  return useQuery({
    queryKey: ['pets', page, size, sort],
    queryFn: () => petService.getPets(page, size, sort),
  });
};

export const usePetsByStatus = (status, page = 0, size = 12, sort = 'createdAt,desc') => {
  return useQuery({
    queryKey: ['pets', 'status', status, page, size, sort],
    queryFn: () => petService.getPetsByStatus(status, page, size, sort),
    enabled: !!status,
  });
};

export const usePet = (id) => {
  return useQuery({
    queryKey: ['pets', id],
    queryFn: () => petService.getPetById(id),
    enabled: !!id,
  });
};

export const usePetTypes = () => {
  return useQuery({
    queryKey: ['petTypes'],
    queryFn: petService.getPetTypes,
  });
};

export const useActivePetTypes = () => {
  return useQuery({
    queryKey: ['petTypes', 'active'],
    queryFn: petService.getActivePetTypes,
  });
};

export const useBreeds = () => {
  return useQuery({
    queryKey: ['breeds'],
    queryFn: petService.getBreeds,
  });
};

export const useBreedsByPetType = (petTypeId) => {
  return useQuery({
    queryKey: ['breeds', 'petType', petTypeId],
    queryFn: () => petService.getBreedsByPetType(petTypeId),
    enabled: !!petTypeId,
  });
};

export const useCreatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: petService.createPet,
    onSuccess: () => {
      queryClient.invalidateQueries(['pets']);
    },
  });
};

export const useUpdatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => petService.updatePet(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['pets']);
      queryClient.invalidateQueries(['pets', variables.id]);
    },
  });
};

export const useDeletePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: petService.deletePet,
    onSuccess: () => {
      queryClient.invalidateQueries(['pets']);
    },
  });
};

export const useCreatePetType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: petService.createPetType,
    onSuccess: () => {
      queryClient.invalidateQueries(['petTypes']);
    },
  });
};

export const useUpdatePetType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => petService.updatePetType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['petTypes']);
    },
  });
};

export const useDeletePetType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: petService.deletePetType,
    onSuccess: () => {
      queryClient.invalidateQueries(['petTypes']);
    },
  });
};

export const useCreateBreed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: petService.createBreed,
    onSuccess: () => {
      queryClient.invalidateQueries(['breeds']);
    },
  });
};

export const useUpdateBreed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => petService.updateBreed(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['breeds']);
    },
  });
};

export const useDeleteBreed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: petService.deleteBreed,
    onSuccess: () => {
      queryClient.invalidateQueries(['breeds']);
    },
  });
};
