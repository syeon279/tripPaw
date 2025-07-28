// MemberDataInitializer.java
package com.ssdam.tripPaw.init;

import org.springframework.stereotype.Component;

import com.ssdam.tripPaw.domain.Member;
import com.ssdam.tripPaw.member.config.MemberRepository;
import com.ssdam.tripPaw.member.config.MemberRole;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MemberDataInitializer {

    private final MemberRepository memberRepository;

    public void run(String[] args) {
        System.out.println("[INIT] Member 더미 데이터 삽입 시작");

        Member member = Member.builder()
                .username("admin")
                .password("$2a$12$IzrS4K6sNGAsReeCH6YQ9.jQ9Nlz/G4wO3/rMJ/6O5NPfPngzGZEK")
                .nickname("admin")
                .email("admin@example.com")
                .zonecode("13529")
                .roadAddress("경기 성남시 분당구 판교역로 166 (카카오 판교 아지트)")
                .namujiAddress("102동")
                .status(true)
                .provider("")
                .build();
        member.getRole().add(MemberRole.ADMIN);
        memberRepository.save(member);

        for (int i = 1; i <= 3; i++) {
            member = Member.builder()
                    .username("test" + i)
                    .password("$2a$12$IzrS4K6sNGAsReeCH6YQ9.jQ9Nlz/G4wO3/rMJ/6O5NPfPngzGZEK")
                    .nickname("test" + i)
                    .email("test" + i + "@email.com")
                    .zonecode("13529")
                    .roadAddress("경기 성남시 분당구 판교역로 166 (카카오 판교 아지트)")
                    .namujiAddress("102동")
                    .status(true)
                    .provider("")
                    .build();
            member.getRole().add(MemberRole.MEMBER);
            memberRepository.save(member);
        }

        System.out.println("[INIT] Member 더미 데이터 삽입 완료");
    }
}
