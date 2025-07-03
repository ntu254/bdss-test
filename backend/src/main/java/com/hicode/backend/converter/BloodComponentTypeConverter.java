package com.hicode.backend.converter;

import com.hicode.backend.model.enums.BloodComponentType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class BloodComponentTypeConverter implements AttributeConverter<BloodComponentType, String> {

    @Override
    public String convertToDatabaseColumn(BloodComponentType attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getDisplayName();
    }

    @Override
    public BloodComponentType convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }
        return BloodComponentType.fromDisplayName(dbData);
    }
}