package com.petstore.petservice.utils;

public class PetApiPath {
    // Base paths for authentication levels
    public static final String PUBLIC_BASE = "/public";
    public static final String PRIVATE_BASE = "/private";
    
    // Pet Type - Public
    public static final String PET_TYPE_PUBLIC_BASE = PUBLIC_BASE + "/pet-types";
    public static final String PET_TYPE_PUBLIC_BY_ID = "/{typeId}";
    public static final String PET_TYPE_PUBLIC_ACTIVE = "/active";
    
    // Pet Type - Private (Admin)
    public static final String PET_TYPE_PRIVATE_BASE = PRIVATE_BASE + "/pet-types";
    public static final String PET_TYPE_PRIVATE_BY_ID = "/{typeId}";
    
    // Breed - Public
    public static final String BREED_PUBLIC_BASE = PUBLIC_BASE + "/breeds";
    public static final String BREED_PUBLIC_BY_ID = "/{breedId}";
    public static final String BREED_PUBLIC_BY_TYPE = "/type/{typeId}";
    
    // Breed - Private (Admin)
    public static final String BREED_PRIVATE_BASE = PRIVATE_BASE + "/breeds";
    public static final String BREED_PRIVATE_BY_ID = "/{breedId}";
    
    // Pet - Public
    public static final String PET_PUBLIC_BASE = PUBLIC_BASE + "/pets";
    public static final String PET_PUBLIC_BY_ID = "/{petId}";
    public static final String PET_PUBLIC_SEARCH = "/search";
    public static final String PET_PUBLIC_BY_STATUS = "/status/{status}";
    public static final String PET_PUBLIC_INCREMENT_VIEW = "/{petId}/view";
    
    // Pet - Private (Service to Service)
    public static final String PET_PRIVATE_BASE = PRIVATE_BASE + "/pets";
    public static final String PET_PRIVATE_BY_ID = "/{petId}";
    public static final String PET_PRIVATE_CHECK_AVAILABILITY = "/{petId}/availability";
    public static final String PET_PRIVATE_UPDATE_STATUS = "/{petId}/status";
    public static final String PET_PRIVATE_BATCH_CHECK = "/batch/check";
    
    // Pet Images - Public
    public static final String PET_IMAGE_PUBLIC_BASE = PUBLIC_BASE + "/pets/{petId}/images";
    
    // Pet Images - Private (Admin)
    public static final String PET_IMAGE_PRIVATE_BASE = PRIVATE_BASE + "/pets/{petId}/images";
    public static final String PET_IMAGE_PRIVATE_BY_ID = "/{imageId}";
    public static final String PET_IMAGE_PRIVATE_REORDER = "/reorder";
    
    // Pet 3D Models - Public
    public static final String PET_3D_MODEL_PUBLIC_BASE = PUBLIC_BASE + "/pets/{petId}/3d-models";
    public static final String PET_3D_MODEL_PUBLIC_BY_ID = "/{modelId}";
    
    // Pet 3D Models - Private (Admin/AI Service)
    public static final String PET_3D_MODEL_PRIVATE_BASE = PRIVATE_BASE + "/pets/{petId}/3d-models";
    public static final String PET_3D_MODEL_PRIVATE_BY_ID = "/{modelId}";
    
    // Pet Products - Public (Client & Admin)
    public static final String PET_PRODUCT_PUBLIC_BASE = PUBLIC_BASE + "/products";
    public static final String PET_PRODUCT_PUBLIC_BY_ID = "/{productId}";
    public static final String PET_PRODUCT_PUBLIC_BY_STATUS = "/status/{status}";
    public static final String PET_PRODUCT_PUBLIC_BY_CATEGORY = "/category/{category}";
    public static final String PET_PRODUCT_PUBLIC_BY_PET_TYPE = "/pet-type/{petTypeId}";
    public static final String PET_PRODUCT_PUBLIC_SEARCH = "/search";
    public static final String PET_PRODUCT_PUBLIC_TOP_SELLING = "/top-selling";
    public static final String PET_PRODUCT_PUBLIC_TOP_RATED = "/top-rated";
    public static final String PET_PRODUCT_PUBLIC_INCREMENT_VIEW = "/{productId}/view";
    
    // Pet Products - Private (Service to Service)
    public static final String PET_PRODUCT_PRIVATE_BASE = PRIVATE_BASE + "/products";
    public static final String PET_PRODUCT_PRIVATE_BY_ID = "/{productId}";
    public static final String PET_PRODUCT_PRIVATE_CHECK_STOCK = "/{productId}/check-stock";
    public static final String PET_PRODUCT_PRIVATE_UPDATE_STOCK = "/{productId}/stock";
    public static final String PET_PRODUCT_PRIVATE_INCREMENT_SOLD = "/{productId}/sold";
    public static final String PET_PRODUCT_PRIVATE_BATCH_CHECK = "/batch/check";
    
    // Pet Product Reviews - Public (Client & Admin)
    public static final String PET_PRODUCT_REVIEW_PUBLIC_BASE = PUBLIC_BASE + "/products/{productId}/reviews";
    public static final String PET_PRODUCT_REVIEW_PUBLIC_BY_ID = "/{reviewId}";
}
