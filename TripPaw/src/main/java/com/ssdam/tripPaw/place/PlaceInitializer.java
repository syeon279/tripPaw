package com.ssdam.tripPaw.place;

import java.net.URISyntaxException;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class PlaceInitializer implements ApplicationRunner {
    private final PlaceApiService placeApiService;

    public PlaceInitializer(PlaceApiService placeApiService) {
        this.placeApiService = placeApiService;
    }

    @Override
    public void run(ApplicationArguments args) throws URISyntaxException {
        placeApiService.fetchAndSavePetFriendlyPlaces();
    }
}
