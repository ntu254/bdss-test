package com.hicode.backend.model.entity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.hicode.backend.model.enums.BloodComponentType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "blood_types", uniqueConstraints = {
        @UniqueConstraint(name = "UQ_blood_group_component", columnNames = {"blood_group", "component_type"})
})
@Getter
@Setter
@NoArgsConstructor
public class BloodType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "blood_group", length = 3, nullable = false)
    private String bloodGroup;

    @Column(name = "component_type", length = 30, nullable = false)
    private BloodComponentType componentType;

    @Column(length = 50)
    private String description;

    @Column(nullable = false)
    private Integer shelfLifeDays;

    @OneToMany(mappedBy = "bloodType", fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<User> users;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = this.updatedAt = LocalDateTime.now();
        if (this.componentType == null) this.componentType = BloodComponentType.WHOLE_BLOOD;
        if (this.shelfLifeDays == null) this.shelfLifeDays = 42;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
