import style from "../less/Course.module.less";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import MyPage from "../component/pages/MyPage";

interface Schedule {
  title: string;
  date: string;
  startTime: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  location: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // latitude, longitude는 서버에서 응답으로 포함됨
}

export default function Course() {
  const navigate = useNavigate();
  const [showMyPage, setShowMyPage] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [, setMap] = useState<kakao.maps.Map | null>(null);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  const handleShowModal = () => setShowMyPage(true);
  const handleCloseModal = () => setShowMyPage(false);

  useEffect(() => {
    const checkKakaoLoaded = () => {
      if (window.kakao && window.kakao.maps) {
        setIsKakaoLoaded(true);
      } else {
        setTimeout(checkKakaoLoaded, 100);
      }
    };
    checkKakaoLoaded();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch("http://54.180.239.50:8080/schedule/upcoming");
        const data = await response.json();
        if (data.length > 0) {
          setSchedules(data);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error("일정 불러오기 실패:", error);
      }
    };
    fetchSchedules();
  }, []);

  useEffect(() => {
    if (!isKakaoLoaded || !mapRef.current || schedules.length === 0) return;

    const currentSchedule = schedules[currentIndex];
    if (!currentSchedule.latitude || !currentSchedule.longitude) return;

    const mapInstance = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(currentSchedule.latitude, currentSchedule.longitude),
      level: 3,
    });

    new window.kakao.maps.Marker({
      map: mapInstance,
      position: new window.kakao.maps.LatLng(currentSchedule.latitude, currentSchedule.longitude),
    });

    setMap(mapInstance);
  }, [isKakaoLoaded, currentIndex, schedules]);

  return (
    <div className={style.container}>
      <div className={style.function}>
        <div className={style.header} onClick={() => navigate("/MainPage")}>
          PlanFit
        </div>
        <div className={style.body}>
          <div onClick={() => navigate("/Post")}>포스트</div>
          <div>코스</div>
          <div onClick={() => navigate("/Like")}>좋아요</div>
          <div onClick={handleShowModal}>마이페이지</div>
        </div>
      </div>

      <div className={style.section}>
        <header className={style.header}>
          <div className={style.actionGroup}>
            <button
              className={style.actionBtn}
              onClick={() => {
                const selected = schedules[currentIndex];
                if (selected && selected.id) {
                  navigate(`/EditCourse/${selected.id}`);
                } else {
                  alert("수정할 코스를 찾을 수 없습니다.");
                }
              }}
            >
              수정하기
            </button>
            <button className={style.actionBtn}>삭제하기</button>
          </div>
          <h1 className={style.courseTitle}>나의 코스</h1>
          <button className={style.actionBtn}>포스팅하기</button>
        </header>

        <div className={style.dateSelector}>
          <button onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))} disabled={currentIndex === 0}>
            ◀
          </button>
          <span>
            {schedules.length > 0
              ? format(new Date(schedules[currentIndex].date), "yyyy-MM-dd")
              : format(new Date(), "yyyy-MM-dd")}
          </span>
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, schedules.length - 1))}
            disabled={currentIndex >= schedules.length - 1}
          >
            ▶
          </button>
        </div>

        <div className={style.mainContent}>
          {schedules.length === 0 ? (
            <div className={style.emptyMessage}>제작된 코스가 없습니다. 코스를 만들어보세요!</div>
          ) : (
            <>
              <div ref={mapRef} className={style.mapBox}></div>
              <div className={style.memoBox}>
                <p>{schedules[currentIndex].title}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {showMyPage && (
        <>
          <div className={style.overlay} onClick={handleCloseModal}></div>
          <MyPage onClose={handleCloseModal} />
        </>
      )}
    </div>
  );
}
