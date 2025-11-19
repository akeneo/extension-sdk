import { useDesignSystem, type DesignSystem } from '../contexts/DesignSystemContext';

export const DesignSystemSelector = () => {
  const { designSystem, setDesignSystem } = useDesignSystem();

  const tabs = [
    { value: 'akeneo' as DesignSystem, label: 'Akeneo Design System' },
    { value: 'shadcn' as DesignSystem, label: 'shadcn/ui' },
    { value: 'polaris' as DesignSystem, label: 'Shopify Polaris' },
  ];

  return (
    <div className="w-full bg-muted/30">
      <div className="flex items-end gap-1 pt-4 pl-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setDesignSystem(tab.value)}
            className={`
              relative px-6 py-3 text-sm font-medium
              transition-all duration-200
              rounded-t-lg outline-none
              ${designSystem === tab.value
                ? 'bg-background text-foreground shadow-lg z-10'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
