package com.ssdam.tripPaw.search;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ssdam.tripPaw.dto.SearchResultDto;

import lombok.RequiredArgsConstructor;


@Controller
@RequiredArgsConstructor
public class SearchController {
     
    private final SearchService searchService;
    
    // 🔍 검색하기
    @GetMapping("/search")
    @ResponseBody
    public SearchResultDto search(
    	    @RequestParam String keyword,
    	    @RequestParam(required = false) String region,
    	    @RequestParam(defaultValue = "0") int offset, // ⭐ offset 추가
    	    @RequestParam(defaultValue = "0") int tripPlanOffset
    	) {
    	//System.out.println("...............[controller] : keyword=" + keyword + ", region=" + region + ", offset=" + offset + ", tripPlanOffset=" + tripPlanOffset);
        return searchService.search(keyword, region, offset, tripPlanOffset); // ✅ 수정
    	}
}
