package com.petstore.orderservice.mapper;

import com.petstore.orderservice.entity.OrderEntity;
import com.petstore.orderservice.model.Order;
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
