import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [fontPath, setFontPath] = useState('');
  const [imgPath, setImgPath] = useState('');
  const [listPath, setListPath] = useState('');
  const [namesList, setNamesList] = useState([]);

  const canvasRef = useRef(null);

  const cmToPx = (cm) => (cm * 96) / 2.54;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const sizeInPx = cmToPx(5);
    canvas.width = sizeInPx;
    canvas.height = sizeInPx;

    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

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
        <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
      </div>
      
    </div>
  );
}

export default App;