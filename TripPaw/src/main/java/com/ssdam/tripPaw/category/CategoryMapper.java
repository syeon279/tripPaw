package com.ssdam.tripPaw.category;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.Category;

@Mapper
public interface CategoryMapper {
	
	// insert
    public int insert(Category category);
    
    // select
    public Category findAll();
    public Category findById(Long id);
    public Category findByName(String name);
    
    // update
    public int updateById(Long id);
    
}