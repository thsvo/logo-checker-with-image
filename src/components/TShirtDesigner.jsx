import { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";

const TShirtDesigner = () => {
  const [tshirtImage, setTshirtImage] = useState("/shirt.jpg"); 
  const [logo, setLogo] = useState(null);
  const designRef = useRef(null);
  const dropZoneRef = useRef(null);

  const setCombinedRefs = (el) => {
    designRef.current = el;
    dropZoneRef.current = el;
  };

  const handleTShirtUpload = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setTshirtImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (designRef.current) {
      const designWidth = designRef.current.offsetWidth;
      const designHeight = designRef.current.offsetHeight;

      const canvas = await html2canvas(designRef.current, {
        useCORS: true,
        width: designWidth,
        height: designHeight,
        x: 0,
        y: 0,
        scale: 1,
      });

      const link = document.createElement("a");
      link.download = "tshirt-design.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.style.borderColor = "#4CAF50";
    }
  };

  const handleDragLeave = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.style.borderColor = "#e5e7eb";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.style.borderColor = "#e5e7eb";
    }
    handleLogoUpload(e);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 space-y-4 bg-gray-100">
      <h1 className="text-2xl font-bold">Logo Designer Builder</h1>

      <div className="flex flex-col lg:flex-row items-center space-y-4 gap-10 relative">
        <div
          ref={setCombinedRefs}
          className="relative w-96 h-96 bg-white shadow-xl rounded overflow-hidden border border-gray-300"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <img
            src={tshirtImage}
            alt="Design"
            className="w-full h-full object-cover"
          />
          {logo && (
            <Rnd
              bounds="parent"
              default={{
                x: 100,
                y: 100,
                width: 100,
                height: 100,
              }}
              lockAspectRatio
              className="absolute cursor-move"
            >
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </Rnd>
          )}

          {!logo && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 border-2 border-dashed border-gray-300 text-gray-500">
              Drag and Drop Logo Here
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 text-center">
            Upload Design
            <input
              type="file"
              accept="image/*"
              onChange={handleTShirtUpload}
              className="hidden"
            />
          </label>

          <label className="px-4 py-2 bg-purple-500 text-white rounded cursor-pointer hover:bg-purple-600 text-center">
            Upload Logo
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center"
          >
            Download Design
          </button>
        </div>
      </div>
    </div>
  );
};

export default TShirtDesigner;
