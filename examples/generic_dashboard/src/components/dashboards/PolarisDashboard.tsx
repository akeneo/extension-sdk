import { Flag } from '../Flag.tsx';

interface PolarisDashboardProps {
  productStatusData: any;
  pricingStatusData: any;
  selectedFamilyLabel: string;
  completenessData: Array<{ locale: string; completeness: number }>;
  completenessLoading: boolean;
  products: any[];
}

const getProductName = (values: { [key: string]: Array<{ locale: string | null; data: string; }> } | undefined): string => {
  const attributePriority = ['name', 'erp_name', 'product_name', 'marketing_name', 'internal_erpname', 'label'];
  const localePriority = ['en_US', 'en_GB', 'fr_FR', 'de_DE', 'nl_NL', 'it_IT', 'es_ES'];

  if (!values) {
    return 'N/A';
  }

  for (const attribute of attributePriority) {
    const nameValues = values[attribute];
    if (nameValues && nameValues.length > 0) {
      for (const locale of localePriority) {
        const nameValue = nameValues.find(val => val.locale === locale);
        if (nameValue && nameValue.data) {
          return nameValue.data;
        }
      }
      if (nameValues[0] && nameValues[0].data) {
        return nameValues[0].data;
      }
    }
  }

  return 'N/A';
};

export const PolarisDashboard = ({
  productStatusData,
  pricingStatusData,
  selectedFamilyLabel,
  completenessData,
  completenessLoading,
  products,
}: PolarisDashboardProps) => {
  // Extract data from chart objects
  const pricingLabels = pricingStatusData.labels || [];
  const pricingValues = pricingStatusData.datasets?.[0]?.data || [];
  const pricingTotal = pricingValues.reduce((sum: number, val: number) => sum + val, 0);

  const productLabels = productStatusData.labels || [];
  const productValues = productStatusData.datasets?.[0]?.data || [];
  const productTotal = productValues.reduce((sum: number, val: number) => sum + val, 0);

  return (
    <s-stack direction="inline" gap="large">
      {/* Pricing Status Section */}
       <s-section heading="Pricing Status">
        <p style={{ marginBottom: '16px', color: '#6d7175' }}>
          Complete products with or without a price.
        </p>
        <s-table variant="auto">
          <s-table-header-row>
            <s-table-header>Status</s-table-header>
            <s-table-header format="numeric">Count</s-table-header>
            <s-table-header format="numeric">Percentage</s-table-header>
          </s-table-header-row>
          <s-table-body>
            {pricingLabels.map((label: string, index: number) => {
              const value = pricingValues[index] || 0;
              const percentage = pricingTotal > 0 ? ((value / pricingTotal) * 100).toFixed(1) : '0.0';
              return (
                <s-table-row key={index}>
                  <s-table-cell>{label}</s-table-cell>
                  <s-table-cell>{value}</s-table-cell>
                  <s-table-cell>{percentage}%</s-table-cell>
                </s-table-row>
              );
            })}
          </s-table-body>
        </s-table>
      </s-section>

      {/* Product Status Section */}
      <s-section heading="Distribution by Completeness Status">
        <s-table variant="auto">
          <s-table-header-row>
            <s-table-header>Status</s-table-header>
            <s-table-header format="numeric">Count</s-table-header>
            <s-table-header format="numeric">Percentage</s-table-header>
          </s-table-header-row>
          <s-table-body>
            {productLabels.map((label: string, index: number) => {
              const value = productValues[index] || 0;
              const percentage = productTotal > 0 ? ((value / productTotal) * 100).toFixed(1) : '0.0';
              return (
                <s-table-row key={index}>
                  <s-table-cell>{label}</s-table-cell>
                  <s-table-cell>{value}</s-table-cell>
                  <s-table-cell>{percentage}%</s-table-cell>
                </s-table-row>
              );
            })}
          </s-table-body>
        </s-table>
      </s-section>

      {/* Completeness per Locale Section */}
      <s-section heading="Completeness per Locale">
        <p style={{ marginBottom: '16px', color: '#6d7175' }}>
          Average score for the '{selectedFamilyLabel}' family.
        </p>

        {completenessLoading ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#6d7175' }}>
            Calculating...
          </p>
        ) : (
          <s-table variant="auto">
            <s-table-header-row>
              <s-table-header>Locale</s-table-header>
              <s-table-header format="numeric">Completeness</s-table-header>
            </s-table-header-row>
            <s-table-body>
              {completenessData.map((item) => (
                <s-table-row key={item.locale}>
                  <s-table-cell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Flag locale={item.locale} />
                      <span>{item.locale}</span>
                    </div>
                  </s-table-cell>
                  <s-table-cell>{item.completeness}%</s-table-cell>
                </s-table-row>
              ))}
            </s-table-body>
          </s-table>
        )}
      </s-section>

      {/* Products Table Section */}
      <s-section heading={`Recently Updated Products in the ${selectedFamilyLabel} Family`}>
        <p style={{ marginBottom: '16px', color: '#6d7175' }}>
          List of 10 products from the PIM.
        </p>

        <s-table variant="auto">
          <s-table-header-row>
            <s-table-header>Image</s-table-header>
            <s-table-header>SKU</s-table-header>
            <s-table-header>Name</s-table-header>
            <s-table-header>Last Update</s-table-header>
          </s-table-header-row>
          <s-table-body>
            {products.map((product: any) => {
              const updatedDate = new Date(product.updated);
              const day = String(updatedDate.getDate()).padStart(2, '0');
              const month = String(updatedDate.getMonth() + 1).padStart(2, '0');
              const year = updatedDate.getFullYear();
              const hours = String(updatedDate.getHours()).padStart(2, '0');
              const minutes = String(updatedDate.getMinutes()).padStart(2, '0');
              const seconds = String(updatedDate.getSeconds()).padStart(2, '0');
              const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
              const productName = getProductName(product.values);

              return (
                <s-table-row key={product.uuid}>
                  <s-table-cell>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={productName}
                        style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      'N/A'
                    )}
                  </s-table-cell>
                  <s-table-cell>
                    <a
                      href={`/enrich/product/${product.uuid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {product.values?.sku?.[0]?.data ?? product.values?.internal_itemid?.[0]?.data ?? product.identifier}
                    </a>
                  </s-table-cell>
                  <s-table-cell>{productName}</s-table-cell>
                  <s-table-cell>{formattedDate}</s-table-cell>
                </s-table-row>
              );
            })}
          </s-table-body>
        </s-table>
      </s-section>
    </s-stack>
  );
};
