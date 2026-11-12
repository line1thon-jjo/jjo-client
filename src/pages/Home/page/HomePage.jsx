
import { useNavigate } from "react-router-dom";

import Header from "../../../components/Header/Header";
import PracticeCard from "../components/PracticeCard";
import AddButton from "../components/AddButton";

import "./HomePage.css";

const sampleContent =
  "카카오톡은 위챗과 마찬가지로 주요 메신저 어플리케이션이고, 심지어 카카오페이와도 연동되어 있어 위챗페이와도 유사하죠. 하지만, 카카오...";

const practices = [
  {
    id: 1,
    title: "해커톤 스피치",
    content: sampleContent,
    time: "3분 전",
  },
  {
    id: 2,
    title: "해커톤 스피치",
    content: sampleContent,
    time: "3분 전",
  },
  {
    id: 3,
    title: "해커톤 스피치",
    content: sampleContent,
    time: "3분 전",
  },
  {
    id: 4,
    title: "해커톤 스피치",
    content: sampleContent,
    time: "3분 전",
  },
  {
    id: 5,
    title: "해커톤 스피치",
    content: sampleContent,
    time: "3분 전",
  },
  {
    id: 6,
    title: "해커톤 스피치",
    content: sampleContent,
    time: "3분 전",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  const leftCards = practices.filter(
    (_, index) => index % 2 === 0
  );

  const rightCards = practices.filter(
    (_, index) => index % 2 !== 0
  );

  const handleAddPractice = () => {
    navigate("/script");
  };

  const handleOpenPractice = () => {
    navigate("/reports/1");
  };

  return (
    <div className="home-page">
      <Header />

      <main className="home-page__main">
        <div className="home-page__grid">
          <div className="home-page__column">
            {leftCards.map((practice) => (
              <PracticeCard
                key={practice.id}
                title={practice.title}
                content={practice.content}
                time={practice.time}
                onClick={handleOpenPractice}
              />
            ))}
          </div>

          <div className="home-page__column home-page__column--right">
            {rightCards.map((practice) => (
              <PracticeCard
                key={practice.id}
                title={practice.title}
                content={practice.content}
                time={practice.time}
                onClick={handleOpenPractice}
              />
            ))}
          </div>
        </div>
      </main>

      <AddButton onClick={handleAddPractice} />
    </div>
  );
}
