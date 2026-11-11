import { useState } from "react";

import Header from "../../../components/Header/Header";
import GreenButton from "../../../components/Button/GreenButton";

import ScriptTitle from "../components/ScriptTitle";
import FileUpload from "../components/FileUpload";
import ScriptEditor from "../components/ScriptEditor";

import "./ScriptPage.css";

const MAX_LENGTH = 1500;

export default function ScriptPage({
  onBack,
  onRecord,
}) {
  const [title, setTitle] = useState("");
  const [script, setScript] = useState("");

  const handleFileLoad = (text) => {
    if (text.length > MAX_LENGTH) {
      alert("대본은 최대 1,500자까지 입력할 수 있습니다.");
    }

    setScript(text.slice(0, MAX_LENGTH));
  };

  const handleRecord = () => {
    if (!title.trim()) {
      alert("연습 제목을 입력해주세요.");
      return;
    }

    if (!script.trim()) {
      alert("발표 대본을 입력해주세요.");
      return;
    }

    const practiceData = {
      title: title.trim(),
      script,
    };

    if (onRecord) {
      onRecord(practiceData);
    } else {
      console.log("녹음 화면으로 전달할 데이터:", practiceData);
    }
  };

  return (
    <div className="script-page">
      <Header
        variant="back"
        onBack={onBack}
      />

      <main className="script-page__main">
        <div className="script-page__title">
          <ScriptTitle
            value={title}
            onChange={setTitle}
          />
        </div>

        <p className="script-page__description">
          3~5분 정도의 짧은 대본이 좋아요.
        </p>

        <div className="script-page__upload">
          <FileUpload
            onFileLoad={handleFileLoad}
          />
        </div>

        <ScriptEditor
          value={script}
          onChange={setScript}
          maxLength={MAX_LENGTH}
        />

        <div className="script-page__bottom">
          <GreenButton
            text="녹음하기"
            onClick={handleRecord}
          />
        </div>
      </main>
    </div>
  );
}