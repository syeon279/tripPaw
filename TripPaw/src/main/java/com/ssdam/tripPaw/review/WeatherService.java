package com.ssdam.tripPaw.review;

import java.io.StringReader;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import javax.xml.parsers.DocumentBuilderFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.*;
import org.xml.sax.InputSource;

@Service
public class WeatherService {

    @Value("${kma.api.key}")
    private String serviceKey;

    private static final String KMA_API = "https://apis.data.go.kr/1360000/AsosHourlyInfoService/getWthrDataList";

    public String getWeather(LocalDate date, double lat, double lon) {
        try {
            int stationId = getNearestStation(lat, lon); // TODO: 너가 구현한 좌표 -> 지점코드 변환
            if (stationId == -1) {
                System.out.println("지점 코드 찾기 실패");
                return "알 수 없음";
            }

            String formattedDate = date.format(DateTimeFormatter.ofPattern("yyyyMMdd"));

            String url = KMA_API + "?"
                    + "serviceKey=" + URLEncoder.encode(serviceKey, StandardCharsets.UTF_8)
                    + "&dataType=XML"
                    + "&dataCd=ASOS"
                    + "&dateCd=HR"
                    + "&startDt=" + formattedDate
                    + "&startHh=06"
                    + "&endDt=" + formattedDate
                    + "&endHh=06"
                    + "&stnIds=" + stationId
                    + "&numOfRows=1&pageNo=1";

            System.out.println("날씨 API URL: " + url);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(new URI(url), String.class);

            Document doc = DocumentBuilderFactory.newInstance()
                    .newDocumentBuilder()
                    .parse(new InputSource(new StringReader(response.getBody())));

            NodeList items = doc.getElementsByTagName("item");
            if (items.getLength() > 0) {
                Node item = items.item(0);
                return parseWeatherCondition(item);
            } else {
                System.out.println("응답에 item 없음");
                return "알 수 없음";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "알 수 없음";
        }
    }

    private String parseWeatherCondition(Node item) {
        String rnStr = getTagValue("rn", item);        // 강수량
        String dsnwStr = getTagValue("dsnw", item);    // 적설량
        String cloudStr = getTagValue("dc10Tca", item); // 전운량

        double rn = parseDouble(rnStr);
        double dsnw = parseDouble(dsnwStr);
        int cloud = parseInt(cloudStr);

        System.out.printf("강수량: %.1f, 적설량: %.1f, 전운량: %d%n", rn, dsnw, cloud);

        if (dsnw > 0.0) return "눈";
        else if (rn > 0.0) return "비";
        else if (cloud >= 0 && cloud <= 2) return "맑음";
        else if (cloud >= 3 && cloud <= 7) return "구름많음";
        else if (cloud >= 8) return "흐림";
        else return "알 수 없음";
    }

    private String getTagValue(String tag, Node item) {
        Element e = (Element) item;
        NodeList nodeList = e.getElementsByTagName(tag);
        if (nodeList.getLength() > 0) {
            return nodeList.item(0).getTextContent();
        }
        return "";
    }

    private double parseDouble(String val) {
        try {
            return Double.parseDouble(val);
        } catch (Exception e) {
            return 0.0;
        }
    }

    private int parseInt(String val) {
        try {
            return Integer.parseInt(val);
        } catch (Exception e) {
            return -1;
        }
    }

    // TODO: 지점 코드 매핑을 좌표 기반으로 구현하거나 임시 하드코딩
    private int getNearestStation(double lat, double lon) {
        // 간단 예시: 서울 주변이면 108번 사용
        return 108;
    }
}
