import React from 'react';

// onToggleForm 함수를 props로 받습니다.
function LoginForm({ onToggleForm }) {
  return (
    <div>
      <h2>로그인</h2>
      <form>
        <input type="email" placeholder="이메일" />
        <br />
        <input type="password" placeholder="비밀번호" />
        <br />
        <button type="submit">로그인</button>
      </form>
      <p>
        계정이 없으신가요?{' '}
        {/* 버튼 클릭 시 onToggleForm 함수를 실행합니다. */}
        <button type="button" onClick={onToggleForm}>
          회원가입
        </button>
      </p>
    </div>
  );
}

export default LoginForm;