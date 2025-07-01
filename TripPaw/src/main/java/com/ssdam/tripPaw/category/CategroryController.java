package com.ssdam.tripPaw.category;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class CategroryController {
	private final CategoryService categoryService;
	
	@GetMapping("/category")
	public String showCategory(Model model) {
		return categoryService;
	}
}