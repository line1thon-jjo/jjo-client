import { useState } from "react";

import Header from "@/components/Header/Header";
import GreenButton from "@/components/Button/GreenButton";
import { getErrorMessage } from "@/api/messages";
import { createPractice } from "@/api/practices";

import FileUpload from "../components/FileUpload";
import ScriptEditor from "../components/ScriptEditor";

import "./ScriptPage.css";

const MAX_LENGTH = 1500;

export default function ScriptPage({
  onBack,
  onRecord,
}) {
  const [script, setScript] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleFileLoad = (text) => {
    if (text.length > MAX_LENGTH) {
      alert("대본은 최대 1,500자까지 입력할 수 있습니다.");
    }

    setScript(text.slice(0, MAX_LENGTH));
  };

  // 대본으로 연습 생성(AI 제목 생성) → 녹음 화면으로 이동
  const handleRecord = async () => {
    if (isCreating) return;

    if (!script.trim()) {
      alert("발표 대본을 입력해주세요.");
      return;
    }

    setIsCreating(true);

    try {
      const practice = await createPractice(script);
      onRecord?.(practice);
    } catch (error) {
      alert(getErrorMessage(error));
      setIsCreating(false);
    }
  };

  return (
    <div className="script-page">
      <Header
        variant="back"
        onBack={onBack}
      />

      <main className="script-page__main">
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
            text={isCreating ? "녹음 준비 중" : "녹음하기"}
            onClick={handleRecord}
            disabled={isCreating}
          />
        </div>
      </main>
    </div>
  );
}
