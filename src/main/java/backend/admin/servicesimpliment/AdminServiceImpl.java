package backend.admin.servicesimpliment;

import backend.admin.dto.AdminDTO;
import backend.admin.models.Admin;
import backend.admin.repository.AdminRepository;
import backend.admin.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;

    @Override
    public AdminDTO login(String email, String password) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));

        if (!admin.getPassword().equals(password)) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        return new AdminDTO(admin.getId(), admin.getEmail());
    }
}
