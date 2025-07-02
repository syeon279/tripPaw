package com.ssdam.tripPaw.init;
//CheckRoutine 진행하는데 Route 더미데이터가 필요해서 작성한 파일입니다. 불필요할 경우 com.ssdam.tripPaw.init.RouteRepository와 함께 꺼두시면 됩니다.

import java.util.ArrayList;
import java.util.List;

import com.ssdam.tripPaw.domain.Route;

public class RouteDummyFactory {
	
	public static List<Route> createDummyRoutes() {
        List<Route> routes = new ArrayList<>();

        for (int i = 1; i <= 10; i++) {
            Route route = new Route();
            route.setName("Route " + i);
            route.setRoutePlaces(new ArrayList<>()); // 빈 리스트 
            routes.add(route);
        }

        return routes;
    }
}
