import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/Header/Header";
import { getErrorMessage } from "@/api/messages";
import { listPractices } from "@/api/practices";
import { getAttempts } from "@/api/reports";

import PracticeCard from "../components/PracticeCard";
import AddButton from "../components/AddButton";
import { formatRelativeTime } from "../lib/formatRelativeTime";

import "./HomePage.css";

function findLatestAttempt(attempts) {
  return attempts.reduce(
    (latest, attempt) => (!latest || attempt.attempt_no > latest.attempt_no ? attempt : latest),
    null,
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  const [practices, setPractices] = useState(null);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [openingId, setOpeningId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    listPractices({ signal: controller.signal })
      .then((list) => {
        setPractices(list);
        setError(null);
      })
      .catch((loadError) => {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(loadError));
      });

    return () => controller.abort();
  }, [reloadKey]);

  const handleReload = () => {
    setError(null);
    setPractices(null);
    setReloadKey((key) => key + 1);
  };

  const handleAddPractice = () => {
    navigate("/script");
  };

  // 최신 회차 결과로 이동. 녹음이 아직 없으면 녹음 화면으로 이동
  const handleOpenPractice = async (practice) => {
    if (openingId !== null) return;

    setOpeningId(practice.id);

    try {
      const { attempts } = await getAttempts(practice.id);
      const latest = findLatestAttempt(attempts);

      if (latest) {
        navigate(`/practices/${practice.id}/reports/${latest.recording_id}`);
      } else {
        navigate("/record", {
          state: { title: practice.title, script: practice.script, practiceId: practice.id },
        });
      }
    } catch (openError) {
      alert(getErrorMessage(openError));
      setOpeningId(null);
    }
  };

  const leftCards = practices?.filter((_, index) => index % 2 === 0) ?? [];
  const rightCards = practices?.filter((_, index) => index % 2 !== 0) ?? [];

  const renderCard = (practice) => (
    <PracticeCard
      key={practice.id}
      title={practice.title}
      content={practice.script}
      time={formatRelativeTime(practice.created_at)}
      onClick={() => handleOpenPractice(practice)}
    />
  );

  return (
    <div className="home-page">
      <Header />

      <main className="home-page__main">
        {error && (
          <div className="home-page__message">
            <p>{error}</p>
            <button type="button" className="home-page__retry" onClick={handleReload}>
              다시 불러오기
            </button>
          </div>
        )}

        {!error && practices?.length === 0 && (
          <div className="home-page__message">
            <p>아직 연습이 없어요.</p>
            <p>+ 버튼을 눌러 첫 발표를 연습해보세요.</p>
          </div>
        )}

        {!error && practices?.length > 0 && (
          <div className="home-page__grid">
            <div className="home-page__column">{leftCards.map(renderCard)}</div>
            <div className="home-page__column home-page__column--right">{rightCards.map(renderCard)}</div>
          </div>
        )}
      </main>

      <AddButton onClick={handleAddPractice} />
    </div>
  );
}
