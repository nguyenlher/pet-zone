// src/hooks/useProducts.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { petService } from '../services/petService';

// Get all products
export const useProducts = (page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'DESC') => {
  return useQuery({
    queryKey: ['products', page, size, sortBy, sortDirection],
    queryFn: () => productService.getProducts(page, size, sortBy, sortDirection),
  });
};

// Get product by ID
export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
};

// Get products by category
export const useProductsByCategory = (category, page = 0, size = 10) => {
  return useQuery({
    queryKey: ['products', 'category', category, page, size],
    queryFn: () => productService.getProductsByCategory(category, page, size),
    enabled: !!category,
  });
};

// Get pet types (for filtering)
export const usePetTypes = () => {
  return useQuery({
    queryKey: ['petTypes'],
    queryFn: () => petService.getPetTypes(),
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productData) => productService.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
