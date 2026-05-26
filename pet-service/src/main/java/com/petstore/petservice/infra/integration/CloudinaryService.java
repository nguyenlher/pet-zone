package com.petstore.petservice.infra.integration;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {
    
    private final Cloudinary cloudinary;
    
    private static final String IMAGE_FOLDER = "super-petmark-3d/images";
    private static final String MODEL_FOLDER = "super-petmark-3d/models";
    
    /**
     * Upload image to Cloudinary
     * @param file MultipartFile to upload
     * @param publicId Optional public ID for the file
     * @return URL of uploaded image
     */
    public String uploadImage(MultipartFile file, String publicId) throws IOException {
        try {
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                "folder", IMAGE_FOLDER,
                "resource_type", "image"
            );
            
            if (publicId != null && !publicId.isEmpty()) {
                uploadParams.put("public_id", publicId);
            }
            
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            String url = (String) uploadResult.get("secure_url");
            
            log.info("Image uploaded successfully: {}", url);
            return url;
        } catch (IOException e) {
            log.error("Failed to upload image to Cloudinary", e);
            throw new IOException("Failed to upload image: " + e.getMessage(), e);
        }
    }
    
    /**
     * Upload 3D model to Cloudinary
     * @param file MultipartFile to upload (GLB, GLTF, etc.)
     * @param publicId Optional public ID for the file
     * @return URL of uploaded model
     */
    public String upload3DModel(MultipartFile file, String publicId) throws IOException {
        try {
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                "folder", MODEL_FOLDER,
                "resource_type", "raw" // Use 'raw' for 3D models
            );
            
            if (publicId != null && !publicId.isEmpty()) {
                uploadParams.put("public_id", publicId);
            }
            
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            String url = (String) uploadResult.get("secure_url");
            
            log.info("3D Model uploaded successfully: {}", url);
            return url;
        } catch (IOException e) {
            log.error("Failed to upload 3D model to Cloudinary", e);
            throw new IOException("Failed to upload 3D model: " + e.getMessage(), e);
        }
    }
    
    /**
     * Delete file from Cloudinary
     * @param publicId Public ID of the file to delete
     * @param resourceType Type of resource (image, raw, video)
     */
    public void deleteFile(String publicId, String resourceType) throws IOException {
        try {
            Map result = cloudinary.uploader().destroy(publicId, 
                ObjectUtils.asMap("resource_type", resourceType));
            
            log.info("File deleted from Cloudinary: {}", publicId);
        } catch (IOException e) {
            log.error("Failed to delete file from Cloudinary: {}", publicId, e);
            throw new IOException("Failed to delete file: " + e.getMessage(), e);
        }
    }
    
    /**
     * Extract public ID from Cloudinary URL
     * @param url Cloudinary URL
     * @return Public ID
     */
    public String extractPublicId(String url) {
        if (url == null || url.isEmpty()) {
            return null;
        }
        
        // Example URL: https://res.cloudinary.com/dehn8lwxv/image/upload/v1234567890/super-petmark-3d/images/pet_123.jpg
        // Extract: super-petmark-3d/images/pet_123
        
        try {
            String[] parts = url.split("/upload/");
            if (parts.length < 2) {
                return null;
            }
            
            String pathWithVersion = parts[1];
            // Remove version (v1234567890/)
            String path = pathWithVersion.replaceFirst("v\\d+/", "");
            
            // Remove file extension
            int lastDot = path.lastIndexOf('.');
            if (lastDot > 0) {
                path = path.substring(0, lastDot);
            }
            
            return path;
        } catch (Exception e) {
            log.error("Failed to extract public ID from URL: {}", url, e);
            return null;
        }
    }
}
