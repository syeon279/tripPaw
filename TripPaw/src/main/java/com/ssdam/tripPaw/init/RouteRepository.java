package com.ssdam.tripPaw.init;
//CheckRoutine 진행하는데 Route 더미데이터가 필요해서 작성한 파일입니다. 불필요할 경우 com.ssdam.tripPaw.init.RouteDummyFactory와 함께 꺼두시면 됩니다.

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssdam.tripPaw.domain.Route;

public interface RouteRepository extends JpaRepository<Route, Long>  {

}
