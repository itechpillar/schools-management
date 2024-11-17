export interface PhotoValidationResult {
    isValid: boolean;
    error?: string;
}

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export function validatePhoto(file: Express.Multer.File): PhotoValidationResult {
    if (!file) {
        return { isValid: false, error: 'No file uploaded' };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return { 
            isValid: false, 
            error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}` 
        };
    }

    if (file.size > MAX_PHOTO_SIZE) {
        return { 
            isValid: false, 
            error: `File too large. Maximum size allowed: ${MAX_PHOTO_SIZE / (1024 * 1024)}MB` 
        };
    }

    return { isValid: true };
}

export function processPhotoUpload(file: Express.Multer.File) {
    return {
        photo: file.buffer,
        photo_content_type: file.mimetype
    };
}
