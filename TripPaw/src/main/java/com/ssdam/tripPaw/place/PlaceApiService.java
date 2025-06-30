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

    String petKey = "Lo38ICo6xt3eMSv%2FK2WlWeqaqRUzTq3REzTTfiCcfMyyiwwV9UzngNFzXFLx3aSwKoqMeZ%2F%2FcmIjq1Z8G8nAdg%3D%3D";
    String korKey = "Lo38ICo6xt3eMSv%2FK2WlWeqaqRUzTq3REzTTfiCcfMyyiwwV9UzngNFzXFLx3aSwKoqMeZ%2F%2FcmIjq1Z8G8nAdg%3D%3D";

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
        int[] areaCodes = {1};

        for (int areaCode : areaCodes) {
            String apiUrl = "https://apis.data.go.kr/B551011/KorPetTourService/areaBasedList"
                    + "?serviceKey=" + petKey
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

                if (!isValidJson(responseBody)) continue;

                JSONObject root = new JSONObject(responseBody);
                JSONObject header = root.getJSONObject("response").getJSONObject("header");
                if (!"0000".equals(header.optString("resultCode"))) continue;

                JSONArray items = root.getJSONObject("response")
                        .getJSONObject("body")
                        .getJSONObject("items")
                        .getJSONArray("item");

                for (int i = 0; i < items.length(); i++) {
                    JSONObject item = items.getJSONObject(i);
                    long contentId = item.optLong("contentid");
                    String contentTypeId = item.optString("contenttypeid");
                    boolean petFriendly = false;

                    // 디테일 정보 조회
                    try {
                        String detailUrl = "https://apis.data.go.kr/B551011/KorService2/detailIntro2"
                                + "?ServiceKey=" + korKey
                                + "&contentId=" + contentId
                                + "&contentTypeId=" + contentTypeId
                                + "&MobileOS=ETC"
                                + "&MobileApp=TripPaw"
                                + "&_type=json";

                        URI detailUri = new URI(detailUrl);
                        ResponseEntity<String> detailResponse = restTemplate.exchange(detailUri, HttpMethod.GET, entity, String.class);
                        String detailBody = detailResponse.getBody();

                        if (isValidJson(detailBody)) {
                            JSONArray detailItems = new JSONObject(detailBody)
                                    .getJSONObject("response")
                                    .getJSONObject("body")
                                    .getJSONObject("items")
                                    .getJSONArray("item");
                            if (detailItems.length() > 0) {
                                String chkpet = detailItems.getJSONObject(0).optString("chkpet", "").toLowerCase();
                                if (chkpet.contains("가능")) petFriendly = true;
                            }
                        }
                    } catch (Exception e) {
                        System.out.println("⚠️ 상세 정보 조회 실패: contentId=" + contentId);
                    }

                    String typeName = contentTypeIdMap.getOrDefault(contentTypeId, "기타");
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

                    placeMapper.insert(place);

                    // 이미지 추가
                    try {
                        String imageUrl = "https://apis.data.go.kr/B551011/KorService2/detailImage"
                                + "?ServiceKey=" + korKey
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
                        System.out.println("⚠️ 이미지 로딩 실패: contentId=" + contentId);
                    }
                }

                System.out.println("✅ " + areaCode + " 지역 처리 완료");

            } catch (Exception e) {
                System.out.println("❌ 전체 에러: " + e.getMessage());
            }
        }
    }
}