package com.petstore.orderservice.infra.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.orderservice.domain.model.OrderShippingDetail;
import com.petstore.orderservice.infra.entity.OrderShippingDetailEntity;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OrderShippingDetailMapper {
    
    @Mapping(target = "order", ignore = true)
    OrderShippingDetailEntity toEntity(OrderShippingDetail detail);
    
    OrderShippingDetail toDomain(OrderShippingDetailEntity entity);
}
