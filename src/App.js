import React, { useState } from 'react';

function App() {
  const [fontPath, setFontPath] = useState('');
  const [imgPath, setImgPath] = useState('');

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
            <input type="file" accept="image/*" onChange={selectBackgroundImage} style={{ display: 'none' }} />
          </label>
        </button>
        <span>{imgPath ? 'Imagen seleccionada' : 'Seleccione imagen de fondo'}</span>
      </div>

    </div>
  );
}

export default App;