package com.ssdam.tripPaw.review;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

@Service
public class WeatherService {
	public String getWeather(LocalDate date, double lat, double lon) {
        
        return "맑음";
    }
}
