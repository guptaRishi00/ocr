import { useState } from "react";

export interface DemoImage {
  id: string;
  name: string;
  url: string;
  description: string;
  expectedText: string;
}

export const useDemoImages = () => {
  const [selectedDemo, setSelectedDemo] = useState<DemoImage | null>(null);

  // No demo images - demo functionality removed
  const demoImages: DemoImage[] = [];

  const selectDemo = (demo: DemoImage) => {
    setSelectedDemo(demo);
  };

  const clearDemo = () => {
    setSelectedDemo(null);
  };

  // No demo functionality
  const getDemoAsFile = async (demo: DemoImage): Promise<File | null> => {
    return null;
  };

  return {
    demoImages,
    selectedDemo,
    selectDemo,
    clearDemo,
    getDemoAsFile,
  };
};
