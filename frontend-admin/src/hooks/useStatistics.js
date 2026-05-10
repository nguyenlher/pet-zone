// src/hooks/useStatistics.js
import { useQuery } from '@tanstack/react-query';
import { statisticsService } from '../services/statisticsService';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['statistics', 'dashboard'],
    queryFn: statisticsService.getDashboardStats,
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useRevenueStats = (startDate, endDate, groupBy = 'day') => {
  return useQuery({
    queryKey: ['statistics', 'revenue', startDate, endDate, groupBy],
    queryFn: () => statisticsService.getRevenueStats(startDate, endDate, groupBy),
    enabled: !!startDate && !!endDate,
  });
};

export const useOrderStats = (startDate, endDate) => {
  return useQuery({
    queryKey: ['statistics', 'orders', startDate, endDate],
    queryFn: () => statisticsService.getOrderStats(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

export const useCustomerStats = () => {
  return useQuery({
    queryKey: ['statistics', 'customers'],
    queryFn: statisticsService.getCustomerStats,
  });
};

export const useTopSellingPets = (limit = 5, startDate, endDate) => {
  return useQuery({
    queryKey: ['statistics', 'top-pets', limit, startDate, endDate],
    queryFn: () => statisticsService.getTopSellingPets(limit, startDate, endDate),
  });
};

export const useTopSellingProducts = (limit = 5, startDate, endDate) => {
  return useQuery({
    queryKey: ['statistics', 'top-products', limit, startDate, endDate],
    queryFn: () => statisticsService.getTopSellingProducts(limit, startDate, endDate),
  });
};

export const useSalesChartData = (startDate, endDate) => {
  return useQuery({
    queryKey: ['statistics', 'sales-chart', startDate, endDate],
    queryFn: () => statisticsService.getSalesChartData(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

export const usePaymentMethodStats = (startDate, endDate) => {
  return useQuery({
    queryKey: ['statistics', 'payment-methods', startDate, endDate],
    queryFn: () => statisticsService.getPaymentMethodStats(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};
