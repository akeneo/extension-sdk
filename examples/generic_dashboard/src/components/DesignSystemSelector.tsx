import { useDesignSystem, type DesignSystem } from '../contexts/DesignSystemContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const DesignSystemSelector = () => {
  const { designSystem, setDesignSystem } = useDesignSystem();

  return (
    <div className="w-full bg-muted/30 border-b border-border py-6">
      <div className="flex flex-col items-center justify-center gap-3 max-w-7xl mx-auto px-4">
        <label htmlFor="design-system-select" className="text-base font-semibold text-foreground">
          Choose your design system
        </label>
        <Select
          value={designSystem}
          onValueChange={(value) => setDesignSystem(value as DesignSystem)}
        >
          <SelectTrigger id="design-system-select" className="w-[280px]">
            <SelectValue placeholder="Select design system" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Custom UI</SelectItem>
            <SelectItem value="akeneo">Akeneo Design System</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
