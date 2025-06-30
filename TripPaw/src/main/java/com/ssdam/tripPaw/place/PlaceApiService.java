package com.ssdam.tripPaw.place;

import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.PlaceImage;
import com.ssdam.tripPaw.domain.PlaceType;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

@Service
public class PlaceApiService {

    private final PlaceMapper placeMapper;
    private final PlaceTypeMapper placeTypeMapper;
    private final PlaceImageMapper placeImageMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    String encodedKey = "BwTmKuAlk0mdCJda6gICnjx3Q%2BVUWBVzQqCoMGzz4xxB2ejK27Kpiws8Og1v1Yh0R7Rw7LFzFB6rR7Xv4jLxGA%3D%3D";
    String key="BwTmKuAlk0mdCJda6gICnjx3Q%2BVUWBVzQqCoMGzz4xxB2ejK27Kpiws8Og1v1Yh0R7Rw7LFzFB6rR7Xv4jLxGA%3D%3D";
    
    public PlaceApiService(PlaceMapper placeMapper, PlaceTypeMapper placeTypeMapper, PlaceImageMapper placeImageMapper) {
        this.placeMapper = placeMapper;
        this.placeTypeMapper = placeTypeMapper;
        this.placeImageMapper = placeImageMapper;
    }

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

    private boolean isValidJson(String body) {
        return body != null && body.trim().startsWith("{");
    }

    public void fetchAndSavePetFriendlyPlaces() throws URISyntaxException {
        int[] areaCodes = {1 };
        //int[] areaCodes = {1, 2, 3, 4, 5, 6, 7, 8, 31, 32};
        

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
                String responseBody = response.getBody();

                if (!isValidJson(responseBody)) {
                    System.out.println("❌ 지역 " + areaCode + " 응답이 JSON이 아님: " + responseBody);
                    continue;
                }

                JSONObject root = new JSONObject(responseBody);
                JSONObject header = root.getJSONObject("response").getJSONObject("header");
                if (!"0000".equals(header.optString("resultCode"))) {
                    System.out.println("❌ 지역 " + areaCode + " 응답 오류: " + header.optString("resultMsg"));
                    continue;
                }

                JSONArray items = root.getJSONObject("response")
                        .getJSONObject("body")
                        .getJSONObject("items")
                        .getJSONArray("item");

                for (int i = 0; i < items.length(); i++) {
                    JSONObject item = items.getJSONObject(i);
                    long contentId = item.optLong("contentid");
                    boolean petFriendly = false;

                    try {
                    	String detailUrl = "https://apis.data.go.kr/B551011/KorPetTourService/detailPetIntro"
                    	        + "?serviceKey=" + encodedKey
                    	        + "&contentId=" + contentId
                    	        + "&MobileOS=ETC"
                    	        + "&MobileApp=TripPaw"
                    	        + "&_type=json";


                        URI detailUri = new URI(detailUrl);
                        ResponseEntity<String> detailResponse = restTemplate.exchange(detailUri, HttpMethod.GET, entity, String.class);

                        String detailBody = detailResponse.getBody();
                        if (isValidJson(detailBody)) {
                            JSONObject detailRoot = new JSONObject(detailBody);
                            JSONArray detailItems = detailRoot.getJSONObject("response").getJSONObject("body").getJSONObject("items").getJSONArray("item");
                            if (detailItems.length() > 0) {
                                String chkpet = detailItems.getJSONObject(0).optString("chkpet", "").toLowerCase();
                                if (chkpet.contains("가능")) petFriendly = true;
                            }
                        }
                    } catch (Exception e) {
                        System.out.println("⚠️ 상세 정보 조회 실패: contentId=" + contentId + ", 이유: " + e.getMessage());
                    }

                    String typeName = contentTypeIdMap.getOrDefault(item.optString("contenttypeid"), "기타");
                    PlaceType placeType = placeTypeMapper.findByName(typeName);
                    if (placeType == null) {
                        placeType = new PlaceType();
                        placeType.setName(typeName);
                        placeTypeMapper.insert(placeType);
                        placeType = placeTypeMapper.findByName(typeName);
                    }

                    Place place = new Place();
                    place.setName(item.optString("title"));
                    place.setRegion(item.optString("addr1"));
                    place.setLatitude(item.optString("mapy"));
                    place.setLongitude(item.optString("mapx"));
                    place.setPhone(item.optString("tel"));
                    place.setImageUrl(item.optString("firstimage"));
                    place.setExtermalContentId(contentId);
                    place.setSource("KTO");
                    place.setPetFriendly(petFriendly);
                    place.setPlaceType(placeType);
                    System.out.println("📌 저장할 타입: " + typeName);
                    System.out.println("📌 placeType ID: " + (placeType != null ? placeType.getId() : "null"));

                    placeMapper.insert(place);

                    try {
                    	String imageUrl = "https://apis.data.go.kr/B551011/KorPetTourService/detailImage"
                    	        + "?ServiceKey=" + key
                    	        + "&contentId=" + contentId
                    	        + "&imageYN=Y"
                    	        + "&MobileOS=ETC"
                    	        + "&MobileApp=TripPaw"
                    	        + "&_type=json";


                        URI imageUri = new URI(imageUrl);
                        ResponseEntity<String> imageResponse = restTemplate.exchange(imageUri, HttpMethod.GET, entity, String.class);
                        String imageBody = imageResponse.getBody();

                        if (isValidJson(imageBody)) {
                            JSONArray imageItems = new JSONObject(imageBody)
                                    .getJSONObject("response")
                                    .getJSONObject("body")
                                    .getJSONObject("items")
                                    .getJSONArray("item");

                            for (int j = 0; j < imageItems.length(); j++) {
                                JSONObject img = imageItems.getJSONObject(j);
                                String originUrl = img.optString("originimgurl");
                                if (!originUrl.isBlank()) {
                                    PlaceImage placeImage = new PlaceImage();
                                    placeImage.setImageUrl(originUrl);
                                    placeImage.setPlace(place);
                                    placeImageMapper.insert(placeImage);
                                }
                            }
                        }
                    } catch (Exception e) {
                        System.out.println("⚠️ 추가 이미지 로딩 실패: contentId=" + contentId + ", 이유: " + e.getMessage());
                    }
                }

                System.out.println("✅ " + areaCode + "번 지역: 장소 " + items.length() + "개 저장 완료!");

            } catch (Exception e) {
                System.out.println("❌ 지역 " + areaCode + " 오류: " + e.getMessage());
            }
        }
    }
}
