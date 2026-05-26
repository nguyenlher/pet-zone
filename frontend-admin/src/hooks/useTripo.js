// src/hooks/useTripo.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadFile, createImageTo3DTask, getTaskStatus, getTaskList, cancelTask, downloadAndUploadToCloudinary, DEFAULT_MODEL_VERSION } from '../services/tripoService';
import { petService } from '../services/petService';

/**
 * Upload image + create 3D generation task in one mutation.
 * Returns the task_id on success.
 */
export const useGenerateModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, modelVersion = DEFAULT_MODEL_VERSION }) => {
      // Step 1: Upload image → file_token
      const fileToken = await uploadFile(file);
      // Step 2: Create task → task_id
      const taskId = await createImageTo3DTask(fileToken, modelVersion);
      return taskId;
    },
    // Removed invalidateQueries for tripo-tasks since it's disabled
  });
};

/**
 * Poll a single task until it is complete or failed.
 * Auto-refetches every 3 s while the task is still running.
 */
export const useTaskStatus = (taskId) => {
  return useQuery({
    queryKey: ['tripo-task', taskId],
    queryFn: () => getTaskStatus(taskId),
    enabled: !!taskId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'running' || status === 'queued' ? 3000 : false;
    },
  });
};

/**
 * Fetch the list of recent tasks (auto-refreshes every 10 s).
 * TEMPORARILY DISABLED due to API 405 error
 */
export const useTaskList = () => {
  return useQuery({
    queryKey: ['tripo-tasks'],
    queryFn: getTaskList,
    enabled: false, // Disable this query
    refetchInterval: false, // Disable auto-refetch
  });
};

/**
 * Cancel a running/queued task.
 */
export const useCancelTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId) => cancelTask(taskId),
    // Removed invalidateQueries for tripo-tasks since it's disabled
  });
};

/**
 * Save 3D model to pet after successful generation.
 * Downloads GLB from Tripo, uploads to Cloudinary, and saves to pet-service.
 */
export const useSave3DModelToPet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ petId, glbUrl, sourceImageUrl }) => {
      // Download from Tripo and upload to Cloudinary
      const cloudinaryUrl = await downloadAndUploadToCloudinary(glbUrl, petId);
      
      // Save to pet-service database
      const result = await petService.save3DModel(petId, cloudinaryUrl, sourceImageUrl);
      
      return result;
    },
    onSuccess: () => {
      // Refresh pets list
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
};
