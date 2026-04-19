package com.petstore.paymentservice.infra.mapper;

import com.petstore.paymentservice.infra.entity.PaymentEntity;
import com.petstore.paymentservice.domain.model.Payment;
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
