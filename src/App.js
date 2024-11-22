import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import interact from 'interactjs';

function App() {
  const [fontPath, setFontPath] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [imgPath, setImgPath] = useState('');
  const [bgImage, setBgImage] = useState(null);
  const [listPath, setListPath] = useState('');
  const [namesList, setNamesList] = useState([]);
  const [newName, setNewName] = useState('');
  const [previewMode, setPreviewMode] = useState('prueba');
  const [currentPage, setCurrentPage] = useState(0);
  const [editIndex, setEditIndex] = useState(null);

  const canvasRef = useRef(null);

  const [diplomaWidthCm, setDiplomaWidthCm] = useState(6);
  const [diplomaHeightCm, setDiplomaHeightCm] = useState(4);
  const [diplomaBgColor, setDiplomaBgColor] = useState('#87CEEB');

  const [textColor, setTextColor] = useState('#000');
  const [textAreaWidthCm, setTextAreaWidthCm] = useState(5);
  const [textAreaHeightCm, setTextAreaHeightCm] = useState(0.4);

  const [textPosX, setTextPosX] = useState(0);
  const [textPosY, setTextPosY] = useState(0);
  const [centerTextArea, setCenterTextArea] = useState(true);
  const [highlightTextArea, setHighlightTextArea] = useState(false);
  const [fillPageMode, setFillPageMode] = useState('automatic');
  const [manualFillCount, setManualFillCount] = useState(1);
  const [pageSize, setPageSize] = useState('carta');
  const [customPageWidthCm, setCustomPageWidthCm] = useState(21.59);
  const [customPageHeightCm, setCustomPageHeightCm] = useState(27.94);
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

  const [itemsPerPage, setItemsPerPage] = useState(1);

  const [selectedConfiguration, setSelectedConfiguration] = useState('small');

  const [diplomaRotation, setDiplomaRotation] = useState(0);
  const [textAreaRotation, setTextAreaRotation] = useState(0);

  const diplomaRotationRef = useRef(diplomaRotation);
  const textAreaRotationRef = useRef(textAreaRotation);

  useEffect(() => {
    diplomaRotationRef.current = diplomaRotation;
  }, [diplomaRotation]);

  useEffect(() => {
    textAreaRotationRef.current = textAreaRotation;
  }, [textAreaRotation]);

  useEffect(() => {
    switch (selectedConfiguration) {
      case 'small':
        setDiplomaWidthCm(6);
        setDiplomaHeightCm(4);
        setTextAreaWidthCm(6);
        setTextAreaHeightCm(0.4);
        setCenterTextArea(true);
        break;
      case 'letter':
        setDiplomaWidthCm(21.59);
        setDiplomaHeightCm(27.94);
        setTextAreaWidthCm(21.59);
        setTextAreaHeightCm(2.794); // 10%
        setCenterTextArea(true);
        break;
      case 'legal':
        setDiplomaWidthCm(21.59);
        setDiplomaHeightCm(35.56);
        setTextAreaWidthCm(21.59);
        setTextAreaHeightCm(3.556); // 10%
        setCenterTextArea(true);
        break;
      case 'custom':
        break;
      default:
        break;
    }
  }, [selectedConfiguration]);

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
    bgImage,
    textAlignOption,
    numberOfLines,
    centerTextArea,
    pageSize,
    customPageWidthCm,
    customPageHeightCm,
    orientation,
    marginMode,
    manualMargin,
    fillPageMode,
    manualFillCount,
    highlightTextArea,
    textColor,
    diplomaBgColor,
    fontFamily,
    diplomaRotation,
    textAreaRotation,
  ]);

  useEffect(() => {
    if (imgPath) {
      const img = new Image();
      img.src = imgPath;
      img.onload = () => {
        setBgImage(img);
      };
    } else {
      setBgImage(null);
    }
  }, [imgPath]);

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

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);

            target.style.transform = `translate(${x}px, ${y}px) rotate(${diplomaRotationRef.current}deg)`;

            setDiplomaWidthCm(pxToCm(event.rect.width));
            setDiplomaHeightCm(pxToCm(event.rect.height));
            setSelectedConfiguration('custom');
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
            const target = event.target;
            let x = parseFloat(target.getAttribute('data-x')) || 0;
            let y = parseFloat(target.getAttribute('data-y')) || 0;

            const angle = (diplomaRotationRef.current * Math.PI) / 180;
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            const deltaX = event.dx * cos - event.dy * sin;
            const deltaY = event.dx * sin + event.dy * cos;

            x += deltaX;
            y += deltaY;

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);

            target.style.transform = `translate(${x}px, ${y}px) rotate(${diplomaRotationRef.current}deg)`;
          },
        },
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

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);

            target.style.transform = `translate(${x}px, ${y}px) rotate(${textAreaRotationRef.current}deg)`;

            setTextAreaWidthCm(pxToCm(event.rect.width));
            setTextAreaHeightCm(pxToCm(event.rect.height));
            setTextPosX(pxToCm(x));
            setTextPosY(pxToCm(y));

            if (centerTextArea) {
              x = (cmToPx(diplomaWidthCm) - event.rect.width) / 2;
              y = (cmToPx(diplomaHeightCm) - event.rect.height) / 2;
              target.setAttribute('data-x', x);
              target.setAttribute('data-y', y);
              target.style.transform = `translate(${x}px, ${y}px) rotate(${textAreaRotationRef.current}deg)`;
              setTextPosX(pxToCm(x));
              setTextPosY(pxToCm(y));
            }
            setSelectedConfiguration('custom');
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
              let x = parseFloat(target.getAttribute('data-x')) || 0;
              let y = parseFloat(target.getAttribute('data-y')) || 0;

              const angle = (textAreaRotationRef.current * Math.PI) / 180;
              const sin = Math.sin(angle);
              const cos = Math.cos(angle);

              const deltaX = event.dx * cos - event.dy * sin;
              const deltaY = event.dx * sin + event.dy * cos;

              x += deltaX;
              y += deltaY;

              target.setAttribute('data-x', x);
              target.setAttribute('data-y', y);

              target.style.transform = `translate(${x}px, ${y}px) rotate(${textAreaRotationRef.current}deg)`;

              setTextPosX(pxToCm(x));
              setTextPosY(pxToCm(y));
              setSelectedConfiguration('custom');
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

  useEffect(() => {
    const target = resizableBoxRef.current;
    if (target) {
      let x = parseFloat(target.getAttribute('data-x')) || 0;
      let y = parseFloat(target.getAttribute('data-y')) || 0;
      target.style.transform = `translate(${x}px, ${y}px) rotate(${diplomaRotation}deg)`;
    }
  }, [diplomaRotation]);

  useEffect(() => {
    const target = textBoxRef.current;
    if (target) {
      let x = parseFloat(target.getAttribute('data-x')) || 0;
      let y = parseFloat(target.getAttribute('data-y')) || 0;
      target.style.transform = `translate(${x}px, ${y}px) rotate(${textAreaRotation}deg)`;
    }
  }, [textAreaRotation]);

  const cmToPx = (cm) => (cm * 96) / 2.54;
  const pxToCm = (px) => (px * 2.54) / 96;

  const getPageDimensions = (size) => {
    switch (size) {
      case 'carta':
        return { width: 21.59, height: 27.94 };
      case 'legal':
        return { width: 21.59, height: 35.56 };
      case 'custom':
        return {
          width: customPageWidthCm,
          height: customPageHeightCm,
        };
      default:
        return { width: 21.59, height: 27.94 };
    }
  };

  const previewCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const pageDimensions = getPageDimensions(pageSize);
    let pageWidthCm = pageDimensions.width;
    let pageHeightCm = pageDimensions.height;

    // cm to px
    const pageWidthPx = cmToPx(pageWidthCm);
    const pageHeightPx = cmToPx(pageHeightCm);

    // size of canva
    canvas.width = pageWidthPx;
    canvas.height = pageHeightPx;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (orientation === 'horizontal') {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.translate(-canvas.height / 2, -canvas.width / 2);
    }

    const diplomaWidthPx = cmToPx(diplomaWidthCm);
    const diplomaHeightPx = cmToPx(diplomaHeightCm);

    let columns = 1;
    let rows = 1;
    let marginX = 0;
    let marginY = 0;

    if (fillPageMode === 'automatic') {
      if (marginMode === 'none') {
        marginX = 0;
        marginY = 0;
        columns = Math.floor(canvas.width / diplomaWidthPx);
        rows = Math.floor(canvas.height / diplomaHeightPx);
      } else if (marginMode === 'manual') {
        marginX = cmToPx(manualMargin);
        marginY = cmToPx(manualMargin);
        columns = Math.floor(
          (canvas.width + marginX) / (diplomaWidthPx + marginX)
        );
        rows = Math.floor(
          (canvas.height + marginY) / (diplomaHeightPx + marginY)
        );
      } else if (marginMode === 'automatic') {
        columns = Math.floor(canvas.width / diplomaWidthPx);
        rows = Math.floor(canvas.height / diplomaHeightPx);

        marginX = (canvas.width - columns * diplomaWidthPx) / (columns + 1);
        marginY = (canvas.height - rows * diplomaHeightPx) / (rows + 1);

        if (marginX < 0) marginX = 0;
        if (marginY < 0) marginY = 0;
      }

      columns = Math.max(1, columns);
      rows = Math.max(1, rows);
    } else if (fillPageMode === 'manual') {

      const manualItemsPerPage = manualFillCount;

      let maxColumns, maxRows;
      if (marginMode === 'none') {
        marginX = 0;
        marginY = 0;
        maxColumns = Math.floor(canvas.width / diplomaWidthPx);
        maxRows = Math.floor(canvas.height / diplomaHeightPx);
      } else if (marginMode === 'manual') {
        marginX = cmToPx(manualMargin);
        marginY = cmToPx(manualMargin);
        maxColumns = Math.floor(
          (canvas.width + marginX) / (diplomaWidthPx + marginX)
        );
        maxRows = Math.floor(
          (canvas.height + marginY) / (diplomaHeightPx + marginY)
        );
      } else if (marginMode === 'automatic') {
        columns = Math.floor(canvas.width / diplomaWidthPx);
        rows = Math.floor(canvas.height / diplomaHeightPx);

        marginX = (canvas.width - columns * diplomaWidthPx) / (columns + 1);
        marginY = (canvas.height - rows * diplomaHeightPx) / (rows + 1);

        if (marginX < 0) marginX = 0;
        if (marginY < 0) marginY = 0;

        maxColumns = columns;
        maxRows = rows;
      }

      maxColumns = Math.max(1, maxColumns);
      maxRows = Math.max(1, maxRows);

      const maxItemsPerPage = maxColumns * maxRows;
      const itemsPerPage = Math.min(manualItemsPerPage, maxItemsPerPage);

      columns = Math.min(itemsPerPage, maxColumns);
      rows = Math.ceil(itemsPerPage / columns);
      if (rows > maxRows) {
        rows = maxRows;
        columns = Math.ceil(itemsPerPage / rows);
      }

      if (marginMode === 'automatic') {
        marginX = (canvas.width - columns * diplomaWidthPx) / (columns + 1);
        marginY = (canvas.height - rows * diplomaHeightPx) / (rows + 1);
        if (marginX < 0) marginX = 0;
        if (marginY < 0) marginY = 0;
      }
    }

    columns = Math.max(1, columns);
    rows = Math.max(1, rows);

    if (marginX < 0) marginX = 0;
    if (marginY < 0) marginY = 0;

    //setColumns(columns);
    //setRows(rows);
    setItemsPerPage(columns * rows);

    if (previewMode === 'prueba') {
      const totalItems = columns * rows;
      let count = 0;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const x = marginX + col * (diplomaWidthPx + marginX);
          const y = marginY + row * (diplomaHeightPx + marginY);
          drawDiploma(ctx, x, y, diplomaWidthPx, diplomaHeightPx, exampleText);
          count++;
          if (count >= totalItems) break;
        }
      }
    } else if (previewMode === 'lista') {
      const enabledNames = namesList.filter((name) => name.enabled);
      //const totalPages = Math.ceil(enabledNames.length / itemsPerPage);

      let startIndex = currentPage * itemsPerPage;
      let endIndex = Math.min(startIndex + itemsPerPage, enabledNames.length);
      let count = startIndex;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          if (count >= endIndex) {
            break;
          }
          const x = marginX + col * (diplomaWidthPx + marginX);
          const y = marginY + row * (diplomaHeightPx + marginY);
          drawDiploma(
            ctx,
            x,
            y,
            diplomaWidthPx,
            diplomaHeightPx,
            enabledNames[count]?.name
          );
          count++;
        }
      }
    }

    if (orientation === 'horizontal') {
      ctx.restore();
    }
  };

  const drawDiploma = (ctx, x, y, width, height, name) => {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate((Math.PI / 180) * diplomaRotation);
    ctx.translate(-width / 2, -height / 2);

    if (bgImage) {
      ctx.drawImage(bgImage, 0, 0, width, height);
    } else {
      ctx.fillStyle = diplomaBgColor;
      ctx.fillRect(0, 0, width, height);
    }

    drawText(ctx, 0, 0, width, height, name);

    ctx.restore();
  };

  const drawText = (ctx, x, y, width, height, name) => {
    ctx.save();

    const textWidthPx = cmToPx(textAreaWidthCm);
    const textHeightPx = cmToPx(textAreaHeightCm);

    let areaX = centerTextArea ? (width - textWidthPx) / 2 : cmToPx(textPosX);
    let areaY = centerTextArea ? (height - textHeightPx) / 2 : cmToPx(textPosY);

    ctx.translate(x + areaX + textWidthPx / 2, y + areaY + textHeightPx / 2);
    ctx.rotate((Math.PI / 180) * textAreaRotation);
    ctx.translate(-textWidthPx / 2, -textHeightPx / 2);

    if (highlightTextArea) {
      ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
      ctx.fillRect(0, 0, textWidthPx, textHeightPx);
    }

    ctx.fillStyle = textColor;
    ctx.textAlign = textAlignOption;
    ctx.textBaseline = 'bottom';

    const words = name.split(' ');
    const lines = [];
    const wordsPerLine = Math.ceil(words.length / numberOfLines);

    for (let i = 0; i < numberOfLines; i++) {
      lines.push(
        words.slice(i * wordsPerLine, (i + 1) * wordsPerLine).join(' ')
      );
    }

    let fontSize = calculateFontSize(ctx, lines, textWidthPx, textHeightPx);

    ctx.font = `${fontSize}px '${fontFamily}'`;

    lines.forEach((line, index) => {
      ctx.fillText(
        line,
        textAlignOption === 'center'
          ? textWidthPx / 2
          : textAlignOption === 'left'
            ? 0
            : textWidthPx,
        textHeightPx - (lines.length - index - 1) * (fontSize + 5)
      );
    });

    ctx.restore();
  };

  const calculateFontSize = (ctx, lines, maxWidth, maxHeight) => {
    let fontSize = 100; // big initial size
    let fits = false;

    while (!fits && fontSize > 1) {
      ctx.font = `${fontSize}px '${fontFamily}'`;
      let totalHeight = lines.length * (fontSize + 5) - 5;
      let maxLineWidth = 0;

      lines.forEach((line) => {
        const metrics = ctx.measureText(line);
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
        font
          .load()
          .then(function (loadedFont) {
            document.fonts.add(loadedFont);
            setFontFamily('CustomFont');
          })
          .catch(function (error) {
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
        const names = content
          .split(',')
          .map((name) => ({ name: name.trim(), enabled: true }));
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
        setNamesList([
          ...namesList,
          { name: newName.trim(), enabled: true },
        ]);
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
    const totalPages = Math.ceil(enabledNames.length / itemsPerPage);
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
          resultArray[chunkIndex] +=
            (resultArray[chunkIndex] ? ' ' : '') + word;
          return resultArray;
        }, []);

      let fontSize = 100;
      let fits = false;
      const textBoxCtx = document.createElement('canvas').getContext('2d');

      while (!fits && fontSize > 1) {
        textBoxCtx.font = `${fontSize}px '${fontFamily}'`;
        let totalHeight = lines.length * (fontSize + 5) - 5;
        let maxLineWidth = 0;

        lines.forEach((line) => {
          const metrics = textBoxCtx.measureText(line);
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
    // eslint-disable-next-line
  }, [
    exampleText,
    textAreaWidthCm,
    textAreaHeightCm,
    numberOfLines,
    fontFamily,
    textBoxRef.current,
  ]);

  const handleDiplomaWidthChange = (e) => {
    setDiplomaWidthCm(parseFloat(e.target.value) || 0);
    setSelectedConfiguration('custom');
  };

  const handleDiplomaHeightChange = (e) => {
    setDiplomaHeightCm(parseFloat(e.target.value) || 0);
    setSelectedConfiguration('custom');
  };

  const handleTextAreaWidthChange = (e) => {
    const newValue = parseFloat(e.target.value) || 0;
    setTextAreaWidthCm(newValue);
    if (centerTextArea) {
      setTextPosX((diplomaWidthCm - newValue) / 2);
    }
    setSelectedConfiguration('custom');
  };

  const handleTextAreaHeightChange = (e) => {
    const newValue = parseFloat(e.target.value) || 0;
    setTextAreaHeightCm(newValue);
    if (centerTextArea) {
      setTextPosY((diplomaHeightCm - newValue) / 2);
    }
    setSelectedConfiguration('custom');
  };

  const handleTextPosXChange = (e) => {
    setTextPosX(parseFloat(e.target.value) || 0);
    setSelectedConfiguration('custom');
  };

  const handleTextPosYChange = (e) => {
    setTextPosY(parseFloat(e.target.value) || 0);
    setSelectedConfiguration('custom');
  };

  // rotate
  const rotateDiploma = () => {
    setDiplomaRotation((prev) => (prev + 90) % 360);
  };

  const rotateTextArea = () => {
    setTextAreaRotation((prev) => (prev + 90) % 360);
  };

  // generate images
  const generateImages = async () => {
    const totalPages = Math.ceil(
      namesList.filter((name) => name.enabled).length / itemsPerPage
    );
    const images = [];

    const originalPage = currentPage;
    const originalPreviewMode = previewMode;

    setPreviewMode('lista');

    for (let i = 0; i < totalPages; i++) {
      setCurrentPage(i);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/jpeg');
      images.push(imageData);
    }

    // initial state
    setCurrentPage(originalPage);
    setPreviewMode(originalPreviewMode);

    // Download
    images.forEach((dataUrl, index) => {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `pagina_${index + 1}.jpg`;
      link.click();
    });
  };

  return (
    <div className="container">
      <h1>Generador de Diplomas</h1>

      <div className="fixed-bar">
        <button className="generate-button" onClick={generateImages}>
          GENERAR
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
                ref={imgInputRef}
              />
            </label>
          </button>
          <span>
            {imgPath !== ''
              ? 'Imagen seleccionada  '
              : 'Seleccione imagen de fondo '}
          </span>
          {imgPath !== '' ? (
            <button
              onClick={() => {
                setImgPath('');
                if (imgInputRef.current) {
                  imgInputRef.current.value = '';
                }
              }}
            >
              {' '}
              Eliminar Imagen
            </button>
          ) : (
            ''
          )}
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
          <span>
            {fontPath.name
              ? fontPath.name + '  '
              : 'Seleccione tipo de letra  '}
          </span>
          {fontPath.name ? (
            <button
              onClick={() => {
                setFontPath('');
                setFontFamily('Arial');
                if (fontInputRef.current) {
                  fontInputRef.current.value = '';
                }
              }}
            >
              Eliminar Letra
            </button>
          ) : (
            ''
          )}
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
          <span>
            {listPath.name
              ? listPath.name + '  '
              : 'Seleccione nombres (separados por coma)  '}
          </span>
          {listPath.name ? (
            <button
              onClick={() => {
                setListPath('');
                setNamesList([]);
                if (listInputRef.current) {
                  listInputRef.current.value = '';
                }
              }}
            >
              Eliminar Lista
            </button>
          ) : (
            ''
          )}
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
            <button onClick={addName}>
              {editIndex !== null ? 'Guardar' : 'Añadir'}
            </button>
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
          <div className="radio-group">
            <label>Configuración Predeterminada:</label>
            <label>
              <input
                type="radio"
                value="small"
                checked={selectedConfiguration === 'small'}
                onChange={() => setSelectedConfiguration('small')}
              />
              Tarjeta Pequeña (6x4 cm)
            </label>
            <label>
              <input
                type="radio"
                value="letter"
                checked={selectedConfiguration === 'letter'}
                onChange={() => setSelectedConfiguration('letter')}
              />
              Tamaño Carta
            </label>
            <label>
              <input
                type="radio"
                value="legal"
                checked={selectedConfiguration === 'legal'}
                onChange={() => setSelectedConfiguration('legal')}
              />
              Tamaño Legal
            </label>
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={centerTextArea}
                onChange={(e) => {
                  setCenterTextArea(e.target.checked);
                  setSelectedConfiguration('custom');
                }}
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

          <div className="rotation-buttons">
            <button onClick={rotateDiploma}>Girar Tarjeta</button>
            <button onClick={rotateTextArea}>Girar Área de Texto</button>
          </div>

          <div
            ref={resizableBoxRef}
            className="resizable-box"
            data-x="0"
            data-y="0"
            style={{
              backgroundImage: imgPath ? `url(${imgPath})` : null,
              backgroundColor: !imgPath ? diplomaBgColor : null,
              backgroundSize: 'cover',
              width: `${cmToPx(diplomaWidthCm)}px`,
              height: `${cmToPx(diplomaHeightCm)}px`,
              margin: '0 auto',
              position: 'relative',
              transform: `translate(0px, 0px) rotate(${diplomaRotation}deg)`,
            }}
          >
            <div
              ref={textBoxRef}
              className="text-box"
              data-x="0"
              data-y="0"
              style={{
                backgroundColor: highlightTextArea
                  ? 'rgba(255, 215, 0, 0.5)'
                  : 'transparent',
                width: `${cmToPx(textAreaWidthCm)}px`,
                height: `${cmToPx(textAreaHeightCm)}px`,
                color: textColor,
                textAlign: textAlignOption,
                fontFamily: fontFamily,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                transform: centerTextArea
                  ? `translate(${(cmToPx(diplomaWidthCm) - cmToPx(textAreaWidthCm)) / 2
                  }px, ${(cmToPx(diplomaHeightCm) - cmToPx(textAreaHeightCm)) / 2
                  }px) rotate(${textAreaRotation}deg)`
                  : `translate(${cmToPx(textPosX)}px, ${cmToPx(
                    textPosY
                  )}px) rotate(${textAreaRotation}deg)`,
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                const newText = prompt(
                  'Ingrese el texto de ejemplo:',
                  exampleText
                );
                if (newText !== null) {
                  setExampleText(newText);
                }
              }}
            >
              {exampleText
                .split(' ')
                .reduce((resultArray, word, index) => {
                  const chunkIndex = Math.floor(
                    index /
                    Math.ceil(exampleText.split(' ').length / numberOfLines)
                  );
                  if (!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = '';
                  }
                  resultArray[chunkIndex] +=
                    (resultArray[chunkIndex] ? ' ' : '') + word;
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
              onChange={handleDiplomaWidthChange}
            />
            <label>Alto (cm):</label>
            <input
              type="number"
              value={diplomaHeightCm}
              onChange={handleDiplomaHeightChange}
            />

            <label>Ancho del área de texto (cm):</label>
            <input
              type="number"
              value={textAreaWidthCm}
              onChange={handleTextAreaWidthChange}
            />
            <label>Alto del área de texto (cm):</label>
            <input
              type="number"
              value={textAreaHeightCm}
              onChange={handleTextAreaHeightChange}
            />

            <label>Posición X del texto (cm):</label>
            <input
              type="number"
              value={textPosX}
              onChange={handleTextPosXChange}
              disabled={centerTextArea}
            />
            <label>Posición Y del texto (cm):</label>
            <input
              type="number"
              value={textPosY}
              onChange={handleTextPosYChange}
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
          <select value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
            <option value="carta">Carta</option>
            <option value="legal">Legal</option>
            <option value="custom">Personalizado</option>
          </select>
          {pageSize === 'custom' && (
            <div className="input-group">
              <label>Ancho de página (cm):</label>
              <input
                type="number"
                value={customPageWidthCm}
                onChange={(e) =>
                  setCustomPageWidthCm(parseFloat(e.target.value) || 0)
                }
              />
              <label>Alto de página (cm):</label>
              <input
                type="number"
                value={customPageHeightCm}
                onChange={(e) =>
                  setCustomPageHeightCm(parseFloat(e.target.value) || 0)
                }
              />
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
              <label>Cantidad de tarjetas por página:</label>
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
                onChange={(e) =>
                  setManualMargin(parseFloat(e.target.value) || 0)
                }
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
              Math.ceil(
                namesList.filter((name) => name.enabled).length / itemsPerPage
              ) -
              1
            }
          >
            {'>'}
          </button>
          <button
            onClick={() => handlePageNavigation('last')}
            disabled={
              currentPage >=
              Math.ceil(
                namesList.filter((name) => name.enabled).length / itemsPerPage
              ) -
              1
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
