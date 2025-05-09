import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import style from "../less/SignUpComponent.module.less";

interface SignUpComponentProps {
  onBack: () => void;
}

const SignUpComponent: React.FC<SignUpComponentProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthOfDate, setBirthOfDate] = useState("");
  const [identity, setIdentity] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [photoType, setPhotoType] = useState("ENCODED_BINARY");

  const checkIdAvailability = async (id: string) => {
    if (!id) {
      return;
    }
    try {
      const response = await axios.get(`http://54.180.239.50:8080/authorization/duplication/${id}`);
      if (response.status === 200) {
        alert("아이디 사용 가능");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          // 중복일 경우
          alert("아이디 사용 불가");
        } else {
          alert("아이디 중복 체크 실패");
        }
      } else {
        alert("아이디 중복 체크 실패");
      }
    }
  };

  const signUpClick = async () => {
    console.log("회원가입 요청 데이터:", {
      name,
      loginId,
      password,
      email,
      phoneNumber,
      birthOfDate,
      identity,
      profilePhoto: profilePhoto || undefined,
      photoType: profilePhoto ? photoType : undefined,
    });
    try {
      const response = await axios.post(
        "http://54.180.239.50:8080/authorization/planfit",
        {
          name,
          loginId,
          password,
          email,
          phoneNumber,
          birthOfDate,
          identity,
          profilePhoto: profilePhoto || undefined,
          photoType: profilePhoto ? photoType : undefined,
        },
        {
          headers: { "Content-Type": "application/json;charset=utf-8" },
        }
      );

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      console.log("회원가입 성공");
      navigate("/WelcomePage");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("회원가입 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
      } else {
        console.log("회원가입 실패: 알 수 없는 오류");
      }
    }
  };
  return (
    <div className={style.signUpContainer}>
      <h2 className={style.title}>회원가입</h2>
      <form className={style.form}>
        <input
          type="text"
          value={name}
          placeholder="이름"
          onChange={(e) => {
            setName(e.target.value);
          }}
          className={style.input}
        />
        <input
          type="email"
          value={email}
          placeholder="이메일"
          onChange={(e) => setEmail(e.target.value)}
          className={style.input}
        />
        <input
          type="text"
          value={loginId}
          placeholder="아이디"
          onChange={(e) => {
            setLoginId(e.target.value);
            checkIdAvailability(e.target.value);
          }}
          className={style.input}
        />
        <input
          type="password"
          value={password}
          placeholder="비밀번호"
          onChange={(e) => setPassword(e.target.value)}
          className={style.input}
        />
        <input
          type="text"
          value={phoneNumber}
          placeholder="전화번호"
          onChange={(e) => setPhoneNumber(e.target.value)}
          className={style.input}
        />
        <input
          type="date"
          value={birthOfDate}
          placeholder="생년월일"
          onChange={(e) => setBirthOfDate(e.target.value)}
          className={style.input}
        />
        <input
          type="text"
          value={identity}
          placeholder="신분"
          onChange={(e) => setIdentity(e.target.value)}
          className={style.input}
        />
        <input type="file" className={style.input} accept="image/*" onChange={(e) => setProfilePhoto(e.target.value)} />
        <button type="button" className={style.button} onClick={signUpClick}>
          가입하기
        </button>
      </form>
      <div className={style.footer}>
        <span>이미 계정이 있으신가요?</span>
        <button onClick={onBack} className={style.link}>
          뒤로가기
        </button>
      </div>
    </div>
  );
};

export default SignUpComponent;
