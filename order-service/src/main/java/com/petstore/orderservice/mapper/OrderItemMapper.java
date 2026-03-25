package com.petstore.orderservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.orderservice.entity.OrderItemEntity;
import com.petstore.orderservice.model.OrderItem;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OrderItemMapper {
    @Mapping(target = "orderId", ignore = true)
    OrderItemEntity toEntity(OrderItem orderItem);
}
