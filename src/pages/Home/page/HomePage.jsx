import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/Header/Header";
import AddButton from "@/pages/Home/components/AddButton";
import PracticeRow from "@/pages/Home/components/PracticeRow";
import { usePracticeList } from "@/pages/Home/hooks/usePracticeList";
import { greetingFor } from "@/pages/Home/lib/greeting";
import { getErrorMessage } from "@/api/messages";
import { useAuth } from "@/auth/useAuth";

import "./HomePage.css";

const SKELETON_ROWS = [0, 1, 2, 3];

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { entries, error, retry } = usePracticeList();
  const [openId, setOpenId] = useState();

  const currentOpenId = openId === undefined ? entries?.[0]?.practice.id : openId;

  const handleAddPractice = () => navigate("/script");
  const handleRecord = (practice) =>
    navigate("/record", { state: { title: practice.title, script: practice.script, practiceId: practice.id } });
  const handleOpenReport = ({ practice, latest }) => navigate(`/practices/${practice.id}/reports/${latest.recording_id}`);
  const handleToggle = (id) => setOpenId(id === currentOpenId ? null : id);

  return (
    <div className="home-page">
      <Header />

      <main className="home-page__main">
        <h1 className="home-page__hello font-26-regular">
          {greetingFor()},
          <strong className="font-26-bold">{user.name}님</strong>
        </h1>

        {error ? (
          <div className="home-page__notice" role="alert">
            <p className="font-16-semibold">연습 목록을 불러오지 못했어요.</p>
            <p className="font-14-regular">{getErrorMessage(error)}</p>
            <button type="button" className="home-page__retry font-14-semibold" onClick={retry}>
              다시 불러오기
            </button>
          </div>
        ) : !entries ? (
          <ul className="home-page__list" aria-busy="true">
            {SKELETON_ROWS.map((row) => (
              <li key={row} className="home-page__skeleton-row">
                <span className="home-page__skeleton" style={{ width: "56%", height: 22 }} />
                <span className="home-page__skeleton" style={{ width: "32%" }} />
              </li>
            ))}
          </ul>
        ) : entries.length === 0 ? (
          <div className="home-page__notice">
            <p className="font-16-semibold">아직 연습이 없어요.</p>
            <p className="font-14-regular">오른쪽 아래 + 버튼으로 첫 대본을 넣어 보세요.</p>
          </div>
        ) : (
          <ul className="home-page__list">
            {entries.map((entry) => (
              <PracticeRow
                key={entry.practice.id}
                entry={entry}
                isOpen={entry.practice.id === currentOpenId}
                onToggle={handleToggle}
                onRecord={handleRecord}
                onOpenReport={handleOpenReport}
              />
            ))}
          </ul>
        )}
      </main>

      <AddButton onClick={handleAddPractice} />
    </div>
  );
}
