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
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
public class PlaceApiService {

    private final PlaceMapper placeMapper;
    private final PlaceTypeMapper placeTypeMapper;
    private final PlaceImageMapper placeImageMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String key = "YOUR_KEY_HERE"; // 인증키

    public PlaceApiService(PlaceMapper placeMapper, PlaceTypeMapper placeTypeMapper, PlaceImageMapper placeImageMapper) {
        this.placeMapper = placeMapper;
        this.placeTypeMapper = placeTypeMapper;
        this.placeImageMapper = placeImageMapper;
    }

    private static final Map<String, String> contentTypeIdMap = Map.of(
            "12", "관광지", "14", "문화시설", "15", "축제/공연/행사",
            "25", "여행코스", "28", "레포츠", "32", "숙박",
            "38", "쇼핑", "39", "음식점"
    );

    private boolean isValidJson(String body) {
        return body != null && body.trim().startsWith("{");
    }

    public void fetchAndSavePetFriendlyPlaces() throws InterruptedException {
        int[] areaCodes = {1}; // 서울 등 필요 지역코드만 입력
        ExecutorService executor = Executors.newFixedThreadPool(3); // 병렬 처리 제한

        for (int areaCode : areaCodes) {
            try {
                String apiUrl = "https://apis.data.go.kr/B551011/KorPetTourService/areaBasedList"
                        + "?serviceKey=" + key
                        + "&MobileOS=ETC"
                        + "&MobileApp=TripPaw"
                        + "&areaCode=" + areaCode
                        + "&contentTypeId=12"
                        + "&numOfRows=30"
                        + "&pageNo=1"
                        + "&_type=json";

                URI uri = new URI(apiUrl);
                HttpHeaders headers = new HttpHeaders();
                headers.add("Accept", "application/json");
                HttpEntity<String> entity = new HttpEntity<>(headers);

                ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);
                String responseBody = response.getBody();

                if (!isValidJson(responseBody)) {
                    System.out.println("⚠️ JSON 응답이 유효하지 않음");
                    continue;
                }

                JSONArray items = new JSONObject(responseBody)
                        .getJSONObject("response").getJSONObject("body")
                        .getJSONObject("items").getJSONArray("item");

                for (int i = 0; i < items.length(); i++) {
                    JSONObject item = items.getJSONObject(i);

                    executor.submit(() -> {
                        try {
                            processPlaceItem(item);
                            Thread.sleep(1300); // 요청 간 간격 확보
                        } catch (Exception e) {
                            System.out.println("⚠️ 처리 실패: " + e.getMessage());
                        }
                    });
                }

            } catch (Exception e) {
                System.out.println("❌ 전체 에러: " + e.getMessage());
            }
        }

        executor.shutdown();
        executor.awaitTermination(30, TimeUnit.MINUTES);
    }

    private void processPlaceItem(JSONObject item) throws Exception {
        long contentId = item.optLong("contentid");
        String contentTypeId = item.optString("contenttypeid");

        boolean petFriendly = false;
        String petDescription = "";
        String openHours = "";
        String restDays = "";
        String price = "";
        String parking = "";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Accept", "application/json");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // detailIntro2
        try {
            String detailUrl = "https://apis.data.go.kr/B551011/KorService2/detailIntro2"
                    + "?serviceKey=" + key
                    + "&MobileOS=ETC"
                    + "&MobileApp=TripPaw"
                    + "&_type=json"
                    + "&contentId=" + contentId
                    + "&contentTypeId=" + contentTypeId;

            ResponseEntity<String> detailResponse = restTemplate.exchange(new URI(detailUrl), HttpMethod.GET, entity, String.class);
            if (isValidJson(detailResponse.getBody())) {
                JSONArray detailItems = new JSONObject(detailResponse.getBody())
                        .getJSONObject("response").getJSONObject("body")
                        .getJSONObject("items").getJSONArray("item");

                if (!detailItems.isEmpty()) {
                    JSONObject detail = detailItems.getJSONObject(0);
                    petDescription = detail.optString("chkpet", "");
                    openHours = detail.optString("usetime", "");
                    restDays = detail.optString("restdate", "");
                    if (petDescription.contains("가능")) petFriendly = true;
                }
            }
        } catch (Exception e) {
            System.out.println("⚠️ intro2 파싱 실패: contentId=" + contentId);
        }

        // detailInfo2
        try {
            String infoUrl = "https://apis.data.go.kr/B551011/KorService2/detailInfo2"
                    + "?serviceKey=" + key
                    + "&MobileOS=ETC"
                    + "&MobileApp=TripPaw"
                    + "&_type=json"
                    + "&contentId=" + contentId
                    + "&contentTypeId=" + contentTypeId;

            ResponseEntity<String> infoResponse = restTemplate.exchange(new URI(infoUrl), HttpMethod.GET, entity, String.class);

            if (isValidJson(infoResponse.getBody())) {
                JSONArray infoItems = new JSONObject(infoResponse.getBody())
                        .getJSONObject("response").getJSONObject("body")
                        .getJSONObject("items").getJSONArray("item");

                for (int k = 0; k < infoItems.length(); k++) {
                    JSONObject infoItem = infoItems.getJSONObject(k);
                    String infoName = infoItem.optString("infoname");
                    if (infoName.contains("입장")) price = infoItem.optString("infotext", "없음");
                    if (infoName.contains("주차")) parking = infoItem.optString("infotext", "");
                }
            }
        } catch (Exception e) {
            System.out.println("⚠️ detailInfo2 파싱 실패: contentId=" + contentId);
        }

        // 장소 타입
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
        place.setPetVerified(!petDescription.isBlank());
        place.setOpenHours(openHours);
        place.setRestDays(restDays);
        place.setPrice(price);
        place.setParking(parking);
        place.setDescription(item.optString("overview"));
        place.setPlaceType(placeType);

        placeMapper.insert(place);

        // detailImage2
        try {
            String imageUrl = "https://apis.data.go.kr/B551011/KorService2/detailImage2"
                    + "?serviceKey=" + key
                    + "&contentId=" + contentId
                    + "&imageYN=Y"
                    + "&MobileOS=ETC"
                    + "&MobileApp=TripPaw"
                    + "&_type=json";

            ResponseEntity<String> imageResponse = restTemplate.exchange(new URI(imageUrl), HttpMethod.GET, entity, String.class);

            if (isValidJson(imageResponse.getBody())) {
                JSONArray imageItems = new JSONObject(imageResponse.getBody())
                        .getJSONObject("response").getJSONObject("body")
                        .getJSONObject("items").getJSONArray("item");

                for (int j = 0; j < imageItems.length(); j++) {
                    String originUrl = imageItems.getJSONObject(j).optString("originimgurl");
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
}
