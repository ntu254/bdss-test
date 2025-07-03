package com.hicode.backend.config;

import com.hicode.backend.model.entity.*;
import com.hicode.backend.model.enums.*;
import com.hicode.backend.repository.BloodTypeCompatibilityRepository;
import com.hicode.backend.repository.BloodTypeRepository;
import com.hicode.backend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private BloodTypeRepository bloodTypeRepository;
    @Autowired
    private BloodTypeCompatibilityRepository compatibilityRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeBloodTypes();
        initializeBloodCompatibilities();
    }

    private void initializeRoles() {
        createRoleIfNotFound("Guest", "[\"view_public_content\"]", "Public users with limited access");
        createRoleIfNotFound("Member", "[\"view_content\", \"request_blood\", \"view_profile\"]", "Registered users");
        createRoleIfNotFound("Staff", "[\"manage_donations\", \"manage_inventory\", \"view_reports\"]", "Medical staff");
        createRoleIfNotFound("Admin", "[\"full_access\", \"manage_users\", \"manage_system\"]", "System administrators");
    }

    private void initializeBloodTypes() {
        createBloodTypeIfNotFound("O+", BloodComponentType.WHOLE_BLOOD, "Whole Blood O+", 42);
        createBloodTypeIfNotFound("O+", BloodComponentType.RED_BLOOD_CELLS, "Red Blood Cells O+", 42);
        createBloodTypeIfNotFound("O+", BloodComponentType.PLASMA, "Plasma O+", 365);
        createBloodTypeIfNotFound("O+", BloodComponentType.PLATELETS, "Platelets O+", 5);
        createBloodTypeIfNotFound("O-", BloodComponentType.WHOLE_BLOOD, "Whole Blood O-", 42);
        createBloodTypeIfNotFound("O-", BloodComponentType.RED_BLOOD_CELLS, "Red Blood Cells O- (Universal Donor)", 42);
        createBloodTypeIfNotFound("O-", BloodComponentType.PLASMA, "Plasma O-", 365);
        createBloodTypeIfNotFound("O-", BloodComponentType.PLATELETS, "Platelets O-", 5);
        createBloodTypeIfNotFound("A+", BloodComponentType.WHOLE_BLOOD, "Whole Blood A+", 42);
        createBloodTypeIfNotFound("A+", BloodComponentType.RED_BLOOD_CELLS, "Red Blood Cells A+", 42);
        createBloodTypeIfNotFound("A+", BloodComponentType.PLASMA, "Plasma A+", 365);
        createBloodTypeIfNotFound("A+", BloodComponentType.PLATELETS, "Platelets A+", 5);
        createBloodTypeIfNotFound("A-", BloodComponentType.WHOLE_BLOOD, "Whole Blood A-", 42);
        createBloodTypeIfNotFound("A-", BloodComponentType.RED_BLOOD_CELLS, "Red Blood Cells A-", 42);
        createBloodTypeIfNotFound("A-", BloodComponentType.PLASMA, "Plasma A-", 365);
        createBloodTypeIfNotFound("A-", BloodComponentType.PLATELETS, "Platelets A-", 5);
        createBloodTypeIfNotFound("B+", BloodComponentType.WHOLE_BLOOD, "Whole Blood B+", 42);
        createBloodTypeIfNotFound("B+", BloodComponentType.RED_BLOOD_CELLS, "Red Blood Cells B+", 42);
        createBloodTypeIfNotFound("B+", BloodComponentType.PLASMA, "Plasma B+", 365);
        createBloodTypeIfNotFound("B+", BloodComponentType.PLATELETS, "Platelets B+", 5);
        createBloodTypeIfNotFound("B-", BloodComponentType.WHOLE_BLOOD, "Whole Blood B-", 42);
        createBloodTypeIfNotFound("B-", BloodComponentType.RED_BLOOD_CELLS, "Red Blood Cells B-", 42);
        createBloodTypeIfNotFound("B-", BloodComponentType.PLASMA, "Plasma B-", 365);
        createBloodTypeIfNotFound("B-", BloodComponentType.PLATELETS, "Platelets B-", 5);
        createBloodTypeIfNotFound("AB+", BloodComponentType.WHOLE_BLOOD, "Whole Blood AB+", 42);
        createBloodTypeIfNotFound("AB+", BloodComponentType.RED_BLOOD_CELLS, "Red Blood Cells AB+", 42);
        createBloodTypeIfNotFound("AB+", BloodComponentType.PLASMA, "Plasma AB+ (Universal Donor)", 365);
        createBloodTypeIfNotFound("AB+", BloodComponentType.PLATELETS, "Platelets AB+", 5);
        createBloodTypeIfNotFound("AB-", BloodComponentType.WHOLE_BLOOD, "Whole Blood AB-", 42);
        createBloodTypeIfNotFound("AB-", BloodComponentType.RED_BLOOD_CELLS, "Red Blood Cells AB-", 42);
        createBloodTypeIfNotFound("AB-", BloodComponentType.PLASMA, "Plasma AB-", 365);
        createBloodTypeIfNotFound("AB-", BloodComponentType.PLATELETS, "Platelets AB-", 5);
    }

    private void initializeBloodCompatibilities() {
        List<BloodType> allTypes = bloodTypeRepository.findAll();
        System.out.println("Initializing Red Blood Cell compatibility rules...");
        Map<String, BloodType> rbcMap = allTypes.stream().filter(bt -> bt.getComponentType() == BloodComponentType.RED_BLOOD_CELLS).collect(Collectors.toMap(BloodType::getBloodGroup, bt -> bt));
        addRbcRules(rbcMap);
        System.out.println("Initializing Plasma compatibility rules...");
        Map<String, BloodType> plasmaMap = allTypes.stream().filter(bt -> bt.getComponentType() == BloodComponentType.PLASMA).collect(Collectors.toMap(BloodType::getBloodGroup, bt -> bt));
        addPlasmaRules(plasmaMap);
        System.out.println("Initializing Platelet compatibility rules...");
        Map<String, BloodType> plateletMap = allTypes.stream().filter(bt -> bt.getComponentType() == BloodComponentType.PLATELETS).collect(Collectors.toMap(BloodType::getBloodGroup, bt -> bt));
        addPlateletRules(plateletMap);
        System.out.println("Initializing Whole Blood compatibility rules...");
        Map<String, BloodType> wholeBloodMap = allTypes.stream().filter(bt -> bt.getComponentType() == BloodComponentType.WHOLE_BLOOD).collect(Collectors.toMap(BloodType::getBloodGroup, bt -> bt));
        addWholeBloodRules(wholeBloodMap);
    }

    private void addRbcRules(Map<String, BloodType> rbcMap) {
        addCompatibility(rbcMap, "O-", "O-", true, "RBC"); addCompatibility(rbcMap, "O-", "O+", true, "RBC"); addCompatibility(rbcMap, "O-", "A-", true, "RBC"); addCompatibility(rbcMap, "O-", "A+", true, "RBC"); addCompatibility(rbcMap, "O-", "B-", true, "RBC"); addCompatibility(rbcMap, "O-", "B+", true, "RBC"); addCompatibility(rbcMap, "O-", "AB-", true, "RBC"); addCompatibility(rbcMap, "O-", "AB+", true, "RBC");
        addCompatibility(rbcMap, "O+", "O+", true, "RBC"); addCompatibility(rbcMap, "O+", "A+", true, "RBC"); addCompatibility(rbcMap, "O+", "B+", true, "RBC"); addCompatibility(rbcMap, "O+", "AB+", true, "RBC");
        addCompatibility(rbcMap, "A-", "A-", true, "RBC"); addCompatibility(rbcMap, "A-", "A+", true, "RBC"); addCompatibility(rbcMap, "A-", "AB-", true, "RBC"); addCompatibility(rbcMap, "A-", "AB+", true, "RBC");
        addCompatibility(rbcMap, "A+", "A+", true, "RBC"); addCompatibility(rbcMap, "A+", "AB+", true, "RBC");
        addCompatibility(rbcMap, "B-", "B-", true, "RBC"); addCompatibility(rbcMap, "B-", "B+", true, "RBC"); addCompatibility(rbcMap, "B-", "AB-", true, "RBC"); addCompatibility(rbcMap, "B-", "AB+", true, "RBC");
        addCompatibility(rbcMap, "B+", "B+", true, "RBC"); addCompatibility(rbcMap, "B+", "AB+", true, "RBC");
        addCompatibility(rbcMap, "AB-", "AB-", true, "RBC"); addCompatibility(rbcMap, "AB-", "AB+", true, "RBC");
        addCompatibility(rbcMap, "AB+", "AB+", true, "RBC");
    }

    private void addPlasmaRules(Map<String, BloodType> plasmaMap) {
        addCompatibility(plasmaMap, "AB+", "AB+", true, "Plasma"); addCompatibility(plasmaMap, "AB+", "A+", true, "Plasma"); addCompatibility(plasmaMap, "AB+", "B+", true, "Plasma"); addCompatibility(plasmaMap, "AB+", "O+", true, "Plasma");
        addCompatibility(plasmaMap, "AB-", "AB-", true, "Plasma"); addCompatibility(plasmaMap, "AB-", "A-", true, "Plasma"); addCompatibility(plasmaMap, "AB-", "B-", true, "Plasma"); addCompatibility(plasmaMap, "AB-", "O-", true, "Plasma");
        addCompatibility(plasmaMap, "A+", "A+", true, "Plasma"); addCompatibility(plasmaMap, "A+", "O+", true, "Plasma");
        addCompatibility(plasmaMap, "B+", "B+", true, "Plasma"); addCompatibility(plasmaMap, "B+", "O+", true, "Plasma");
        addCompatibility(plasmaMap, "O+", "O+", true, "Plasma");
    }

    private void addPlateletRules(Map<String, BloodType> plateletMap) {
        addCompatibility(plateletMap, "O+", "O+", true, "Platelets"); addCompatibility(plateletMap, "O+", "A+", true, "Platelets"); addCompatibility(plateletMap, "O+", "B+", true, "Platelets"); addCompatibility(plateletMap, "O+", "AB+", true, "Platelets");
        addCompatibility(plateletMap, "A+", "A+", true, "Platelets"); addCompatibility(plateletMap, "A+", "AB+", true, "Platelets");
        addCompatibility(plateletMap, "B+", "B+", true, "Platelets"); addCompatibility(plateletMap, "B+", "AB+", true, "Platelets");
        addCompatibility(plateletMap, "AB+", "AB+", true, "Platelets");
    }

    private void addWholeBloodRules(Map<String, BloodType> wholeBloodMap) {
        addCompatibility(wholeBloodMap, "O+", "O+", true, "Whole Blood"); addCompatibility(wholeBloodMap, "O-", "O-", true, "Whole Blood");
        addCompatibility(wholeBloodMap, "A+", "A+", true, "Whole Blood"); addCompatibility(wholeBloodMap, "A-", "A-", true, "Whole Blood");
        addCompatibility(wholeBloodMap, "B+", "B+", true, "Whole Blood"); addCompatibility(wholeBloodMap, "B-", "B-", true, "Whole Blood");
        addCompatibility(wholeBloodMap, "AB+", "AB+", true, "Whole Blood"); addCompatibility(wholeBloodMap, "AB-", "AB-", true, "Whole Blood");
    }

    private void createRoleIfNotFound(String name, String permissions, String description) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = new Role(name);
            role.setPermissions(permissions);
            role.setDescription(description);
            roleRepository.save(role);
            System.out.println("Initialized role: " + name);
        }
    }

    private void createBloodTypeIfNotFound(String group, BloodComponentType component, String desc, Integer shelfLife) {
        if (bloodTypeRepository.findByBloodGroupAndComponentType(group, component).isEmpty()) {
            BloodType bloodType = new BloodType();
            bloodType.setBloodGroup(group);
            bloodType.setComponentType(component);
            bloodType.setDescription(desc);
            bloodType.setShelfLifeDays(shelfLife);
            bloodTypeRepository.save(bloodType);
            System.out.println("Initialized Blood Type: " + group + " " + component.getDisplayName());
        }
    }

    private void addCompatibility(Map<String, BloodType> typeMap, String donorGroup, String recipientGroup, boolean isCompatible, String notes) {
        BloodType donor = typeMap.get(donorGroup);
        BloodType recipient = typeMap.get(recipientGroup);
        if (donor != null && recipient != null) {
            createCompatibilityIfNotFound(donor, recipient, isCompatible, 100, true, notes);
        }
    }

    private void createCompatibilityIfNotFound(BloodType donor, BloodType recipient, boolean isCompatible, int score, boolean isEmergency, String notes) {
        if (compatibilityRepository.findByDonorBloodTypeIdAndRecipientBloodTypeId(donor.getId(), recipient.getId()).isEmpty()) {
            BloodTypeCompatibility compatibility = new BloodTypeCompatibility();
            compatibility.setDonorBloodType(donor);
            compatibility.setRecipientBloodType(recipient);
            compatibility.setIsCompatible(isCompatible);
            compatibility.setNotes(notes);
            compatibilityRepository.save(compatibility);
            System.out.println("Initialized Compatibility: " + notes + " (" + donor.getBloodGroup() + " -> " + recipient.getBloodGroup() + ")");
        }
    }
}