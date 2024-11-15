import React, { useState, useRef } from 'react';
import './App.css'

function App() {
  const [fontPath, setFontPath] = useState('');
  const [imgPath, setImgPath] = useState('');
  const [listPath, setListPath] = useState('');
  const [namesList, setNamesList] = useState([]);

  const canvasRef = useRef(null);

  const [diplomaWidthCm, setDiplomaWidthCm] = useState(8);
  const [diplomaHeightCm, setDiplomaHeightCm] = useState(5);

  const [textColor, setTextColor] = useState('#FFF');
  const [textAreaWidthCm, setTextAreaWidthCm] = useState(4);
  const [textAreaHeightCm, setTextAreaHeightCm] = useState(4);

  const [textPosX, setTextPosX] = useState(0);
  const [textPosY, setTextPosY] = useState(0);
  const [centerTextArea, setCenterTextArea] = useState(true);
  const [highlightTextArea, setHighlightTextArea] = useState(false);
  const [previewPrint, setPreviewPrint] = useState(false);
  const [fillPageMode, setFillPageMode] = useState('automatic');
  const [manualFillCount, setManualFillCount] = useState(1);
  const [pageSize, setPageSize] = useState('carta');
  const [orientation, setOrientation] = useState('vertical');
  const [marginMode, setMarginMode] = useState('none');
  const [manualMargin, setManualMargin] = useState(0);

  const [numberOfLines, setNumberOfLines] = useState(1);
  const [textAlignOption, setTextAlignOption] = useState('center'); // 'center' o 'justify'

  const cmToPx = (cm) => (cm * 96) / 2.54;

  const getPageDimensions = (size) => {
    switch (size) {
      case 'carta':
        return { width: cmToPx(21.59), height: cmToPx(27.94) };
      case 'legal':
        return { width: cmToPx(21.59), height: cmToPx(35.56) };
      default:
        return { width: cmToPx(21.59), height: cmToPx(27.94) };
    }
  };

  const previewCanvas = () => {
    console.log(namesList);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (previewPrint) {
      const { width, height } = getPageDimensions(pageSize);
      canvas.width = orientation === 'horizontal' ? Math.max(width, height) : Math.min(width, height);
      canvas.height = orientation === 'horizontal' ? Math.min(width, height) : Math.max(width, height);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const diplomaWidthPx = cmToPx(diplomaWidthCm);
      const diplomaHeightPx = cmToPx(diplomaHeightCm);
      let columns, rows;

      if (fillPageMode === 'automatic') {
        columns = Math.floor(canvas.width / diplomaWidthPx);
        rows = Math.floor(canvas.height / diplomaHeightPx);
      } else {
        columns = Math.min(manualFillCount, Math.floor(canvas.width / diplomaWidthPx));
        rows = Math.ceil(manualFillCount / columns);
      }

      let marginX = 0, marginY = 0;
      if (marginMode === 'automatic') {
        marginX = (canvas.width - columns * diplomaWidthPx) / (columns + 1);
        marginY = (canvas.height - rows * diplomaHeightPx) / (rows + 1);
      } else if (marginMode === 'manual') {
        marginX = cmToPx(manualMargin);
        marginY = cmToPx(manualMargin);
      }

      let count = 0;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          if (fillPageMode === 'manual' && count >= manualFillCount) {
            break;
          }
          const x = marginX + col * (diplomaWidthPx + marginX);
          const y = marginY + row * (diplomaHeightPx + marginY);
          drawDiploma(ctx, x, y, diplomaWidthPx, diplomaHeightPx);
          count++;
        }
      }
    } else {
      const widthPx = cmToPx(diplomaWidthCm);
      const heightPx = cmToPx(diplomaHeightCm);
      canvas.width = widthPx;
      canvas.height = heightPx;
      drawDiploma(ctx, 0, 0, widthPx, heightPx);
    }
  };

  const drawDiploma = (ctx, x, y, width, height) => {
    let fontSize = 20;
    let textX, textY;

    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, width, height);

    const textWidthPx = cmToPx(textAreaWidthCm);
    const textHeightPx = cmToPx(textAreaHeightCm);

    if (highlightTextArea) {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(
        x + (centerTextArea ? (width - textWidthPx) / 2 : cmToPx(textPosX)),
        y + (centerTextArea ? (height - textHeightPx) / 2 : cmToPx(textPosY)),
        textWidthPx,
        textHeightPx
      );
    }

    ctx.fillStyle = textColor;
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const text = 'Nombre preparado para vista previa';

    do {
      ctx.font = `${fontSize}px Arial`;
      var metrics = ctx.measureText(text);
      var textWidth = metrics.width;
      fontSize--;
    } while (textWidth > textWidthPx && fontSize > 5);

    if (centerTextArea) {
      textX = x + width / 2;
      textY = y + height / 2;
    } else {
      textX = x + cmToPx(textPosX);
      textY = y + cmToPx(textPosY);
    }

    const words = text.split(' ');
    const lines = [];
    const wordsPerLine = Math.ceil(words.length / numberOfLines);

    for (let i = 0; i < numberOfLines; i++) {
      lines.push(words.slice(i * wordsPerLine, (i + 1) * wordsPerLine).join(' '));
    }

    ctx.textAlign = textAlignOption;

    lines.forEach((line, index) => {
      ctx.fillText(
        line,
        textX,
        textY + index * (fontSize + 5)
      );
    });
  };

  const selectFont = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFontPath(file);
    }
  };

  const selectBackgroundImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgPath(URL.createObjectURL(file));
    }
  };

  const selectList = (e) => {
    const file = e.target.files[0];
    if (file) {
      setListPath(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        const names = content.split(',').map((name) => name.trim());
        setNamesList(names);
      };
      reader.readAsText(file, 'UTF-8');
    }
  };

  return (
    <div className="container">
      <h1>Diploma Generator</h1>

      <div className="fixed-bar">
        <button className="generate-button">GENERAR</button>
        <button className="preview-button" onClick={previewCanvas}>
          PREVIEW
        </button>
      </div>

      <div className="file-selection">
        <hr />
        <h2>Selección de Archivos</h2>
        <div className="file-item">
          <button>
            <label>
              Seleccione Imagen
              <input
                type="file"
                accept="image/*"
                onChange={selectBackgroundImage}
                style={{ display: 'none' }}
              />
            </label>
          </button>
          <span>{imgPath ? 'Imagen seleccionada' : 'Seleccione imagen de fondo'}</span>
        </div>

        <div className="file-item">
          <button>
            <label>
              Seleccione letra
              <input
                type="file"
                accept=".ttf"
                onChange={selectFont}
                style={{ display: 'none' }}
              />
            </label>
          </button>
          <span>{fontPath.name || 'Seleccione tipo de letra'}</span>
        </div>

        <div className="file-item">
          <button>
            <label>
              Seleccione Lista
              <input
                type="file"
                accept=".txt"
                onChange={selectList}
                style={{ display: 'none' }}
              />
            </label>
          </button>
          <span>{listPath.name || 'Seleccione nombres (separados por coma)'}</span>
        </div>
      </div>

      <div className="dimensions-section">
        <hr />
        <h2>Dimensiones del Diploma</h2>
        <div className="input-group">
          <label>Ancho (cm):</label>
          <input
            type="number"
            value={diplomaWidthCm}
            onChange={(e) => setDiplomaWidthCm(e.target.value)}
          />
          <label>Alto (cm):</label>
          <input
            type="number"
            value={diplomaHeightCm}
            onChange={(e) => setDiplomaHeightCm(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Ancho del área de texto (cm):</label>
          <input
            type="number"
            value={textAreaWidthCm}
            onChange={(e) => setTextAreaWidthCm(e.target.value)}
          />
          <label>Alto del área de texto (cm):</label>
          <input
            type="number"
            value={textAreaHeightCm}
            onChange={(e) => setTextAreaHeightCm(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Posición X del texto (cm):</label>
          <input
            type="number"
            value={textPosX}
            onChange={(e) => setTextPosX(e.target.value)}
            disabled={centerTextArea}
          />
          <label>Posición Y del texto (cm):</label>
          <input
            type="number"
            value={textPosY}
            onChange={(e) => setTextPosY(e.target.value)}
            disabled={centerTextArea}
          />
        </div>
      </div>

      <div className="text-formatting">
        <hr />

        <h2>Formato de Texto</h2>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={centerTextArea}
              onChange={(e) => setCenterTextArea(e.target.checked)}
            />
            Centrar el área de texto en la tarjeta
          </label>
        </div>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={highlightTextArea}
              onChange={(e) => setHighlightTextArea(e.target.checked)}
            />
            Resaltar área del texto
          </label>
        </div>

        <div className="color-picker">
          <label>Color del texto:</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
        </div>

        <div className="radio-group">
          <label>Número de líneas:</label>
          <label>
            <input
              type="radio"
              value={1}
              checked={numberOfLines === 1}
              onChange={() => setNumberOfLines(1)}
            />
            1 Línea
          </label>
          <label>
            <input
              type="radio"
              value={2}
              checked={numberOfLines === 2}
              onChange={() => setNumberOfLines(2)}
            />
            2 Líneas
          </label>
          <label>
            <input
              type="radio"
              value={3}
              checked={numberOfLines === 3}
              onChange={() => setNumberOfLines(3)}
            />
            3 Líneas
          </label>
        </div>

        <div className="radio-group">
          <label>Alineación del texto:</label>
          <label>
            <input
              type="radio"
              value="center"
              checked={textAlignOption === 'center'}
              onChange={() => setTextAlignOption('center')}
            />
            Centrado
          </label>
          <label>
            <input
              type="radio"
              value="left"
              checked={textAlignOption === 'left'}
              onChange={() => setTextAlignOption('left')}
            />
            Justificado a la izquierda
          </label>
        </div>
      </div>

      <div className="canvas-area">
        <hr />
        <h2>Vista Previa del Diploma</h2>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={previewPrint}
              onChange={(e) => setPreviewPrint(e.target.checked)}
            />
            Previsualizar Impresión
          </label>
          {previewPrint && (
            <div className="select-page-size">
              <label>Tamaño de página:</label>
              <select value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
                <option value="carta">Carta</option>
                <option value="legal">Legal</option>
              </select>
            </div>
          )}
        </div>
        <div className="radio-group">
          <label>Rellenar página:</label>
          <label>
            <input
              type="radio"
              value="automatic"
              checked={fillPageMode === 'automatic'}
              onChange={() => setFillPageMode('automatic')}
            />
            Automático
          </label>
          <label>
            <input
              type="radio"
              value="manual"
              checked={fillPageMode === 'manual'}
              onChange={() => setFillPageMode('manual')}
            />
            Manual
          </label>
          {fillPageMode === 'manual' && (
            <div className="input-group">
              <label>Cantidad de tarjetas:</label>
              <input
                type="number"
                value={manualFillCount}
                onChange={(e) => setManualFillCount(parseInt(e.target.value, 10) || 1)}
                min="1"
              />
            </div>
          )}
        </div>
        <div className="radio-group">
          <label>Orientación de la página:</label>
          <label>
            <input
              type="radio"
              value="horizontal"
              checked={orientation === 'horizontal'}
              onChange={() => setOrientation('horizontal')}
            />
            Horizontal
          </label>
          <label>
            <input
              type="radio"
              value="vertical"
              checked={orientation === 'vertical'}
              onChange={() => setOrientation('vertical')}
            />
            Vertical
          </label>
        </div>
        <div className="radio-group">
          <label>Márgenes:</label>
          <label>
            <input
              type="radio"
              value="none"
              checked={marginMode === 'none'}
              onChange={() => setMarginMode('none')}
            />
            Sin margen
          </label>
          <label>
            <input
              type="radio"
              value="automatic"
              checked={marginMode === 'automatic'}
              onChange={() => setMarginMode('automatic')}
            />
            Márgen automático
          </label>
          <label>
            <input
              type="radio"
              value="manual"
              checked={marginMode === 'manual'}
              onChange={() => setMarginMode('manual')}
            />
            Márgen manual
          </label>
          {marginMode === 'manual' && (
            <div className="input-group">
              <label>Tamaño del márgen (cm):</label>
              <input
                type="number"
                value={manualMargin}
                onChange={(e) => setManualMargin(e.target.value)}
                min="0"
              />
            </div>
          )}
        </div>
        <canvas ref={canvasRef} style={{ border: '2px dashed #000' }} />
      </div>
    </div>
  );
}

export default App;
