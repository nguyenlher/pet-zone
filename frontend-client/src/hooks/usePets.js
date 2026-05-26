import { useState, useEffect } from 'react';
import petService from '../services/petService';

export const usePets = (status = 'AVAILABLE', page = 0, size = 12) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const data = await petService.getPetsByStatus(status, page, size);
        setPets(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch pets');
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [status, page, size]);

  return { pets, loading, error, totalPages, totalElements };
};

export const usePetDetail = (petId) => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!petId) return;

    const fetchPet = async () => {
      try {
        setLoading(true);
        const data = await petService.getPetById(petId);
        setPet(data);
        setError(null);
        
        // Increment view count
        await petService.incrementViewCount(petId);
      } catch (err) {
        setError(err.message || 'Failed to fetch pet details');
        setPet(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  return { pet, loading, error };
};

export const usePetTypes = () => {
  const [petTypes, setPetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPetTypes = async () => {
      try {
        setLoading(true);
        const data = await petService.getActivePetTypes();
        setPetTypes(data || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch pet types');
        setPetTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPetTypes();
  }, []);

  return { petTypes, loading, error };
};
