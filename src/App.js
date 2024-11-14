import React, { useState, useRef } from 'react';

function App() {
  const [fontPath, setFontPath] = useState('');
  const [imgPath, setImgPath] = useState('');
  const [listPath, setListPath] = useState('');
  const [namesList, setNamesList] = useState([]);

  const canvasRef = useRef(null);

  const [diplomaWidthCm, setDiplomaWidthCm] = useState(5);
  const [diplomaHeightCm, setDiplomaHeightCm] = useState(5);

  const [textColor, setTextColor] = useState('#000000');
  const [textAreaWidthCm, setTextAreaWidthCm] = useState(4);
  const [textAreaHeightCm, setTextAreaHeightCm] = useState(4);

  const [textPosX, setTextPosX] = useState(0);
  const [textPosY, setTextPosY] = useState(0);
  const [centerTextArea, setCenterTextArea] = useState(true);

  const [numberOfLines, setNumberOfLines] = useState(1);
  const [textAlignOption, setTextAlignOption] = useState('center'); // 'center' o 'justify'

  const cmToPx = (cm) => (cm * 96) / 2.54;

  const previewCanvas = () => {

    console.log(namesList);

    let fontSize = 20;
    let textX, textY;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const widthPx = cmToPx(diplomaWidthCm);
    const heightPx = cmToPx(diplomaHeightCm);
    canvas.width = widthPx;
    canvas.height = heightPx;

    const text = 'Nombre preparado para vista previa';

    const textWidthPx = cmToPx(textAreaWidthCm);
    const textHeightPx = cmToPx(textAreaHeightCm);

    console.log(textHeightPx);

    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = textColor;
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    do {
      ctx.font = `${fontSize}px Arial`;
      var metrics = ctx.measureText(text);
      var textWidth = metrics.width;
      fontSize--;
    } while (textWidth > textWidthPx && fontSize > 5);

    if (centerTextArea) {
      textX = canvas.width / 2;
      textY = canvas.height / 2;
    } else {
      textX = cmToPx(textPosX);
      textY = cmToPx(textPosY);
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
    <div>
      <h1>Diploma Generator</h1>

      <div>
        <button>
          <label>
            Seleccione letra
            <input type="file" accept=".ttf" onChange={selectFont} style={{ display: 'none' }} />
          </label>
        </button>
        <span>{fontPath.name || 'Seleccione tipo de letra'}</span>
      </div>

      <div>
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

      <div>
        <button>
          <label>
            Seleccione Lista
            <input type="file" accept=".txt" onChange={selectList} style={{ display: 'none' }} />
          </label>
        </button>
        <span>{listPath.name || 'Seleccione nombres (separados por coma)'}</span>
      </div>

      <div>
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

      <div>
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

      <div>
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

      <div>
        <label>
          <input
            type="checkbox"
            checked={centerTextArea}
            onChange={(e) => setCenterTextArea(e.target.checked)}
          />
          Centrar el área de texto en la tarjeta
        </label>
      </div>

      <div>
        <label>Color de letra:</label>
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
        />
      </div>

      <div>
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

<div>
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

      <button onClick={previewCanvas}>Vista Previa</button>


      <div>
        <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
      </div>

    </div>
  );
}

export default App;