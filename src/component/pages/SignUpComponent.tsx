import React from "react";
import style from "../less/SignUpComponent.module.less";

interface SignUpComponentProps {
  onBack: () => void;
}

const SignUpComponent: React.FC<SignUpComponentProps> = ({ onBack }) => {
  return (
    <div className={style.signUpContainer}>
      <h2 className={style.title}>회원가입</h2>
      <form className={style.form}>
        <input type="text" placeholder="이름" className={style.input} />
        <input type="email" placeholder="이메일" className={style.input} />
        <input type="text" placeholder="아이디" className={style.input} />
        <input type="password" placeholder="비밀번호" className={style.input} />
        <button type="submit" className={style.button}>
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
