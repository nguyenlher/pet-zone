package com.petstore.orderservice.infra.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.orderservice.infra.entity.OrderItemEntity;
import com.petstore.orderservice.domain.model.OrderItem;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OrderItemMapper {
    @Mapping(target = "orderId", ignore = true)
    OrderItemEntity toEntity(OrderItem orderItem);
}
