package com.petstore.orderservice.infra.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.orderservice.domain.model.OrderItem;
import com.petstore.orderservice.infra.entity.OrderItemEntity;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OrderItemMapper {
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    OrderItemEntity toEntity(OrderItem orderItem);
    
    @Mapping(target = "orderId", source = "order.id")
    OrderItem toDomain(OrderItemEntity entity);
}
