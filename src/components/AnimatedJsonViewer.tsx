import React, { useState, useEffect, useMemo } from "react";
import { Copy, Check, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedJsonViewerProps {
  data: any;
  title?: string;
  accentColor?: "green" | "cyan" | "pink" | "purple" | "yellow" | "orange";
  animationSpeed?: number; // ms per line
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
  const [isExpanded, setIsExpanded] = useState(true);
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

      // Detect line type
      let type: JsonLine["type"] = "string";
      let keyName: string | undefined;
      let value: string | undefined;

      // Check for key-value pairs
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

  // Render syntax highlighted line
  const renderLine = (line: JsonLine, index: number) => {
    const parts: React.ReactNode[] = [];
    
    if (line.keyName) {
      // Key-value line
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

        // Render value with appropriate color
        let valueColor = "text-foreground";
        if (rest.startsWith('"')) valueColor = "text-neon-yellow";
        else if (rest === "true" || rest === "false" || rest.startsWith("true") || rest.startsWith("false")) valueColor = "text-neon-pink";
        else if (rest === "null" || rest.startsWith("null")) valueColor = "text-muted-foreground italic";
        else if (!isNaN(Number(rest.replace(",", "")))) valueColor = "text-neon-cyan";
        else if (rest === "{" || rest === "[") valueColor = "text-neon-orange";

        parts.push(
          <span key="value" className={valueColor}>{rest}</span>
        );

        // Add copy button for values
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
      // Bracket or plain line
      const bracketColor = line.type === "bracket" ? `text-neon-orange` : "text-foreground";
      parts.push(
        <span key="content" className={bracketColor}>{line.content}</span>
      );
    }

    return parts;
  };

  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden",
      `bg-gradient-to-br from-${neonColor}/10 via-black/60 to-${neonColor}/5`,
      `border border-${neonColor}/40`,
      `shadow-[0_0_30px_hsl(var(--${neonColor})/0.15)]`
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-4 py-3",
        `bg-${neonColor}/10 border-b border-${neonColor}/30`
      )}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          {isExpanded ? (
            <ChevronDown className={`w-4 h-4 text-${neonColor}`} />
          ) : (
            <ChevronRight className={`w-4 h-4 text-${neonColor}`} />
          )}
          <span className={`text-${neonColor} font-mono font-bold text-sm`}>{title}</span>
        </button>
        
        <div className="flex items-center gap-2">
          {!animationComplete && (
            <span className="text-xs text-muted-foreground animate-pulse">
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
        </div>
      </div>

      {/* JSON Content */}
      {isExpanded && (
        <div className="relative overflow-auto max-h-[500px] custom-scrollbar">
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />
          
          <div className="p-4 font-mono text-sm">
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
      )}

      {/* Corner accents */}
      <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-${neonColor}/60 rounded-tl-xl`} />
      <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-${neonColor}/60 rounded-tr-xl`} />
      <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-${neonColor}/60 rounded-bl-xl`} />
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-${neonColor}/60 rounded-br-xl`} />
    </div>
  );
};

export default AnimatedJsonViewer;
