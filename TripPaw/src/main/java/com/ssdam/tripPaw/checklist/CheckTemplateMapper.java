package com.ssdam.tripPaw.checklist;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.CheckTemplate;

@Mapper
public interface CheckTemplateMapper {
	void insertTemplate(CheckTemplate template);
    int countTemplates();  // 데이터 중복 방지용
}
