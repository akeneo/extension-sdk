declare interface AllottedTime {
    value?: number;
    unit?: string;
}

/**
 * Common link structure for API navigation
 */
declare interface ApiLink {
    href: string;
}

/**
 * Common link collection structure used across different API resources
 */
declare interface ApiLinks {
    self?: ApiLink;
    first?: ApiLink;
    previous?: ApiLink;
    next?: ApiLink;
}

declare interface ApproveTaskRequest {
    status: 'approved';
}

/**
 * Simplified asset for the SDK
 */
declare interface Asset {
    code: string;
    assetFamilyCode: string;
    values: {
        [key: string]: any;
    };
    created?: string;
    updated?: string;
    links?: ApiLinks;
}

/**
 * Simplified asset attribute for the SDK
 */
declare interface AssetAttribute {
    code: string;
    assetFamilyCode: string;
    labels: {
        [localeCode: string]: string;
    };
    type: string;
    valuePerLocale?: boolean;
    valuePerChannel?: boolean;
    isRequired?: boolean;
    maxCharacters?: number;
    isTextarea?: boolean;
    allowedExtensions?: string[];
    mediaType?: string;
    links?: ApiLinks;
    [key: string]: any;
}

/**
 * Parameters for getting a single asset attribute
 */
declare interface AssetAttributeGetParams {
    /**
     * Code of the asset family
     */
    assetFamilyCode: string;
    /**
     * Code of the attribute
     */
    code: string;
}

/**
 * Parameters for listing asset attributes
 */
declare interface AssetAttributeListParams {
    /**
     * Code of the asset family
     */
    assetFamilyCode: string;
}

/**
 * Simplified asset attribute option for the SDK
 */
declare interface AssetAttributeOption {
    code: string;
    assetFamilyCode: string;
    attributeCode: string;
    labels: {
        [localeCode: string]: string;
    };
    links?: ApiLinks;
}

/**
 * Parameters for getting a single asset attribute option
 */
declare interface AssetAttributeOptionGetParams {
    /**
     * Code of the asset family
     */
    assetFamilyCode: string;
    /**
     * Code of the attribute
     */
    attributeCode: string;
    /**
     * Code of the option
     */
    code: string;
}

/**
 * Parameters for listing asset attribute options
 */
declare interface AssetAttributeOptionListParams {
    /**
     * Code of the asset family
     */
    assetFamilyCode: string;
    /**
     * Code of the attribute
     */
    attributeCode: string;
}

/**
 * Parameters for creating/updating asset attribute options
 */
declare interface AssetAttributeOptionUpsertParams {
    /**
     * Code of the asset family
     */
    assetFamilyCode: string;
    /**
     * Code of the attribute
     */
    attributeCode: string;
    /**
     * Code of the option
     */
    code: string;
    /**
     * Option data to create/update
     */
    data: any;
}

/**
 * Result of asset attribute option update operation
 */
declare interface AssetAttributeOptionUpsertResult {
    /**
     * List of update status reports
     */
    items: {
        code: string;
        status: string;
        message?: string;
        errors?: Array<{
            property: string;
            message: string;
        }>;
    }[];
}

/**
 * Parameters for creating/updating asset attributes
 */
declare interface AssetAttributeUpsertParams {
    /**
     * Code of the asset family
     */
    assetFamilyCode: string;
    /**
     * Code of the attribute (required for update)
     */
    code: string;
    /**
     * Attribute data to update/create
     */
    data: any;
}

/**
 * Result of asset attribute update operation
 */
declare interface AssetAttributeUpsertResult {
    /**
     * List of update status reports
     */
    items: {
        code: string;
        status: string;
        message?: string;
        errors?: Array<{
            property: string;
            message: string;
        }>;
    }[];
}

/**
 * Common parameters for all asset operations
 */
declare interface AssetBaseParams {
    /**
     * Code of the asset family
     */
    assetFamilyCode: string;
}

/**
 * Asset data for create/update operations
 */
declare interface AssetData {
    code: string;
    values: {
        [key: string]: any;
    };
    [key: string]: any;
}

/**
 * Simplified asset family for the SDK
 */
declare interface AssetFamily {
    code: string;
    labels: {
        [localeCode: string]: string;
    };
    productLinkRules?: any[];
    transformations?: any[];
    namingConvention?: any;
    attributeAsMainMedia?: string;
    links?: ApiLinks;
}

/**
 * Parameters for getting a single asset family
 */
declare interface AssetFamilyGetParams {
    /**
     * Code of the asset family
     */
    code: string;
}

/**
 * Parameters for creating/updating asset families
 */
declare interface AssetFamilyUpsertParams {
    /**
     * List of asset families to create/update
     */
    data: any[];
}

/**
 * Result of asset family update operation
 */
declare interface AssetFamilyUpsertResult {
    /**
     * List of update status reports
     */
    items: {
        code: string;
        status: string;
        message?: string;
        errors?: Array<{
            property: string;
            message: string;
        }>;
    }[];
}

/**
 * Parameters for getting a single asset
 */
declare interface AssetGetParams extends AssetBaseParams {
    /**
     * Code of the asset
     */
    code: string;
}

/**
 * Parameters for listing assets
 */
declare interface AssetListParams extends AssetBaseParams {
    /**
     * Search query to filter assets
     */
    search?: string;
    /**
     * Filter asset values to return scopable asset attributes for the given channel
     * as well as the non localizable/non scopable asset attributes
     */
    channel?: string;
    /**
     * Filter asset values to return localizable asset attributes for the given locales
     * as well as the non localizable/non scopable asset attributes
     */
    locales?: string;
    /**
     * Pagination cursor for large result sets
     */
    paginationCursor?: string;
    /**
     * Number of results per page (not supported by API, kept for interface consistency)
     * @deprecated This parameter is not supported by the API and will be ignored
     */
    limit?: number;
}

/**
 * Parameters for downloading an asset media file
 */
declare interface AssetMediaFileDownloadParams {
    /**
     * Code of the asset media file
     */
    code: string;
}

/**
 * Parameters for uploading an asset media file
 */
declare interface AssetMediaFileUploadParams {
    /**
     * Binary content of the file
     */
    file: Blob | File;
    /**
     * Original filename of the file
     */
    filename?: string;
}

/**
 * Result of an asset media file upload, contains the code from the Asset-media-file-code header
 */
declare interface AssetMediaFileUploadResult {
    /**
     * Code of the uploaded media file
     */
    code: string;
}

/**
 * Response for operations that modify assets
 */
declare interface AssetOperationResponse {
    /**
     * Operation status for each processed asset
     */
    results: AssetOperationStatus[];
}

/**
 * Status of an asset operation
 */
declare interface AssetOperationStatus {
    /**
     * Asset code
     */
    code: string;
    /**
     * Operation status: 'success' or 'error'
     */
    status: 'success' | 'error';
    /**
     * Status message, if available
     */
    message?: string;
    /**
     * Validation errors, if any
     */
    errors?: Array<{
        property: string;
        message: string;
    }>;
}

/**
 * Parameters for creating/updating a single asset
 */
declare interface AssetUpsertParams extends AssetBaseParams {
    /**
     * Asset data to create or update
     */
    asset: AssetData;
}

declare interface Assignee {
    uuid?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
}

declare interface AssigneesList {
    currentPage?: number;
    items?: Assignee[];
}

/**
 * Association type data
 */
declare interface AssociationType {
    code: string;
    labels?: AssociationTypeLabels;
    isQuantified?: boolean;
    isTwoWay?: boolean;
    links?: ApiLinks;
}

declare interface AssociationTypeCreateParams {
    data: {
        code: string;
        labels?: AssociationTypeLabels;
        is_quantified?: boolean;
        is_two_way?: boolean;
    };
}

/**
 * Parameters for association type operations
 */
declare interface AssociationTypeGetParams {
    code: string;
}

/**
 * Labels for an association type by locale
 */
declare interface AssociationTypeLabels {
    [localeCode: string]: string;
}

/**
 * List of association types
 */
declare interface AssociationTypeList extends PaginatedList<AssociationType> {
}

declare interface AssociationTypeListParams {
    limit?: number;
    page?: number;
    with_count?: boolean;
}

declare interface AssociationTypePatchParams extends AssociationTypeGetParams {
    data: Partial<AssociationTypeCreateParams['data']>;
}

/**
 * Attribute in SDK format
 */
declare interface Attribute {
    /**
     * Attribute code
     */
    code: string;
    /**
     * Attribute type
     */
    type: string;
    /**
     * Attribute group
     */
    group?: string | null;
    /**
     * Attribute labels
     */
    labels?: {
        [locale: string]: string;
    };
    /**
     * Is the attribute localizable
     */
    localizable?: boolean;
    /**
     * Is the attribute scopable
     */
    scopable?: boolean;
    /**
     * Sort order of the attribute
     */
    sortOrder?: number;
    /**
     * Default value for this attribute
     */
    defaultValue?: any;
    /**
     * Is the attribute usable in grid
     */
    usableInGrid?: boolean;
    /**
     * Is the attribute unique
     */
    unique?: boolean;
    /**
     * Maximum number of characters allowed for the value of the attribute when type is `text` or `textarea`
     */
    maxCharacters?: number | null;
    /**
     * Regular expression validation rule for the attribute when type is `text` or `textarea`
     */
    validationRule?: string | null;
    /**
     * Regular expression validation message for the attribute when type is `text` or `textarea`
     */
    validationRegexp?: string | null;
    /**
     * Whether decimal values are allowed for this attribute when type is `number`
     */
    decimalsAllowed?: boolean;
    /**
     * Minimum value allowed for the attribute when type is `number`
     */
    minValue?: number | null;
    /**
     * Maximum value allowed for the attribute when type is `number`
     */
    maxValue?: number | null;
    /**
     * Expected measurement family for this attribute when type is `metric`
     */
    metricFamily?: string | null;
    /**
     * Default metric unit for this attribute when type is `metric`
     */
    defaultMetricUnit?: string | null;
    /**
     * Maximum file size in MB for the attribute when type is `file` or `image`
     */
    maxFileSize?: number | null;
    /**
     * Allowed file extensions for the attribute when type is `file` or `image`
     */
    allowedExtensions?: string[] | null;
    /**
     * Minimum date allowed when the attribute type is `date`
     */
    dateMin?: string | null;
    /**
     * Maximum date allowed when the attribute type is `date`
     */
    dateMax?: string | null;
    /**
     * Whether the attribute is read-only
     */
    isReadOnly?: boolean;
    /**
     * API links for the attribute
     */
    links?: ApiLinks;
}

/**
 * Data for creating an attribute
 */
declare interface AttributeCreateData {
    /**
     * Attribute code
     */
    code: string;
    /**
     * Attribute type
     */
    type: string;
    /**
     * Attribute group
     */
    group?: string | null;
    /**
     * Attribute labels
     */
    labels?: {
        [locale: string]: string;
    };
    /**
     * Is the attribute localizable
     */
    localizable?: boolean;
    /**
     * Is the attribute scopable
     */
    scopable?: boolean;
    /**
     * Sort order of the attribute
     */
    sort_order?: number;
    /**
     * Default value for this attribute
     */
    default_value?: any;
    /**
     * Is the attribute usable in grid
     */
    usable_in_grid?: boolean;
    /**
     * Is the attribute unique
     */
    unique?: boolean;
    /**
     * Maximum number of characters allowed for the value of the attribute when type is `text` or `textarea`
     */
    max_characters?: number | null;
    /**
     * Regular expression validation rule for the attribute when type is `text` or `textarea`
     */
    validation_rule?: string | null;
    /**
     * Regular expression validation message for the attribute when type is `text` or `textarea`
     */
    validation_regexp?: string | null;
    /**
     * Whether decimal values are allowed for this attribute when type is `number`
     */
    decimals_allowed?: boolean;
    /**
     * Minimum value allowed for the attribute when type is `number`
     */
    min_value?: number | null;
    /**
     * Maximum value allowed for the attribute when type is `number`
     */
    max_value?: number | null;
    /**
     * Expected measurement family for this attribute when type is `metric`
     */
    metric_family?: string | null;
    /**
     * Default metric unit for this attribute when type is `metric`
     */
    default_metric_unit?: string | null;
    /**
     * Maximum file size in MB for the attribute when type is `file` or `image`
     */
    max_file_size?: number | null;
    /**
     * Allowed file extensions for the attribute when type is `file` or `image`
     */
    allowed_extensions?: string[] | null;
    /**
     * Minimum date allowed when the attribute type is `date`
     */
    date_min?: string | null;
    /**
     * Maximum date allowed when the attribute type is `date`
     */
    date_max?: string | null;
    /**
     * Whether the attribute is read-only
     */
    is_read_only?: boolean;
}

/**
 * Parameters for creating an attribute
 */
declare interface AttributeCreateParams {
    /**
     * Data to create an attribute
     */
    data: AttributeCreateData;
}

/**
 * Parameters for getting a single attribute
 */
declare interface AttributeGetParams {
    /**
     * Code of the attribute
     */
    code: string;
    /**
     * Whether to include table select options in the response
     */
    withTableSelectOptions?: boolean;
}

/**
 * Attribute group data
 */
declare interface AttributeGroup {
    code: string;
    sortOrder?: number;
    attributes?: string[];
    labels?: AttributeGroupLabels;
    links?: ApiLinks;
}

declare interface AttributeGroupCreateParams {
    data: {
        code: string;
        sort_order?: number;
        attributes?: string[];
        labels?: AttributeGroupLabels;
    };
}

/**
 * Parameters for attribute group operations
 */
declare interface AttributeGroupGetParams {
    code: string;
}

/**
 * Labels for an attribute group by locale
 */
declare interface AttributeGroupLabels {
    [localeCode: string]: string;
}

/**
 * List of attribute groups
 */
declare interface AttributeGroupList extends PaginatedList<AttributeGroup> {
}

declare interface AttributeGroupListParams {
    limit?: number;
    page?: number;
    search?: string;
    with_count?: boolean;
}

declare interface AttributeGroupPatchParams extends AttributeGroupGetParams {
    data: Partial<AttributeGroupCreateParams['data']>;
}

/**
 * List of attributes with pagination info
 */
declare interface AttributeList extends PaginatedList<Attribute> {
}

/**
 * Parameters for listing attributes
 */
declare interface AttributeListParams {
    /**
     * Search criteria for filtering attributes
     */
    search?: any;
    /**
     * Page number for pagination
     */
    page?: number;
    /**
     * Maximum number of results per page
     */
    limit?: number;
    /**
     * Whether to include the total count in the response
     */
    withCount?: boolean;
    /**
     * Whether to include table select options in the response
     */
    withTableSelectOptions?: boolean;
}

/**
 * Attribute option data
 */
declare interface AttributeOption {
    code: string;
    attribute?: string;
    sortOrder?: number;
    labels?: AttributeOptionLabels;
    links?: ApiLinks;
}

declare interface AttributeOptionCreateParams {
    attributeCode: string;
    data: {
        code: string;
        sort_order?: number;
        labels?: AttributeOptionLabels;
    };
}

/**
 * Parameters for attribute option operations
 */
declare interface AttributeOptionGetParams {
    attribute_code: string;
    code: string;
}

/**
 * Labels for an attribute option by locale
 */
declare interface AttributeOptionLabels {
    [localeCode: string]: string;
}

/**
 * List of attribute options
 */
declare interface AttributeOptionList extends PaginatedList<AttributeOption> {
}

declare interface AttributeOptionListParams {
    attribute_code: string;
    limit?: number;
    page?: number;
    search?: string;
    with_count?: boolean;
}

declare interface AttributeOptionPatchParams extends AttributeOptionGetParams {
    data: Partial<AttributeOptionCreateParams['data']>;
}

/**
 * Data for updating an attribute
 */
declare interface AttributePatchData {
    /**
     * Attribute code
     */
    code?: string;
    /**
     * Attribute type
     */
    type?: string;
    /**
     * Attribute group
     */
    group?: string | null;
    /**
     * Attribute labels
     */
    labels?: {
        [locale: string]: string;
    };
    /**
     * Is the attribute localizable
     */
    localizable?: boolean;
    /**
     * Is the attribute scopable
     */
    scopable?: boolean;
    /**
     * Sort order of the attribute
     */
    sort_order?: number;
    /**
     * Default value for this attribute
     */
    default_value?: any;
    /**
     * Is the attribute usable in grid
     */
    usable_in_grid?: boolean;
    /**
     * Is the attribute unique
     */
    unique?: boolean;
    /**
     * Maximum number of characters allowed for the value of the attribute when type is `text` or `textarea`
     */
    max_characters?: number | null;
    /**
     * Regular expression validation rule for the attribute when type is `text` or `textarea`
     */
    validation_rule?: string | null;
    /**
     * Regular expression validation message for the attribute when type is `text` or `textarea`
     */
    validation_regexp?: string | null;
    /**
     * Whether decimal values are allowed for this attribute when type is `number`
     */
    decimals_allowed?: boolean;
    /**
     * Minimum value allowed for the attribute when type is `number`
     */
    min_value?: number | null;
    /**
     * Maximum value allowed for the attribute when type is `number`
     */
    max_value?: number | null;
    /**
     * Expected measurement family for this attribute when type is `metric`
     */
    metric_family?: string | null;
    /**
     * Default metric unit for this attribute when type is `metric`
     */
    default_metric_unit?: string | null;
    /**
     * Maximum file size in MB for the attribute when type is `file` or `image`
     */
    max_file_size?: number | null;
    /**
     * Allowed file extensions for the attribute when type is `file` or `image`
     */
    allowed_extensions?: string[] | null;
    /**
     * Minimum date allowed when the attribute type is `date`
     */
    date_min?: string | null;
    /**
     * Maximum date allowed when the attribute type is `date`
     */
    date_max?: string | null;
    /**
     * Whether the attribute is read-only
     */
    is_read_only?: boolean;
}

/**
 * Parameters for updating an attribute
 */
declare interface AttributePatchParams {
    /**
     * Code of the attribute to update
     */
    code: string;
    /**
     * Data to update
     */
    data: AttributePatchData;
}

/**
 * Simplified category for the SDK
 */
declare interface Category {
    code: string;
    parent?: string | null;
    labels?: CategoryLabels;
    values?: CategoryValues;
    position?: number;
    links?: ApiLinks;
}

/**
 * Data for creating or updating a category
 */
declare interface CategoryCreateData {
    /**
     * Code of the category
     */
    code: string;
    /**
     * Parent category code
     */
    parent?: string | null;
    /**
     * Labels by locale
     */
    labels?: CategoryLabels;
    /**
     * Values by attribute code
     */
    values?: CategoryValues;
}

/**
 * Parameters for creating a category
 */
declare interface CategoryCreateParams {
    /**
     * Category data
     */
    data: CategoryCreateData;
}

/**
 * Parameters for getting a single category
 */
declare interface CategoryGetParams {
    /**
     * Code of the category
     */
    code: string;
    /**
     * Whether to include the position in the response
     */
    withPosition?: boolean;
    /**
     * Whether to include enriched attributes in the response
     */
    withEnrichedAttributes?: boolean;
}

/**
 * Category labels with locale codes as keys
 */
declare interface CategoryLabels {
    [localeCode: string]: string;
}

/**
 * List of categories with pagination info
 */
declare interface CategoryList extends PaginatedList<Category> {
}

/**
 * Parameters for getting a list of categories
 */
declare interface CategoryListParams {
    /**
     * Search query to filter categories
     */
    search?: string;
    /**
     * Page number for pagination
     */
    page?: number;
    /**
     * Maximum number of results per page
     */
    limit?: number;
    /**
     * Whether to include the total count in the response
     */
    withCount?: boolean;
    /**
     * Whether to include the position in the response
     */
    withPosition?: boolean;
    /**
     * Whether to include enriched attributes in the response
     */
    withEnrichedAttributes?: boolean;
}

/**
 * Parameters for updating a category
 */
declare interface CategoryPatchParams {
    /**
     * Code of the category to update
     */
    code: string;
    /**
     * Data to update
     */
    data: CategoryCreateData;
}

/**
 * Category values with attribute codes as keys
 */
declare interface CategoryValues {
    [attributeCode: string]: Array<{
        locale?: string;
        scope?: string;
        data: any;
    }>;
}

/**
 * Channel data for the SDK
 */
declare interface Channel {
    code: string;
    labels?: ChannelLabels;
    categoryTree: string;
    currencies: string[];
    locales: string[];
    conversionUnits?: ChannelConversionUnits;
    links?: ApiLinks;
}

/**
 * Conversion units with attribute codes as keys
 */
declare interface ChannelConversionUnits {
    [attributeCode: string]: string;
}

declare interface ChannelCreateParams {
    data: {
        code: string;
        labels?: ChannelLabels;
        category_tree: string;
        currencies: string[];
        locales: string[];
        conversion_units?: ChannelConversionUnits;
    };
}

/**
 * Parameters for channel operations
 */
declare interface ChannelGetParams {
    code: string;
}

/**
 * Channel labels with locale codes as keys
 */
declare interface ChannelLabels {
    [localeCode: string]: string;
}

/**
 * List of channels with pagination info
 */
declare interface ChannelList extends PaginatedList<Channel> {
}

declare interface ChannelListParams {
    limit?: number;
    page?: number;
    with_count?: boolean;
}

/**
 * Channel attribute requirements
 */
declare interface ChannelRequirements {
    [channelCode: string]: string[];
}

declare interface ChannelUpdateParams extends ChannelGetParams {
    data: Partial<ChannelCreateParams['data']>;
}

/**
 * Product completeness
 */
declare interface Completeness {
    locale?: string;
    scope?: string;
    data?: number;
}

declare interface CompleteTaskRequest {
    status: 'completed';
}

/**
 * Currency representation
 */
declare interface Currency {
    /**
     * Currency code (e.g., 'USD', 'EUR')
     */
    code?: string;
    /**
     * Whether the currency is enabled
     */
    enabled?: boolean;
    /**
     * Currency label
     */
    label?: string;
    /**
     * API navigation links
     */
    links?: ApiLinks;
}

/**
 * Parameters for getting a single currency
 */
declare interface CurrencyGetParams {
    /**
     * Currency code (e.g., 'USD', 'EUR')
     */
    code: string;
}

/**
 * Currency list representation
 */
declare interface CurrencyList extends PaginatedList<Currency> {
}

/**
 * Parameters for listing currencies
 */
declare interface CurrencyListParams {
    /**
     * Filter currencies based on specific criteria
     */
    search?: string;
    /**
     * Page number for pagination
     */
    page?: number;
    /**
     * Number of results per page
     */
    limit?: number;
}

declare interface ExecutionProduct {
    uuid: string;
}

declare interface ExecutionProductModel {
    code: string;
}

declare interface ExecutionWorkflow {
    uuid: string;
}

declare type externalGateway = {
    call: (requestParameters?: externalGatewayRequest) => Promise<any>;
};

declare interface externalGatewayRequest {
    method: string;
    headers?: Record<string, string>;
    body?: string;
    url?: string;
    credentials_code?: string;
}

/**
 * Simplified family for the SDK
 */
declare interface Family {
    code: string;
    labels?: FamilyLabels;
    attributes?: string[];
    attributeAsLabel?: string;
    attributeAsImage?: string;
    attributeRequirements?: ChannelRequirements;
    links?: ApiLinks;
}

/**
 * Data for creating or updating a family
 */
declare interface FamilyCreateData {
    /**
     * Code of the family
     */
    code: string;
    /**
     * Labels by locale
     */
    labels?: FamilyLabels;
    /**
     * Attributes in the family
     */
    attributes?: string[];
    /**
     * Attribute code used as label
     */
    attribute_as_label?: string;
    /**
     * Attribute code used as image
     */
    attribute_as_image?: string;
    /**
     * Attribute requirements by channel (arrays of attribute codes)
     */
    attribute_requirements?: ChannelRequirements;
}

/**
 * Parameters for creating a family
 */
declare interface FamilyCreateParams {
    /**
     * Family data
     */
    data: FamilyCreateData;
}

/**
 * Parameters for getting a single family
 */
declare interface FamilyGetParams {
    /**
     * Code of the family
     */
    code: string;
}

/**
 * Family labels with locale codes as keys
 */
declare interface FamilyLabels {
    [localeCode: string]: string;
}

/**
 * List of families with pagination info
 */
declare interface FamilyList extends PaginatedList<Family> {
}

/**
 * Parameters for getting a list of families
 */
declare interface FamilyListParams {
    /**
     * Search query to filter families
     */
    search?: string;
    /**
     * Page number for pagination
     */
    page?: number;
    /**
     * Maximum number of results per page
     */
    limit?: number;
    /**
     * Whether to include the total count in the response
     */
    withCount?: boolean;
}

/**
 * Parameters for updating a family
 */
declare interface FamilyPatchParams {
    /**
     * Code of the family to update
     */
    code: string;
    /**
     * Data to update
     */
    data: FamilyCreateData;
}

/**
 * Simplified family variant for the SDK
 */
declare interface FamilyVariant {
    code: string;
    variantAttributeSets: VariantAttributeSet[];
    labels?: FamilyVariantLabels;
    links?: ApiLinks;
}

/**
 * Data for creating a family variant
 */
declare interface FamilyVariantCreateData {
    /**
     * Code of the family variant
     */
    code: string;
    /**
     * Variant attribute sets for distribution in family variants
     */
    variant_attribute_sets: {
        level: number;
        axes: string[];
        attributes: string[];
    }[];
    /**
     * Labels by locale
     */
    labels?: FamilyVariantLabels;
}

/**
 * Parameters for creating a family variant
 */
declare interface FamilyVariantCreateParams {
    /**
     * Code of the family
     */
    familyCode: string;
    /**
     * Family variant data
     */
    data: FamilyVariantCreateData;
}

/**
 * Parameters for getting a single family variant
 */
declare interface FamilyVariantGetParams {
    /**
     * Code of the family
     */
    familyCode: string;
    /**
     * Code of the family variant
     */
    code: string;
}

/**
 * Properly typed family variant labels with locale codes as keys
 */
declare interface FamilyVariantLabels {
    [localeCode: string]: string;
}

/**
 * List of family variants with pagination info
 */
declare interface FamilyVariantList extends PaginatedList<FamilyVariant> {
}

/**
 * Parameters for getting a list of family variants
 */
declare interface FamilyVariantListParams {
    /**
     * Code of the family
     */
    familyCode: string;
    /**
     * Page number for pagination
     */
    page?: number;
    /**
     * Maximum number of results per page
     */
    limit?: number;
    /**
     * Whether to include the total count in the response
     */
    withCount?: boolean;
}

/**
 * Data for updating a family variant
 */
declare interface FamilyVariantPatchData {
    /**
     * Variant attribute sets for distribution in family variants
     */
    variant_attribute_sets?: {
        level: number;
        axes: string[];
        attributes: string[];
    }[];
    /**
     * Labels by locale
     */
    labels?: FamilyVariantLabels;
}

/**
 * Parameters for updating a family variant
 */
declare interface FamilyVariantPatchParams {
    /**
     * Code of the family
     */
    familyCode: string;
    /**
     * Code of the family variant
     */
    code: string;
    /**
     * Family variant data
     */
    data: FamilyVariantPatchData;
}

/**
 * Simplified locale for the SDK
 */
declare interface Locale {
    code: string;
    enabled: boolean;
    links?: ApiLinks;
}

/**
 * Parameters for getting a single locale
 */
declare interface LocaleGetParams {
    /**
     * Code of the locale
     */
    code: string;
}

/**
 * List of locales with pagination info
 */
declare interface LocaleList extends PaginatedList<Locale> {
}

/**
 * Parameters for getting a list of locales
 */
declare interface LocaleListParams {
    /**
     * Search query to filter locales
     */
    search?: string;
    /**
     * Page number for pagination
     */
    page?: number;
    /**
     * Maximum number of results per page
     */
    limit?: number;
    /**
     * Whether to include the total count in the response
     */
    withCount?: boolean;
}

/**
 * Simplified measurement family for the SDK
 */
declare interface MeasurementFamily {
    code: string;
    labels?: {
        [localeCode: string]: string;
    };
    standardUnitCode: string;
    units: {
        [unitCode: string]: MeasurementFamilyUnit;
    };
    links?: ApiLinks;
}

/**
 * Data for creating or updating a measurement family
 */
declare interface MeasurementFamilyData {
    code: string;
    labels?: {
        [localeCode: string]: string;
    };
    standard_unit_code: string;
    units: {
        [unitCode: string]: MeasurementFamilyUnitData;
    };
}

/**
 * Measurement family unit
 */
declare interface MeasurementFamilyUnit {
    code: string;
    label: {
        [localeCode: string]: string;
    };
    symbol: {
        [localeCode: string]: string;
    };
    convertFromStandard: MeasurementFamilyUnitConversion[];
    convertToStandard: MeasurementFamilyUnitConversion[];
}

/**
 * Measurement family unit conversion configuration
 */
declare interface MeasurementFamilyUnitConversion {
    value: number;
    operator: string;
}

/**
 * Measurement family unit data for update/create operations
 */
declare interface MeasurementFamilyUnitData {
    code?: string;
    labels?: {
        [localeCode: string]: string;
    };
    symbols?: {
        [localeCode: string]: string;
    };
    convert_from_standard?: MeasurementFamilyUnitConversion[];
    convert_to_standard?: MeasurementFamilyUnitConversion[];
}

/**
 * Error details in update result
 */
declare interface MeasurementFamilyUpdateError {
    property: string;
    message: string;
}

/**
 * Parameters for updating/creating measurement families
 */
declare interface MeasurementFamilyUpdateParams {
    /**
     * List of measurement families to update/create
     */
    data: MeasurementFamilyData[];
}

/**
 * Result of measurement family update operation
 */
declare interface MeasurementFamilyUpdateResult {
    /**
     * List of update status reports
     */
    items: MeasurementFamilyUpdateResultItem[];
}

/**
 * Update result item
 */
declare interface MeasurementFamilyUpdateResultItem {
    code: string;
    status: string;
    message?: string;
    errors?: MeasurementFamilyUpdateError[];
}

/**
 * Generic paginated list structure with links
 */
declare interface PaginatedList<T> {
    items: T[];
    count?: number;
    currentPage?: number;
    links?: ApiLinks;
}

declare interface PendingAttributeValue {
    locale?: string | null;
    scope?: string | null;
    rejected: boolean;
    comment?: string;
}

export declare type PIM_CONTEXT = {
    product: {
        uuid: string;
        identifier: string | null;
    };
} | {
    category: {
        code: string;
    };
} | {
    productGrid: {
        productUuids: string[];
        productModelCodes: string[];
    };
};

export declare type PIM_SDK = {
    user: PIM_USER;
    context: PIM_CONTEXT;
    api: {
        external: externalGateway;
        system_v1: SdkApiSystem;
        channel_v1: SdkApiChannel;
        currency_v1: SdkApiCurrency;
        product_model_v1: SdkApiProductModel;
        attribute_option_v1: SdkApiAttributeOption;
        attribute_group_v1: SdkApiAttributeGroup;
        association_type_v1: SdkApiAssociationType;
        measurement_family_v1: SdkApiMeasurementFamily;
        family_variant_v1: SdkApiFamilyVariant;
        product_media_file_v1: SdkApiProductMediaFile;
        asset_v1: SdkApiAsset;
        asset_family_v1: SdkApiAssetFamily;
        asset_attribute_v1: SdkApiAssetAttribute;
        asset_attribute_option_v1: SdkApiAssetAttributeOption;
        asset_media_file_v1: SdkApiAssetMediaFile;
        category_v1: SdkApiCategory;
        product_uuid_v1: SdkApiProductUuid;
        locale_v1: SdkApiLocale;
        family_v1: SdkApiFamily;
        reference_entity_v1: SdkApiReferenceEntity;
        reference_entity_attribute_v1: SdkApiReferenceEntityAttribute;
        reference_entity_record_v1: SdkApiReferenceEntityRecord;
        reference_entity_attribute_option_v1: SdkApiReferenceEntityAttributeOption;
        attribute_v1: SdkApiAttribute;
        workflows_v1: SdkApiWorkflows;
        workflow_tasks_v1: SdkApiWorkflowTasks;
        workflow_executions_v1: SdkApiWorkflowExecutions;
    };
    navigate: pimNavigate;
};

export declare type PIM_USER = {
    username: string;
    uuid: string;
    first_name: string;
    last_name: string;
};

declare type pimNavigate = {
    internal: (path: string) => void;
};

/**
 * Simplified product for the SDK
 */
declare interface Product {
    uuid: string;
    identifier?: string;
    enabled?: boolean;
    family?: string | null;
    categories?: string[];
    groups?: string[];
    parent?: string | null;
    values?: ProductValues;
    associations?: ProductAssociations;
    quantifiedAssociations?: ProductQuantifiedAssociations;
    completenesses?: Completeness[];
    created?: string;
    updated?: string;
    metadata?: {
        workflow_status?: string;
    };
    links?: ApiLinks;
}

/**
 * Product associations
 */
declare interface ProductAssociations {
    [associationType: string]: {
        groups?: string[];
        products?: string[];
        product_models?: string[];
    };
}

/**
 * Data for creating a product
 */
declare interface ProductCreateData {
    /**
     * Identifier for the product
     */
    identifier?: string;
    /**
     * Whether the product is enabled
     */
    enabled?: boolean;
    /**
     * Family code
     */
    family?: string | null;
    /**
     * Parent product model code
     */
    parent?: string | null;
    /**
     * List of category codes
     */
    categories?: string[];
    /**
     * List of group codes
     */
    groups?: string[];
    /**
     * Values with attribute codes as keys
     */
    values?: ProductValues;
    /**
     * Associations with association types as keys
     */
    associations?: ProductAssociations;
    /**
     * Quantified associations with association types as keys
     */
    quantified_associations?: ProductQuantifiedAssociations;
}

/**
 * Parameters for creating a product
 */
declare interface ProductCreateParams {
    /**
     * Data to create a product
     */
    data: ProductCreateData;
}

/**
 * Parameters for deleting a product
 */
declare interface ProductDeleteParams {
    /**
     * UUID of the product to delete
     */
    uuid: string;
}

/**
 * Parameters for getting a single product
 */
declare interface ProductGetParams {
    /**
     * UUID of the product
     */
    uuid: string;
    /**
     * Completnesses of the product
     */
    withCompletenesses?: boolean;
    /**
     * Asset share links of the product
     */
    withAssetShareLinks?: boolean;
}

/**
 * List of products with pagination info
 */
declare interface ProductList extends PaginatedList<Product> {
}

/**
 * Parameters for getting a list of products
 */
declare interface ProductListParams {
    /**
     * Search query for advanced filtering
     */
    search?: any;
    /**
     * Page number for pagination
     */
    page?: number;
    /**
     * Maximum number of results per page
     */
    limit?: number;
    /**
     * Whether to include the total count in the response
     */
    withCount?: boolean;
    /**
     * Completnesses of the products
     */
    withCompletenesses?: boolean;
    /**
     * Asset share links of the products
     */
    withAssetShareLinks?: boolean;
}

/**
 * Simplified product media file for the SDK
 */
declare interface ProductMediaFile {
    code: string;
    originalFilename?: string;
    mimeType?: string;
    size?: number;
    extension?: string;
    linkToDownload?: string;
    links?: ApiLinks;
}

/**
 * Parameters for creating a product media file
 */
declare interface ProductMediaFileCreateParams {
    /**
     * File to upload
     */
    file: File;
    /**
     * Product information (mutually exclusive with productModel)
     */
    product?: {
        identifier: string;
        attribute: string;
        scope?: string;
        locale?: string;
    };
    /**
     * Product model information (mutually exclusive with product)
     */
    productModel?: {
        code: string;
        attribute: string;
        scope?: string;
        locale?: string;
    };
}

/**
 * Parameters for downloading a product media file
 */
declare interface ProductMediaFileDownloadParams {
    /**
     * Code of the product media file
     */
    code: string;
}

/**
 * Parameters for getting a single product media file
 */
declare interface ProductMediaFileGetParams {
    /**
     * Code of the product media file
     */
    code: string;
}

/**
 * List of product media files with pagination info
 */
declare interface ProductMediaFileList extends PaginatedList<ProductMediaFile> {
}

/**
 * Parameters for getting a list of product media files
 */
declare interface ProductMediaFileListParams {
    /**
     * Page number for pagination
     */
    page?: number;
    /**
     * Maximum number of results per page
     */
    limit?: number;
    /**
     * Whether to include the total count in the response
     */
    withCount?: boolean;
}

/**
 * Simplified product model type for the SDK
 */
declare interface ProductModel {
    code?: string;
    family?: string | null;
    family_variant?: string;
    parent?: string | null;
    categories?: string[];
    values?: ProductModelValues;
    associations?: ProductModelAssociations;
    quantifiedAssociations?: ProductModelQuantifiedAssociations;
    created?: string;
    updated?: string;
    metadata?: {
        workflow_status?: string;
    };
    links?: ApiLinks;
}

/**
 * Properly typed product model associations
 */
declare interface ProductModelAssociations {
    [associationType: string]: {
        groups?: string[];
        products?: string[];
        product_models?: string[];
    };
}

/**
 * Data for creating a product model
 */
declare interface ProductModelCreateData {
    /**
     * Code of the product model
     */
    code: string;
    /**
     * Family code
     */
    family: string;
    /**
     * Family variant code
     */
    family_variant: string;
    /**
     * Parent product model code
     */
    parent?: string;
    /**
     * List of category codes
     */
    categories?: string[];
    /**
     * Values with attribute codes as keys
     */
    values?: ProductModelValues;
    /**
     * Associations with association types as keys
     */
    associations?: ProductModelAssociations;
    /**
     * Quantified associations with association types as keys
     */
    quantified_associations?: ProductModelQuantifiedAssociations;
}

/**
 * Parameters for creating a product model
 */
declare interface ProductModelCreateParams {
    /**
     * Data to create a product model
     */
    data: ProductModelCreateData;
}

/**
 * Parameters for deleting a product model
 */
declare interface ProductModelDeleteParams {
    /**
     * Code of the product model to delete
     */
    code: string;
}

/**
 * Parameters for getting a single product model
 */
declare interface ProductModelGetParams {
    /**
     * Code of the product model
     */
    code: string;
    /**
     * Asset share links of the product model
     */
    withAssetShareLinks?: boolean;
}

/**
 * List of product models with pagination info
 */
declare interface ProductModelList extends PaginatedList<ProductModel> {
}

/**
 * Parameters for listing product models
 */
declare interface ProductModelListParams {
    /**
     * Search query to filter product models
     */
    search?: string;
    /**
     * Attribute code to order by
     */
    attributeCode?: string;
    /**
     * Order direction (ASC or DESC)
     */
    orderDirection?: string;
    /**
     * Filter by category code
     */
    categoryCode?: string;
    /**
     * Filter by channel code
     */
    channelCode?: string;
    /**
     * Filter by locale code
     */
    localeCode?: string;
    /**
     * Page number for pagination
     */
    page?: number;
    /**
     * Maximum number of results per page
     */
    limit?: number;
    /**
     * Whether to include the total count in the response
     */
    withCount?: boolean;
    /**
     * Asset share links of the product models
     */
    withAssetShareLinks?: boolean;
}

/**
 * Data for updating a product model
 */
declare interface ProductModelPatchData {
    /**
     * Parent product model code
     */
    parent?: string;
    /**
     * List of category codes
     */
    categories?: string[];
    /**
     * Values with attribute codes as keys
     */
    values?: ProductModelValues;
    /**
     * Associations with association types as keys
     */
    associations?: ProductModelAssociations;
    /**
     * Quantified associations with association types as keys
     */
    quantified_associations?: ProductModelQuantifiedAssociations;
}

/**
 * Parameters for updating a product model
 */
declare interface ProductModelPatchParams {
    /**
     * Code of the product model to update
     */
    code: string;
    /**
     * Data to update
     */
    data: ProductModelPatchData;
}

/**
 * Properly typed product model quantified associations
 */
declare interface ProductModelQuantifiedAssociations {
    [associationType: string]: {
        products?: Array<{
            identifier: string;
            quantity: number;
        }>;
        product_models?: Array<{
            code: string;
            quantity: number;
        }>;
    };
}

/**
 * Product model values with attribute codes as keys
 */
declare interface ProductModelValues {
    [attributeCode: string]: Array<{
        locale?: string;
        scope?: string;
        data: any;
        linked_data?: any;
    }>;
}

/**
 * Data for updating a product
 */
declare interface ProductPatchData {
    /**
     * Whether the product is enabled
     */
    enabled?: boolean;
    /**
     * Family code
     */
    family?: string | null;
    /**
     * Parent product model code
     */
    parent?: string | null;
    /**
     * List of category codes
     */
    categories?: string[];
    /**
     * List of group codes
     */
    groups?: string[];
    /**
     * Values with attribute codes as keys
     */
    values?: ProductValues;
    /**
     * Associations with association types as keys
     */
    associations?: ProductAssociations;
    /**
     * Quantified associations with association types as keys
     */
    quantified_associations?: ProductQuantifiedAssociations;
}

/**
 * Parameters for updating a product
 */
declare interface ProductPatchParams {
    /**
     * UUID of the product to update
     */
    uuid: string;
    /**
     * Data to update
     */
    data: ProductPatchData;
}

/**
 * Product quantified associations
 */
declare interface ProductQuantifiedAssociations {
    [associationType: string]: {
        products?: Array<{
            identifier: string;
            quantity: number;
        }>;
        product_models?: Array<{
            code: string;
            quantity: number;
        }>;
    };
}

/**
 * Product values with attribute codes as keys
 */
declare interface ProductValues {
    [attributeCode: string]: Array<{
        locale?: string;
        scope?: string;
        data: any;
        linked_data?: any;
    }>;
}

/**
 * Type representing a reference entity
 */
declare interface ReferenceEntity {
    code: string;
    labels?: ReferenceEntityLabels;
    image?: string | null;
    links?: ApiLinks;
}

/**
 * Type representing a reference entity attribute
 */
declare interface ReferenceEntityAttribute {
    code: string;
    type: string;
    labels?: ReferenceEntityAttributeLabels;
    valuePerLocale?: boolean;
    valuePerChannel?: boolean;
    isRequiredForCompleteness?: boolean;
    maxCharacters?: number | null;
    isTextarea?: boolean;
    isRichTextEditor?: boolean;
    validationRule?: string | null;
    validationRegexp?: string | null;
    allowedExtensions?: string[];
    maxFileSize?: string | null;
    referenceEntityCode?: string | null;
    decimalsAllowed?: boolean;
    minValue?: string | null;
    maxValue?: string | null;
    links?: ApiLinks;
}

/**
 * Type for creating or updating a reference entity attribute
 */
declare interface ReferenceEntityAttributeCreate {
    code: string;
    type: string;
    valuePerLocale?: boolean;
    valuePerChannel?: boolean;
    labels?: ReferenceEntityAttributeLabels;
    isRequiredForCompleteness?: boolean;
    maxCharacters?: number | null;
    isTextarea?: boolean;
    isRichTextEditor?: boolean;
    validationRule?: string;
    validationRegexp?: string | null;
    allowedExtensions?: string[];
    maxFileSize?: string | null;
    decimalsAllowed?: boolean;
    minValue?: string | null;
    maxValue?: string | null;
}

/**
 * Type representing params for getting a reference entity attribute
 */
declare interface ReferenceEntityAttributeGetParams {
    referenceEntityCode: string;
    attributeCode: string;
}

/**
 * Type representing reference entity attribute labels
 */
declare interface ReferenceEntityAttributeLabels {
    [locale: string]: string;
}

/**
 * Type representing a paginated response for a list of reference entity attributes
 */
declare interface ReferenceEntityAttributeList extends PaginatedList<ReferenceEntityAttribute> {
}

/**
 * Type representing params for listing reference entity attributes
 */
declare interface ReferenceEntityAttributeListParams {
    referenceEntityCode: string;
}

/**
 * Types for Reference Entity Attribute Option
 */
declare interface ReferenceEntityAttributeOption {
    code: string;
    labels: {
        [key: string]: string;
    };
}

declare interface ReferenceEntityAttributeOptionBaseParams {
    /**
     * Code of the reference entity
     */
    referenceEntityCode: string;
    /**
     * Code of the attribute
     */
    attributeCode: string;
}

/**
 * Parameters for getting a single reference entity attribute option
 */
declare interface ReferenceEntityAttributeOptionGetParams extends ReferenceEntityAttributeOptionBaseParams {
    /**
     * Code of the option to retrieve
     */
    code: string;
}

/**
 * Parameters for listing reference entity attribute options
 */
declare interface ReferenceEntityAttributeOptionListParams extends ReferenceEntityAttributeOptionBaseParams {
}

declare interface ReferenceEntityAttributeOptionUpdate extends Partial<ReferenceEntityAttributeOption> {
    code: string;
}

/**
 * Parameters for upserting reference entity attribute options
 */
declare interface ReferenceEntityAttributeOptionUpsertParams extends ReferenceEntityAttributeOptionBaseParams {
    /**
     * Data to upsert
     */
    data: ReferenceEntityAttributeOptionUpdate[];
}

declare interface ReferenceEntityAttributeOptionUpsertResult {
    items: {
        code: string;
        status: 'error' | 'success';
        message?: string;
        errors?: Array<{
            property: string;
            message: string;
        }>;
    }[];
}

/**
 * Type for partially updating a reference entity attribute
 */
declare type ReferenceEntityAttributeUpdate = Partial<ReferenceEntityAttributeCreate>;

/**
 * Type for creating or updating a reference entity
 */
declare interface ReferenceEntityCreate {
    code: string;
    labels?: ReferenceEntityLabels;
    image?: string | null;
}

/**
 * Type representing params for getting a reference entity
 */
declare interface ReferenceEntityGetParams {
    code: string;
}

/**
 * Type representing reference entity labels
 */
declare interface ReferenceEntityLabels {
    [locale: string]: string;
}

/**
 * Type representing a paginated response for a list of reference entities
 */
declare interface ReferenceEntityList extends PaginatedList<ReferenceEntity> {
}

/**
 * Type representing params for listing reference entities
 */
declare interface ReferenceEntityListParams {
    searchAfter?: string;
}

/**
 * Simplified reference entity record for the SDK
 */
declare interface ReferenceEntityRecord {
    code: string;
    values: ReferenceEntityRecordValues;
    links?: ApiLinks;
}

declare interface ReferenceEntityRecordBaseParams {
    /**
     * Code of the reference entity
     */
    referenceEntityCode: string;
}

/**
 * Type for creating or updating a reference entity record
 */
declare interface ReferenceEntityRecordCreate {
    code: string;
    values: ReferenceEntityRecordValues;
}

/**
 * Type representing params for getting a reference entity record
 */
declare interface ReferenceEntityRecordGetParams extends ReferenceEntityRecordBaseParams {
    /**
     * Code of the reference entity record
     */
    recordCode: string;
}

/**
 * Type representing params for listing reference entity records
 */
declare interface ReferenceEntityRecordListParams extends ReferenceEntityRecordBaseParams {
    search?: string;
    channel?: string;
    locales?: string;
    searchAfter?: string;
}

/**
 * Type for partially updating a reference entity record
 */
declare type ReferenceEntityRecordUpdate = Partial<ReferenceEntityRecordCreate>;

/**
 * Type representing the response from a record upsert operation
 */
declare interface ReferenceEntityRecordUpsertResult {
    items: {
        /**
         * Code of the reference entity record
         */
        code: string;
        /**
         * Operation status: 'success' or 'error'
         */
        status: 'success' | 'error';
        /**
         * Status message, if available
         */
        message?: string;
        /**
         * Validation errors, if any
         */
        errors?: Array<{
            property: string;
            message: string;
        }>;
    }[];
}

/**
 * Type representing a single record value
 */
declare interface ReferenceEntityRecordValue {
    locale?: string | null;
    channel?: string | null;
    data: string | string[] | null;
}

/**
 * Type representing reference entity record values
 */
declare interface ReferenceEntityRecordValues {
    [attributeCode: string]: ReferenceEntityRecordValue[];
}

/**
 * Type for partially updating a reference entity
 */
declare type ReferenceEntityUpdate = Partial<ReferenceEntityCreate>;

declare interface RejectedAttributeValue {
    locale: string | null;
    scope: string | null;
    comment: string;
}

declare interface RejectTaskRequest {
    status: 'rejected';
    sendBackToStepUuid: string;
    rejectedAttributes?: {
        [key: string]: RejectedAttributeValue[];
    };
}

/**
 * SDK interface for asset operations
 */
declare interface SdkApiAsset {
    /**
     * Get a single asset
     */
    get: (params: AssetGetParams) => Promise<Asset>;
    /**
     * Get a list of assets with pagination support
     */
    list: (params: AssetListParams) => Promise<PaginatedList<Asset>>;
    /**
     * Create or update a single asset
     */
    upsert: (params: AssetUpsertParams) => Promise<AssetOperationResponse>;
    /**
     * Delete an asset
     */
    delete: (params: AssetGetParams) => Promise<AssetOperationResponse>;
}

/**
 * SDK interface for asset attribute operations
 */
declare interface SdkApiAssetAttribute {
    /**
     * Get a single asset attribute
     */
    get: (params: AssetAttributeGetParams) => Promise<AssetAttribute>;
    /**
     * Get a list of asset attributes for a family
     */
    list: (params: AssetAttributeListParams) => Promise<AssetAttribute[]>;
    /**
     * Create or update asset attribute
     */
    upsert: (params: AssetAttributeUpsertParams) => Promise<AssetAttributeUpsertResult>;
}

/**
 * SDK interface for asset attribute option operations
 */
declare interface SdkApiAssetAttributeOption {
    /**
     * Get a single asset attribute option
     */
    get: (params: AssetAttributeOptionGetParams) => Promise<AssetAttributeOption>;
    /**
     * Get a list of asset attribute options
     */
    list: (params: AssetAttributeOptionListParams) => Promise<AssetAttributeOption[]>;
    /**
     * Create or update asset attribute options
     */
    upsert: (params: AssetAttributeOptionUpsertParams) => Promise<AssetAttributeOptionUpsertResult>;
}

/**
 * SDK interface for asset family operations
 */
declare interface SdkApiAssetFamily {
    /**
     * Get a single asset family
     */
    get: (params: AssetFamilyGetParams) => Promise<AssetFamily>;
    /**
     * Get a list of all asset families
     */
    list: () => Promise<AssetFamily[]>;
    /**
     * Create or update asset families
     */
    upsert: (params: AssetFamilyUpsertParams) => Promise<AssetFamilyUpsertResult>;
}

/**
 * SDK interface for asset media file operations
 */
declare interface SdkApiAssetMediaFile {
    /**
     * Upload an asset media file
     */
    upload: (params: AssetMediaFileUploadParams) => Promise<AssetMediaFileUploadResult>;
    /**
     * Download an asset media file
     */
    download: (params: AssetMediaFileDownloadParams) => Promise<Blob>;
}

/**
 * SDK interface for association type operations
 */
declare interface SdkApiAssociationType {
    /**
     * Get a single association type by code
     */
    get: (params: AssociationTypeGetParams) => Promise<AssociationType>;
    /**
     * Get a list of association types
     */
    list: (params?: AssociationTypeListParams) => Promise<AssociationTypeList>;
    /**
     * Create a new association type
     */
    create: (params: AssociationTypeCreateParams) => Promise<void>;
    /**
     * Update an association type
     */
    patch: (params: AssociationTypePatchParams) => Promise<void>;
}

/**
 * SDK interface for attribute operations
 */
declare interface SdkApiAttribute {
    /**
     * Get a single attribute by code
     */
    get: (params: AttributeGetParams) => Promise<Attribute>;
    /**
     * Get a list of attributes
     */
    list: (params?: AttributeListParams) => Promise<AttributeList>;
    /**
     * Create a new attribute
     */
    create: (params: AttributeCreateParams) => Promise<void>;
    /**
     * Update an attribute
     */
    patch: (params: AttributePatchParams) => Promise<void>;
}

/**
 * SDK interface for attribute group operations
 */
declare interface SdkApiAttributeGroup {
    /**
     * Get a single attribute group by code
     */
    get: (params: AttributeGroupGetParams) => Promise<AttributeGroup>;
    /**
     * Get a list of attribute groups
     */
    list: (params?: AttributeGroupListParams) => Promise<AttributeGroupList>;
    /**
     * Create a new attribute group
     */
    create: (params: AttributeGroupCreateParams) => Promise<void>;
    /**
     * Update an attribute group
     */
    patch: (params: AttributeGroupPatchParams) => Promise<void>;
}

/**
 * SDK interface for attribute option operations
 */
declare interface SdkApiAttributeOption {
    /**
     * Get a single attribute option by code
     */
    get: (params: AttributeOptionGetParams) => Promise<AttributeOption>;
    /**
     * Get a list of attribute options
     */
    list: (params: AttributeOptionListParams) => Promise<AttributeOptionList>;
    /**
     * Create a new attribute option
     */
    create: (params: AttributeOptionCreateParams) => Promise<void>;
    /**
     * Update an attribute option
     */
    patch: (params: AttributeOptionPatchParams) => Promise<void>;
}

/**
 * SDK interface for category operations
 */
declare interface SdkApiCategory {
    /**
     * Get a single category by code
     */
    get: (params: CategoryGetParams) => Promise<Category>;
    /**
     * Get a list of categories
     */
    list: (params?: CategoryListParams) => Promise<CategoryList>;
    /**
     * Create a new category
     */
    create: (params: CategoryCreateParams) => Promise<void>;
    /**
     * Update a category
     */
    patch: (params: CategoryPatchParams) => Promise<void>;
}

/**
 * SDK interface for channel operations
 */
declare interface SdkApiChannel {
    /**
     * Get a single channel by code
     */
    get: (params: ChannelGetParams) => Promise<Channel>;
    /**
     * Get a list of channels
     */
    list: (params?: ChannelListParams) => Promise<ChannelList>;
    /**
     * Update a channel
     */
    update: (params: ChannelUpdateParams) => Promise<void>;
    /**
     * Create a new channel
     */
    create: (params: ChannelCreateParams) => Promise<void>;
}

/**
 * SDK interface for currency operations
 */
declare interface SdkApiCurrency {
    /**
     * Get a single currency by code
     */
    get: (params: CurrencyGetParams) => Promise<Currency>;
    /**
     * Get a list of currencies
     */
    list: (params?: CurrencyListParams) => Promise<CurrencyList>;
}

/**
 * SDK interface for family operations
 */
declare interface SdkApiFamily {
    /**
     * Get a single family by code
     */
    get: (params: FamilyGetParams) => Promise<Family>;
    /**
     * Get a list of families
     */
    list: (params?: FamilyListParams) => Promise<FamilyList>;
    /**
     * Create a new family
     */
    create: (params: FamilyCreateParams) => Promise<void>;
    /**
     * Update a family
     */
    patch: (params: FamilyPatchParams) => Promise<void>;
}

/**
 * SDK interface for family variant operations
 */
declare interface SdkApiFamilyVariant {
    /**
     * Get a single family variant by code
     */
    get: (params: FamilyVariantGetParams) => Promise<FamilyVariant>;
    /**
     * Get a list of family variants
     */
    list: (params: FamilyVariantListParams) => Promise<FamilyVariantList>;
    /**
     * Create a new family variant
     */
    create: (params: FamilyVariantCreateParams) => Promise<void>;
    /**
     * Update a family variant
     */
    patch: (params: FamilyVariantPatchParams) => Promise<void>;
}

/**
 * SDK interface for locale operations
 */
declare interface SdkApiLocale {
    /**
     * Get a single locale by code
     */
    get: (params: LocaleGetParams) => Promise<Locale>;
    /**
     * Get a list of locales
     */
    list: (params?: LocaleListParams) => Promise<LocaleList>;
}

/**
 * SDK interface for measurement family operations
 */
declare interface SdkApiMeasurementFamily {
    /**
     * Get a list of all measurement families
     */
    list: () => Promise<MeasurementFamily[]>;
    /**
     * Update or create measurement families
     */
    update: (params: MeasurementFamilyUpdateParams) => Promise<MeasurementFamilyUpdateResult>;
}

/**
 * SDK interface for product media file operations
 */
declare interface SdkApiProductMediaFile {
    /**
     * Get a single product media file by code
     */
    get: (params: ProductMediaFileGetParams) => Promise<ProductMediaFile>;
    /**
     * Get a list of product media files
     */
    list: (params?: ProductMediaFileListParams) => Promise<ProductMediaFileList>;
    /**
     * Download a product media file
     */
    download: (params: ProductMediaFileDownloadParams) => Promise<Blob>;
    /**
     * Create a new product media file
     */
    create: (params: ProductMediaFileCreateParams) => Promise<void>;
}

/**
 * SDK interface for product model operations
 */
declare interface SdkApiProductModel {
    /**
     * Get a single product model by code
     */
    get: (params: ProductModelGetParams) => Promise<ProductModel>;
    /**
     * Get a list of product models
     */
    list: (params?: ProductModelListParams) => Promise<ProductModelList>;
    /**
     * Create a new product model
     */
    post: (params: ProductModelCreateParams) => Promise<void>;
    /**
     * Update a product model
     */
    patch: (params: ProductModelPatchParams) => Promise<void>;
    /**
     * Delete a product model
     */
    delete: (params: ProductModelDeleteParams) => Promise<void>;
}

/**
 * SDK interface for product UUID operations
 */
declare interface SdkApiProductUuid {
    /**
     * Get a single product by UUID
     */
    get: (params: ProductGetParams) => Promise<Product>;
    /**
     * Get a list of products
     */
    list: (params?: ProductListParams) => Promise<ProductList>;
    /**
     * Create a new product
     */
    create: (params: ProductCreateParams) => Promise<void>;
    /**
     * Update a product
     */
    patch: (params: ProductPatchParams) => Promise<void>;
    /**
     * Delete a product
     */
    delete: (params: ProductDeleteParams) => Promise<void>;
}

/**
 * Interface defining the available methods for the Reference Entity SDK
 */
declare interface SdkApiReferenceEntity {
    /**
     * Get a reference entity by code
     */
    get: (params: ReferenceEntityGetParams) => Promise<ReferenceEntity>;
    /**
     * Get a list of reference entities
     */
    list: (params?: ReferenceEntityListParams) => Promise<ReferenceEntityList>;
    /**
     * Create or update a reference entity
     */
    upsert: (params: {
        code: string;
        data: ReferenceEntityUpdate;
    }) => Promise<void>;
}

/**
 * Interface defining the available methods for the Reference Entity Attribute SDK
 */
declare interface SdkApiReferenceEntityAttribute {
    /**
     * Get a reference entity attribute by code
     */
    get: (params: ReferenceEntityAttributeGetParams) => Promise<ReferenceEntityAttribute>;
    /**
     * Get a list of reference entity attributes
     */
    list: (params: ReferenceEntityAttributeListParams) => Promise<ReferenceEntityAttributeList>;
    /**
     * Create or update a reference entity attribute
     */
    upsert: (params: {
        referenceEntityCode: string;
        attributeCode: string;
        data: ReferenceEntityAttributeUpdate | ReferenceEntityAttributeCreate;
    }) => Promise<void>;
}

declare interface SdkApiReferenceEntityAttributeOption {
    get(params: ReferenceEntityAttributeOptionGetParams): Promise<ReferenceEntityAttributeOption>;
    list(params: ReferenceEntityAttributeOptionListParams): Promise<ReferenceEntityAttributeOption[]>;
    upsert(params: ReferenceEntityAttributeOptionUpsertParams): Promise<ReferenceEntityAttributeOptionUpsertResult>;
}

/**
 * Interface defining the available methods for the Reference Entity Record SDK
 */
declare interface SdkApiReferenceEntityRecord {
    /**
     * Get a reference entity record by code
     */
    get: (params: ReferenceEntityRecordGetParams) => Promise<ReferenceEntityRecord>;
    /**
     * Get a list of reference entity records
     */
    list: (params: ReferenceEntityRecordListParams) => Promise<PaginatedList<ReferenceEntityRecord>>;
    /**
     * Create or update reference entity records
     */
    upsert: (params: {
        referenceEntityCode: string;
        data: ReferenceEntityRecordCreate[] | ReferenceEntityRecordUpdate[];
    }) => Promise<ReferenceEntityRecordUpsertResult>;
}

/**
 * SDK interface for system operations
 */
declare interface SdkApiSystem {
    /**
     * Get information about the PIM system
     */
    get: () => Promise<SystemInfo>;
}

declare interface SdkApiWorkflowExecutions {
    start: (executions: StartExecutionRequest[]) => Promise<void>;
}

declare interface SdkApiWorkflows {
    list: (page?: number, limit?: number) => Promise<WorkflowsList>;
    get: (uuid: string) => Promise<Workflow>;
    getStepAssignees: (stepUuid: string, page?: number, limit?: number) => Promise<AssigneesList>;
}

declare interface SdkApiWorkflowTasks {
    list: (search: string, withAttributes?: boolean, page?: number, limit?: number) => Promise<WorkflowTasksList>;
    patch: (uuid: string, request: UpdateTaskRequest) => Promise<void>;
}

declare interface StartExecutionForProductModelRequest {
    workflow: ExecutionWorkflow;
    productModel: ExecutionProductModel;
}

declare interface StartExecutionForProductRequest {
    workflow: ExecutionWorkflow;
    product: ExecutionProduct;
}

declare type StartExecutionRequest = StartExecutionForProductRequest | StartExecutionForProductModelRequest;

/**
 * Represents system information in the SDK
 */
declare interface SystemInfo {
    /**
     * Version of the PIM
     */
    version?: string;
    /**
     * Edition of the PIM
     */
    edition?: string;
}

declare interface TaskProduct {
    uuid?: string;
}

declare interface TaskProductModel {
    code?: string;
}

declare type UpdateTaskRequest = RejectTaskRequest | CompleteTaskRequest | ApproveTaskRequest;

/**
 * Variant attribute set for defining attribute distribution in family variants
 */
declare interface VariantAttributeSet {
    level: number;
    axes: string[];
    attributes: string[];
}

declare interface Workflow {
    uuid?: string;
    code?: string;
    labels?: Record<string, string>;
    enabled?: boolean;
    steps?: WorkflowStep[];
}

declare interface WorkflowListItem {
    uuid?: string;
    code?: string;
    labels?: Record<string, string>;
    enabled?: boolean;
}

declare interface WorkflowsList {
    currentPage?: number;
    items?: WorkflowListItem[];
}

declare interface WorkflowStep {
    uuid?: string;
    code?: string;
    type?: string;
    labels?: Record<string, string>;
    descriptions?: Record<string, string>;
    allottedTime?: AllottedTime;
    channelsAndLocales?: Record<string, string[]>;
}

declare interface WorkflowTask {
    uuid?: string;
    status?: string;
    createdAt?: string;
    product?: TaskProduct;
    productModel?: TaskProductModel;
    dueDate?: string | null;
    rejected?: boolean;
    pendingAttributes?: {
        [key: string]: PendingAttributeValue[];
    };
}

declare interface WorkflowTasksList {
    currentPage?: number;
    items?: WorkflowTask[];
}

export { }


declare global {
    namespace globalThis {
        var PIM: PIM_SDK;
    }
}
