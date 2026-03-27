package backend.admin.serviceimpl;

import backend.admin.dto.*;
import backend.admin.models.*;
import backend.admin.repository.*;
import backend.admin.services.InformationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InformationServiceImpl implements InformationService {

    private final InformationRepository informationRepository;
    private final OfficeRepository officeRepository;
    private final SponsorRepository sponsorRepository;
    private final ContactRepository contactRepository;

    @Override
    public InformationDTO createInformation(InformationDTO informationDTO) {
        Information information = new Information();
        mapToEntity(informationDTO, information);
        Information savedInformation = informationRepository.save(information);
        return mapToDTO(savedInformation);
    }

    @Override
    public InformationDTO updateInformation(Long id, InformationDTO informationDTO) {
        Information information = informationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Information not found"));
        mapToEntity(informationDTO, information);
        Information updatedInformation = informationRepository.save(information);
        return mapToDTO(updatedInformation);
    }

    @Override
    public void deleteInformation(Long id) {
        Information information = informationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Information not found"));

        // Delete all associated entities
        officeRepository.deleteByInformationId(id);
        sponsorRepository.deleteByInformationId(id);
        contactRepository.deleteByInformationId(id);

        informationRepository.delete(information);
    }

    @Override
    public Optional<InformationDTO> getInformationById(Long id) {
        return informationRepository.findById(id)
                .map(this::mapToDTO);
    }

    @Override
    public List<InformationDTO> getAllInformations() {
        return informationRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public InformationDTO addOfficeToInformation(Long infoId, OfficeDTO officeDTO) {
        Information information = informationRepository.findById(infoId)
                .orElseThrow(() -> new RuntimeException("Information not found"));

        Office office = new Office();
        office.setOfficeName(officeDTO.getOfficeName());
        office.setInformation(information);

        Office savedOffice = officeRepository.save(office);
        information.getOffices().add(savedOffice);

        return mapToDTO(information);
    }

    @Override
    public InformationDTO addSponsorToInformation(Long infoId, SponsorDTO sponsorDTO) {
        Information information = informationRepository.findById(infoId)
                .orElseThrow(() -> new RuntimeException("Information not found"));

        Sponsor sponsor = new Sponsor();
        sponsor.setImage(sponsorDTO.getImage());
        sponsor.setInformation(information);

        Sponsor savedSponsor = sponsorRepository.save(sponsor);
        information.getSponsors().add(savedSponsor);

        return mapToDTO(information);
    }

    @Override
    public InformationDTO addContactToInformation(Long infoId, ContactDTO contactDTO) {
        Information information = informationRepository.findById(infoId)
                .orElseThrow(() -> new RuntimeException("Information not found"));

        Contact contact = new Contact();
        mapContactToEntity(contactDTO, contact);
        contact.setInformation(information);

        Contact savedContact = contactRepository.save(contact);
        information.getContacts().add(savedContact);

        return mapToDTO(information);
    }

    private void mapToEntity(InformationDTO dto, Information entity) {
        entity.setMoveProfetionelle(dto.getMoveProfetionelle());
        entity.setStorageSolution(dto.getStorageSolution());
        entity.setYearsExperience(dto.getYearsExperience());
        entity.setPhone1(dto.getPhone1());
        entity.setPhone2(dto.getPhone2());
        entity.setEmail(dto.getEmail());
    }

    private void mapContactToEntity(ContactDTO dto, Contact entity) {
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setPhone(dto.getPhone());
        entity.setEmail(dto.getEmail());
        entity.setOriginCity(dto.getOriginCity());
        entity.setDistnationCity(dto.getDistnationCity());
        entity.setDate(dto.getDate());
        entity.setDescription(dto.getDescription());
    }

    private InformationDTO mapToDTO(Information entity) {
        InformationDTO dto = new InformationDTO();
        dto.setId(entity.getId());
        dto.setMoveProfetionelle(entity.getMoveProfetionelle());
        dto.setStorageSolution(entity.getStorageSolution());
        dto.setYearsExperience(entity.getYearsExperience());
        dto.setPhone1(entity.getPhone1());
        dto.setPhone2(entity.getPhone2());
        dto.setEmail(entity.getEmail());

        if (entity.getOffices() != null) {
            dto.setOffices(entity.getOffices().stream()
                    .map(this::mapOfficeToDTO)
                    .collect(Collectors.toList()));
        }

        if (entity.getSponsors() != null) {
            dto.setSponsors(entity.getSponsors().stream()
                    .map(this::mapSponsorToDTO)
                    .collect(Collectors.toList()));
        }

        if (entity.getContacts() != null) {
            dto.setContacts(entity.getContacts().stream()
                    .map(this::mapContactToDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private OfficeDTO mapOfficeToDTO(Office office) {
        return new OfficeDTO(office.getId(), office.getOfficeName());
    }

    private SponsorDTO mapSponsorToDTO(Sponsor sponsor) {
        return new SponsorDTO(sponsor.getId(), sponsor.getImage());
    }

    private ContactDTO mapContactToDTO(Contact contact) {
        return new ContactDTO(
                contact.getId(),
                contact.getFirstName(),
                contact.getLastName(),
                contact.getPhone(),
                contact.getEmail(),
                contact.getOriginCity(),
                contact.getDistnationCity(),
                contact.getDate(),
                contact.getDescription()
        );
    }
}