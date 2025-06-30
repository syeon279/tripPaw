package com.ssdam.tripPaw.checklist;

import org.apache.ibatis.annotations.Mapper;

import com.ssdam.tripPaw.domain.CheckTemplateItem;

@Mapper
public interface CheckTemplateItemMapper {
    void insertTemplateItem(CheckTemplateItem item);
}