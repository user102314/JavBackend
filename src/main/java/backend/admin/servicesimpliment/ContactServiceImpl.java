package backend.admin.servicesimpliment;

import backend.admin.dto.ContactDTO;
import backend.admin.models.Contact;
import backend.admin.repository.ContactRepository;
import backend.admin.services.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;

    @Override
    public ContactDTO createContact(ContactDTO contactDTO) {
        Contact contact = new Contact();
        mapToEntity(contactDTO, contact);
        Contact savedContact = contactRepository.save(contact);
        return mapToDTO(savedContact);
    }

    @Override
    public ContactDTO updateContact(Long id, ContactDTO contactDTO) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        mapToEntity(contactDTO, contact);
        Contact updatedContact = contactRepository.save(contact);
        return mapToDTO(updatedContact);
    }

    @Override
    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }

    @Override
    public Optional<ContactDTO> getContactById(Long id) {
        return contactRepository.findById(id)
                .map(this::mapToDTO);
    }

    @Override
    public List<ContactDTO> getAllContacts() {
        return contactRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ContactDTO> getContactsByInformationId(Long infoId) {
        return contactRepository.findByInformationId(infoId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ContactDTO> getContactsByDateRange(String startDate, String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return contactRepository.findByDateBetween(start, end).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private void mapToEntity(ContactDTO dto, Contact entity) {
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setPhone(dto.getPhone());
        entity.setEmail(dto.getEmail());
        entity.setOriginCity(dto.getOriginCity());
        entity.setDistnationCity(dto.getDistnationCity());
        entity.setDate(dto.getDate());
        entity.setDescription(dto.getDescription());
    }

    private ContactDTO mapToDTO(Contact entity) {
        return new ContactDTO(
                entity.getId(),
                entity.getFirstName(),
                entity.getLastName(),
                entity.getPhone(),
                entity.getEmail(),
                entity.getOriginCity(),
                entity.getDistnationCity(),
                entity.getDate(),
                entity.getDescription()
        );
    }
}