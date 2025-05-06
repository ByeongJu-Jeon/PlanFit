import style from "../less/Course.module.less";
import { useEffect, useRef, useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import MyPage from "../component/pages/MyPage";

interface Place {
  id: number;
  name: string;
  address: string;
  imageUrl: string;
  visited: boolean;
}

export default function Course() {
  const navigate = useNavigate();
  const [showMyPage, setShowMyPage] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [, setMap] = useState<kakao.maps.Map | null>(null);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [places, setPlaces] = useState<Place[]>([
    {
      id: 1,
      name: "성수 연무장길",
      address: "서울 성동구 연무장길 47",
      imageUrl: "https://via.placeholder.com/80",
      visited: false,
    },
    {
      id: 2,
      name: "한강공원",
      address: "서울 영등포구 여의도동",
      imageUrl: "https://via.placeholder.com/80",
      visited: false,
    },
  ]);

  const toggleVisited = (id: number) => {
    setPlaces((prev) => prev.map((place) => (place.id === id ? { ...place, visited: !place.visited } : place)));
  };

  const handleShowModal = () => {
    setShowMyPage(true);
  };

  const handleCloseModal = () => {
    setShowMyPage(false);
  };

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
    if (!isKakaoLoaded || !mapRef.current) return;

    const mapInstance = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 시청 좌표
      level: 3,
    });

    setMap(mapInstance);
  }, [isKakaoLoaded]);

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
        {/* 상단 바 */}
        <header className={style.header}>
          <button className={style.actionBtn}>수정하기</button>
          <h1 className={style.courseTitle}>나의 코스</h1>
          <button className={style.actionBtn}>포스팅하기</button>
        </header>

        {/* 날짜 네비게이션 */}
        <div className={style.dateSelector}>
          <button onClick={() => setSelectedDate(subDays(selectedDate, 1))}>◀</button>
          <span>{format(selectedDate, "yyyy-MM-dd")}</span>
          <button onClick={() => setSelectedDate(addDays(selectedDate, 1))}>▶</button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className={style.mainContent}>
          {/* 좌측: Kakao Map */}
          {/* 왼쪽: 지도 + 메모 */}
          <div className={style.leftPanel}>
            <div ref={mapRef} className={style.mapBox} />
            <div className={style.memoBox}></div>
          </div>

          {/* 우측: 장소 리스트 */}
          <div className={style.placeList}>
            {places.map((place) => (
              <div key={place.id} className={style.placeItem}>
                <img src={place.imageUrl} alt={place.name} />
                <div className={style.placeText}>
                  <div className={style.placeName}>{place.name}</div>
                  <div className={style.placeAddress}>{place.address}</div>
                </div>
                <button
                  className={`${style.circleButton} ${place.visited ? style.visited : ""}`}
                  onClick={() => toggleVisited(place.id)}
                >
                  {place.visited ? "✔" : "○"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 모달이 열리면 MyPage 컴포넌트를 모달로 표시 */}
      {showMyPage && (
        <>
          <div className={style.overlay} onClick={handleCloseModal}></div>
          <MyPage onClose={handleCloseModal} />
        </>
      )}
    </div>
  );
}
