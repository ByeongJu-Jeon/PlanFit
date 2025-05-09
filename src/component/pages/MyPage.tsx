import style from "../less/MyPage.module.less";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { BsListCheck } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { BiInfoCircle } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { RiFileList3Line } from "react-icons/ri";

import defaultProfile from "../pages/img/profile.jpg";

interface MyPageProps {
  onClose: () => void;
}

// 사용자 정보 타입 정의
interface UserInfo {
  name: string;
  email: string;
  phoneNumber: string;
  birthOfDate: string;
  identity: string;
  password: string;
  profilePhoto: string | null;
}

export default function MyPage({ onClose }: MyPageProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // 컴포넌트 마운트 시 사용자 정보 가져오기
  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // 저장된 토큰 사용

    if (!token) {
      console.error("JWT 토큰이 없습니다. 로그인 후 다시 시도하세요.");
      return;
    }

    axios
      .get("http://54.180.239.50:8080/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          alert("사용자 정보를 불러오는 중 오류가 발생했습니다.");
        }
        console.error("유저 정보 불러오기 실패:", error);
      });
  }, []);

  return (
    <div className={style.modalBackground} onClick={onClose}>
      <div className={style.modal} onClick={(e) => e.stopPropagation()}>
        <div className={style.container}>
          {/* Profile Section */}
          <div className={style.profileSection}>
            <div className={style.profileImg}>
              {/* 프로필 이미지 조건부 렌더링 */}
              <img
                src={userInfo?.profilePhoto || defaultProfile}
                alt="프로필 이미지"
                className={style.avatarPlaceholder}
              />
            </div>
            <div className={style.profileInfo}>
              <h2 className={style.userName}>{userInfo?.name || "사용자 이름"}</h2>
            </div>
          </div>

          {/* User Stats */}
          <div className={style.statsSection}>
            <div className={style.statItem}>
              <p className={style.statLabel}>계정 생성일</p>
              <p className={style.statValue}>2025-01-01</p>
            </div>
            <div className={style.statItem}>
              <p className={style.statLabel}>제작한 나의 코스</p>
              <p className={style.statValue}>0개</p>
            </div>
            <div className={style.statItem}>
              <p className={style.statLabel}>나의 포스팅</p>
              <p className={style.statValue}>0개</p>
            </div>
          </div>

          {/* Menu Icons - First Row */}
          <div className={style.menuGrid}>
            <div className={style.menuItem}>
              <div className={style.iconWrapper} style={{ backgroundColor: "#f8a5a5" }}>
                <BsListCheck size={24} color="white" />
              </div>
              <p>내가 만든 코스</p>
            </div>
            <div className={style.menuItem}>
              <div className={style.iconWrapper} style={{ backgroundColor: "#5db2e9" }}>
                <FaRegCommentDots size={24} color="white" />
              </div>
              <p>내가 올린 포스트</p>
            </div>
            <div className={style.menuItem}>
              <div className={style.iconWrapper} style={{ backgroundColor: "#80c57b" }}>
                <RiFileList3Line size={24} color="white" />
              </div>
              <p>리뷰 관리</p>
            </div>
          </div>

          {/* Menu Icons - Second Row */}
          <div className={style.menuGrid}>
            <div className={style.menuItem}>
              <div className={style.iconWrapper} style={{ backgroundColor: "#f4c15a" }}>
                <FiEdit size={24} color="white" />
              </div>
              <p>정보 수정</p>
            </div>
            <div className={style.menuItem}>
              <div className={style.iconWrapper} style={{ backgroundColor: "#5ad7d1" }}>
                <MdLogout size={24} color="white" />
              </div>
              <p>로그아웃</p>
            </div>
            <div className={style.menuItem}>
              <div className={style.iconWrapper} style={{ backgroundColor: "#a2c0e5" }}>
                <BiInfoCircle size={24} color="white" />
              </div>
              <p>계정 탈퇴</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
