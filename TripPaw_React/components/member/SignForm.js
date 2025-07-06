import React from 'react';

// onToggleForm 함수를 props로 받습니다.
function SignForm({ onToggleForm }) {
  return (
    <div>
      <h2>회원가입</h2>
      <form>
        <input type="email" placeholder="이메일" />
        <br />
        <input type="password" placeholder="비밀번호" />
        <br />
        <input type="password" placeholder="비밀번호 확인" />
        <br />
        <button type="submit">가입하기</button>
      </form>
      <p>
        이미 계정이 있으신가요?{' '}
        {/* 버튼 클릭 시 onToggleForm 함수를 실행합니다. */}
        <button type="button" onClick={onToggleForm}>
          로그인
        </button>
      </p>
    </div>
  );
}

export default SignForm;