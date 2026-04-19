package com.petstore.orderservice.infra.mapper;

import com.petstore.orderservice.infra.entity.OrderEntity;
import com.petstore.orderservice.domain.model.Order;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OrderMapper {
    OrderEntity toEntity(Order order);
    Order toDomain(OrderEntity entity);
    List<OrderEntity> toEntity(List<Order> orders);
    List<Order> toDomain(List<OrderEntity> entities);
}
