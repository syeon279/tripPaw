package com.ssdam.tripPaw.place;

import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.PlaceType;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
public class PlaceApiService {

    private final PlaceMapper placeMapper;
    private final PlaceTypeMapper placeTypeMapper;
    private final RestTemplate restTemplate = new RestTemplate();
    String encodedKey = "BwTmKuAlk0mdCJda6gICnjx3Q%2BVUWBVzQqCoMGzz4xxB2ejK27Kpiws8Og1v1Yh0R7Rw7LFzFB6rR7Xv4jLxGA%3D%3D";

    public PlaceApiService(PlaceMapper placeMapper, PlaceTypeMapper placeTypeMapper) {
        this.placeMapper = placeMapper;
        this.placeTypeMapper = placeTypeMapper;
    }
    
    // 대분류
    private static final Map<String, String> contentTypeIdMap = Map.of(
    	    "12", "관광지",
    	    "14", "문화시설",
    	    "15", "축제/공연/행사",
    	    "25", "여행코스",
    	    "28", "레포츠",
    	    "32", "숙박",
    	    "38", "쇼핑",
    	    "39", "음식점"
    	);

    public void fetchAndSavePetFriendlyPlaces() throws URISyntaxException {
        int[] areaCodes = {1, 2, 3, 4, 5, 6, 7, 8, 31, 32};

        for (int areaCode : areaCodes) {
            String apiUrl = "https://apis.data.go.kr/B551011/KorPetTourService/areaBasedList"
                    + "?serviceKey=" + encodedKey
                    + "&MobileOS=ETC"
                    + "&MobileApp=TripPaw"
                    + "&areaCode=" + areaCode
                    + "&numOfRows=100"
                    + "&pageNo=1"
                    + "&_type=json";

            URI uri = new URI(apiUrl);

            try {
                HttpHeaders headers = new HttpHeaders();
                headers.add("Accept", "application/json");
                HttpEntity<String> entity = new HttpEntity<>(headers);

                ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);

                JSONObject root = new JSONObject(response.getBody());
                JSONArray items = root.getJSONObject("response")
                        .getJSONObject("body")
                        .getJSONObject("items")
                        .getJSONArray("item");

                for (int i = 0; i < items.length(); i++) {
                    JSONObject item = items.getJSONObject(i);
                    long contentId = item.optLong("contentid");

                    // ✅ detailPetIntro 호출
                    String detailUrl = "https://apis.data.go.kr/B551011/KorPetTourService/detailPetIntro"
                            + "?serviceKey=" + encodedKey
                            + "&contentId=" + contentId
                            + "&_type=json";

                    boolean petFriendly = false;

                    try {
                        URI detailUri = new URI(detailUrl);
                        ResponseEntity<String> detailResponse = restTemplate.exchange(detailUri, HttpMethod.GET, entity, String.class);

                        JSONObject detailRoot = new JSONObject(detailResponse.getBody());
                        JSONObject detailBody = detailRoot.getJSONObject("response").getJSONObject("body");
                        JSONArray detailItems = detailBody.getJSONObject("items").getJSONArray("item");

                        if (detailItems.length() > 0) {
                            String chkpet = detailItems.getJSONObject(0).optString("chkpet", "").toLowerCase();
                            if (chkpet.contains("가능")) {
                                petFriendly = true;
                            }
                        }
                    } catch (Exception e) {
                        System.out.println("⚠️ 상세 정보 조회 실패: contentId=" + contentId + ", 이유: " + e.getMessage());
                    }
                    
                    String contentTypeId = item.optString("contenttypeid");
                    String typeName = contentTypeIdMap.getOrDefault(contentTypeId, "기타");

                    // 1. DB에서 해당 PlaceType 이름 조회
                    PlaceType placeType = placeTypeMapper.findByName(typeName);

                    // 2. 없으면 새로 insert
                    if (placeType == null) {
                        placeType = new PlaceType();
                        placeType.setName(typeName);
                        placeTypeMapper.insert(placeType);
                        placeType = placeTypeMapper.findByName(typeName); // ID 다시 조회
                    }
           

                    // ✅ Place 객체 생성
                    Place place = new Place();
                    place.setName(item.optString("title"));
                    place.setRegion(item.optString("addr1"));
                    place.setLatitude(item.optString("mapy"));
                    place.setLongitude(item.optString("mapx"));
                    place.setPhone(item.optString("tel"));
                    place.setImageUrl(item.optString("firstimage"));
                    place.setExtermalContentId(contentId);
                    place.setSource("KTO");
                    place.setDescription(item.optString("overview", null));
                    place.setHomePage(item.optString("homepage", null));
                    place.setPetFriendly(petFriendly);
                    place.setPlaceType(placeType);
                    
                    placeMapper.insert(place);
                }

                System.out.println("✅ " + areaCode + "번 지역: 장소 " + items.length() + "개 저장 완료!");

            } catch (Exception e) {
                System.out.println("❌ " + areaCode + "번 지역 오류: " + e.getMessage());
            }
        }
    }
}
