package com.ssdam.tripPaw.init;

import java.net.URISyntaxException;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.ssdam.tripPaw.category.CategoryMapper;
import com.ssdam.tripPaw.place.PlaceApiService;

@Component
public class PlaceInitializer implements ApplicationRunner {
	private final CategoryMapper categoryMapper;
    private final PlaceApiService placeApiService;

    public PlaceInitializer(PlaceApiService placeApiService, CategoryMapper categoryMapper) {
        this.placeApiService = placeApiService;
        this.categoryMapper = categoryMapper;
    }

    @Override
    public void run(ApplicationArguments args) throws URISyntaxException, InterruptedException {
 
//        placeApiService.fetchAndSavePetFriendlyPlaces();
    }
}