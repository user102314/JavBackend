package backend.admin.services;

import backend.admin.dto.AdminDTO;

public interface AdminService {
    AdminDTO login(String email, String password);
}
