import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import interact from 'interactjs';

function App() {
  const [fontPath, setFontPath] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [imgPath, setImgPath] = useState('');
  const [listPath, setListPath] = useState('');
  const [namesList, setNamesList] = useState([]);
  const [newName, setNewName] = useState('');
  const [previewMode, setPreviewMode] = useState('prueba');
  const [currentPage, setCurrentPage] = useState(0);
  const [editIndex, setEditIndex] = useState(null);

  const canvasRef = useRef(null);

  const [diplomaWidthCm, setDiplomaWidthCm] = useState(8);
  const [diplomaHeightCm, setDiplomaHeightCm] = useState(5);
  const [diplomaBgColor, setDiplomaBgColor] = useState('#87CEEB');

  const [textColor, setTextColor] = useState('#000');
  const [textAreaWidthCm, setTextAreaWidthCm] = useState(4);
  const [textAreaHeightCm, setTextAreaHeightCm] = useState(4);

  const [textPosX, setTextPosX] = useState(0);
  const [textPosY, setTextPosY] = useState(0);
  const [centerTextArea, setCenterTextArea] = useState(false);
  const [highlightTextArea, setHighlightTextArea] = useState(false);
  const [fillPageMode, setFillPageMode] = useState('automatic');
  const [manualFillCount, setManualFillCount] = useState(1);
  const [pageSize, setPageSize] = useState('carta');
  const [orientation, setOrientation] = useState('vertical');
  const [marginMode, setMarginMode] = useState('none');
  const [manualMargin, setManualMargin] = useState(0);

  const [numberOfLines, setNumberOfLines] = useState(1);
  const [textAlignOption, setTextAlignOption] = useState('center');
  const [exampleText, setExampleText] = useState('Nombre de Ejemplo');
  const resizableBoxRef = useRef(null);
  const textBoxRef = useRef(null);

  const imgInputRef = useRef(null);
  const fontInputRef = useRef(null);
  const listInputRef = useRef(null);

  useEffect(() => {
    previewCanvas();
    // eslint-disable-next-line
  }, [
    currentPage,
    previewMode,
    namesList,
    diplomaWidthCm,
    diplomaHeightCm,
    textAreaWidthCm,
    textAreaHeightCm,
    textPosX,
    textPosY,
    exampleText,
    imgPath,
    textAlignOption,
    numberOfLines,
    centerTextArea,
    pageSize,
    orientation,
    marginMode,
    manualMargin,
    fillPageMode,
    manualFillCount,
    highlightTextArea,
    textColor,
    diplomaBgColor,
    fontFamily,
  ]);

  useEffect(() => {
    interact(resizableBoxRef.current).unset();
    interact(textBoxRef.current).unset();

    interact(resizableBoxRef.current)
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move(event) {
            const target = event.target;
            let x = parseFloat(target.getAttribute('data-x')) || 0;
            let y = parseFloat(target.getAttribute('data-y')) || 0;

            target.style.width = `${event.rect.width}px`;
            target.style.height = `${event.rect.height}px`;

            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.transform = `translate(${x}px, ${y}px)`;

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);

            setDiplomaWidthCm(pxToCm(event.rect.width));
            setDiplomaHeightCm(pxToCm(event.rect.height));
          },
        },
        modifiers: [
          interact.modifiers.restrictSize({
            min: { width: 50, height: 50 },
          }),
        ],
      });

    interact(textBoxRef.current)
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move(event) {
            const target = event.target;
            let x = parseFloat(target.getAttribute('data-x')) || 0;
            let y = parseFloat(target.getAttribute('data-y')) || 0;

            target.style.width = `${event.rect.width}px`;
            target.style.height = `${event.rect.height}px`;

            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.transform = `translate(${x}px, ${y}px)`;

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);

            setTextAreaWidthCm(pxToCm(event.rect.width));
            setTextAreaHeightCm(pxToCm(event.rect.height));
            setTextPosX(pxToCm(x));
            setTextPosY(pxToCm(y));

            if (centerTextArea) {
              x = (cmToPx(diplomaWidthCm) - event.rect.width) / 2;
              y = (cmToPx(diplomaHeightCm) - event.rect.height) / 2;
              target.style.transform = `translate(${x}px, ${y}px)`;
              target.setAttribute('data-x', x);
              target.setAttribute('data-y', y);
              setTextPosX(pxToCm(x));
              setTextPosY(pxToCm(y));
            }
          },
        },
        modifiers: [
          interact.modifiers.restrictSize({
            min: { width: 50, height: 50 },
          }),
        ],
      })
      .draggable({
        listeners: {
          move(event) {
            if (!centerTextArea) {
              const target = event.target;
              const x =
                (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
              const y =
                (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

              target.style.transform = `translate(${x}px, ${y}px)`;

              target.setAttribute('data-x', x);
              target.setAttribute('data-y', y);

              setTextPosX(pxToCm(x));
              setTextPosY(pxToCm(y));
            }
          },
        },
      });
  }, [
    centerTextArea,
    textAreaWidthCm,
    textAreaHeightCm,
    diplomaWidthCm,
    diplomaHeightCm,
    imgPath,
  ]);

  const cmToPx = (cm) => (cm * 96) / 2.54;
  const pxToCm = (px) => (px * 2.54) / 96;

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
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const { width, height } = getPageDimensions(pageSize);
    canvas.width =
      orientation === 'horizontal' ? Math.max(width, height) : Math.min(width, height);
    canvas.height =
      orientation === 'horizontal' ? Math.min(width, height) : Math.max(width, height);
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

    let marginX = 0,
      marginY = 0;
    if (marginMode === 'automatic') {
      marginX = (canvas.width - columns * diplomaWidthPx) / (columns + 1);
      marginY = (canvas.height - rows * diplomaHeightPx) / (rows + 1);
    } else if (marginMode === 'manual') {
      marginX = cmToPx(manualMargin);
      marginY = cmToPx(manualMargin);
    }

    if (previewMode === 'prueba') {
      const x = marginX + (canvas.width - diplomaWidthPx) / 2;
      const y = marginY + (canvas.height - diplomaHeightPx) / 2;
      drawDiploma(ctx, x, y, diplomaWidthPx, diplomaHeightPx, exampleText);
    } else if (previewMode === 'lista') {
      const enabledNames = namesList.filter((name) => name.enabled);
      let startIndex = currentPage * (columns * rows);
      let endIndex = Math.min(startIndex + columns * rows, enabledNames.length);
      let count = startIndex;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          if (count >= endIndex) {
            break;
          }
          const x = marginX + col * (diplomaWidthPx + marginX);
          const y = marginY + row * (diplomaHeightPx + marginY);
          drawDiploma(ctx, x, y, diplomaWidthPx, diplomaHeightPx, enabledNames[count].name);
          count++;
        }
      }
    }
  };

  const drawDiploma = (ctx, x, y, width, height, name) => {
    if (imgPath) {
      const img = new Image();
      img.src = imgPath;
      img.onload = () => {
        ctx.drawImage(img, x, y, width, height);
        drawText();
      };
    } else {
      ctx.fillStyle = diplomaBgColor;
      ctx.fillRect(x, y, width, height);
      drawText();
    }

    function drawText() {
      document.fonts.ready.then(() => {
        const textWidthPx = cmToPx(textAreaWidthCm);
        const textHeightPx = cmToPx(textAreaHeightCm);

        if (highlightTextArea) {
          ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
          ctx.fillRect(
            x + (centerTextArea ? (width - textWidthPx) / 2 : cmToPx(textPosX)),
            y + (centerTextArea ? (height - textHeightPx) / 2 : cmToPx(textPosY)),
            textWidthPx,
            textHeightPx
          );
        }

        ctx.fillStyle = textColor;
        ctx.textAlign = textAlignOption;
        ctx.textBaseline = 'top';

        const words = name.split(' ');
        const lines = [];
        const wordsPerLine = Math.ceil(words.length / numberOfLines);

        for (let i = 0; i < numberOfLines; i++) {
          lines.push(words.slice(i * wordsPerLine, (i + 1) * wordsPerLine).join(' '));
        }

        // text adjustment
        let fontSize = calculateFontSize(ctx, lines, textWidthPx, textHeightPx);

        ctx.font = `${fontSize}px '${fontFamily}'`;

        lines.forEach((line, index) => {
          ctx.fillText(
            line,
            x +
              (centerTextArea
                ? width / 2
                : cmToPx(textPosX) + (textAlignOption === 'center' ? textWidthPx / 2 : 0)),
            y +
              (centerTextArea ? (height - textHeightPx) / 2 : cmToPx(textPosY)) +
              index * (fontSize + 5)
          );
        });
      });
    }
  };

  const calculateFontSize = (ctx, lines, maxWidth, maxHeight) => {
    let fontSize = 100; // initial size
    let fits = false;

    while (!fits && fontSize > 1) {
      ctx.font = `${fontSize}px '${fontFamily}'`;
      let totalHeight = 0;
      let maxLineWidth = 0;

      lines.forEach((line) => {
        const metrics = ctx.measureText(line);
        const lineHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        totalHeight += lineHeight + 5; // 5 lines spaces
        const lineWidth = metrics.width;
        if (lineWidth > maxLineWidth) {
          maxLineWidth = lineWidth;
        }
      });

      if (totalHeight <= maxHeight && maxLineWidth <= maxWidth) {
        fits = true;
      } else {
        fontSize--;
      }
    }

    return fontSize;
  };

  const selectFont = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFontPath(file);
      const reader = new FileReader();
      reader.onload = function (event) {
        const fontData = event.target.result;
        const font = new FontFace('CustomFont', fontData);
        font.load().then(function (loadedFont) {
          document.fonts.add(loadedFont);
          setFontFamily('CustomFont');
        }).catch(function (error) {
          console.error('Failed to load font:', error);
        });
      };
      reader.readAsArrayBuffer(file);
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
        const names = content.split(',').map((name) => ({ name: name.trim(), enabled: true }));
        setNamesList(names);
      };
      reader.readAsText(file, 'UTF-8');
    }
  };

  const addName = () => {
    if (newName.trim() !== '') {
      if (editIndex !== null) {
        const updatedNames = [...namesList];
        updatedNames[editIndex].name = newName.trim();
        setNamesList(updatedNames);
        setEditIndex(null);
      } else {
        setNamesList([...namesList, { name: newName.trim(), enabled: true }]);
      }
      setNewName('');
    }
  };

  const toggleName = (index) => {
    const updatedNames = [...namesList];
    updatedNames[index].enabled = !updatedNames[index].enabled;
    setNamesList(updatedNames);
  };

  const handlePageNavigation = (action) => {
    const enabledNames = namesList.filter((name) => name.enabled);
    const totalPages = Math.ceil(enabledNames.length / 10);
    if (action === 'first') {
      setCurrentPage(0);
    } else if (action === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (action === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (action === 'last') {
      setCurrentPage(totalPages - 1);
    }
  };

  const editName = (index) => {
    setNewName(namesList[index].name);
    setEditIndex(index);
  };

  const adjustFontSizeInTextBox = () => {
    const textBox = textBoxRef.current;
    if (textBox) {
      const textWidthPx = cmToPx(textAreaWidthCm);
      const textHeightPx = cmToPx(textAreaHeightCm);
      const lines = exampleText
        .split(' ')
        .reduce((resultArray, word, index) => {
          const chunkIndex = Math.floor(
            index / Math.ceil(exampleText.split(' ').length / numberOfLines)
          );
          if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = '';
          }
          resultArray[chunkIndex] += (resultArray[chunkIndex] ? ' ' : '') + word;
          return resultArray;
        }, []);

      let fontSize = 100;
      let fits = false;
      const textBoxCtx = document.createElement('canvas').getContext('2d');

      while (!fits && fontSize > 1) {
        textBoxCtx.font = `${fontSize}px '${fontFamily}'`;
        let totalHeight = 0;
        let maxLineWidth = 0;

        lines.forEach((line) => {
          const metrics = textBoxCtx.measureText(line);
          const lineHeight =
            metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
          totalHeight += lineHeight + 5; // 5 lines spaces
          const lineWidth = metrics.width;
          if (lineWidth > maxLineWidth) {
            maxLineWidth = lineWidth;
          }
        });

        if (totalHeight <= textHeightPx && maxLineWidth <= textWidthPx) {
          fits = true;
        } else {
          fontSize--;
        }
      }

      textBox.style.fontSize = `${fontSize}px`;
    }
  };

  useEffect(() => {
    adjustFontSizeInTextBox();
  }, [
    exampleText,
    textAreaWidthCm,
    textAreaHeightCm,
    numberOfLines,
    fontFamily,
    textBoxRef.current,
  ]);

  return (
    <div className="container">
      <h1>Diploma Generator</h1>

      <div className="fixed-bar">
        <button className="generate-button">GENERAR</button>
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
                ref={imgInputRef}
              />
            </label>
          </button>
          <span>{imgPath !== '' ? 'Imagen seleccionada  ' : 'Seleccione imagen de fondo '}</span>
          {imgPath !== '' ? (
            <button onClick={() => {
              setImgPath('');
              if (imgInputRef.current) {
                imgInputRef.current.value = '';
              }
            }}> Eliminar Imagen</button>
          ) : ''}
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
                ref={fontInputRef}
              />
            </label>
          </button>
          <span>{fontPath.name ? fontPath.name + '  ' : 'Seleccione tipo de letra  '}</span>
          {fontPath.name ? (
            <button onClick={() => {
              setFontPath('');
              setFontFamily('Arial');
              if (fontInputRef.current) {
                fontInputRef.current.value = '';
              }
            }}>Eliminar Letra</button>
          ) : ''}
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
                ref={listInputRef}
              />
            </label>
          </button>
          <span>{listPath.name ? listPath.name + '  ' : 'Seleccione nombres (separados por coma)  '}</span>
          {listPath.name ? (
            <button onClick={() => {
              setListPath('');
              setNamesList([]);
              if (listInputRef.current) {
                listInputRef.current.value = '';
              }
            }}>Eliminar Lista</button>
          ) : ''}
        </div>

        <div className="names-list">
          <h3>Lista de Nombres</h3>
          <div className="manual-names">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Añadir nombre"
            />
            <button onClick={addName}>{editIndex !== null ? 'Guardar' : 'Añadir'}</button>
          </div>
          {namesList.map((name, index) => (
            <div key={index} className="names-list-item">
              <input
                type="checkbox"
                checked={name.enabled}
                onChange={() => toggleName(index)}
              />
              <span className="name-text">{name.name}</span>
              <button onClick={() => editName(index)} className="edit-button">
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="dimensions-section">
        <hr />
        <h2>Ajustes del Diploma</h2>

        <div className="manual-resize-container">
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

          <div className="color-picker">
            <label>Color de fondo del diploma:</label>
            <input
              type="color"
              value={diplomaBgColor}
              onChange={(e) => setDiplomaBgColor(e.target.value)}
              disabled={imgPath !== ''}
            />
          </div>

          <div className="radio-group">
            <label>Alineación del texto:</label>

            <label>
              <input
                type="radio"
                value="left"
                checked={textAlignOption === 'left'}
                onChange={() => setTextAlignOption('left')}
              />
              Izquierda
            </label>
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
                value="right"
                checked={textAlignOption === 'right'}
                onChange={() => setTextAlignOption('right')}
              />
              Derecha
            </label>
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

          <div
            ref={resizableBoxRef}
            className="resizable-box"
            style={{
              backgroundImage: imgPath ? `url(${imgPath})` : null,
              backgroundColor: !imgPath ? diplomaBgColor : null,
              backgroundSize: 'cover',
              width: `${cmToPx(diplomaWidthCm)}px`,
              height: `${cmToPx(diplomaHeightCm)}px`,
              margin: '0 auto',
              position: 'relative',
            }}
          >
            <div
              ref={textBoxRef}
              className="text-box"
              data-x="0"
              data-y="0"
              style={{
                backgroundColor: highlightTextArea ? '#FFD700' : 'transparent',
                width: `${cmToPx(textAreaWidthCm)}px`,
                height: `${cmToPx(textAreaHeightCm)}px`,
                color: textColor,
                textAlign: textAlignOption,
                fontFamily: fontFamily,
                overflow: 'hidden',
                transform: centerTextArea
                  ? `translate(${(cmToPx(diplomaWidthCm) - cmToPx(textAreaWidthCm)) / 2
                    }px, ${(cmToPx(diplomaHeightCm) - cmToPx(textAreaHeightCm)) / 2
                    }px)`
                  : `translate(${cmToPx(textPosX)}px, ${cmToPx(textPosY)}px)`,
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                const newText = prompt('Ingrese el texto de ejemplo:', exampleText);
                if (newText !== null) {
                  setExampleText(newText);
                }
              }}
            >
              {exampleText
                .split(' ')
                .reduce((resultArray, word, index) => {
                  const chunkIndex = Math.floor(
                    index / Math.ceil(exampleText.split(' ').length / numberOfLines)
                  );
                  if (!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = '';
                  }
                  resultArray[chunkIndex] += (resultArray[chunkIndex] ? ' ' : '') + word;
                  return resultArray;
                }, [])
                .map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
            </div>
          </div>

          <br />
          <div className="input-group">
            <label>Ancho (cm):</label>
            <input
              type="number"
              value={diplomaWidthCm}
              onChange={(e) => setDiplomaWidthCm(parseFloat(e.target.value) || 0)}
            />
            <label>Alto (cm):</label>
            <input
              type="number"
              value={diplomaHeightCm}
              onChange={(e) => setDiplomaHeightCm(parseFloat(e.target.value) || 0)}
            />

            <label>Ancho del área de texto (cm):</label>
            <input
              type="number"
              value={textAreaWidthCm}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value) || 0;
                setTextAreaWidthCm(newValue);
                if (centerTextArea) {
                  setTextPosX((diplomaWidthCm - newValue) / 2);
                }
              }}
            />
            <label>Alto del área de texto (cm):</label>
            <input
              type="number"
              value={textAreaHeightCm}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value) || 0;
                setTextAreaHeightCm(newValue);
                if (centerTextArea) {
                  setTextPosY((diplomaHeightCm - newValue) / 2);
                }
              }}
            />

            <label>Posición X del texto (cm):</label>
            <input
              type="number"
              value={textPosX}
              onChange={(e) => setTextPosX(parseFloat(e.target.value) || 0)}
              disabled={centerTextArea}
            />
            <label>Posición Y del texto (cm):</label>
            <input
              type="number"
              value={textPosY}
              onChange={(e) => setTextPosY(parseFloat(e.target.value) || 0)}
              disabled={centerTextArea}
            />
          </div>
        </div>
      </div>

      <div className="canvas-area">
        <hr />
        <h2>Vista Previa del Diploma</h2>

        <div className="select-page-size">
          <label>Tamaño de página:</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
          >
            <option value="carta">Carta</option>
            <option value="legal">Legal</option>
          </select>
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
                onChange={(e) =>
                  setManualFillCount(parseInt(e.target.value, 10) || 1)
                }
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
                onChange={(e) => setManualMargin(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
          )}
        </div>

        <div className="radio-group">
          <label>Modo de Vista Previa:</label>
          <label>
            <input
              type="radio"
              value="prueba"
              checked={previewMode === 'prueba'}
              onChange={() => setPreviewMode('prueba')}
            />
            Visualizar Prueba
          </label>
          <label>
            <input
              type="radio"
              value="lista"
              checked={previewMode === 'lista'}
              onChange={() => setPreviewMode('lista')}
            />
            Visualizar Lista
          </label>
        </div>

        <canvas ref={canvasRef} style={{ border: '2px dashed #000' }} />

        <div className="navigation-buttons">
          <button
            onClick={() => handlePageNavigation('first')}
            disabled={currentPage === 0}
          >
            {'<<'}
          </button>
          <button
            onClick={() => handlePageNavigation('prev')}
            disabled={currentPage === 0}
          >
            {'<'}
          </button>
          <button
            onClick={() => handlePageNavigation('next')}
            disabled={
              currentPage >=
              Math.ceil(namesList.filter((name) => name.enabled).length / 10) - 1
            }
          >
            {'>'}
          </button>
          <button
            onClick={() => handlePageNavigation('last')}
            disabled={
              currentPage >=
              Math.ceil(namesList.filter((name) => name.enabled).length / 10) - 1
            }
          >
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
