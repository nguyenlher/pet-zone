package com.petstore.petservice.enums;

public enum EnergyLevel {
    VERY_LOW(1), LOW(2), MEDIUM(3), HIGH(4), VERY_HIGH(5);
    private final int value;
    EnergyLevel(int value) { this.value = value; }
    public int getValue() { return value; }
}