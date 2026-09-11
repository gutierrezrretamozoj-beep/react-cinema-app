// ticketGenerator.ts — Generador de boleto en formato PNG con HTML5 Canvas en alta resolución (2x Retina)
// Cero dependencias externas; dibuja directamente el boleto cinematográfico estilizado y descarga el archivo.

export interface TicketData {
  movieTitle: string;
  theater: string;
  date: string;
  time: string;
  roomName: string;
  seatsLabel: string;
  ticketCode: string;
  backdropUrl?: string;
  totalPrice?: number;
}

export const downloadTicketPNG = async (data: TicketData): Promise<void> => {
  const width = 800;
  const height = 1150;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Fondo general de la tarjeta (gradiente oscuro cinemático)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#0f0c1b');
  bgGrad.addColorStop(0.5, '#131024');
  bgGrad.addColorStop(1, '#090712');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Borde exterior dorado sutil
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, width - 36, height - 36);

  ctx.strokeStyle = '#332752';
  ctx.lineWidth = 1;
  ctx.strokeRect(26, 26, width - 52, height - 52);

  // 3. Encabezado de Marca "CINEMA NOVA"
  ctx.fillStyle = '#eab308';
  ctx.font = 'bold 22px "Inter", "Segoe UI", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.textAlign = 'center';
  ctx.fillText('CINEMA NOVA', width / 2, 72);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '600 12px "Inter", "Segoe UI", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('BOLETO OFICIAL DE ENTRADA · EXPERIENCIA PREMIUM', width / 2, 96);

  // 4. Intentar dibujar el póster/backdrop superior si carga o fallback cinemático
  const bannerY = 120;
  const bannerHeight = 280;

  let imageLoaded = false;
  if (data.backdropUrl) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = data.backdropUrl!;
      });

      ctx.save();
      ctx.beginPath();
      ctx.rect(40, bannerY, width - 80, bannerHeight);
      ctx.clip();
      ctx.drawImage(img, 40, bannerY, width - 80, bannerHeight);

      // Sombra degradada sobre la imagen para legibilidad
      const imgGrad = ctx.createLinearGradient(0, bannerY, 0, bannerY + bannerHeight);
      imgGrad.addColorStop(0, 'rgba(15, 12, 27, 0.2)');
      imgGrad.addColorStop(0.6, 'rgba(15, 12, 27, 0.6)');
      imgGrad.addColorStop(1, 'rgba(15, 12, 27, 0.95)');
      ctx.fillStyle = imgGrad;
      ctx.fillRect(40, bannerY, width - 80, bannerHeight);
      ctx.restore();
      imageLoaded = true;
    } catch {
      imageLoaded = false;
    }
  }

  if (!imageLoaded) {
    // Banner alternativo con gradiente y patrón estético
    const altGrad = ctx.createLinearGradient(40, bannerY, width - 40, bannerY + bannerHeight);
    altGrad.addColorStop(0, '#1e1438');
    altGrad.addColorStop(1, '#2d1a4e');
    ctx.fillStyle = altGrad;
    ctx.fillRect(40, bannerY, width - 80, bannerHeight);
  }

  // Título de la película dentro del banner
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Inter", "Segoe UI", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.textAlign = 'center';
  ctx.fillText(data.movieTitle, width / 2, bannerY + bannerHeight - 45);

  ctx.fillStyle = '#eab308';
  ctx.font = 'bold 13px "Inter", "Segoe UI", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(data.theater.toUpperCase(), width / 2, bannerY + bannerHeight - 16);

  // 5. Detalles de la función (Ficha técnica en columnas)
  const detailsY = bannerY + bannerHeight + 50;

  const drawField = (label: string, value: string, x: number, y: number, align: 'left' | 'center' | 'right' = 'left') => {
    ctx.textAlign = align;
    ctx.fillStyle = '#71717a';
    ctx.font = 'bold 12px "Inter", "Segoe UI", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(label.toUpperCase(), x, y);

    ctx.fillStyle = '#f4f4f5';
    ctx.font = 'bold 20px "Inter", "Segoe UI", sans-serif';
    ctx.letterSpacing = '0.5px';
    ctx.fillText(value, x, y + 26);
  };

  drawField('FECHA', data.date, 80, detailsY);
  drawField('HORA', data.time, 460, detailsY);

  drawField('SALA', data.roomName, 80, detailsY + 70);
  drawField('ASIENTOS', data.seatsLabel, 460, detailsY + 70);

  if (data.totalPrice !== undefined) {
    drawField('TOTAL PAGADO', `$${data.totalPrice.toFixed(2)} USD`, 80, detailsY + 140);
    drawField('ESTADO', 'CONFIRMADO · PAGADO', 460, detailsY + 140);
  }

  // 6. Línea divisoria perforada (Ticket Stub Perforation)
  const perfY = detailsY + (data.totalPrice !== undefined ? 210 : 160);

  ctx.strokeStyle = '#3f3f46';
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 10]);
  ctx.beginPath();
  ctx.moveTo(40, perfY);
  ctx.lineTo(width - 40, perfY);
  ctx.stroke();
  ctx.setLineDash([]); // Reset dash

  // Notches semicirculares en los laterales de la perforación
  ctx.fillStyle = '#08060d';
  ctx.beginPath();
  ctx.arc(20, perfY, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(width - 20, perfY, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 7. Sección Inferior: Código QR y clave de reserva
  const qrCenterY = perfY + 115;
  const qrSize = 130;
  const qrX = width / 2 - qrSize / 2;
  const qrY = qrCenterY - qrSize / 2;

  // Fondo blanco con esquinas suaves para el QR
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16);

  // Dibujar patrón QR estético determinista
  const matrixSize = 13;
  const cellSize = qrSize / matrixSize;
  ctx.fillStyle = '#090712';

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Marcadores de esquina del QR (Finder patterns)
      const isTopLeft = r < 4 && c < 4;
      const isTopRight = r < 4 && c >= matrixSize - 4;
      const isBottomLeft = r >= matrixSize - 4 && c < 4;

      if (isTopLeft || isTopRight || isBottomLeft) {
        const border = (r === 0 || r === 3 || c === 0 || c === 3) ||
                       (r === 0 || r === 3 || c === matrixSize - 4 || c === matrixSize - 1) ||
                       (r === matrixSize - 4 || r === matrixSize - 1 || c === 0 || c === 3);
        const center = (r === 1 && c === 1) ||
                       (r === 1 && c === matrixSize - 3) ||
                       (r === matrixSize - 3 && c === 1);
        if (border || center) {
          ctx.fillRect(qrX + c * cellSize, qrY + r * cellSize, cellSize, cellSize);
        }
      } else {
        // Pseudo-aleatoriedad consistente basada en código de reserva
        const hash = (data.ticketCode.charCodeAt(r % data.ticketCode.length) + r * 7 + c * 13);
        if (hash % 3 === 0 || hash % 5 === 1) {
          ctx.fillRect(qrX + c * cellSize + 0.5, qrY + r * cellSize + 0.5, cellSize - 1, cellSize - 1);
        }
      }
    }
  }

  // Clave de reserva
  ctx.fillStyle = '#eab308';
  ctx.font = 'bold 24px "Courier New", monospace';
  ctx.letterSpacing = '5px';
  ctx.textAlign = 'center';
  ctx.fillText(data.ticketCode, width / 2, qrCenterY + qrSize / 2 + 38);

  ctx.fillStyle = '#71717a';
  ctx.font = '500 11px "Inter", "Segoe UI", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('PRESENTA ESTE CÓDIGO EN EL ACCESO A LA SALA', width / 2, qrCenterY + qrSize / 2 + 62);

  // 8. Convertir y disparar la descarga en el navegador
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve();
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Boleto-CinemaNova-${data.ticketCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve();
      }, 500);
    }, 'image/png');
  });
};
