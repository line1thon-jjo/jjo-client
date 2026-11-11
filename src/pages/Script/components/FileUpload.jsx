import { useRef } from "react";
import "./FileUpload.css";

import uploadIcon from "../../../assets/icons/upload-icon.svg";

export default function FileUpload({ onFileLoad }) {
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const text = await file.text();
      onFileLoad(text);
    } catch {
      alert("파일을 읽을 수 없습니다.");
    }

    event.target.value = "";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,text/plain"
        className="file-upload__input"
        onChange={handleFileChange}
      />

      <button
        type="button"
        className="file-upload"
        onClick={() => fileInputRef.current?.click()}
      >
        <span>파일 업로드</span>
        <img
          src={uploadIcon}
          alt=""
          className="file-upload__icon"
        />
      </button>
    </>
  );
}
