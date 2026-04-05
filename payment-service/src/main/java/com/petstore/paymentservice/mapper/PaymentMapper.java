package com.petstore.paymentservice.mapper;

import com.petstore.paymentservice.entity.PaymentEntity;
import com.petstore.paymentservice.model.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface PaymentMapper {
    PaymentEntity toEntity(Payment payment);
    Payment toDomain(PaymentEntity entity);
    List<PaymentEntity> toEntity(List<Payment> payments);
    List<Payment> toDomain(List<PaymentEntity> entities);
}
