import { useEffect, useState } from "react";
import style from "../less/EditCourse.module.less";
import Search from "../component/pages/Search";
import { useNavigate, useParams } from "react-router-dom";
import MyPage from "../component/pages/MyPage";

interface Place {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  category: "음식점" | "카페" | "놀거리" | "명소";
}

export default function EditCourse() {
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const [showSearch, setShowSearch] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [showMyPage, setShowMyPage] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`http://54.180.239.50:8080/schedule/${scheduleId}`);
        const data = await response.json();

        setTitle(data.title);
        setDate(data.date);
        setStartTime(
          `${data.startTime.hour.toString().padStart(2, "0")}:${data.startTime.minute.toString().padStart(2, "0")}`
        );
        setContent(data.content);
        setSelectedPlaces(
          data.course.spaces.map((s: any) => ({
            id: s.googlePlacesIdentifier,
            name: s.name,
            address: s.address,
            imageUrl: s.imageUrl,
            category: s.category,
          }))
        );
      } catch (err) {
        console.error("일정 불러오기 실패", err);
      }
    };

    if (scheduleId) fetchSchedule();
  }, [scheduleId]);

  const handleShowModal = () => setShowMyPage(true);
  const handleCloseModal = () => setShowMyPage(false);
  const handleSearchClick = () => setShowSearch(true);
  const handleCloseSearch = () => setShowSearch(false);

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

  const handleUpdate = async () => {
    if (!title || !date || !startTime || selectedPlaces.length === 0) {
      alert("모든 필드를 입력하고 장소를 선택해 주세요.");
      return;
    }

    const [hour, minute] = startTime.split(":").map(Number);

    const requestDto = {
      title,
      date,
      startTime: { hour, minute, second: 0, nano: 0 },
      content,
      course: {
        location: selectedPlaces.length > 0 ? selectedPlaces[0].address : "",
        spaces: selectedPlaces.map((place) => ({
          googlePlacesIdentifier: place.id,
        })),
      },
    };

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`http://54.180.239.50:8080/schedule/${scheduleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(requestDto),
      });

      if (response.ok) {
        alert("일정이 성공적으로 수정되었습니다!");
        navigate("/Course", { replace: true });
      } else {
        alert("일정 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("수정 오류:", error);
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
          코스 수정<div onClick={handleUpdate}>수정하기</div>
        </div>
        <div className={style.info}>
          <div className={style.formSection}>
            <h2>코스 정보를 수정하세요.</h2>
            <form className={style.form}>
              <label>
                제목:
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
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
                <textarea value={content} onChange={(e) => setContent(e.target.value)} maxLength={500} rows={5} />
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
                    <input
                      value={place.name}
                      onChange={(e) => {
                        const newPlaces = [...selectedPlaces];
                        newPlaces.find((p) => p.id === place.id)!.name = e.target.value;
                        setSelectedPlaces(newPlaces);
                      }}
                    />
                    <input
                      value={place.address}
                      onChange={(e) => {
                        const newPlaces = [...selectedPlaces];
                        newPlaces.find((p) => p.id === place.id)!.address = e.target.value;
                        setSelectedPlaces(newPlaces);
                      }}
                    />
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
