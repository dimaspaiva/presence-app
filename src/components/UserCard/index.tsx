import { useEffect, useRef, useState } from "react";
import { User } from "../../types/User";
import { AttendanceEnum } from "../../types/Attendance";

import "./styles.css";

export type UserProps = {
  user: User;
  applyUserAttendance: (id: string, userAttendance: AttendanceEnum) => void;
};

export function UserCard({ user, applyUserAttendance }: UserProps) {
  const [selectedAnimation, setSelectedAnimation] = useState<
    AttendanceEnum | ""
  >("");
  const cardRef = useRef<HTMLDivElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("#");
  const [isLoading, setIsLoading] = useState(false);
  const [fade, setFade] = useState(false);
  const [cardPosition, setCardPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [rotate, setRotate] = useState("0deg");

  function startCardMovement(event: TouchEvent) {
    const x = event.touches[0].clientX;
    const y = event.touches[0].clientY;

    event.target?.addEventListener(
      "touchmove",
      buildMoveCard({ x, y }) as EventListenerOrEventListenerObject
    ); // TODO Improve type
    event.target?.addEventListener(
      "touchend",
      buildResetCard({ x, y }) as EventListenerOrEventListenerObject
    ); // TODO Improve type
  }

  function buildMoveCard(initialPosition: { x: number; y: number }) {
    return (event: TouchEvent) => {
      event.preventDefault();
      const x = event.touches[0].clientX;
      const y = event.touches[0].clientY;

      const newX = x - initialPosition.x;
      const newY = y - initialPosition.y;

      if (newX > 0) {
        setRotate(`${Math.min(newX * 0.1, 45)}deg`);
      } else {
        setRotate(`${Math.max(newX * 0.1, -45)}deg`);
      }
      setCardPosition({ x: newX, y: newY });
    };
  }

  const MINIMAL_DISTANCE = 150;
  function buildResetCard(initialPosition: { x: number; y: number }) {
    return (event: TouchEvent) => {
      if (
        initialPosition.x - event.changedTouches[0].clientX >
        MINIMAL_DISTANCE
      ) {
        return applyUserAttendance(user.id, AttendanceEnum.PRESENT);
      }

      if (
        initialPosition.x - event.changedTouches[0].clientX <
        -MINIMAL_DISTANCE
      ) {
        return applyUserAttendance(user.id, AttendanceEnum.ABSENT);
      }

      setCardPosition({ x: 0, y: 0 });
      setRotate("0deg");
    };
  }

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://api.dicebear.com/9.x/bottts/svg?seed=${user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setAvatarUrl(url || "#");
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user.id]);

  useEffect(() => {
    cardRef.current?.addEventListener("touchstart", startCardMovement);
    const card = cardRef.current;

    return () => {
      card?.removeEventListener("touchstart", startCardMovement);
    };
  }, [cardRef]);

  const createAnimationFunction = (attendanceType: AttendanceEnum) => {
    return () => {
      setSelectedAnimation(attendanceType);
      setTimeout(() => {
        setFade(true);
      }, 100);

      setTimeout(() => {
        applyUserAttendance(user.id, attendanceType);
      }, 300);
    };
  };

  const fadeClass = fade ? "fade" : "";

  return (
    <div
      data-testid="user-card"
      className={`user-card_container card ${
        user.number
      } ${selectedAnimation.toLowerCase()} ${fadeClass}`}
      draggable
      ref={cardRef}
      style={{
        marginLeft: cardPosition.x,
        marginTop: cardPosition.y,
        rotate,
      }}
    >
      <div className="user-data_container">
        <h2 className="user-name">{user.name}</h2>
        <h3 className="user-number">{user.number}</h3>
      </div>
      <div className="user-avatar_container">
        <div className="avatar-circle">
          {isLoading && <div className="avatar_loading-spinner"></div>}
          {!isLoading && (
            <img
              className={`user-avatar ${fadeClass}`}
              src={avatarUrl}
              alt={user.name}
            />
          )}
          {!isLoading && !avatarUrl && (
            <div className={`user-avatar ${fadeClass}`}></div>
          )}
        </div>
      </div>
      <div className="user-card_actions">
        <button
          className="user-card_button button_absence"
          onClick={createAnimationFunction(AttendanceEnum.ABSENT)}
        >
          Ausente
        </button>
        <button
          className="user-card_button button_presence"
          onClick={createAnimationFunction(AttendanceEnum.PRESENT)}
        >
          Presente
        </button>
      </div>
    </div>
  );
}
