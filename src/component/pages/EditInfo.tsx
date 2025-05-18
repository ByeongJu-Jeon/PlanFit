import style from "../less/EditInfo.module.less";
import { useState } from "react";
import axios from "axios";

interface EditInfoProps {
  onClose: () => void;
}

export default function EditInfo({ onClose }: EditInfoProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    birthOfDate: "",
    identity: "STUDENT",
    password: "",
    profilePhoto: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch("http://54.180.239.50:8080/user", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("정보가 성공적으로 수정되었습니다.");
      onClose();
    } catch (error) {
      console.error("정보 수정 실패", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  return (
    <div className={style.modalBackground}>
      <div className={style.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={style.title}>회원 정보 수정</h2>

        <div className={style.form}>
          <label>
            이름
            <input type="text" name="name" value={form.name} onChange={handleChange} />
          </label>
          <label>
            이메일
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </label>
          <label>
            전화번호
            <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
          </label>
          <label>
            생년월일
            <input type="date" name="birthOfDate" value={form.birthOfDate} onChange={handleChange} />
          </label>
          <label>
            신분
            <select name="identity" value={form.identity} onChange={handleChange}>
              <option value="STUDENT">학생</option>
              <option value="TEACHER">교사</option>
              <option value="OTHER">기타</option>
            </select>
          </label>
          <label>
            비밀번호
            <input type="password" name="password" value={form.password} onChange={handleChange} />
          </label>
          <label>
            프로필 이미지 URL
            <input type="text" name="profilePhoto" value={form.profilePhoto} onChange={handleChange} />
          </label>
        </div>

        <div className={style.buttonGroup}>
          <button className={style.submit} onClick={handleSubmit}>
            저장
          </button>
          <button className={style.cancel} onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
