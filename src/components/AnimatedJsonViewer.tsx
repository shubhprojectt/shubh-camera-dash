import React, { useState, useEffect, useMemo } from "react";
import { Copy, Check, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedJsonViewerProps {
  data: any;
  title?: string;
  accentColor?: "green" | "cyan" | "pink" | "purple" | "yellow" | "orange";
  animationSpeed?: number;
  showLineNumbers?: boolean;
}

interface JsonLine {
  content: string;
  indent: number;
  isKey?: boolean;
  keyName?: string;
  value?: string;
  type?: "string" | "number" | "boolean" | "null" | "bracket";
}

const colorMap = {
  green: "neon-green",
  cyan: "neon-cyan", 
  pink: "neon-pink",
  purple: "neon-purple",
  yellow: "neon-yellow",
  orange: "neon-orange",
};

export const AnimatedJsonViewer: React.FC<AnimatedJsonViewerProps> = ({
  data,
  title = "JSON Data",
  accentColor = "green",
  animationSpeed = 30,
  showLineNumbers = true,
}) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  const neonColor = colorMap[accentColor];

  // Parse JSON into lines with syntax info
  const jsonLines = useMemo(() => {
    const lines: JsonLine[] = [];
    const jsonStr = JSON.stringify(data, null, 2);
    const rawLines = jsonStr.split("\n");

    rawLines.forEach((line) => {
      const indent = line.search(/\S|$/);
      const trimmed = line.trim();

      let type: JsonLine["type"] = "string";
      let keyName: string | undefined;
      let value: string | undefined;

      const keyMatch = trimmed.match(/^"([^"]+)":\s*(.*)$/);
      if (keyMatch) {
        keyName = keyMatch[1];
        value = keyMatch[2];
        
        if (value.startsWith('"')) type = "string";
        else if (value === "true" || value === "false") type = "boolean";
        else if (value === "null") type = "null";
        else if (!isNaN(Number(value.replace(",", "")))) type = "number";
        else if (value === "{" || value === "[" || value === "}," || value === "},") type = "bracket";
      } else if (trimmed === "{" || trimmed === "}" || trimmed === "[" || trimmed === "]" || 
                 trimmed === "}," || trimmed === "]," || trimmed === "{" || trimmed === "[") {
        type = "bracket";
      }

      lines.push({
        content: line,
        indent,
        isKey: !!keyName,
        keyName,
        value,
        type,
      });
    });

    return lines;
  }, [data]);

  // Animate lines appearing
  useEffect(() => {
    if (visibleLines < jsonLines.length) {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => Math.min(prev + 1, jsonLines.length));
      }, animationSpeed);
      return () => clearTimeout(timer);
    } else {
      setAnimationComplete(true);
    }
  }, [visibleLines, jsonLines.length, animationSpeed]);

  // Reset animation when data changes
  useEffect(() => {
    setVisibleLines(0);
    setAnimationComplete(false);
  }, [data]);

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const copyAll = () => {
    copyToClipboard(JSON.stringify(data, null, 2), "all");
  };

  const exportToPdf = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title} - Export</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              padding: 40px;
              background: #0a0a0a;
              color: #00ff88;
              font-size: 12px;
              line-height: 1.6;
            }
            h1 {
              color: #00ff88;
              font-size: 18px;
              margin-bottom: 20px;
              border-bottom: 2px solid #00ff88;
              padding-bottom: 10px;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .key { color: #00ff88; font-weight: bold; }
            .string { color: #ffff00; }
            .number { color: #00ffff; }
            .boolean { color: #ff69b4; }
            .null { color: #888888; font-style: italic; }
            @media print {
              body { background: white; color: #000; }
              h1 { color: #000; border-color: #000; }
              pre { color: #000; }
              .key { color: #006600; }
              .string { color: #996600; }
              .number { color: #000099; }
              .boolean { color: #990066; }
              .null { color: #666666; }
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <pre>${jsonStr}</pre>
          <script>
            setTimeout(() => { window.print(); }, 300);
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Render syntax highlighted line
  const renderLine = (line: JsonLine, index: number) => {
    const parts: React.ReactNode[] = [];
    
    if (line.keyName) {
      const keyMatch = line.content.match(/^(\s*)"([^"]+)":\s*(.*)$/);
      if (keyMatch) {
        const [, spaces, key, rest] = keyMatch;
        parts.push(
          <span key="space" className="text-transparent">{spaces}</span>,
          <span key="quote1" className="text-muted-foreground">"</span>,
          <span key="key" className={`text-${neonColor} font-semibold`}>{key}</span>,
          <span key="quote2" className="text-muted-foreground">"</span>,
          <span key="colon" className="text-muted-foreground">: </span>
        );

        let valueColor = "text-foreground";
        if (rest.startsWith('"')) valueColor = "text-neon-yellow";
        else if (rest === "true" || rest === "false" || rest.startsWith("true") || rest.startsWith("false")) valueColor = "text-neon-pink";
        else if (rest === "null" || rest.startsWith("null")) valueColor = "text-muted-foreground italic";
        else if (!isNaN(Number(rest.replace(",", "")))) valueColor = "text-neon-cyan";
        else if (rest === "{" || rest === "[") valueColor = "text-neon-orange";

        parts.push(
          <span key="value" className={valueColor}>{rest}</span>
        );

        if (!rest.includes("{") && !rest.includes("[")) {
          const cleanValue = rest.replace(/^"|"$/g, "").replace(/,$/g, "");
          parts.push(
            <button
              key="copy"
              onClick={() => copyToClipboard(cleanValue, key)}
              className={cn(
                "ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center p-1 rounded hover:bg-white/10",
                copiedField === key && "opacity-100"
              )}
              title={`Copy ${key}`}
            >
              {copiedField === key ? (
                <Check className="w-3 h-3 text-neon-green" />
              ) : (
                <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground" />
              )}
            </button>
          );
        }
      }
    } else {
      const bracketColor = line.type === "bracket" ? `text-neon-orange` : "text-foreground";
      parts.push(
        <span key="content" className={bracketColor}>{line.content}</span>
      );
    }

    return parts;
  };

  return (
    <div className="relative">
      {/* Action buttons - floating */}
      <div className="flex items-center justify-end gap-2 mb-3">
        {!animationComplete && (
          <span className="text-xs text-muted-foreground animate-pulse mr-2">
            Loading...
          </span>
        )}
        <button
          onClick={copyAll}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            `bg-${neonColor}/20 border border-${neonColor}/40`,
            `hover:bg-${neonColor}/30 hover:border-${neonColor}/60`,
            `text-${neonColor}`
          )}
        >
          {copiedField === "all" ? (
            <>
              <Check className="w-3 h-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy All
            </>
          )}
        </button>
        <button
          onClick={exportToPdf}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            `bg-${neonColor}/20 border border-${neonColor}/40`,
            `hover:bg-${neonColor}/30 hover:border-${neonColor}/60`,
            `text-${neonColor}`
          )}
        >
          <FileDown className="w-3 h-3" />
          Export PDF
        </button>
      </div>

      {/* JSON Content - no card, just raw text */}
      <div className="overflow-auto max-h-[500px] font-mono text-sm">
        {jsonLines.slice(0, visibleLines).map((line, index) => (
          <div
            key={index}
            className={cn(
              "group flex items-start gap-3 leading-relaxed",
              "animate-fade-in",
              index === visibleLines - 1 && !animationComplete && "relative"
            )}
            style={{
              animationDelay: `${index * 10}ms`,
            }}
          >
            {/* Line number */}
            {showLineNumbers && (
              <span className="select-none text-muted-foreground/40 text-xs w-6 text-right flex-shrink-0 pt-0.5">
                {index + 1}
              </span>
            )}
            
            {/* Line content */}
            <div className="flex-1 whitespace-pre-wrap break-all">
              {renderLine(line, index)}
            </div>

            {/* Typing cursor for last line during animation */}
            {index === visibleLines - 1 && !animationComplete && (
              <span className={`inline-block w-2 h-4 bg-${neonColor} animate-pulse ml-1`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedJsonViewer;
