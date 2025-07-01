package com.ssdam.tripPaw.category;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssdam.tripPaw.domain.Category;
import com.ssdam.tripPaw.domain.Place;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlaceCategoryService {

    private final CategoryMapper categoryMapper;
    private final PlaceCategoryMapper placeCategoryMapper;
    private final PlaceCategoryMappingMapper placeCategoryMappingMapper;

    public void mapCategoriesToPlace(Place place) {
        String combinedText = (place.getName() + " " + place.getDescription() + " " + place.getRegion()).toLowerCase();

        List<Category> categories = categoryMapper.findAll();

        for (Category category : categories) {
            String categoryName = category.getName();
            String normalized = categoryName.replaceAll("[^가-힣a-zA-Z0-9]", "").toLowerCase();

            if (combinedText.contains(normalized)) {
                placeCategoryMappingMapper.insertMapping(place.getId(), category.getId());
            }
        }
    }
}
