import { useState, useRef, useCallback, useEffect } from "react";
import {
  useUpdateTokens,
  type EmCenaState,
  type EmCenaToken,
  type CampanhaPersonagemEntry,
} from "@workspace/api-client-react";
import { Swords, ImageOff } from "lucide-react";

const TOKEN_SIZE = 40;

const TOKEN_COLORS: Record<string, string> = {
  jogador: "bg-blue-600 border-blue-400 text-white",
  monstro: "bg-red-700 border-red-500 text-white",
  aliado: "bg-green-700 border-green-500 text-white",
  neutro: "bg-amber-700 border-amber-500 text-white",
};

function tokenInitial(token: EmCenaToken): string {
  return token.nome.charAt(0).toUpperCase();
}

interface Props {
  emCena: EmCenaState;
  campanhaId: string;
  amMestre: boolean;
  personagens: CampanhaPersonagemEntry[];
}

export default function CenaMapaView({ emCena, campanhaId, amMestre, personagens }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const updateTokensMut = useUpdateTokens(campanhaId);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const tokensRef = useRef<EmCenaToken[]>(emCena.tokens);

  useEffect(() => {
    if (!dragging) {
      tokensRef.current = emCena.tokens;
    }
  }, [emCena.tokens, dragging]);

  const getPercent = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, tokenId: string) => {
      if (!amMestre) return;
      e.preventDefault();
      setDragging(tokenId);
      const pos = getPercent(e.clientX, e.clientY);
      setDragPos(pos);
    },
    [amMestre, getPercent],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      const pos = getPercent(e.clientX, e.clientY);
      setDragPos(pos);
    },
    [dragging, getPercent],
  );

  const handleMouseUp = useCallback(() => {
    if (!dragging || !dragPos) {
      setDragging(null);
      setDragPos(null);
      return;
    }
    const updated = tokensRef.current.map((t) =>
      t.id === dragging ? { ...t, x: Math.round(dragPos.x * 10) / 10, y: Math.round(dragPos.y * 10) / 10 } : t,
    );
    tokensRef.current = updated;
    updateTokensMut.mutate(updated);
    setDragging(null);
    setDragPos(null);
  }, [dragging, dragPos, updateTokensMut]);

  const displayTokens = tokensRef.current.map((t) => {
    if (t.id === dragging && dragPos) {
      return { ...t, x: dragPos.x, y: dragPos.y };
    }
    return t;
  });

  if (!emCena.imagemCena) {
    return (
      <div className="relative rounded-sm border border-border/40 bg-gradient-to-br from-[#1a0f0a] via-[#120a07] to-[#0d0705] min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <Swords className="w-16 h-16 text-primary/20" />
        <div className="text-center space-y-1">
          <p className="font-display text-lg tracking-widest text-muted-foreground/40">AGUARDANDO CENA</p>
          <p className="font-mono text-xs text-muted-foreground/25">
            {amMestre
              ? "Defina uma imagem de cena no Escudo do Mestre."
              : "O mestre ainda não definiu uma imagem para a cena."}
          </p>
        </div>

        {displayTokens.length > 0 && (
          <div className="flex gap-2 mt-4">
            {displayTokens.map((token) => (
              <div
                key={token.id}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-display font-bold ${TOKEN_COLORS[token.tipo] ?? TOKEN_COLORS.neutro}`}
                title={token.nome}
              >
                {tokenInitial(token)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative rounded-sm border border-border/40 overflow-hidden bg-black select-none"
      style={{ minHeight: "50vh" }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        src={emCena.imagemCena}
        alt="Cena atual"
        className="w-full h-auto block"
        style={{ objectFit: "contain" }}
        draggable={false}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />

      {displayTokens.map((token) => {
        const isDragging = token.id === dragging;
        return (
          <div
            key={token.id}
            className={`absolute flex flex-col items-center gap-0.5 ${amMestre ? "cursor-grab" : "cursor-default"} ${isDragging ? "z-50 scale-110" : "z-10"} transition-transform`}
            style={{
              left: `${token.x}%`,
              top: `${token.y}%`,
              transform: `translate(-50%, -50%)${isDragging ? " scale(1.1)" : ""}`,
            }}
            onMouseDown={(e) => handleMouseDown(e, token.id)}
          >
            <div
              className={`rounded-full border-2 flex items-center justify-center font-display font-bold text-xs shadow-lg ${TOKEN_COLORS[token.tipo] ?? TOKEN_COLORS.neutro} ${isDragging ? "ring-2 ring-primary ring-offset-1 ring-offset-black" : ""}`}
              style={{ width: TOKEN_SIZE, height: TOKEN_SIZE }}
            >
              {tokenInitial(token)}
            </div>
            <span className="text-[9px] font-mono text-white/80 bg-black/70 px-1 rounded-sm whitespace-nowrap max-w-[80px] truncate">
              {token.nome}
            </span>
          </div>
        );
      })}
    </div>
  );
}
