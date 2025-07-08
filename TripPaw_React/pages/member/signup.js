import React from 'react';
import AuthLayout from './loginLayout';
import SignForm from '../../components/member/SignForm'; // SignForm을 별도 컴포넌트로 분리했다고 가정
import Test from './test';
function SignupPage() {
  return (
    <AuthLayout>
      <Test />
    </AuthLayout>
  );
}

export default SignupPage;