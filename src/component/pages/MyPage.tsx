import style from "../less/MyPage.module.less";
import { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { BsListCheck } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { BiInfoCircle } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { RiFileList3Line } from "react-icons/ri";
import EditInfo from "./EditInfo";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface MyPageProps {
  onClose: () => void;
}

export default function MyPage({ onClose }: MyPageProps) {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState("/img/profile.jpg"); // 기본 이미지
  const [createdDate, setCreatedDate] = useState("");
  const [myCourseCount, setMyCourseCount] = useState(0);
  const [myPostCount, setMyPostCount] = useState(0);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://54.180.239.50:8080/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data;
        setUserName(user.name);
        setProfileImage(user.profilePhoto || "public/profile.jpg");
        setCreatedDate(user.birthOfDate || "알 수 없음"); // 서버에서 가입일 필드명을 정확히 확인
        // setMyCourseCount(user.courseCount); // 예시
        // setMyPostCount(user.postCount); // 예시
      } catch (error) {
        console.error("회원 정보 조회 실패:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
    if (!confirmLogout) return;

    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete("http://54.180.239.50:8080/user/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

  const handleWithdraw = async () => {
    const confirmWithdraw = window.confirm("정말 계정을 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
    if (!confirmWithdraw) return;

    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete("http://54.180.239.50:8080/user/withdraw", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    } catch (error) {
      console.error("회원 탈퇴 실패", error);
    }
  };

  return (
    <div className={style.modalBackground} onClick={onClose}>
      <div className={style.modal} onClick={(e) => e.stopPropagation()}>
        <div className={style.container}>
          {showEditModal ? (
            <EditInfo onClose={() => setShowEditModal(false)} />
          ) : (
            <>
              {/* 프로필 영역 */}
              <div className={style.profileSection}>
                <div className={style.profileImg}>
                  <img
                    src={profileImage}
                    alt="프로필"
                    className={style.avatarPlaceholder}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/img/profile.jpg";
                    }}
                  />
                </div>
                <div className={style.profileInfo}>
                  <h2 className={style.userName}>{userName}</h2>
                  <p className={style.userIntro}>사용자 한줄소개</p>
                </div>
              </div>

              {/* 통계 정보 */}
              <div className={style.statsSection}>
                <div className={style.statItem}>
                  <p className={style.statLabel}>계정 생성일</p>
                  <p className={style.statValue}>{createdDate}</p>
                </div>
                <div className={style.statItem}>
                  <p className={style.statLabel}>제작한 나의 코스</p>
                  <p className={style.statValue}>{myCourseCount}개</p>
                </div>
                <div className={style.statItem}>
                  <p className={style.statLabel}>나의 포스팅</p>
                  <p className={style.statValue}>{myPostCount}개</p>
                </div>
              </div>

              {/* 메뉴 */}
              <div className={style.menuGrid}>
                <div className={style.menuItem} onClick={() => navigate("/Course")}>
                  <div className={style.iconWrapper} style={{ backgroundColor: "#f8a5a5" }}>
                    <BsListCheck size={24} color="white" />
                  </div>
                  <p>내가 만든 코스</p>
                </div>
                <div className={style.menuItem} onClick={() => navigate("/Post")}>
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

              <div className={style.menuGrid}>
                <div className={style.menuItem} onClick={() => setShowEditModal(true)}>
                  <div className={style.iconWrapper} style={{ backgroundColor: "#f4c15a" }}>
                    <FiEdit size={24} color="white" />
                  </div>
                  <p>정보 수정</p>
                </div>
                <div className={style.menuItem} onClick={handleLogout}>
                  <div className={style.iconWrapper} style={{ backgroundColor: "#5ad7d1" }}>
                    <MdLogout size={24} color="white" />
                  </div>
                  <p>로그아웃</p>
                </div>
                <div className={style.menuItem} onClick={handleWithdraw}>
                  <div className={style.iconWrapper} style={{ backgroundColor: "#a2c0e5" }}>
                    <BiInfoCircle size={24} color="white" />
                  </div>
                  <p>계정 탈퇴</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
