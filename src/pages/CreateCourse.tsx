import { useState } from "react";
import style from "../less/CreateCourse.module.less";
import Search from "../component/pages/Search";
import { useNavigate } from "react-router-dom";
import MyPage from "../component/pages/MyPage";

interface Place {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  category: "음식점" | "카페" | "놀거리" | "명소";
}

export default function CreateCourse() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [showMyPage, setShowMyPage] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState(""); // "HH:MM" 형태
  const [content, setContent] = useState("");

  const handleShowModal = () => {
    setShowMyPage(true);
  };

  const handleCloseModal = () => {
    setShowMyPage(false);
  };

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
  };

  const handleAddPlace = (place: Place) => {
    if (!selectedPlaces.find((p) => p.id === place.id)) {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  const handleDeletePlace = (id: string) => {
    if (window.confirm("정말 이 장소를 삭제하시겠습니까?")) {
      setSelectedPlaces(selectedPlaces.filter((place) => place.id !== id));
    }
  };

  const handleSave = async () => {
    const [hour, minute] = startTime.split(":").map(Number);

    const requestDto = {
      title,
      date,
      startTime: {
        hour,
        minute,
        second: 0,
        nano: 0,
      },
      content,
      course: {
        location: selectedPlaces.length > 0 ? selectedPlaces[0].address : "",
        spaces: selectedPlaces.map((place) => ({
          googlePlacesIdentifier: place.id,
        })),
      },
    };

    try {
      const token = localStorage.getItem("accessToken"); // 또는 쿠키 등

      const response = await fetch("http://54.180.239.50:8080/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "", // 토큰이 있다면 붙이기
        },
        body: JSON.stringify(requestDto),
      });

      if (response.ok) {
        alert("일정이 성공적으로 저장되었습니다!");
        navigate("/MainPage");
      } else {
        console.log("보내는 데이터:", JSON.stringify(requestDto, null, 2));
        alert("일정 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("저장 오류:", error);
      alert("서버 연결 오류가 발생했습니다.");
    }
  };

  return (
    <div className={style.container}>
      <div className={style.function}>
        <div className={style.header} onClick={() => navigate("/MainPage")}>
          PlanFit
        </div>
        <div className={style.body}>
          <div onClick={() => navigate("/Post")}>포스트</div>
          <div onClick={() => navigate("/Course")}>코스</div>
          <div onClick={() => navigate("/Like")}>좋아요</div>
          <div onClick={handleShowModal}>마이페이지</div>
        </div>
      </div>

      <div className={style.section}>
        <div className={style.title}>
          코스 제작<div onClick={handleSave}>저장하기</div>
        </div>
        <div className={style.info}>
          <div className={style.formSection}>
            <h2>코스 정보를 입력하세요.</h2>
            <form className={style.form}>
              <label>
                제목:
                <input
                  type="text"
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label>
                코스 일자:
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <label>
                시작 시간:
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </label>
              <label>
                메모:
                <textarea
                  placeholder="메모를 입력하세요 (최대 500자)"
                  maxLength={500}
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </label>
            </form>
          </div>

          <div className={style.place}>
            <h2>장소를 선택하세요.</h2>
            <div className={style.buttons} onClick={handleSearchClick}>
              클릭
            </div>
            <div className={style.result}>
              {selectedPlaces.map((place) => (
                <div key={place.id} className={style.card}>
                  <img src={place.imageUrl} alt={place.name} />
                  <div className={style.info}>
                    <h3>{place.name}</h3>
                    <p>{place.address}</p>
                  </div>
                  <div className={style.delete} onClick={() => handleDeletePlace(place.id)}>
                    X
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showSearch && <Search onClose={handleCloseSearch} onAdd={handleAddPlace} />}
      {showMyPage && (
        <>
          <div className={style.overlay} onClick={handleCloseModal}></div>
          <MyPage onClose={handleCloseModal} />
        </>
      )}
    </div>
  );
}
