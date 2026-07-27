import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Tabs,
  Tooltip,
  Dropdown,
  Label,
  toast,
} from "@heroui/react";
import {
  Play,
  Pause,
  RotateCcw,
  Repeat,
  RepeatOff,
  EllipsisVertical,
  Trash2,
  Clock,
  Coffee,
  Check,
} from "lucide-react";

const FOCUS_OPTIONS = [15, 20, 25, 30, 45, 60];
const BREAK_OPTIONS = [3, 5, 10, 15, 20];

export function PomodoroWidget({ isOverlay, attributes, listeners, onDelete }) {
  const [modeTimes, setModeTimes] = useState({
    focus: 25 * 60,
    break: 5 * 60,
  });
  const [mode, setMode] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(modeTimes.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [isAutoSwitch, setIsAutoSwitch] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (isAutoSwitch) {
        const nextMode = mode === "focus" ? "break" : "focus";
        setMode(nextMode);
        setTimeLeft(modeTimes[nextMode]);
      } else {
        setIsRunning(false);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isAutoSwitch, mode, modeTimes]);

  const handleModeChange = (key) => {
    const selectedMode = String(key);
    setMode(selectedMode);
    setTimeLeft(modeTimes[selectedMode]);
    setIsRunning(false);
  };

  const handleSetDuration = (targetMode, minutes) => {
    const seconds = minutes * 60;
    setModeTimes((prev) => ({
      ...prev,
      [targetMode]: seconds,
    }));
    if (mode === targetMode) {
      setTimeLeft(seconds);
      setIsRunning(false);
    }
    toast.success(
      `${targetMode === "focus" ? "Focus" : "Break"} time set to ${minutes} mins`,
    );
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modeTimes[mode]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card
      className={`group/card card-bg w-full p-3 ${isOverlay ? "shadow-2xl scale-101" : ""}`}
    >
      <Card.Header
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing pb-2 select-none flex flex-row justify-between items-center"
      >
        <Card.Title>Pomodoro</Card.Title>

        <div
          className={`transition-opacity duration-200 ${
            isMenuOpen
              ? "opacity-100"
              : "opacity-0 group-hover/card:opacity-100"
          }`}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Dropdown onOpenChange={setIsMenuOpen}>
            <Button
              isIconOnly
              aria-label="Menu"
              variant="ghost"
              size="sm"
              className="hover:bg-transparent shadow-none w-6 h-6 min-w-6 p-0"
            >
              <EllipsisVertical className="size-4 shrink-0 transition-colors text-muted" />
            </Button>
            <Dropdown.Popover placement="bottom left">
              <Dropdown.Menu
                onAction={(key) => {
                  if (key === "delete" && onDelete) {
                    onDelete();
                    toast.success("Widget deleted successfully");
                  }
                }}
              >
                <Dropdown.SubmenuTrigger>
                  <Dropdown.Item id="focus-duration" textValue="Focus Duration">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4" />
                      <Label className="cursor-pointer capitalize">
                        Focus Duration
                      </Label>
                    </div>
                    <Dropdown.SubmenuIndicator />
                  </Dropdown.Item>
                  <Dropdown.Popover placement="start top">
                    <Dropdown.Menu
                      onAction={(key) =>
                        handleSetDuration("focus", Number(key))
                      }
                    >
                      {FOCUS_OPTIONS.map((mins) => (
                        <Dropdown.Item
                          key={mins}
                          id={mins}
                          textValue={`${mins} mins`}
                        >
                          <div className="flex items-center justify-between w-full gap-4">
                            <Label className="cursor-pointer">
                              {mins} mins
                            </Label>
                            {modeTimes.focus === mins * 60 && (
                              <Check className="size-4 text-accent" />
                            )}
                          </div>
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown.SubmenuTrigger>

                <Dropdown.SubmenuTrigger>
                  <Dropdown.Item id="break-duration" textValue="Break Duration">
                    <div className="flex items-center gap-2">
                      <Coffee className="size-4" />
                      <Label className="cursor-pointer capitalize">
                        Break Duration
                      </Label>
                    </div>
                    <Dropdown.SubmenuIndicator />
                  </Dropdown.Item>
                  <Dropdown.Popover placement="start top">
                    <Dropdown.Menu
                      onAction={(key) =>
                        handleSetDuration("break", Number(key))
                      }
                    >
                      {BREAK_OPTIONS.map((mins) => (
                        <Dropdown.Item
                          key={mins}
                          id={mins}
                          textValue={`${mins} mins`}
                        >
                          <div className="flex items-center justify-between w-full gap-4">
                            <Label className="cursor-pointer">
                              {mins} mins
                            </Label>
                            {modeTimes.break === mins * 60 && (
                              <Check className="size-4 text-accent" />
                            )}
                          </div>
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown.SubmenuTrigger>

                <Dropdown.Item id="delete" textValue="delete" variant="danger">
                  <div className="flex items-center gap-2">
                    <Trash2 className="size-4 text-danger" />
                    <Label className="cursor-pointer capitalize text-danger">
                      Delete
                    </Label>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      </Card.Header>

      <Card.Content className="p-0 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center py-2">
          <span className="text-5xl font-light tracking-tight font-mono">
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Tooltip delay={1000} closeDelay={300}>
            <Tooltip.Trigger>
              <Button
                isIconOnly
                variant="tertiary"
                size="sm"
                onClick={resetTimer}
                aria-label="Reset Timer"
                className="secondary-bg"
              >
                <RotateCcw className="size-4" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content placement="bottom">Reset Timer</Tooltip.Content>
          </Tooltip>

          <Tooltip delay={1000} closeDelay={300}>
            <Tooltip.Trigger>
              <Button
                isIconOnly
                size="lg"
                onClick={toggleTimer}
                aria-label={isRunning ? "Pause Timer" : "Start Timer"}
                className="rounded-full"
              >
                {isRunning ? (
                  <Pause className="size-5 fill-current" />
                ) : (
                  <Play className="size-5 fill-current" />
                )}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content placement="bottom">
              {isRunning ? "Pause Timer" : "Start Timer"}
            </Tooltip.Content>
          </Tooltip>

          <Tooltip delay={1000} closeDelay={300}>
            <Tooltip.Trigger>
              <Button
                isIconOnly
                variant="tertiary"
                size="sm"
                onClick={() => setIsAutoSwitch(!isAutoSwitch)}
                aria-label="Auto Switch Mode"
                className="secondary-bg"
              >
                {isAutoSwitch ? (
                  <Repeat className="size-4" />
                ) : (
                  <RepeatOff className="size-4 opacity-50" />
                )}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content placement="bottom">
              {isAutoSwitch ? "Disable Auto-start" : "Enable Auto-start"}
            </Tooltip.Content>
          </Tooltip>
        </div>

        <Tabs
          selectedKey={mode}
          onSelectionChange={handleModeChange}
          className="w-full"
        >
          <Tabs.ListContainer className="w-full secondary-bg">
            <Tabs.List aria-label="Pomodoro Modes">
              {Object.keys(modeTimes).map((m) => {
                const isSelected = mode === m;

                return (
                  <Tabs.Tab
                    key={m}
                    id={m}
                    className="capitalize transition-colors duration-200"
                    style={{
                      color: isSelected ? "#ffffff" : undefined,
                    }}
                  >
                    {m}
                    <Tabs.Indicator />
                  </Tabs.Tab>
                );
              })}
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      </Card.Content>
    </Card>
  );
}

export default PomodoroWidget;
