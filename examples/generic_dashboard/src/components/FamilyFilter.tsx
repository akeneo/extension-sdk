import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// This now matches the processed data from the hook
interface FamilyRecord {
    code: string;
    label: string;
}

interface FamilyFilterProps {
    families: FamilyRecord[];
    selectedFamily: string | null;
    onFamilyChange: (value: string) => void;
    loading: boolean;
}

const FamilyFilter: React.FC<FamilyFilterProps> = ({ 
    families, 
    selectedFamily, 
    onFamilyChange, 
    loading 
}) => {
    if (loading) {
        return <p className="text-sm text-muted-foreground">Loading families...</p>;
    }

    // Find the full object for the currently selected family to display its label
    const selectedFamilyObject = families.find(f => f.code === selectedFamily);

    return (
        <div className="flex items-center gap-4">
            <label htmlFor="family-filter" className="text-sm font-medium">Family</label>
            <Select
                value={selectedFamily || ''}
                onValueChange={onFamilyChange}
            >
                <SelectTrigger id="family-filter" className="w-[280px]">
                    {/* Display the label of the selected item */}
                    <SelectValue placeholder="Select a family">
                        {selectedFamilyObject ? selectedFamilyObject.label : "Select a family"}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {families.map((family) => (
                        <SelectItem key={family.code} value={family.code}>
                            {/* Display the label in the dropdown list */}
                            {family.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export { FamilyFilter };
