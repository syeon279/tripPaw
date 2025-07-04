package com.ssdam.tripPaw.search;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ssdam.tripPaw.dto.SearchResultDto;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Controller
@RequiredArgsConstructor
public class SearchController {
	
	private final SearchService searchService;
	
	//검색하기
	@GetMapping("/search")
	@ResponseBody
	public SearchResultDto search(String keyword) {
		return searchService.search(keyword);
		
	}
}
