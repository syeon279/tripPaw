package com.ssdam.tripPaw.place;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import com.ssdam.tripPaw.category.CategoryService;
import com.ssdam.tripPaw.category.PlaceCategoryService;
import com.ssdam.tripPaw.domain.Category;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@Controller
@RequiredArgsConstructor
public class PlaceController {
	
	private final PlaceCategoryService placeCategoryService;
	private final CategoryService categoryService;

	// 여행 추천 페이지 렌더링
	@GetMapping("/trip")
	public String showTripRecommendationPage(Model model) {
		// 예: 카테고리 추천 정보 등을 model에 담을 수 있음
		List<Category> categories = categoryService.findAll();
		model.addAttribute("categories", categories);
		return "trip/recommend"; // 예: templates/trip/recommend.html 또는 .jsp
	}
}
