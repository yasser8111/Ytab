import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  Modal,
  Label,
  Slider,
  ColorPicker,
  ColorArea,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  ColorField,
  Button,
  parseColor,
} from "@heroui/react";
import { Shuffle } from "lucide-react";

const colors = [
  "#F43F5E",
  "#D946EF",
  "#8B5CF6",
  "#3B82F6",
  "#06B6D4",
  "#10B981",
  "#84CC16",
];

const colorPresets = [
  "#F43F5E",
  "#D946EF",
  "#8B5CF6",
  "#3B82F6",
  "#06B6D4",
  "#10B981",
];

export function CustomizeModal({ isOpen, onOpenChange }) {
  const { customization, updateCustomization } = useTheme();

  const [color, setColor] = useState(() =>
    parseColor(customization.accentColor || "#3B82F6"),
  );

  useEffect(() => {
    if (customization.accentColor) {
      setColor(parseColor(customization.accentColor));
    }
  }, [customization.accentColor]);

  const handleColorChange = (newColor) => {
    setColor(newColor);
    const hex = newColor.toString("hex");
    updateCustomization("accentColor", hex.startsWith("#") ? hex : `#${hex}`);
  };

  const handleSwatchSelect = (selectedColor) => {
    const hex = selectedColor.toString();
    setColor(parseColor(hex));
    updateCustomization("accentColor", hex);
  };

  const shuffleColor = () => {
    const randomHue = Math.floor(Math.random() * 360);
    const randomSaturation = 50 + Math.floor(Math.random() * 50);
    const randomLightness = 40 + Math.floor(Math.random() * 30);
    const newColor = parseColor(
      `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`,
    );
    handleColorChange(newColor);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop variant="transparent">
        <Modal.Container placement="bottom">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className="flex items-center gap-2">
                Customize Appearance
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body className="space-y-6 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <ColorSwatchPicker
                    value={customization.accentColor}
                    onChange={handleSwatchSelect}
                    className="flex items-center gap-2"
                  >
                    {colors.map((color) => (
                      <ColorSwatchPicker.Item key={color} color={color}>
                        <ColorSwatchPicker.Swatch />
                        <ColorSwatchPicker.Indicator />
                      </ColorSwatchPicker.Item>
                    ))}
                  </ColorSwatchPicker>

                  <ColorPicker value={color} onChange={handleColorChange}>
                    <ColorPicker.Trigger className="p-0 border-none bg-transparent hover:bg-transparent min-w-0">
                      <div className="relative flex items-center justify-center size-8 rounded-full border-2 border-dashed border-default-400 hover:border-primary transition-colors cursor-pointer overflow-hidden p-0.5">
                        <ColorSwatch className="size-full rounded-full" />
                      </div>
                    </ColorPicker.Trigger>
                    <ColorPicker.Popover className="gap-2">
                      <ColorArea
                        aria-label="Color area"
                        className="max-w-full"
                        colorSpace="hsb"
                        xChannel="saturation"
                        yChannel="brightness"
                      >
                        <ColorArea.Thumb />
                      </ColorArea>
                      <div className="flex items-center gap-2 px-1">
                        <ColorSlider
                          aria-label="Hue slider"
                          channel="hue"
                          className="flex-1"
                          colorSpace="hsb"
                        >
                          <ColorSlider.Track>
                            <ColorSlider.Thumb />
                          </ColorSlider.Track>
                        </ColorSlider>
                        <Button
                          isIconOnly
                          aria-label="Shuffle color"
                          size="sm"
                          variant="tertiary"
                          onPress={shuffleColor}
                        >
                          <Shuffle className="size-4 shrink-0" />
                        </Button>
                      </div>
                      <ColorField aria-label="Color field">
                        <ColorField.Group variant="secondary">
                          <ColorField.Prefix>
                            <ColorSwatch size="xs" />
                          </ColorField.Prefix>
                          <ColorField.Input />
                        </ColorField.Group>
                      </ColorField>
                    </ColorPicker.Popover>
                  </ColorPicker>
                </div>
              </div>

              <div>
                <Slider
                  className="w-full max-w-xs"
                  minValue={0}
                  maxValue={1}
                  step={0.05}
                  value={customization.opacity}
                  onChange={(val) => updateCustomization("opacity", val)}
                >
                  <div className="flex justify-between items-center mb-1 dir-rtl">
                    <Label className="text-sm font-medium">Card Opacity</Label>
                    <Slider.Output className="text-sm font-medium" />
                  </div>
                  <Slider.Track>
                    <Slider.Fill />
                    <Slider.Thumb />
                  </Slider.Track>
                </Slider>
              </div>

              <div>
                <Slider
                  className="w-full max-w-xs"
                  minValue={0}
                  maxValue={40}
                  step={1}
                  value={customization.blur}
                  onChange={(val) => updateCustomization("blur", val)}
                >
                  <Label>Card Blur (px)</Label>
                  <Slider.Output />
                  <Slider.Track>
                    <Slider.Fill />
                    <Slider.Thumb />
                  </Slider.Track>
                </Slider>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default CustomizeModal;
