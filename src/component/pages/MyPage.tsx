import style from "../less/MyPage.module.less";

import { FiEdit } from "react-icons/fi";
import { BsListCheck } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { BiInfoCircle } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { RiFileList3Line } from "react-icons/ri";

interface MyPageProps {
  onClose: () => void;
}

export default function MyPage({ onClose }: MyPageProps) {
  return (
    <div className={style.modalBackground} onClick={onClose}>
      <div className={style.modal} onClick={(e) => e.stopPropagation()}>
        <div className={style.container}>
          {/* Profile Section */}
          <div className={style.profileSection}>
            <div className={style.profileImg}>
              {/* Default profile image */}
              <div className={style.avatarPlaceholder}></div>
            </div>
            <div className={style.profileInfo}>
              <h2 className={style.userName}>사용자 이름</h2>
              <p className={style.userIntro}>사용자 한줄소개</p>
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
