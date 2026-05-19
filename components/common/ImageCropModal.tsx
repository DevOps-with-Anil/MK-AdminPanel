import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
import React, { useCallback, useState } from "react";

type Props = {
  open: boolean;
  image: string | null;
  aspect?: number;
  onCancel: () => void;
  onComplete: (file: File) => void;
};

export const ImageCropModal = ({
  open,
  image,
  aspect = 1,
  onCancel,
  onComplete,
}: Props) => {

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_: any, cropped: any) => {
    setCroppedAreaPixels(cropped);
  }, []);

  const createImage = async () => {
    if (!image || !croppedAreaPixels) return null;

    const img = new Image();
    img.src = image;

    await new Promise((res) => (img.onload = res));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx?.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;

        resolve(
          new File([blob], "cropped.jpg", {
            type: "image/jpeg",
          })
        );
      }, "image/jpeg", 0.95);
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >

          {/* MODAL BOX */}
          <motion.div
            className="bg-white w-[420px] rounded-xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >

            {/* CROPPER */}
            <div className="relative w-full h-[480px] bg-black">
              <Cropper
                image={image || ""}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* CONTROLS */}
            <div className="p-4 space-y-3">

              {/* ZOOM */}
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />

              {/* ACTIONS */}
              <div className="flex justify-end gap-2">

                <button
                  onClick={onCancel}
                  className="px-3 py-1 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    const file = await createImage();
                    if (file) onComplete(file);
                  }}
                  className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Crop
                </button>

              </div>

            </div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};