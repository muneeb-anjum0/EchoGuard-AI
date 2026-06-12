import { useRef, useState } from "react";
import { FileAudio2, LoaderCircle, UploadCloud, X, XCircle } from "lucide-react";

const ACCEPTED_EXTENSIONS = ["wav", "mp3", "flac", "ogg", "m4a"];

type Props = {
  onAnalyze: (file: File) => void;
  isLoading: boolean;
};

export function UploadCard({ onAnalyze, isLoading }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const extension = file ? getExtension(file.name).toUpperCase() : "";

  function chooseFile(selected: File | undefined) {
    if (!selected) {
      return;
    }

    const selectedExtension = getExtension(selected.name);
    if (!ACCEPTED_EXTENSIONS.includes(selectedExtension)) {
      setFile(null);
      setLocalError("Unsupported file type. Please upload WAV, MP3, FLAC, OGG, or M4A.");
      return;
    }

    setLocalError(null);
    setFile(selected);
  }

  return (
    <section className="card upload-card lift-card">
      <div className="section-title compact">
        <span className="eyebrow">Upload</span>
        <h2>Analyze an audio clip</h2>
      </div>

      <div
        className={`drop-zone ${isDragging ? "dragging" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          chooseFile(event.dataTransfer.files[0]);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="upload-symbol">
          <UploadCloud size={30} />
        </div>
        <div>
          <h3>Drop an audio file here</h3>
          <p>or browse from your device</p>
        </div>
        <div className="format-pills" aria-label="Supported formats">
          {ACCEPTED_EXTENSIONS.map((item) => (
            <span key={item}>{item.toUpperCase()}</span>
          ))}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".wav,.mp3,.flac,.ogg,.m4a,audio/*"
          onChange={(event) => chooseFile(event.target.files?.[0])}
        />
      </div>

      {file && (
        <div className="file-row">
          <div className="file-icon">
            <FileAudio2 size={19} />
          </div>
          <div className="file-meta">
            <strong>{file.name}</strong>
            <span>
              {formatBytes(file.size)} · {extension || "AUDIO"}
            </span>
          </div>
          <button className="icon-button" onClick={() => setFile(null)} aria-label="Remove selected file">
            <X size={16} />
          </button>
        </div>
      )}

      {localError && (
        <div className="soft-error">
          <XCircle size={16} />
          <span>{localError}</span>
        </div>
      )}

      <button className="button-primary full-width shine-button" disabled={!file || isLoading} onClick={() => file && onAnalyze(file)}>
        {isLoading ? <LoaderCircle className="spin" size={18} /> : null}
        {isLoading ? "Analyzing signal..." : "Analyze audio"}
      </button>
    </section>
  );
}

function getExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
