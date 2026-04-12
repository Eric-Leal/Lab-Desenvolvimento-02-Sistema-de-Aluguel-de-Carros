package com.example.service.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.exception.BusinessException;
import io.micronaut.context.annotation.Value;
import jakarta.inject.Singleton;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Singleton
public class CloudinaryService {

    private static final Pattern DATA_URI_PATTERN = Pattern.compile("^data:(image/[a-zA-Z0-9.+-]+);base64,(.+)$", Pattern.DOTALL);

    private final Cloudinary cloudinary;
    private final String folder;
    private final boolean configured;

    public CloudinaryService(
        @Value("${cloudinary.cloud-name:}") String cloudName,
        @Value("${cloudinary.api-key:}") String apiKey,
        @Value("${cloudinary.api-secret:}") String apiSecret,
        @Value("${cloudinary.folder:users-service}") String folder
    ) {
        this.folder = folder;
        this.configured = cloudName != null && !cloudName.isBlank()
            && apiKey != null && !apiKey.isBlank()
            && apiSecret != null && !apiSecret.isBlank();

        if (configured) {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
            ));
        } else {
            this.cloudinary = null;
        }
    }

    public CloudinaryUploadResult uploadUserImage(byte[] fileBytes, String contentType, String ownerType, UUID userId) {
        ensureConfigured();

        if (fileBytes == null || fileBytes.length == 0) {
            throw new BusinessException("Arquivo de imagem vazio.");
        }

        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BusinessException("Apenas arquivos de imagem são permitidos.");
        }

        try {
            String publicId = ownerType + "-" + userId;
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                fileBytes,
                ObjectUtils.asMap(
                    "folder", folder,
                    "public_id", publicId,
                    "resource_type", "image",
                    "overwrite", true,
                    "invalidate", true
                )
            );

            String secureUrl = String.valueOf(uploadResult.get("secure_url"));
            String uploadedPublicId = String.valueOf(uploadResult.get("public_id"));
            return new CloudinaryUploadResult(secureUrl, uploadedPublicId);
        } catch (IOException e) {
            throw new BusinessException("Falha ao enviar imagem para o Cloudinary: " + e.getMessage());
        }
    }

    public CloudinaryUploadResult uploadBase64UserImage(String imageBase64, String ownerType, UUID userId) {
        if (imageBase64 == null || imageBase64.isBlank()) {
            throw new BusinessException("A imagem em base64 não foi informada.");
        }

        String contentType = "image/jpeg";
        String base64Payload = imageBase64.trim();

        Matcher matcher = DATA_URI_PATTERN.matcher(base64Payload);
        if (matcher.matches()) {
            contentType = matcher.group(1);
            base64Payload = matcher.group(2);
        }

        byte[] imageBytes;
        try {
            imageBytes = Base64.getDecoder().decode(base64Payload);
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Conteúdo de imagem base64 inválido.");
        }

        return uploadUserImage(imageBytes, contentType, ownerType, userId);
    }

    public void deleteImage(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            return;
        }

        ensureConfigured();

        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("invalidate", true));
        } catch (IOException e) {
            throw new BusinessException("Falha ao remover imagem do Cloudinary: " + e.getMessage());
        }
    }

    private void ensureConfigured() {
        if (!configured) {
            throw new BusinessException("Cloudinary não configurado. Defina CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.");
        }
    }
}
