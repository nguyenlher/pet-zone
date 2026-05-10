package com.petstore.petservice.infra.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.petstore.petservice.domain.repository.PetStatisticsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Repository
@RequiredArgsConstructor
@Slf4j
public class PetStatisticsRepositoryImpl implements PetStatisticsRepository {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public Long countTotalPets() {
        String sql = "SELECT COUNT(*) FROM pets";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    @Override
    public Long countPetsByStatus(String status) {
        String sql = "SELECT COUNT(*) FROM pets WHERE status = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, status);
    }

    @Override
    public List<TopPetData> getTopViewedPets(int limit) {
        String sql = """
            SELECT 
                p.id,
                p.name,
                COALESCE(ppi.image_url, '') as image_url,
                p.price,
                p.view_count
            FROM pets p
            LEFT JOIN pet_product_images ppi ON ppi.entity_id = p.id 
                AND ppi.entity_type = 'PET' 
                AND ppi.is_thumbnail = true
            ORDER BY p.view_count DESC
            LIMIT ?
            """;
        
        return jdbcTemplate.query(sql,
            (rs, rowNum) -> new TopPetData(
                rs.getString("id"),
                rs.getString("name"),
                rs.getString("image_url"),
                rs.getDouble("price"),
                rs.getInt("view_count")
            ),
            limit
        );
    }
}
