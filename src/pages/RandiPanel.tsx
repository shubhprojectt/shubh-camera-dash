import { useEffect, useState } from "react";

const RandiPanel = () => {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    // Load the index.html from WEB-PANEL
    fetch("/WEB-PANEL/index.html")
      .then((res) => res.text())
      .then((html) => {
        setHtmlContent(html);
      })
      .catch((err) => {
        console.error("Failed to load WEB-PANEL:", err);
      });
  }, []);

  // If no content yet, show loading
  if (!htmlContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
          <p className="text-neon-cyan font-mono">Loading RANDI PANEL...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default RandiPanel;
