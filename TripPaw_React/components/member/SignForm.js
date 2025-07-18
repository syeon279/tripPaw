import React, { useState, useCallback, useEffect, useRef, useRouter } from "react";
import { Button, Checkbox, Form, Input, Space } from "antd";
import Head from 'next/head';
import styled from 'styled-components';
import Router from 'next/router';
import axios from "axios";
import { useDaumPostcodePopup } from 'react-daum-postcode';
import RefAutoComplete from "antd/lib/auto-complete";

const ErrorMessage = styled.div`color:red;`;   //style.div( color:red; )
const UnderlineInput = styled(Input)`
  border: none;
  border-bottom: 1px solid #d9d9d9;
  border-radius: 0;
  box-shadow: none;

  &:focus,
  &.ant-input-focused {
    border-bottom: 2px solid #1677ff;
    box-shadow: none;
  }
`;

const googleIconPath = '/image/member/google.png';
const kakaoIconPath = '/image/member/kakao.png';
const naverIconPath = '/image/member/naver.png';

const SocialLogin = styled.div`
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;

  p {
    font-size: 14px;
    color: #777;
    margin-bottom: 15px;
    textAling: center;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  img {
    width: 25px;
    height: 24px;
  }

  &:hover {
    transform: translateY(-2px);
  }
`;

// onToggleForm 함수를 props로 받습니다.
function SignForm({ onToggleForm }) {

  const [recommendNickname, setRecommendNickname] = useState([]);
  const [aiNicknames, setAiNicknames] = useState('');
  useEffect( () => {
    const chetGPT = async () => {
      try{
        const response = await axios.get('http://localhost:8080/api/chatGPT')
        if(response.status == 200){
             const rawString = response.data.choices[0].message.content;

            const nicknameArray = rawString.split('\n').filter(name => name.trim() !== '');
            setAiNicknames(nicknameArray);
          //setRecommendNickname(response.data.choices[0].message.content);
          
        }
      }catch(error){
        console.log();
      }
  }
  chetGPT();
},[]) 
const nicknameIndex = useRef(0);

const onRecommendNickname = () => {
   // 닉네임 배열이 비어있으면 아무것도 하지 않음
    if (aiNicknames.length === 0) return;

    // 현재 인덱스의 닉네임을 설정
    setChangeNickname(aiNicknames[nicknameIndex.current]);

    nicknameIndex.current = (nicknameIndex.current + 1) % aiNicknames.length;
    
    console.log('다음 인덱스:', nicknameIndex.current);
}
// useEffect(() => {
//    //console.log('recommendNickname',recommendNickname);
//   //  for(var i=0; i<recommendNickname.length; i++){
//   //   for(var j=0; j<recommendNickname[i].length; j++){
//   //     console.log('recommendNickname',recommendNickname[i][j]);
//   //   }
//   //  }
// //   console.log('업데이트된 닉네임 배열:', recommendNickname);

//     // 배열의 각 항목을 보려면 forEach 등을 사용합니다.
//     // recommendNickname.forEach(name => console.log(name));
//     // for(let i = 0; i<recommendNickname.length; i++){
//     //   console.log('배열',recommendNickname[i]);
//     // }
// },[recommendNickname])
  // useEffect(() => { 
  //   if ( user &&  user.id) {   Router.replace('/');  }
  // } , [user &&  user.id]);

  // useEffect(() => {
  //   if ( signUpDone ) {   Router.replace('/');   }
  // } , [signUpDone]);

  // useEffect(() => { 
  //   if ( signUpError ) {  alert(signUpError);   }
  // } , [signUpError]);
  //const [email, setChangeEmail] = userInput('');
  //const [nickname, onChangeNickname] = userInput('');
  const [nickname, setChangeNickname] = useState('');
  //const [password, setChangePassword] = userInput(''); 
  const onChangeNickname = useCallback((e) => {
    setChangeNickname(e.target.value)
  }, [])
  const [email, setChangeEmail] = useState('');
  const onChangeEmail = useCallback((e) => {
    setChangeEmail(e.target.value)
  }, [])
  const [username, setChangeUsername] = useState('');
  const onChangeUsername = useCallback((e) => {
    setChangeUsername(e.target.value);

  }, [])
  const [phoneNum, setChangePhoneNum] = useState('');
  const [phoneNumRegError, setPhoneNumRegError] = useState(false);
  const [phoneNumLenError, setPhoneNumLenError] = useState(false);
  const onChangePhoneNum = useCallback((e) => {
    setPhoneNumRegError(false);
    setPhoneNumLenError(false);
    console.log(e.target.value);
    //숫자만 받기
    setChangePhoneNum(e.target.value);
  }, []);


  // const [nickname, setChangeNickname] = useState('');
  // const onChangeNickname = useCallback((e) => {
  //   setChangeNickname(e.target.value);

  // },[])
  const [password, setChangePassword] = useState('');   // userInput  줄이기
  const [passwordError, setPasswordError] = useState(false);
  //const [passwordRegError, setPasswordRegError] = useState(false);
  const onChangePassword = useCallback((e) => {
    const passRegex = /^[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,12}$/;
    const pass = e.target.value;
    console.log('changePassword', e.target.value);
    // if(!passRegex.test(password)){
    //   setChangePassword(true);
    // }
    setChangePassword(e.target.value);
  }, [password]);
  const [passwordRe, setChangePasswordRe] = useState('');
  const [passwordReError, setPasswordReError] = useState(false);
  const onChangePasswordRe = useCallback((e) => {
    console.log('changePasswordRe', e.target.value);
    setChangePasswordRe(e.target.value);
  }, []);

  // const [check, setCheck] = useState('');
  // const [checkError, setCheckError] = useState(false);
  // const onChangeCheck = useCallback((e) => {   //console.log(e.target.checked);
  //   setCheck(e.target.checked);     // true
  //   setCheckError(false);
  // } , []);
  function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
  }
  const [time, setTime] = useState();
  const [minute, setMinute] = useState();
  const [seconds, setSeconds] = useState();
  const [timerFlag, setTimerFlag] = useState(false);
  const [errTimeout, setErrTimeout] = useState(false);
  const [authenticationNum, setAuthenticationNum] = useState();
  const [isDisabled, setIsDisabled] = useState(true);
  //const [isStopTimer, setIsStopTimer] = useState(false);
  const isStopTimer = useRef(false);
  const [isdupTimer, setIsdupTimer] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  let stopTimer = false;
  // const timer = async () => {
  //   let initMinute = 1;
  //   let seconds = 10;
  //   for(let minute = initMinute-1; minute >= 0; minute--){
  //       for(seconds; seconds >= 0; seconds--){
  //         if(isStopTimer.current) return;
  //         await sleep(1);
  //         setMinute(minute)
  //         setSeconds((String(seconds).length<2 ? '0'+seconds:seconds))
  //         setTimerFlag(true);
  //         //console.log('time=',minute+':'+(String(seconds).length<2 ? '0'+seconds:seconds));
  //       }
  //       seconds = 59;
  //       if(minute == 0){
  //         setErrTimeout(true);
  //         setIsdupTimer(false);
  //         //setIsStopTimer(false);
  //         isStopTimer.current = false;
  //         setIsDisabled(true);
  //         setBtnDisabled()
  //         console.log('에러');
  //       }
  //     }
  //   };
  const timerInterval = useRef(null);  // 새 ref 추가

  const timer = () => {
    let totalSeconds = 60; // 예시: 1분
    setTimerFlag(true);
    setErrTimeout(false);

    timerInterval.current = setInterval(() => {
      if (totalSeconds <= 0 || isStopTimer.current) {
        clearInterval(timerInterval.current);
        if (totalSeconds <= 0) {
          setErrTimeout(true);
          setIsDisabled(true);
          setIsdupTimer(false);
        }
        return;
      }

      const minute = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      setMinute(minute);
      setSeconds(seconds < 10 ? `0${seconds}` : `${seconds}`);
      totalSeconds--;
    }, 1000);
  };
  const btnSendAuthenticationNumber = useCallback(async () => {
    if (phoneNum === null || String(phoneNum).length != 11) {
      console.log('오류');
      alert('휴대폰번호를 확인해주세요');
      return;
    }
    setIsDisabled(false);

    const response = await axios.post(`http://localhost:8080/api/sms/send/${phoneNum}`, {}, {
      withCredentials: true,
    });
    // const response = await axios.post(`http://localhost:3065/user/sms/${phoneNum}`,{},{
    //   withCredentials: true,
    // });

    //const {num} = response.data;
    console.log('response=', response.data.code);
    setAuthenticationNum(response.data.code);
    //setStopTimer(prev => !prev);
    if (isdupTimer) { return; }
    //setStopTimer(true); 
    setIsdupTimer(true);
    timer();

    //setTime(setTimeout( ),10000);
  }, [phoneNum, minute, seconds, authenticationNum])

  const [authenNum, setChangeAuthenNum] = useState('');
  const [authenNumError, setAuthenNumError] = useState(false);
  const onChangeAuthenNum = useCallback((e) => {
    console.log('인증번호=', authenticationNum);
    console.log('authenNum=', authenNum);

    setChangeAuthenNum(e.target.value);
  }, [authenNum]);

  const [errAuthenNum, setErrAuthenNum] = useState(false);
  const btnAuthenticationChk = useCallback(() => {
    console.log('클릭인증번호', typeof authenticationNum);
    console.log('클릭', typeof Number(authenNum));
    setErrTimeout(false);
    //인증번호가 같지 않으면
    if (Number(authenticationNum) !== Number(authenNum)) {
      setErrAuthenNum(true);
      return;
    } else {//같다면
      alert('인증되었습니다.');
      setIsDisabled(true);
      setErrTimeout(false);
      setErrAuthenNum(false);
      //setIsStopTimer(true);
      isStopTimer.current = true;
      clearInterval(timerInterval.current);
    }

  })
  const [zonecode, setZonecode] = useState('');
  const onChangeZonecode = useCallback((e) => {
    setZonecode(e.target.value);
  }, [])
  const [roadAddress, setRoadAddress] = useState('');
  const onChangeRoadAddress = useCallback((e) => {
    setRoadAddress(e.target.value);
  }, [])
  const [jibunAddress, setJibunAddress] = useState('');
  const onChangeJibunAddress = useCallback((e) => {
    setJibunAddress(e.target.value);
  }, [])

  const [namujiAddress, setNamujiAddress] = useState('');
  const onChangeNamujiAddress = useCallback((e) => {
    setNamujiAddress(e.target.value);
  },[])
  const open = useDaumPostcodePopup();
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';

      setZonecode(data.zonecode);  // 우편번호
      setRoadAddress(fullAddress); // 도로명 주소
      setJibunAddress(data.jibunAddress); // 지번주소
    }
  };

  const handleClick = () => {
    open(
      { onComplete: handleComplete },
    );
  };
  const onClickBack = () => {
    return Router.back();
  }
  const onSubmitForm = useCallback(async () => {
    setPhoneNumLenError(false);
    setPhoneNumRegError(false);
    setPasswordError(false);
    setPasswordReError(false);
    const passRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,12}$/;
    //const pass = e.target.value;
    const invalidRegex = /[0-9]+/g;
    const invalidStrRegex = /[^0-9]+/g;
    console.log('password', password);
    console.log('passwordRe', passwordRe);
    if (!(phoneNum.length >= 0 && phoneNum.length <= 11)) {
      setPhoneNumLenError(true);
      return;
    }

    ///const cleanNumber = number.replace(invalidRegex,'');
    //일단 전화번호를 11자리 받으면 검사하기
    if (invalidStrRegex.test(phoneNum)) {
      setPhoneNumRegError(true);
      return;
    }
    if (!passRegex.test(password)) {
      setPasswordError(true);
      return;
    }
    if (password !== passwordRe) { return setPasswordReError(true); }
    console.log('zonecode=', zonecode);
    const response = await axios.post('http://localhost:8080/api/auth/join', {
      "username": username,
      "phoneNum": phoneNum,
      "email": email,
      "nickname": nickname,
      "password": password,
      "zonecode": zonecode,
      "roadAddress": roadAddress,
      "namujiAddress": namujiAddress,
      "provider": ""
    }, { withCredentials: true })
    alert(response.data);

    Router.push('/member/login');
    // return dispatch({
    //   type: SIGN_UP_REQUEST, 
    //   data:{ username, phoneNum, email, password, nickname  }
    // }); 
    // 5. dispatch ###
  }, [username, phoneNum, email, password, passwordRe, nickname,zonecode,roadAddress,namujiAddress]);
  const [nextNum, setNextNum] = useState(0);
  let index = 0;
  // const onRecommendNickname = () => {
    
  // }
  return (
    <div >
      <Head>
        <meta charSet="utf-8" />
        <title> Signup | TheJoa </title>
      </Head>
      {/* <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100%", }}> */}
      <div >
        {/* <div style={{ width: '100%', maxWidth: "100%", margin: '0 auto' }}> */}
        <div style={{ border: '0px solid red', width: '500px', height: '800px', margin: '40px' }} >
          <div
            style={{ cursor: 'pointer', marginBottom: '20px', marginTop: '0px' }}
            onClick={() => Router.push('/')}
          >
            <img src={'/image/logo/TripPaw-logo.png'} alt="로고" width={'300px'} onClick={() => Router.push("/")} />
          </div>
          {/* <Form layout='vertical' style={{ width: '100%', padding: '20px', boxSizing: 'border-box', }} onFinish={onSubmitForm}  > */}
          <Form layout='vertical' style={{ padding: '10px', boxSizing: 'border-box', border: '0px solid black' }} onFinish={onSubmitForm}  >
            {/* <Form  layout='vertical'  style={{ margin:'2%' }}  > */}
            <Form.Item>
              <label htmlFor='email'></label>
              <UnderlineInput placeholder='이메일' id='email'
                value={email} onChange={onChangeEmail} name='email' required />
            </Form.Item>
            <Form.Item>
              <label htmlFor='username'></label>
              <UnderlineInput placeholder='이름' id='username'
                value={username} onChange={onChangeUsername} name='username' required />
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'flex' }}>
              <label htmlFor='nickname'></label>
              {/* <UnderlineInput placeholder='닉네임' id='nickname'
                value={nickname} onChange={onChangeNickname} name='nickname' required /> */}
              {/* <UnderlineInput placeholder='닉네임' id='nickname'
                value={nickname} onChange={onRecommendNickname} name='nickname' required /> */}
                 <UnderlineInput placeholder='닉네임 추천' id='nickname'
                  value={nickname}  name='nickname' readOnly />
                <Button onClick={onRecommendNickname} style={{ backgroundColor: 'black', color: 'white' }}>닉네임추천</Button>
              </div>
            </Form.Item>
            <Form.Item>
              <label htmlFor='password'></label>
              <UnderlineInput type="password" placeholder='비밀번호입력(최소 8~12자리 특수문자포함하여 작성)' id='password'
                value={password} onChange={onChangePassword} name='password' required />
              {passwordError && <ErrorMessage>비밀번호를 확인해주세요.(최소 8~12자리 특수문자포함) </ErrorMessage>}
            </Form.Item>
            <Form.Item>
              <label htmlFor='password-re'></label>
              <UnderlineInput type="password" placeholder='비밀번호입력 체크' id='password-re'
                value={passwordRe} onChange={onChangePasswordRe} name='passwordRe' required />
              {passwordReError && <ErrorMessage>비밀번호를 확인해주세요. </ErrorMessage>}
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'flex' }}>
                <label htmlFor='phone'></label>
                <UnderlineInput placeholder='휴대폰' id='phone'
                  value={phoneNum} onChange={onChangePhoneNum} name='phone' required />
                <Button onClick={btnSendAuthenticationNumber} style={{ backgroundColor: 'black', color: 'white' }}>인증번호 전송</Button>
              </div>
              {phoneNumRegError && <ErrorMessage>휴대전화번호: 휴대전화번호가 정확한지 확인해 주세요.</ErrorMessage>}
              {phoneNumLenError && <ErrorMessage>휴대전화번호: 11자리까지 입력가능합니다.</ErrorMessage>}
            </Form.Item>
            <Form.Item>
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label htmlFor='authenNum'></label>
                  {/* <UnderlineInput placeholder='인증번호' id='authenNum'
                    alue={authenNum} onChange={onChangeAuthenNum}  name='authenNum' required/> */}
                  <UnderlineInput placeholder='인증번호' id='authenNum'
                    value={authenNum} onChange={onChangeAuthenNum} name='authenNum' required disabled={isDisabled} />
                  <Button onClick={btnAuthenticationChk} style={{ backgroundColor: 'black', color: 'white' }}>확인</Button>
                  {timerFlag && (<span style={{
                    position: 'absolute',
                    right: '70px',
                    top: errTimeout ? '31%' : '50%',
                    transform: 'translateY(-50%)',
                    color: '#aaa',
                    fontSize: '12px'
                  }}>
                    {minute}:{seconds}
                  </span>)}
                </div>
                <div style={{ display: "block" }}>
                  {errTimeout && (<ErrorMessage style={{ marginTop: '4px' }}> 10초 안에 입력해주세요.</ErrorMessage>)}
                  {errAuthenNum && (<ErrorMessage style={{ marginTop: '4px' }}>인증번호를 다시 입력하세요!</ErrorMessage>)}
                </div>
              </div>
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'flex' }}>
                <label htmlFor='phone'></label>
                <UnderlineInput placeholder='' id='zonecode'
                  value={zonecode} onChange={onChangeZonecode} name='zonecode' readOnly />
                <Button onClick={handleClick} style={{ backgroundColor: 'black', color: 'white' }}>우편번호 찾기</Button>
              </div>
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'flex' }}>
                <label htmlFor='phone'></label>
                <UnderlineInput placeholder='' id='roadAddress'
                  value={roadAddress} onChange={onChangeRoadAddress} name='roadAddress' readOnly />
              </div>
            </Form.Item>
            {/* <Form.Item>
            <div style={{display:'flex'}}>
                <label htmlFor='phone'></label>
                <UnderlineInput placeholder='' id='zonecode'
                    value={jibunAddress} onChange={onChangeJibunAddress}    name='jibunAddress' readOnly />
              </div>
          </Form.Item> */}
            <Form.Item>
              <div style={{ display: 'flex' }}>
                <label htmlFor='phone'></label>
                <UnderlineInput placeholder='' id='namujiAddress'
                  value={namujiAddress} onChange={onChangeNamujiAddress} name='namujiAddress' />
              </div>
            </Form.Item>
            <Form.Item>
              {/* <Space style={{ width: '100%', height: '30px', border: '2px solid blue' }}> */}
              <Button htmlType="submit" style={{ width: '100%', height: '40px', backgroundColor: 'black', color: 'white', borderRadius: '10px' }}>
                회원가입
              </Button>
              {/* <Button htmlType="button" onClick={onClickBack} style={{ width: '100%' }}>
                  돌아가기
                </Button> */}
              {/* </Space> */}
            </Form.Item>
            {/* 
            <Form.Item>
              <div style={{ display: 'flex' }}>
               <DaumPostcode
               className="postmodal"
                autoClose
                onComplete={complete} /> 
              </div>
            </Form.Item> 
            */}
            <Form.Item>
              <SocialLogin>
                <SocialIcons>
                  <SocialIcon><img src={googleIconPath} alt="구글" /></SocialIcon>
                  {/* <SocialIcon href={`https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`}><img src={kakaoIconPath} alt="카카오" /></SocialIcon> */}
                  <SocialIcon href={`http://localhost:8080/oauth2/authorization/kakao`}><img src={kakaoIconPath} alt="카카오" /></SocialIcon>
                  <SocialIcon><img src={naverIconPath} alt="네이버" /></SocialIcon>
                </SocialIcons>
              </SocialLogin>
            </Form.Item>
          </Form>

        </div>
      </div>
    </div>
  );
}

export default SignForm;