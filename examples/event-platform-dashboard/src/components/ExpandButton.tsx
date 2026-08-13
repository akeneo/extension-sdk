import {ArrowDownIcon, ArrowRightIcon, IconButton} from 'akeneo-design-system';

type ExpandButtonProps = {
    expanded: boolean;
    onToggle: () => void;
    label: string;
};

const ExpandButton = ({expanded, onToggle, label}: ExpandButtonProps) => (
    <IconButton
        ghost="borderless"
        level="tertiary"
        size="small"
        title={label}
        icon={expanded ? <ArrowDownIcon /> : <ArrowRightIcon />}
        onClick={onToggle}
    />
);

export default ExpandButton;
