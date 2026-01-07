import { useState, useEffect } from 'react';
import {
  SectionTitle,
  Field,
  SelectInput,
  Button,
  Helper,
  SkeletonPlaceholder
} from 'akeneo-design-system';
import styled, { createGlobalStyle } from 'styled-components';

// Declare PIM global - using any for flexibility with custom_variables
declare const PIM: any;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: 'Lato', sans-serif;
`;

const Header = styled.div`
  padding: 0 0 20px 0;
`;

const Content = styled.div`
  flex: 1;
`;

const FormField = styled.div`
  max-width: 400px;
  margin-bottom: 20px;
`;

const SaveButtonContainer = styled.div`
  margin-top: 20px;
`;

const MessageContainer = styled.div`
  margin-bottom: 20px;
  max-width: 600px;
`;

const CategoryCode = styled.span`
  color: #a1a9b7;
`;

const DropdownFontOverride = createGlobalStyle`
  [class^="sc-"] {
    font-family: Helvetica, Arial, sans-serif !important;
  }
`;

interface CategoryOption {
  code: string;
  label: string;
}

interface CategoryData {
  code: string;
  labels: Record<string, string>;
  parent: string | null;
}

const App = () => {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentMainCategory, setCurrentMainCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Get configuration from custom variables
  const attributeCode = PIM?.custom_variables?.mainCategoryAttributeCode;
  const categoryTreeCode = PIM?.custom_variables?.categoryTreeCode;

  // Get product UUID from context
  const getProductUuid = (): string | null => {
    if (PIM?.context?.product?.uuid) {
      return PIM.context.product.uuid;
    }
    return null;
  };

  // Check if a category belongs to the configured tree
  const isInCategoryTree = async (categoryCode: string, allCategories: Map<string, CategoryData>): Promise<boolean> => {
    if (!categoryTreeCode) return true; // No filter configured

    let current = allCategories.get(categoryCode);
    while (current) {
      if (current.code === categoryTreeCode) return true;
      if (!current.parent) break;
      current = allCategories.get(current.parent);
    }
    return false;
  };

  useEffect(() => {
    loadProductData();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadProductData = async () => {
    setLoading(true);
    setError('');

    if (!attributeCode) {
      setError('Extension not configured. Please set the mainCategoryAttributeCode custom variable.');
      setLoading(false);
      return;
    }

    const productUuid = getProductUuid();
    if (!productUuid) {
      setError('This extension can only be used on product pages.');
      setLoading(false);
      return;
    }

    try {
      const product = await PIM.api.product_uuid_v1.get({
        uuid: productUuid
      });

      const productCategories: string[] = product.categories || [];

      if (productCategories.length === 0) {
        setCategories([]);
        setLoading(false);
        return;
      }

      // Get current main category value
      const mainCategoryValue = product.values?.[attributeCode]?.[0]?.data || '';
      setCurrentMainCategory(mainCategoryValue);
      setSelectedCategory(mainCategoryValue);

      // Fetch category details
      const userLocale = 'en_US';
      const categoryDataMap = new Map<string, CategoryData>();

      // First, fetch all product categories
      await Promise.all(
        productCategories.map(async (categoryCode: string) => {
          try {
            const category = await PIM.api.category_v1.get({ code: categoryCode });
            categoryDataMap.set(categoryCode, {
              code: category.code,
              labels: category.labels || {},
              parent: category.parent || null
            });

            // Also fetch parent chain for tree filtering
            let parentCode = category.parent;
            while (parentCode && !categoryDataMap.has(parentCode)) {
              try {
                const parentCat = await PIM.api.category_v1.get({ code: parentCode });
                categoryDataMap.set(parentCode, {
                  code: parentCat.code,
                  labels: parentCat.labels || {},
                  parent: parentCat.parent || null
                });
                parentCode = parentCat.parent;
              } catch {
                break;
              }
            }
          } catch {
            categoryDataMap.set(categoryCode, {
              code: categoryCode,
              labels: {},
              parent: null
            });
          }
        })
      );

      // Filter categories by tree if configured
      const filteredCategories: CategoryOption[] = [];
      for (const categoryCode of productCategories) {
        const inTree = await isInCategoryTree(categoryCode, categoryDataMap);
        if (inTree) {
          const catData = categoryDataMap.get(categoryCode);
          const label = catData?.labels?.[userLocale] || categoryCode;
          filteredCategories.push({
            code: categoryCode,
            label
          });
        }
      }

      setCategories(filteredCategories);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error loading product data: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const productUuid = getProductUuid();
    if (!selectedCategory || !attributeCode || !productUuid) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await PIM.api.product_uuid_v1.patch({
        uuid: productUuid,
        data: {
          values: {
            [attributeCode]: [{
              data: selectedCategory,
              locale: null,
              scope: null
            }]
          }
        }
      });

      // Check if response contains errors
      if (response?.errors && response.errors.length > 0) {
        const errorMessages = response.errors.map((e: any) => e.message || e.property).join(', ');
        setError(`Validation error: ${errorMessages}`);
        return;
      }

      // Verify the save by re-fetching the product
      const updatedProduct = await PIM.api.product_uuid_v1.get({
        uuid: productUuid
      });

      const savedValue = updatedProduct.values?.[attributeCode]?.[0]?.data;

      if (savedValue !== selectedCategory) {
        setError(`Failed to save. The attribute "${attributeCode}" may not exist or may not be assigned to this product's family.`);
        return;
      }

      setCurrentMainCategory(selectedCategory);
      setSuccess('Main category saved');
      PIM.navigate.refresh();
    } catch (err: unknown) {
      let message = 'Unknown error';
      if (err instanceof Error) {
        message = err.message;
      }
      if (typeof err === 'object' && err !== null) {
        const apiError = err as any;
        if (apiError.response?.data?.message) {
          message = apiError.response.data.message;
        } else if (apiError.message) {
          message = apiError.message;
        }
      }
      setError(`Error saving main category: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Header>
          <SectionTitle>
            <SectionTitle.Title>Main Category Selection</SectionTitle.Title>
          </SectionTitle>
        </Header>
        <Content>
          <FormField>
            <SkeletonPlaceholder>Loading...</SkeletonPlaceholder>
          </FormField>
        </Content>
      </PageContainer>
    );
  }

  if (error && !attributeCode) {
    return (
      <PageContainer>
        <Header>
          <SectionTitle>
            <SectionTitle.Title>Main Category Selection</SectionTitle.Title>
          </SectionTitle>
        </Header>
        <Content>
          <MessageContainer>
            <Helper level="error">{error}</Helper>
          </MessageContainer>
        </Content>
      </PageContainer>
    );
  }

  if (categories.length === 0 && !error) {
    return (
      <PageContainer>
        <Header>
          <SectionTitle>
            <SectionTitle.Title>Main Category Selection</SectionTitle.Title>
          </SectionTitle>
        </Header>
        <Content>
          <MessageContainer>
            <Helper level="warning">
              This product has no categories assigned{categoryTreeCode ? ` in the "${categoryTreeCode}" tree` : ''}. Please assign categories to the product first.
            </Helper>
          </MessageContainer>
        </Content>
      </PageContainer>
    );
  }

  const hasUnsavedChanges = selectedCategory !== currentMainCategory;
  const showMismatchWarning = currentMainCategory &&
    !categories.some(c => c.code === currentMainCategory);

  return (
    <>
      <DropdownFontOverride />
      <PageContainer>
        <Header>
          <SectionTitle>
            <SectionTitle.Title>Main Category Selection</SectionTitle.Title>
          </SectionTitle>
        </Header>
        <Content>
          {error && (
          <MessageContainer>
            <Helper level="error">{error}</Helper>
          </MessageContainer>
        )}

        {success && (
          <MessageContainer>
            <Helper level="success">{success}</Helper>
          </MessageContainer>
        )}

        {showMismatchWarning && (
          <MessageContainer>
            <Helper level="warning">
              The current main category "{currentMainCategory}" is no longer assigned to this product. Please select a new main category.
            </Helper>
          </MessageContainer>
        )}

        <FormField>
          <Field label="Main Category">
            <SelectInput
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value as string)}
              placeholder="Select a main category"
              emptyResultLabel="No categories available"
              openLabel="Open"
              clearable={false}
            >
              {categories.map((category) => (
                <SelectInput.Option key={category.code} value={category.code}>
                  {category.label} <CategoryCode>[{category.code}]</CategoryCode>
                </SelectInput.Option>
              ))}
            </SelectInput>
          </Field>
        </FormField>

        <SaveButtonContainer>
          <Button
            onClick={handleSave}
            disabled={!selectedCategory || saving || !hasUnsavedChanges}
            level="primary"
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </SaveButtonContainer>
        </Content>
      </PageContainer>
    </>
  );
};

export default App;
