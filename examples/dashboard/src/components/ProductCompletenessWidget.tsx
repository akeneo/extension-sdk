import { useState, useEffect } from 'react';
import {
    Table,
    Button,
    SectionTitle,
    // Badge,
    Helper,
} from 'akeneo-design-system';
import { useLeastCompleteProducts } from '../hooks/useLeastCompleteProducts';

// Helper function to determine completeness level badge color
/* const getCompletenessLevel = (value: number): 'danger' | 'warning' | 'primary' => {
    if (value < 30) return 'danger';
    if (value < 70) return 'warning';
    return 'primary';
}; */

export function ProductCompletenessWidget() {
    const [families, setFamilies] = useState<any[]>([]);
    const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const { products, loading: loadingProducts } = useLeastCompleteProducts({ selectedFamily });

    // Fetch families for dropdown
    useEffect(() => {
        const fetchFamilies = async () => {
            const familyApi = globalThis.PIM.api.family_v1;
            const response = await familyApi.list({ limit: 5 });
            setFamilies(response.items || []);
            if (response.items && response.items.length > 0) {
                setSelectedFamily(response.items[0].code);
            }
        };
        fetchFamilies();
    }, []);

    // Handle click outside to close the dropdown
    useEffect(() => {
        if (!dropdownOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.family-dropdown')) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    // Handler for product click
    const openProduct = (uuid: string) => {
        try {
            // Navigate to the product edit page using the internal navigation
            globalThis.PIM.navigate.internal(`#/enrich/product/${uuid}`);
        } catch (e) {
            console.error('Failed to navigate to product:', e);
        }
    };

    // Styles for iframe-friendly display
    const widgetStyle = {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        height: '100%',
        boxSizing: 'border-box' as const
    };

    const headerContainerStyle = {
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap' as const,
        gap: '12px'
    };

    const titleContainerStyle = {
        flexGrow: 1,
        minWidth: '180px'
    };

    const titleStyle = {
        color: '#58316f',
        fontSize: '18px',
        marginBottom: '0'
    };

    const dropdownContainerStyle = {
        position: 'relative' as const,
        zIndex: 10
    };

    const dropdownButtonStyle = {
        minWidth: '180px',
        textAlign: 'left' as const,
        justifyContent: 'space-between',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis' as const,
        whiteSpace: 'nowrap' as const
    };

    const dropdownMenuStyle = {
        position: 'absolute' as const,
        top: 'calc(100% + 4px)',
        right: 0,
        zIndex: 100,
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
        maxHeight: '200px',
        overflowY: 'auto' as const,
        width: '200px',
        // Ensure the dropdown doesn't go out of the iframe
        maxWidth: 'calc(100vw - 40px)'
    };

    const tableContainerStyle = {
        width: '100%',
        overflowX: 'auto' as const,
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    };

    const dropdownItemStyle = (isSelected: boolean) => ({
        padding: '8px 12px',
        cursor: 'pointer',
        borderBottom: '1px solid #eee',
        backgroundColor: isSelected ? '#f5f5f5' : 'transparent',
        transition: 'background-color 0.2s',
        overflow: 'hidden',
        textOverflow: 'ellipsis' as const,
        whiteSpace: 'nowrap' as const
    });

    return (
        <div style={widgetStyle}>
            <div style={headerContainerStyle}>
                <div style={titleContainerStyle}>
                    <SectionTitle>
                        <SectionTitle.Title style={titleStyle}>Incomplete Products</SectionTitle.Title>
                    </SectionTitle>
                </div>
                <div className="family-dropdown" style={dropdownContainerStyle}>
                    <Button
                        level="secondary"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        style={dropdownButtonStyle}
                    >
                        {selectedFamily ?
                            families.find(fam => fam.code === selectedFamily)?.labels?.en_US || selectedFamily
                            : 'Select a family'}
                        <span style={{ marginLeft: '8px' }}>▼</span>
                    </Button>

                    {dropdownOpen && (
                        <div style={dropdownMenuStyle}>
                            {families.map(fam => (
                                <div
                                    key={fam.code}
                                    style={dropdownItemStyle(fam.code === selectedFamily)}
                                    onClick={() => {
                                        setSelectedFamily(fam.code);
                                        setDropdownOpen(false);
                                    }}
                                    onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#f0f0f0'}}
                                    onMouseOut={(e) => {e.currentTarget.style.backgroundColor = fam.code === selectedFamily ? '#f5f5f5' : 'transparent'}}
                                >
                                    {fam.labels?.en_US || fam.code}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {loadingProducts ? (
                <Helper level="info">Loading products...</Helper>
            ) : products.length === 0 ? (
                <Helper level="warning">No products found for this family.</Helper>
            ) : (
                <div style={tableContainerStyle}>
                    <Table>
                        <Table.Header>
                            <Table.HeaderCell>Product</Table.HeaderCell>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            {/* <Table.HeaderCell>Completeness</Table.HeaderCell> */}
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Header>
                        <Table.Body>
                            {products.map(prod => (
                                <Table.Row key={prod.uuid}>
                                    <Table.Cell>
                                        {prod.values?.name?.[0]?.data || prod.identifier}
                                    </Table.Cell>
                                    <Table.Cell>{prod.uuid || prod.code}</Table.Cell>
{/*                                     <Table.Cell>
                                        <Badge level={getCompletenessLevel(prod.completenessValue || 0)}>
                                            {prod.completenessValue || 0}%
                                        </Badge>
                                    </Table.Cell> */}
                                    <Table.Cell>
                                        <Button
                                            level="tertiary"
                                            onClick={() => openProduct(prod.uuid)}
                                        >
                                            View
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            )}
        </div>
    );
}
