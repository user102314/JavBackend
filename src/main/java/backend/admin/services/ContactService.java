package backend.admin.services;

import backend.admin.dto.ContactDTO;
import java.util.List;
import java.util.Optional;

public interface ContactService {
    ContactDTO createContact(ContactDTO contactDTO);
    ContactDTO updateContact(Long id, ContactDTO contactDTO);
    void deleteContact(Long id);
    Optional<ContactDTO> getContactById(Long id);
    List<ContactDTO> getAllContacts();
    List<ContactDTO> getContactsByInformationId(Long infoId);
    List<ContactDTO> getContactsByDateRange(String startDate, String endDate);
}