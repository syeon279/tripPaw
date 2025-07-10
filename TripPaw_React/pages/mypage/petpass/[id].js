import PassportCardList from '@/components/passport/PassportCardList';
import MypageLayout from '@/components/layout/MypageLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const PetPassListPage = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { id: memberId } = router.query;

  useEffect(()=>{
    const checkAuth = async()=>{
      try{
        const res = await axios.get('http://localhost:8080/api/auth/check', {withCredentials: true });
        if(res.status === 200){
          const authUser = res.data;
          setUser(authUser);
          if(`${authUser.id}` !== memberId){
            message.warning('접근 가능 유저가 아닙니다.');
            router.push('/mypage');
          }
        }
      }catch(err){message.error('로그인이 필요합니다.'); router.push('/login');}
    };
    if(memberId) checkAuth();
  }, [memberId]);
  if (!user || `${user.id}` !== memberId) return <div>접근 권한이 없습니다.</div>;

  return (
    <MypageLayout>
      <PassportCardList memberId={memberId} />
    </MypageLayout>
  );
};

export default PetPassListPage;