// // pages/mypage/checklist/mychecklist/[id].js

// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import { getRoutinesByMember } from '@/api/checkRoutine'; 
// import { List, Card } from 'antd';
// import MypageLayout from '@/components/layout/MypageLayout';

// const MyChecklistPage = () => {
//   const router = useRouter();
//   const { id: memberId } = router.query;

//   const [routines, setRoutines] = useState([]);

//   useEffect(() => {
//     if (memberId) {
//       getRoutinesByMember(memberId).then(setRoutines);
//     }
//   }, [memberId]);

//   return (
//     <MypageLayout>
//       <h1>나의 체크리스트</h1>
//       <List
//         grid={{ gutter: 16, column: 2 }}
//         dataSource={routines}
//         renderItem={(routine) => (
//           <List.Item>
//             <Card title={routine.title}>
//               {/* 루틴 항목이 포함되어 있다면 드롭다운 */}
//               <ul>
//                 {routine.checkTemplateItems?.map((item) => (
//                   <li key={item.id}>{item.content}</li>
//                 ))}
//               </ul>
//             </Card>
//           </List.Item>
//         )}
//       />
//     </MypageLayout>
//   );
// };

// export default MyChecklistPage;
