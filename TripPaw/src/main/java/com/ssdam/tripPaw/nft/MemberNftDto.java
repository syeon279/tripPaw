package com.ssdam.tripPaw.nft;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MemberNftDto {
    private Long id;
    private String title;
    private String imageUrl;
}