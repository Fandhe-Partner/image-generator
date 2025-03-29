import React, { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/lgtm";
import "tui-image-editor/dist/tui-image-editor.css";

export function meta() {
  return [
    { title: "LGTM Image Editor" },
    {
      name: "description",
      content: "Create LGTM images with tui-image-editor",
    },
  ];
}

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="w-full" style={{ minHeight: "700px" }} />;
  }

  return <>{children}</>;
}

export default function LGTM() {
  const [selectedFormat, setSelectedFormat] = useState<"png" | "jpg">("png");
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">LGTM Image Editor</h1>

      <ClientOnly>
        <ImageEditorComponent selectedFormat={selectedFormat} />
      </ClientOnly>

      <div className="flex items-center gap-4 mb-4">
        <span className="font-medium">ファイル形式:</span>
        <div className="flex gap-2">
          <button
            type="button"
            className={`px-3 py-1 rounded ${
              selectedFormat === "png"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedFormat("png")}
          >
            PNG
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded ${
              selectedFormat === "jpg"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedFormat("jpg")}
          >
            JPG
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
        <p className="text-sm">
          <strong>使い方:</strong>{" "}
          画像をドラッグ＆ドロップするか、下部のメニューから編集ツールを選択してください。編集が完了したら、ファイル形式を選んでダウンロードボタンをクリックしてください。
        </p>
      </div>
    </div>
  );
}

function ImageEditorComponent({ selectedFormat }: { selectedFormat: "png" | "jpg" }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageEditorRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);

  useEffect(() => {
    let imageEditor: any = null;

    const initEditor = async () => {
      if (editorRef.current && !imageEditorRef.current) {
        try {
          const ImageEditorModule = await import("tui-image-editor");
          const ImageEditor = ImageEditorModule.default;
          
          imageEditor = new ImageEditor(editorRef.current, {
            usageStatistics: false,
            includeUI: {
              loadImage: {
                path: "",
                name: "Blank",
              },
              menu: [
                "crop",
                "flip",
                "rotate",
                "draw",
                "shape",
                "icon",
                "text",
                "mask",
                "filter",
              ],
              initMenu: "filter",
              uiSize: {
                width: "100%",
                height: "700px",
              },
              menuBarPosition: "bottom",
            },
            cssMaxWidth: 700,
            cssMaxHeight: 500,
          });

          imageEditorRef.current = imageEditor;
          setIsEditorLoaded(true);
        } catch (error) {
          console.error("Failed to load image editor:", error);
        }
      }
    };

    initEditor();

    return () => {
      if (imageEditorRef.current) {
        imageEditorRef.current.destroy();
        imageEditorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isEditorLoaded) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          if (
            event.target?.result &&
            typeof event.target.result === "string" &&
            imageEditorRef.current
          ) {
            imageEditorRef.current.loadImageFromURL(
              event.target.result,
              file.name,
            );
          }
        };

        reader.readAsDataURL(file);
      }
    };

    const editorElement = editorRef.current;
    if (editorElement) {
      editorElement.addEventListener(
        "dragover",
        handleDragOver as EventListener,
      );
      editorElement.addEventListener(
        "dragleave",
        handleDragLeave as EventListener,
      );
      editorElement.addEventListener("drop", handleDrop as EventListener);
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener(
          "dragover",
          handleDragOver as EventListener,
        );
        editorElement.removeEventListener(
          "dragleave",
          handleDragLeave as EventListener,
        );
        editorElement.removeEventListener("drop", handleDrop as EventListener);
      }
    };
  }, [isEditorLoaded]);

  const handleDownload = () => {
    if (imageEditorRef.current) {
      const dataURL = imageEditorRef.current.toDataURL({
        format: selectedFormat,
        quality: 1,
      });

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `lgtm-image.${selectedFormat}`;
      link.click();
    }
  };

  return (
    <div>
      <div
        className={`relative mb-4 border-2 ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <div
          ref={editorRef}
          className="w-full"
          style={{ minHeight: "700px" }}
        />
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-100 bg-opacity-70">
            <p className="text-xl font-semibold">
              ドロップして画像をアップロード
            </p>
          </div>
        )}
      </div>
      
      <button
        type="button"
        className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={handleDownload}
      >
        ダウンロード
      </button>
    </div>
  );
}
