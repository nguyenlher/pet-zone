package com.petstore.petservice.api.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.petstore.petservice.infra.integration.CloudinaryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
@Slf4j
public class MediaUploadController {
    
    private final CloudinaryService cloudinaryService;
    
    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "publicId", required = false) String publicId) {
        
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "File is empty"));
            }
            
            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "File must be an image"));
            }
            
            // Upload to Cloudinary
            String imageUrl = cloudinaryService.uploadImage(file, publicId);
            
            Map<String, String> response = new HashMap<>();
            response.put("url", imageUrl);
            response.put("message", "Image uploaded successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            log.error("Failed to upload image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }
    
    @PostMapping("/upload-model")
    public ResponseEntity<Map<String, String>> upload3DModel(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "publicId", required = false) String publicId) {
        
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "File is empty"));
            }
            
            // Validate file extension
            String filename = file.getOriginalFilename();
            if (filename == null || (!filename.endsWith(".glb") && !filename.endsWith(".gltf"))) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "File must be a 3D model (.glb or .gltf)"));
            }
            
            // Upload to Cloudinary
            String modelUrl = cloudinaryService.upload3DModel(file, publicId);
            
            Map<String, String> response = new HashMap<>();
            response.put("url", modelUrl);
            response.put("message", "3D model uploaded successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            log.error("Failed to upload 3D model", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to upload 3D model: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> deleteFile(
            @RequestParam("url") String url,
            @RequestParam("resourceType") String resourceType) {
        
        try {
            String publicId = cloudinaryService.extractPublicId(url);
            
            if (publicId == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid Cloudinary URL"));
            }
            
            cloudinaryService.deleteFile(publicId, resourceType);
            
            return ResponseEntity.ok(Map.of("message", "File deleted successfully"));
            
        } catch (IOException e) {
            log.error("Failed to delete file", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to delete file: " + e.getMessage()));
        }
    }
}
