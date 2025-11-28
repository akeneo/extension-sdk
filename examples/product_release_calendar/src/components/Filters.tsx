import { FilterState, ReleaseStage, STAGE_CONFIG, ReleaseCalendarConfig, ViewMode } from '../types';
import { TextInput, SelectInput } from 'akeneo-design-system';
import styled from 'styled-components';
import { Search } from 'lucide-react';

interface FiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  families: { code: string; label: string }[];
  categories: { code: string; label: string }[];
  config: ReleaseCalendarConfig;
  viewMode: ViewMode;
}

const Container = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  align-items: flex-end;
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 2;
  min-width: 250px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #67768e;
  pointer-events: none;
`;

const StyledTextInput = styled(TextInput)`
  input {
    padding-left: 36px;
  }
`;

export function Filters({ filters, onFiltersChange, families, categories, config, viewMode }: FiltersProps) {
  const stageOptions = [
    { value: '', label: 'All Stages' },
    ...Object.values(ReleaseStage).map((stage) => ({
      value: stage,
      label: STAGE_CONFIG[stage].label,
    })),
  ];

  const familyOptions = families.map((family) => ({
    value: family.code,
    label: family.label,
  }));

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((category) => ({
      value: category.code,
      label: category.label,
    })),
  ];

  const localeOptions = [
    { value: '', label: 'All Locales' },
    { value: config.masterLocale, label: config.masterLocale },
    ...config.targetLocales.map((locale) => ({
      value: locale,
      label: locale,
    })),
  ];

  return (
    <Container>
      <FilterGroup>
        <SelectInput
          value={filters.family}
          onChange={(value: string) => {
            if (value) {
              onFiltersChange({ ...filters, family: value });
            }
          }}
          emptyResultLabel="No families found"
          openLabel="Open"
          clearable={false}
        >
          {familyOptions.map((option) => (
            <SelectInput.Option key={option.value} value={option.value} title={option.label}>
              {option.label}
            </SelectInput.Option>
          ))}
        </SelectInput>
      </FilterGroup>

      <FilterGroup>
        <SelectInput
          value={filters.category || ''}
          onChange={(value: string) => {
            onFiltersChange({ ...filters, category: value || undefined });
          }}
          emptyResultLabel="No categories found"
          openLabel="Open"
          clearable={false}
        >
          {categoryOptions.map((option) => (
            <SelectInput.Option key={option.value} value={option.value} title={option.label}>
              {option.label}
            </SelectInput.Option>
          ))}
        </SelectInput>
      </FilterGroup>

      {viewMode === ViewMode.TIMELINE && (
        <FilterGroup>
          <SelectInput
            value={filters.stage || ''}
            onChange={(value: string) => {
              onFiltersChange({ ...filters, stage: (value as ReleaseStage) || undefined });
            }}
            emptyResultLabel="No stages found"
            openLabel="Open"
            clearable={false}
          >
            {stageOptions.map((option) => (
              <SelectInput.Option key={option.value} value={option.value} title={option.label}>
                {option.label}
              </SelectInput.Option>
            ))}
          </SelectInput>
        </FilterGroup>
      )}

      <FilterGroup>
        <SelectInput
          value={filters.locale || ''}
          onChange={(value: string) => {
            onFiltersChange({ ...filters, locale: value || undefined });
          }}
          emptyResultLabel="No locales found"
          openLabel="Open"
          clearable={false}
        >
          {localeOptions.map((option) => (
            <SelectInput.Option key={option.value} value={option.value} title={option.label}>
              {option.label}
            </SelectInput.Option>
          ))}
        </SelectInput>
      </FilterGroup>

      <SearchContainer>
        <SearchIcon>
          <Search size={16} />
        </SearchIcon>
        <StyledTextInput
          placeholder="Search by product identifier..."
          value={filters.searchQuery || ''}
          onChange={(value: string) => {
            onFiltersChange({ ...filters, searchQuery: value });
          }}
        />
      </SearchContainer>
    </Container>
  );
}
