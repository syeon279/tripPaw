package com.ssdam.tripPaw.member.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;

import com.ssdam.tripPaw.member.MemberService;
import com.ssdam.tripPaw.member.oauth.PrincipalOauth2UserService;
import com.ssdam.tripPaw.member.security.MemberUserDetailService;
import com.ssdam.tripPaw.member.util.JwtFilter;
import com.ssdam.tripPaw.member.util.JwtProvider;
import com.ssdam.tripPaw.member.util.JwtUtil;

@Configuration // 스프링부트 설정파일
@EnableWebSecurity //url 스프링시큐리티 제어 - SecurityFilterChain
public class SecurityConfig {
	
	@Autowired
	PrincipalOauth2UserService principalOauth2UserService;
	
	@Autowired
	JwtUtil jwtUtil; //jwt 토큰발급 ##1
	
	@Autowired
	JwtProvider jwtProvider;
	@Autowired
	MemberUserDetailService memberUserDetailService;
	@Autowired
	OAuth2LoginSuccessHandler auth2LoginSuccessHandler;
	@Autowired
	OAuth2LoginFailureHandler auth2LoginFailureHandler;
	
//	 @Bean
//	    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//	        http
//	            .csrf(csrf -> csrf.disable()) // CSRF 보호 비활성화 (WebSocket과 함께 사용할 때 필요할 수 있음)
//	            .authorizeHttpRequests(authz -> {
//					try {
//						authz
//						    //.antMatchers("/**").permitAll() // "/**"는 모든 경로를 의미합니다.
//						    //.antMatchers("/admin/**").hasRole("ADMIN") // 관리자만 접근 가능 <= 이거 추가
//						    .antMatchers("/**").permitAll() // "/**"는 모든 경로를 의미합니다.
//						    .antMatchers("/admin/**").hasRole("ADMIN") // 관리자만 접근 가능 <= 이거 추가
//						    .anyRequest().authenticated().and()
//						    .oauth2Login()  // oauth2 - kakao, naver, google
//							//.loginPage("/member/login")
//							//.loginPage("/login/oauth2/code/kakao")
////	    			.defaultSuccessUrl("/member/login")
//							.userInfoEndpoint()
//							.userService(principalOauth2UserService);
//					} catch (Exception e) {
//						// TODO Auto-generated catch block
//						e.printStackTrace();
//					}
//				}
//	            );
//
//	        return http.build();
//	    }

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http, MemberService memberService) throws Exception {
		JwtFilter jwtTokenFilter = new JwtFilter(memberService, jwtProvider,memberUserDetailService); //##2
		
		// springsecurity 5와6 버전 혼용가능
		http
		.cors().configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(List.of("http://localhost:3000", "http://3.34.235.202"));
            config.setAllowCredentials(true);
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            config.setAllowedHeaders(List.of("*"));
            config.setExposedHeaders(List.of("Set-Cookie"));
            return config;
        }).and()
		.csrf().disable() //개발용 (보호기능 비활성화)- csrf : 사용자 인증정보를 웹페이지에서 보내기
			.sessionManagement()//쿠키 상에서 데이터 값저장
				.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // 세션필요할때만
			.and()
		.authorizeRequests()
			.antMatchers("/login/oauth2/code/**").permitAll()
			.antMatchers("/api/auth/**","/api/sms/**").permitAll() // 누구나 접근가능 // mobile전용 jwt
			.antMatchers("/member/login","/member/join","/resources/**").permitAll() // 누구나 접근가능 // pc전용 jwt security
			.antMatchers("/board/insert","/board/update/**", "/board/delete/**","/user/user").authenticated() // authenticated 로그인된 사용자만 접근가능
		.anyRequest().permitAll()
		.and()
//			.formLogin()
//				.loginPage("/member/login") // 커스텀로그인 폼
//				.loginProcessingUrl("/member/login") //사용자가 입력한 값 처리 url
//				.defaultSuccessUrl("/member/user", true) //로그인 성공 시 redirect true : 사용자가 로그인전 요청이 있더라도 무시하고 이 url로 이동
//				.failureUrl("/member/login?error=true")
//			.and()
			.logout()
				.logoutRequestMatcher(new AntPathRequestMatcher("/member/logout"))
				.logoutSuccessUrl("/member/login") //로그아웃 성공경로
				.invalidateHttpSession(true) //로그아웃시 세션무효
			.and()
		//.oauth2Login()  // oauth2 - kakao, naver, google
//		.loginPage("/member/login")
		//.defaultSuccessUrl("/member/login")
		//.userInfoEndpoint()
		//.userService(principalOauth2UserService)
		.oauth2Login(oauth2 -> oauth2
		            .successHandler(auth2LoginSuccessHandler) // 성공 핸들러 등록
		            .failureHandler(auth2LoginFailureHandler) // 실패 핸들러 등록
		            .userInfoEndpoint(
		            		userInfo -> userInfo
		            		.userService(principalOauth2UserService)
		            )
		            )
		//.loginPage("/api/auth/login/oauth2/code/kakao")
		//.failureUrl("/member/login?error=true")
			//.and()
			//.and()
		.exceptionHandling()//에러제어
			.authenticationEntryPoint( (request, response, authException) -> {
				if(!request.getRequestURI().startsWith("/api/")) { // /api/로 시작하지 않으면 pc버전
					response.sendRedirect("/member/login?error=true");
				} else {
					response.setStatus(401); //401 인증되지 않았을 때 - 로그인안하고 접근 했을 때 //400 - 잘 못 된 파라미터
					response.setContentType("application/json");
					response.getWriter().write("{\"error\":\"Unauthorized\"}"); // {"error":"Unauthorized"}
				}
			})
			.accessDeniedHandler((request, response, authException) -> {
				if(!request.getRequestURI().startsWith("/api/")) { // /api/로 시작하지 않으면 pc버전
					response.sendRedirect("/member/login?error=true");
				} else {
					response.setStatus(403); // 인증되었지만 접근권한이 없음 - 일반사용자가 관리자페이지 접근할 때
					response.setContentType("application/json");
					response.getWriter().write("{\"error\":\"Unauthorized\"}"); // {"error":"Unauthorized"}
				}
			});
//			.and()
//			.csrf(
//					csrf->csrf.ignoringRequestMatchers( //csrf 검사 생략
//								new AntPathRequestMatcher("/member/join","POST"),
//								new AntPathRequestMatcher("/board/insert","POST"),
//								new AntPathRequestMatcher("/board/update/**","POST"),
//								new AntPathRequestMatcher("/board/delete/**","POST"),
//								new AntPathRequestMatcher("/api/auth/logout","POST")
//							)
//			); //지정하지 않은 다른 모든요청 허용
		http.addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);
		//##
		
		return http.build();
	}
	//2.AuthenticationMagager(관리자)
	//사용자 인증시 Service와 PasswordEncoder를 사용
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration auth) throws Exception{
		return auth.getAuthenticationManager();
	}
	
}