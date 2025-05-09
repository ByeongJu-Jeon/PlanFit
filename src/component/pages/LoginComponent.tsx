import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import style from "../less/LoginComponent.module.less";
import axios from "axios";

interface LoginComponentProps {
  onBack: () => void; // 뒤로가기 또는 초기 화면 복귀 용
}

const LoginComponent: React.FC<LoginComponentProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const loginClick = async () => {
    console.log("로그인 요청 데이터:", {
      loginId,
      password,
    });
    try {
      const response = await axios.post(
        "http://54.180.239.50:8080/authorization/planfit/signIn",
        {
          loginId,
          password,
        },
        {
          headers: { "Content-Type": "application/json;charset=utf-8" },
        }
      );

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      console.log("로그인 성공");
      navigate("/MainPage");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("로그인 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
      } else {
        console.log("로그인 실패: 알 수 없는 오류");
      }
    }
  };
  return (
    <div className={style.loginContainer}>
      <h2 className={style.title}>로그인</h2>
      <form className={style.form}>
        <input type="text" placeholder="아이디" className={style.input} onChange={(e) => setLoginId(e.target.value)} />
        <input
          type="password"
          placeholder="비밀번호"
          className={style.input}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" className={style.button} onClick={loginClick}>
          로그인
        </button>
      </form>
      <div className={style.footer}>
        <span>회원이 아니신가요?</span>
        <button onClick={onBack} className={style.link}>
          뒤로가기
        </button>
      </div>
    </div>
  );
};

export default LoginComponent;
