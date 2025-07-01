package com.ssdam.tripPaw.place;

import com.ssdam.tripPaw.category.PlaceCategoryMappingMapper;
import com.ssdam.tripPaw.category.PlaceCategoryService;
import com.ssdam.tripPaw.domain.Place;
import com.ssdam.tripPaw.domain.PlaceImage;
import com.ssdam.tripPaw.domain.PlaceType;

import io.reactivex.functions.BiFunction;

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
	private final PlaceCategoryService placeCategoryService;
	private final RestTemplate restTemplate = new RestTemplate();

	private static final String key = "kqofCEpJVKxi9%2FD6M7kUNpRDUq4FhSKXk%2FzZxPL8mP1VNAP6TzJnYMNkHQB81OMT0zcwh6VQRyP4cPbSl1HNAg%3D%3D";

	public PlaceApiService(PlaceMapper placeMapper, PlaceTypeMapper placeTypeMapper,
			PlaceImageMapper placeImageMapper, PlaceCategoryService placeCategoryService) {
		this.placeMapper = placeMapper;
		this.placeTypeMapper = placeTypeMapper;
		this.placeImageMapper = placeImageMapper;
		this.placeCategoryService = placeCategoryService;
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

	private ResponseEntity<String> fetchWithRetry(URI uri, HttpEntity<String> entity, int maxAttempts)
			throws InterruptedException {
		int attempt = 0;
		while (attempt < maxAttempts) {
			try {
				return restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);
			} catch (Exception e) {
				attempt++;
				System.out.println("⏳ 재시도 " + attempt + "/" + maxAttempts + ": " + uri);
				Thread.sleep(2000);
			}
		}
		throw new RuntimeException("API 호출 실패: " + uri);
	}

	public void fetchAndSavePetFriendlyPlaces() throws InterruptedException {
		int[] areaCodes = { 1 };
		// int[] areaCodes = {1, 2, 3, 4, 5, 6, 7, 8, 31, 32, 33, 34, 35, 36, 37, 38, 39};
		String[] contentTypeIds = {"12", "14", "15", "25", "28", "32", "38", "39"};

		ExecutorService executor = Executors.newFixedThreadPool(3);

		for (int areaCode : areaCodes) {
			Thread.sleep(3000);
			for( String  contentTypeId : contentTypeIds) {
				try {
					String apiUrl = "https://apis.data.go.kr/B551011/KorPetTourService/areaBasedList" 
				+ "?serviceKey="+ key 
				+ "&MobileOS=ETC" 
				+ "&MobileApp=TripPaw" 
				+ "&areaCode=" + areaCode
				+ "&contentTypeId=" + contentTypeId  
				+ "&numOfRows=20" 
				+ "&pageNo=1" 
				+ "&_type=json";

					URI uri = new URI(apiUrl);
					HttpHeaders headers = new HttpHeaders();
					headers.add("Accept", "application/json");
					HttpEntity<String> entity = new HttpEntity<>(headers);

					ResponseEntity<String> response = fetchWithRetry(uri, entity, 3);
					String responseBody = response.getBody();

					Thread.sleep(3000);

					if (!isValidJson(responseBody)) {
						System.out.println("⚠️ JSON 응답이 유효하지 않음");
						break;
					}

					JSONObject bodyObj = new JSONObject(responseBody).getJSONObject("response").getJSONObject("body");
					JSONArray items = bodyObj.getJSONObject("items").getJSONArray("item");

					for (int i = 0; i < items.length(); i++) {
						JSONObject item = items.getJSONObject(i);
						executor.submit(() -> {
							try {
								processPlaceItem(item);
								Thread.sleep(1300);
							} catch (Exception e) {
								System.out.println("⚠️ 처리 실패: " + e.getMessage());
							}
						});
					}

				} catch (Exception e) {
					System.out.println("❌ 전체 에러: " + e.getMessage());
					continue;
				}
		}
			

		executor.shutdown();
		executor.awaitTermination(30, TimeUnit.MINUTES);
		}
	}

	///////////////////////////////////////////
	private void processPlaceItem(JSONObject item) throws Exception {
		long contentId = item.optLong("contentid");
		String contentTypeId = item.optString("contenttypeid");

		boolean petFriendly = false;
		String description = "";
		String openHours = "";
		String restDays = "";
		String price = "";
		String parking = "";
		String homepage = "";
		String phone = "";

		HttpHeaders headers = new HttpHeaders();
		headers.add("Accept", "application/json");
		HttpEntity<String> entity = new HttpEntity<>(headers);

		// Retry helper
		BiFunction<String, HttpEntity<String>, ResponseEntity<String>> fetchWithRetry = (url, ent) -> {
			for (int i = 0; i < 3; i++) {
				try {
					return restTemplate.exchange(new URI(url), HttpMethod.GET, ent, String.class);
				} catch (Exception e) {
					System.out.println("🔁 재시도(" + (i + 1) + ") 실패: " + e.getMessage());
					try {
						Thread.sleep(1000);
					} catch (InterruptedException ignored) {
					}
				}
			}
			return null;
		};
		
		
		// detailCommon
		try {
			String detailUrl = "https://apis.data.go.kr/B551011/KorPetTourService/detailCommon" 
		+ "?serviceKey=" + key
		+ "&MobileOS=ETC" 
		+ "&MobileApp=TripPaw" 
		+ "&_type=json" 
		+ "&contentId=" + contentId
		+ "&contentTypeId=" + contentTypeId;

			ResponseEntity<String> response = fetchWithRetry.apply(detailUrl, entity);
			if (response != null && isValidJson(response.getBody())) {
				JSONArray detailItems = new JSONObject(response.getBody()).getJSONObject("response")
						.getJSONObject("body").getJSONObject("items").getJSONArray("item");

				if (!detailItems.isEmpty()) {
					JSONObject detail = detailItems.getJSONObject(0);
					// contentTypeId에 따라 필드명을 다르게 적용
			        switch (contentTypeId) {
				        case "12": // 관광지
			            case "14": // 문화시설
			            case "15": // 축제/공연/행사
			            case "25": // 여행코스
			            case "28": // 레포츠
			            case "32": // 숙박
			            case "38": // 쇼핑
			            case "39": // 음식점
			            	description = detail.optString("overview", description);
			            	homepage = detail.optString("homepage", homepage);
		            	//////
			            default:
			            	description = detail.optString("overview", description);
			            	homepage = detail.optString("homepage", homepage);
			        }
				}
			}
		} catch (Exception e) {
			System.out.println("⚠️ detailCommon 파싱 실패: contentId=" + contentId);
		}

		// detailIntro
		try {
			String introUrl = "https://apis.data.go.kr/B551011/KorPetTourService/detailIntro" 
		+ "?serviceKey=" + key
		+ "&MobileOS=ETC" 
		+ "&MobileApp=TripPaw" 
		+ "&_type=json" 
		+ "&contentId=" + contentId
		+ "&contentTypeId=" + contentTypeId;

			ResponseEntity<String> response = fetchWithRetry.apply(introUrl, entity);
			if (response != null && isValidJson(response.getBody())) {
			    JSONArray detailItems = new JSONObject(response.getBody())
			        .getJSONObject("response")
			        .getJSONObject("body")
			        .getJSONObject("items")
			        .getJSONArray("item");

			    if (!detailItems.isEmpty()) {
			        JSONObject detail = detailItems.getJSONObject(0); // 여기서 객체 꺼냄

			        // contentTypeId에 따라 필드명을 다르게 적용
			        switch (contentTypeId) {
				        case "12": // 관광지
				        	openHours = detail.optString("usetime", openHours);
				        	restDays = detail.optString("restdat", restDays);
				        	parking = detail.optString("parking", parking);
				        	break;
			            case "14": // 문화시설
			                openHours = detail.optString("usetimeculture", openHours);
			                restDays = detail.optString("restdateculture", restDays);
			                parking = detail.optString("parkingculture", parking);
			                break;
			            case "15": // 축제/공연/행사
			            	openHours = detail.optString("usetimeculture", openHours);
			            	restDays = detail.optString("restdateculture", restDays);
			            	parking = detail.optString("parkingculture", parking);
			            	break;
			            case "25": // 여행코스
			            	openHours = detail.optString("usetimeculture", openHours);
			            	restDays = detail.optString("restdateculture", restDays);
			            	parking = detail.optString("parkingculture", parking);
			            	break;
			            case "28": // 레포츠
			            	openHours = detail.optString("usetimeleports", openHours);
			            	restDays = detail.optString("restdateleports", restDays);
			            	parking = detail.optString("parkingleports", parking);
			            	break;
			            case "32": // 숙박
			            	openHours = detail.optString("usetimeculture", openHours);
			            	restDays = detail.optString("restdateculture", restDays);
			            	parking = detail.optString("parkinglodging", parking);
			            	phone = detail.optString("infocenterlodging", phone);
			            	break;
			            case "38": // 쇼핑
			            	openHours = detail.optString("opentime", openHours);
			            	restDays = detail.optString("restdateshopping", restDays);
			            	parking = detail.optString("parkingshopping", parking);
			            	break;
			            case "39": // 음식점
			            	openHours = detail.optString("opentimefood", openHours);
			            	restDays = detail.optString("restdatefood", restDays);
			            	parking = detail.optString("parkingfood", parking);
			            	break;
		            	//////
			            default:
			                openHours = detail.optString("usetime", openHours);
			                restDays = detail.optString("restdate", restDays);
			                parking = detail.optString("parking", parking);
			                break;
			        }
			    }
			}
		} catch (Exception e) {
			System.out.println("⚠️ detailIntro 파싱 실패: contentId=" + contentId);
		}

		// detailInfo
		try {
			String infoUrl = "https://apis.data.go.kr/B551011/KorPetTourService/detailInfo" 
		+ "?serviceKey=" + key
		+ "&MobileOS=ETC" 
		+ "&MobileApp=TripPaw" 
		+ "&_type=json" 
		+ "&contentId=" + contentId
		+ "&contentTypeId=" + contentTypeId;

			ResponseEntity<String> response = fetchWithRetry.apply(infoUrl, entity);
			if (response != null && isValidJson(response.getBody())) {
			    JSONArray infoItems = new JSONObject(response.getBody())
			        .getJSONObject("response")
			        .getJSONObject("body")
			        .getJSONObject("items")
			        .getJSONArray("item");

			    for (int k = 0; k < infoItems.length(); k++) {
			        JSONObject infoItem = infoItems.getJSONObject(k);
			        String infoName = infoItem.optString("infoname");
			        String infoText = infoItem.optString("infotext");

			        switch (contentTypeId) {
			            case "12": // 관광지
			                if (infoName.contains("입장료") || infoName.contains("이용요금")) {
			                    price = infoText;
			                }
			                if (infoName.contains("주차")) {
			                    parking = infoText;
			                }
			                break;

			            case "14": // 문화시설
			                if (infoName.contains("입 장 료") || infoName.contains("관 람 료") || infoName.contains("입장")) {
			                    price = infoText;
			                }
			                if (infoName.contains("주차")) {
			                    parking = infoText;
			                }
			                break;

			            case "15": // 축제/공연/행사
			                if (infoName.contains("관람요금") || infoName.contains("이용요금")) {
			                    price = infoText;
			                }
			                if (infoName.contains("주차")) {
			                    parking = infoText;
			                }
			                break;

			            case "25": // 여행코스
			                // 가격정보 거의 없음, 생략 가능
			                break;

			            case "28": // 레포츠
			                if (infoName.contains("이용요금")) {
			                    price = infoText;
			                }
			                if (infoName.contains("주차") || infoName.contains("주차요금")) {
			                    parking = infoText;
			                }
			                break;

			            case "32": // 숙박
			            	String fee1 = infoItem.optString("roomoffseasonminfee1", "");
			                String fee2 = infoItem.optString("roompeakseasonminfee1", "");

			                if (!fee1.isBlank() || !fee2.isBlank()) {
			                    int f1 = fee1.isBlank() ? Integer.MAX_VALUE : Integer.parseInt(fee1);
			                    int f2 = fee2.isBlank() ? Integer.MAX_VALUE : Integer.parseInt(fee2);
			                    int minFee = Math.min(f1, f2);
			                    if (minFee != Integer.MAX_VALUE) {
			                        price = minFee + "원~";
			                    }
			                }
			                break;

			            case "38": // 쇼핑
			            	// 쇼핑 디테일은 입점정보만 있음
			                break;

			            case "39": // 음식점
			                // 음식점은 가격보다 메뉴나 기타 정보가 주, 가격은 생략 가능
			                if (infoName.contains("주차")) {
			                    parking = infoText;
			                }
			                break;

			            default:
			                if (infoName.contains("요금") || infoName.contains("입장")) {
			                    price = infoText;
			                }
			                if (infoName.contains("주차")) {
			                    parking = infoText;
			                }
			                break;
			        }
			    }
			}

		} catch (Exception e) {
			System.out.println("⚠️ detailInfo 파싱 실패: contentId=" + contentId);
		}

		// 타입 처리
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
		place.setHomePage(homepage);
		place.setPhone(phone);
		place.setImageUrl(item.optString("firstimage"));
		place.setExtermalContentId(contentId);
		place.setSource("KTO");
		place.setPetFriendly(petFriendly);
		place.setOpenHours(openHours);
		place.setRestDays(restDays);
		place.setPrice(price);
		System.out.println(place.getPrice());
		place.setParking(parking);
		System.out.println(place.getParking());
		place.setDescription(description);
		place.setPlaceType(placeType);

		placeMapper.insert(place);
		placeCategoryService.mapCategoriesToPlace(place);

		// 이미지 처리
		try {
			String imageUrl = "https://apis.data.go.kr/B551011/KorService2/detailImage2" 
								+ "?serviceKey=" + key
								+ "&contentId=" + contentId 
								+ "&imageYN=Y" 
								+ "&MobileOS=ETC" 
								+ "&MobileApp=TripPaw" 
								+ "&_type=json";

			ResponseEntity<String> response = fetchWithRetry.apply(imageUrl, entity);
			if (response != null && isValidJson(response.getBody())) {
				JSONArray imageItems = new JSONObject(response.getBody()).getJSONObject("response")
						.getJSONObject("body").getJSONObject("items").getJSONArray("item");

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
