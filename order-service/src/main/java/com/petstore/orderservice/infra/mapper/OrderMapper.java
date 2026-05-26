package com.petstore.orderservice.infra.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.infra.entity.OrderEntity;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, uses = {OrderShippingDetailMapper.class, OrderItemMapper.class})
public interface OrderMapper {
    OrderEntity toEntity(Order order);

    Order toDomain(OrderEntity entity);

    List<OrderEntity> toEntity(List<Order> orders);
    List<Order> toDomain(List<OrderEntity> entities);
}
