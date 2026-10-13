/* eslint-disable react/jsx-no-literals */
import React, { useState, useEffect } from "react";
import {
  getSpeedMultiplier,
  setSpeedMultiplier,
} from "features/game/lib/gameSpeed";
import { resetOfflineFarm } from "features/game/lib/preview/previewState";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

export const SpeedControlWidget: React.FC = () => {
  const [speed, setSpeed] = useState(getSpeedMultiplier());
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  useEffect(() => {
    const handleSpeedChange = () => {
      setSpeed(getSpeedMultiplier());
    };
    window.addEventListener("sfl_speed_changed", handleSpeedChange);
    return () =>
      window.removeEventListener("sfl_speed_changed", handleSpeedChange);
  }, []);

  const handleSelectSpeed = (newSpeed: number) => {
    setSpeedMultiplier(newSpeed);
    setSpeed(newSpeed);
    // Reload to apply new scaled definitions to loaded structures
    window.location.reload();
  };

  return (
    <>
      <div
        className="bg-brown-600 border-2 border-brown-700 text-white rounded-md p-1.5 shadow-md flex items-center space-x-1.5 text-xs select-none"
        style={{ zIndex: 50 }}
      >
        <span className="font-bold flex items-center gap-0.5">⚡ {speed}x</span>
        <button
          className={`px-1.5 py-0.5 rounded ${speed === 1 ? "bg-green-600 font-bold" : "bg-brown-700 hover:bg-brown-500"}`}
          onClick={() => handleSelectSpeed(1)}
          title="Tốc độ mặc định 1x"
        >
          1x
        </button>
        <button
          className={`px-1.5 py-0.5 rounded ${speed === 5 ? "bg-green-600 font-bold" : "bg-brown-700 hover:bg-brown-500"}`}
          onClick={() => handleSelectSpeed(5)}
          title="Tăng tốc 5x"
        >
          5x
        </button>
        <button
          className={`px-1.5 py-0.5 rounded ${speed === 10 ? "bg-green-600 font-bold" : "bg-brown-700 hover:bg-brown-500"}`}
          onClick={() => handleSelectSpeed(10)}
          title="Tăng tốc 10x"
        >
          10x
        </button>
        <button
          className="px-1.5 py-0.5 rounded bg-red-700 hover:bg-red-600 ml-1"
          onClick={() => setShowConfirmReset(true)}
          title="Chơi lại từ đầu"
        >
          🔄
        </button>
      </div>

      <Modal show={showConfirmReset} onHide={() => setShowConfirmReset(false)}>
        <Panel>
          <div className="p-2 space-y-3">
            <h2 className="text-base font-bold text-center">
              Xóa dữ liệu & Chơi lại từ đầu?
            </h2>
            <p className="text-sm text-center">
              Toàn bộ tiến trình nông trại đã lưu trên máy sẽ bị xóa và bắt đầu
              lại với nông trại mới.
            </p>
            <div className="flex space-x-2">
              <Button onClick={() => setShowConfirmReset(false)}>Hủy</Button>
              <Button onClick={() => resetOfflineFarm()}>Đồng ý</Button>
            </div>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
