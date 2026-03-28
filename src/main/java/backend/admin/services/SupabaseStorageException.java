package backend.admin.services;

import java.io.IOException;

/** Erreur retournée par l’API Supabase Storage (upload / delete). */
public class SupabaseStorageException extends IOException {

    public SupabaseStorageException(String message) {
        super(message);
    }
}
