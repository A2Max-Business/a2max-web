import React, { ReactNode } from "react";
import Link from "next/link";

interface ArticleBodyProps {
  content: string;
  articleTitle?: string;
  suppressDuplicateTitle?: boolean;
}

/**
 * Validates whether a URL uses an authorized safe protocol (http, https, relative, anchor).
 */
function isSafeUrl(url: string): boolean {
  const clean = url.trim();
  return (
    clean.startsWith("https://") ||
    clean.startsWith("http://") ||
    clean.startsWith("/") ||
    clean.startsWith("#")
  );
}

/**
 * Parses inline markdown tokens safely into React nodes without dangerouslySetInnerHTML:
 * - Images: ![alt](url)
 * - Links: [text](url)
 * - Bold: **text**
 * - Strikethrough: ~~text~~
 * - Italic: *text* or _text_
 * - Inline code: `code`
 */
function renderInline(text: string): ReactNode[] {
  // Tokenizer pattern
  const tokenRegex = /(!?\[[^\]]*\]\([^)]+\)|\*\*[^*]+\*\*|~~[^~]+~~|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // 1. Markdown Image ![alt](url)
    const imgMatch = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const [, altText, rawUrl] = imgMatch;
      const cleanUrl = rawUrl.trim();
      if (!isSafeUrl(cleanUrl)) return null;

      return (
        <span key={idx} className="block my-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cleanUrl}
            alt={altText}
            loading="lazy"
            className="rounded-xl border border-slate-200/90 max-h-[500px] w-auto mx-auto shadow-xs"
          />
          {altText && (
            <span className="block mt-2 text-xs text-slate-500 italic">
              {altText}
            </span>
          )}
        </span>
      );
    }

    // 2. Link [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, rawUrl] = linkMatch;
      const cleanUrl = rawUrl.trim();

      if (!isSafeUrl(cleanUrl)) {
        return <span key={idx}>{label}</span>;
      }

      const isExternal = cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://");

      if (isExternal) {
        return (
          <a
            key={idx}
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF8A00] underline underline-offset-4 font-semibold hover:text-[#E67A00] transition-colors"
          >
            {label}
          </a>
        );
      }

      return (
        <Link
          key={idx}
          href={cleanUrl}
          className="text-[#FF8A00] underline underline-offset-4 font-semibold hover:text-[#E67A00] transition-colors"
        >
          {label}
        </Link>
      );
    }

    // 3. Bold **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={idx} className="font-bold text-[#0B1220]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // 4. Strikethrough ~~text~~
    if (part.startsWith("~~") && part.endsWith("~~") && part.length >= 4) {
      return (
        <del key={idx} className="line-through text-slate-400">
          {part.slice(2, -2)}
        </del>
      );
    }

    // 5. Italic *text*
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={idx} className="italic text-slate-800">
          {part.slice(1, -1)}
        </em>
      );
    }

    // 6. Inline code `code`
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={idx}
          className="font-mono text-xs sm:text-sm bg-slate-100 text-[#0B1220] px-1.5 py-0.5 rounded border border-slate-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Regular plain text
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

/**
 * Checks if a block of lines constitutes a GFM Markdown Table.
 */
function isTableBlock(lines: string[]): boolean {
  if (lines.length < 2) return false;
  const isPipeRow = (l: string) => l.trim().startsWith("|") && l.trim().endsWith("|");
  if (!isPipeRow(lines[0]) || !isPipeRow(lines[1])) return false;
  // Second line must be separator (|---|---|)
  const sepClean = lines[1].replace(/\|/g, "").replace(/[-:\s]/g, "");
  return sepClean === "";
}

/**
 * Renders a GFM Markdown table.
 */
function renderTable(lines: string[], keyPrefix: number | string) {
  const parseRow = (l: string) =>
    l
      .trim()
      .slice(1, -1)
      .split("|")
      .map((c) => c.trim());

  const headers = parseRow(lines[0]);
  const rows = lines.slice(2).map(parseRow);

  return (
    <div key={keyPrefix} className="overflow-x-auto my-8 rounded-xl border border-slate-200/90 shadow-2xs">
      <table className="w-full text-left text-xs sm:text-sm border-collapse bg-white">
        <thead>
          <tr className="bg-[#0B1220] text-white">
            {headers.map((h, i) => (
              <th key={i} className="py-3 px-4 font-bold border-b border-slate-700">
                {renderInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className={`border-b border-slate-100 ${rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"} hover:bg-amber-50/40 transition-colors`}
            >
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="py-3 px-4 text-slate-700">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ArticleBody({
  content,
  articleTitle,
  suppressDuplicateTitle = true,
}: ArticleBodyProps) {
  if (!content || typeof content !== "string") {
    return null;
  }

  // Split into block elements by double or multiple newlines
  const rawBlocks = content.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);

  // Normalize article title for duplicate suppression check
  const normalizedTitle = articleTitle?.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

  let titleAlreadySuppressed = false;

  return (
    <div className="article-body max-w-[760px] mx-auto text-[#0B1220] font-sans antialiased">
      {rawBlocks.map((block, bIdx) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

        // 1. Heading 1 (# ...)
        if (block.startsWith("# ")) {
          const h1Text = block.replace(/^#\s+/, "").trim();
          const normalizedH1 = h1Text.toLowerCase().replace(/[^a-z0-9]/g, "");

          // Suppress if configured and either matches title or is the initial heading
          if (
            suppressDuplicateTitle &&
            (!titleAlreadySuppressed || (normalizedTitle && normalizedH1 === normalizedTitle))
          ) {
            titleAlreadySuppressed = true;
            return null; // Suppress visual repetition
          }

          return (
            <h1
              key={bIdx}
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0B1220] mt-10 mb-5 font-sans leading-tight"
            >
              {renderInline(h1Text)}
            </h1>
          );
        }

        // 2. Heading 2 (## ...)
        if (block.startsWith("## ")) {
          const [firstLine, ...restLines] = block.split("\n");
          return (
            <React.Fragment key={bIdx}>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1220] mt-12 mb-5 pt-6 border-t border-slate-200/90 font-sans leading-snug">
                {renderInline(firstLine.replace(/^##\s+/, ""))}
              </h2>
              {restLines.length > 0 && (
                <p className="text-slate-700 text-base sm:text-lg leading-[1.85] font-normal mb-6 text-pretty">
                  {renderInline(restLines.join(" "))}
                </p>
              )}
            </React.Fragment>
          );
        }

        // 3. Heading 3 (### ...) — Enhanced with Pill Badges for Numbered Steps/Pillars
        if (block.startsWith("### ")) {
          const [firstLine, ...restLines] = block.split("\n");
          const rawH3 = firstLine.replace(/^###\s+/, "").trim();
          // Match numbered headings like "1. Assessment..." or "01. Assessment..."
          const numberedMatch = rawH3.match(/^(\d+)\.\s+(.*)$/);

          let headingElement: ReactNode;
          if (numberedMatch) {
            const [, numStr, restText] = numberedMatch;
            const formattedNum = numStr.padStart(2, "0");

            headingElement = (
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#0B1220] mt-8 mb-3 font-sans flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#FF8A00]/15 text-[#FF8A00] font-black text-xs shrink-0 font-mono"
                >
                  {formattedNum}
                </span>
                <span>{renderInline(restText)}</span>
              </h3>
            );
          } else {
            headingElement = (
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#0B1220] mt-8 mb-3 font-sans">
                {renderInline(rawH3)}
              </h3>
            );
          }

          return (
            <React.Fragment key={bIdx}>
              {headingElement}
              {restLines.length > 0 && (
                <p className="text-slate-700 text-base sm:text-lg leading-[1.85] font-normal mb-6 text-pretty">
                  {renderInline(restLines.join(" "))}
                </p>
              )}
            </React.Fragment>
          );
        }

        // 4. Heading 4 (#### ...)
        if (block.startsWith("#### ")) {
          const [firstLine, ...restLines] = block.split("\n");
          return (
            <React.Fragment key={bIdx}>
              <h4 className="text-base sm:text-lg font-bold text-[#0B1220] mt-6 mb-2 font-sans">
                {renderInline(firstLine.replace(/^####\s+/, ""))}
              </h4>
              {restLines.length > 0 && (
                <p className="text-slate-700 text-base sm:text-lg leading-[1.85] font-normal mb-6 text-pretty">
                  {renderInline(restLines.join(" "))}
                </p>
              )}
            </React.Fragment>
          );
        }

        // 5. Code Block (```lang ... ```)
        if (block.startsWith("```") && block.endsWith("```") && block.length >= 6) {
          const codeLines = block.split("\n");
          const codeContent = codeLines.slice(1, -1).join("\n");
          return (
            <pre
              key={bIdx}
              className="bg-[#0B1220] text-slate-100 p-4 rounded-xl font-mono text-xs sm:text-sm overflow-x-auto my-6 border border-slate-800"
            >
              <code>{codeContent}</code>
            </pre>
          );
        }

        // 6. GFM Tables (| ... | ... |)
        if (isTableBlock(lines)) {
          return renderTable(lines, bIdx);
        }

        // 7. Blockquote (> ...)
        if (block.startsWith("> ")) {
          const quoteLines = block
            .split("\n")
            .map((line) => line.replace(/^>\s*/, ""))
            .join(" ");

          return (
            <blockquote
              key={bIdx}
              className="border-l-4 border-[#FF8A00] pl-6 pr-4 py-4 my-8 italic text-slate-800 bg-white/80 rounded-r-xl border border-slate-200/80 shadow-2xs leading-relaxed"
            >
              <p className="text-base sm:text-lg font-medium">{renderInline(quoteLines)}</p>
            </blockquote>
          );
        }

        // 8. Horizontal Rule (--- ou ***)
        if (block === "---" || block === "***") {
          return <hr key={bIdx} className="my-10 border-slate-200" />;
        }

        // 9. Unordered List (- ou *)
        const isUnorderedList = lines.every((l) => l.startsWith("- ") || l.startsWith("* "));
        if (isUnorderedList && lines.length > 0) {
          return (
            <ul
              key={bIdx}
              className="space-y-3 my-6 pl-6 text-slate-700 list-disc marker:text-[#FF8A00] text-base sm:text-lg leading-[1.8]"
            >
              {lines.map((item, iIdx) => (
                <li key={iIdx}>{renderInline(item.replace(/^[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }

        // 10. Ordered List (1. ...)
        const isOrderedList = lines.every((l) => /^\d+\.\s+/.test(l));
        if (isOrderedList && lines.length > 0) {
          return (
            <ol
              key={bIdx}
              className="space-y-3 my-6 pl-6 text-slate-700 list-decimal marker:font-bold marker:text-[#0B1220] text-base sm:text-lg leading-[1.8]"
            >
              {lines.map((item, iIdx) => (
                <li key={iIdx}>{renderInline(item.replace(/^\d+\.\s+/, ""))}</li>
              ))}
            </ol>
          );
        }

        // 11. Standard Paragraph
        return (
          <p
            key={bIdx}
            className="text-slate-700 text-base sm:text-lg leading-[1.85] font-normal mb-6 text-pretty"
          >
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
}
