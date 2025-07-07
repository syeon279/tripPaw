// import React, { useState } from 'react';
// import LoginForm from './LoginForm';
// import RegisterForm from './SignForm';

// function AuthContainer() {
//   // isLogin 상태가 true이면 로그인 폼, false이면 회원가입 폼을 보여줍니다.
//   // 기본값은 true로 설정하여 처음에는 로그인 폼이 보이게 합니다.
//   const [isLogin, setIsLogin] = useState(true);

//   // isLogin 상태를 현재와 반대 값으로 변경하는 함수입니다.
//   const toggleForm = () => {
//     setIsLogin((prev) => !prev);
//   };

//   return (
//     <div style={{height:'750px'}}>
//       {/* isLogin 값에 따라 다른 컴포넌트를 렌더링합니다. */}
//       {/* 각 컴포넌트에 상태 변경 함수(toggleForm)를 props로 전달합니다. */}
//       {isLogin ? (
//         <LoginForm onToggleForm={toggleForm} />
//       ) : (
//         <RegisterForm onToggleForm={toggleForm} />
//       )}
//     </div>
//   );
// }

// export default AuthContainer;