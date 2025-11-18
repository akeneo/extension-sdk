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

  const productLabels = productStatusData.labels || [];
  const productValues = productStatusData.datasets?.[0]?.data || [];

  return (
    <s-stack direction="vertical" gap="4">
      {/* Pricing Status Section */}
      <s-section title="Pricing Status">
        <p style={{ marginBottom: '16px', color: '#6d7175' }}>
          Complete products with or without a price.
        </p>
        <s-table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {pricingLabels.map((label: string, index: number) => (
              <tr key={index}>
                <td>{label}</td>
                <td>{pricingValues[index] || 0}</td>
              </tr>
            ))}
          </tbody>
        </s-table>
      </s-section>

      {/* Product Status Section */}
      <s-section title="Distribution by Completeness Status">
        <s-table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {productLabels.map((label: string, index: number) => (
              <tr key={index}>
                <td>{label}</td>
                <td>{productValues[index] || 0}</td>
              </tr>
            ))}
          </tbody>
        </s-table>
      </s-section>

      {/* Completeness per Locale Section */}
      <s-section title="Completeness per Locale">
        <p style={{ marginBottom: '16px', color: '#6d7175' }}>
          Average score for the '{selectedFamilyLabel}' family.
        </p>

        {completenessLoading ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#6d7175' }}>
            Calculating...
          </p>
        ) : (
          <s-table>
            <thead>
              <tr>
                <th>Locale</th>
                <th>Completeness</th>
              </tr>
            </thead>
            <tbody>
              {completenessData.map((item) => (
                <tr key={item.locale}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Flag locale={item.locale} />
                      <span>{item.locale}</span>
                    </div>
                  </td>
                  <td>{item.completeness}%</td>
                </tr>
              ))}
            </tbody>
          </s-table>
        )}
      </s-section>

      {/* Products Table Section */}
      <s-section title={`Recently Updated Products in the ${selectedFamilyLabel} Family`}>
        <p style={{ marginBottom: '16px', color: '#6d7175' }}>
          List of 10 products from the PIM.
        </p>

        <s-table>
          <thead>
            <tr>
              <th>Image</th>
              <th>SKU</th>
              <th>Name</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
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
                <tr key={product.uuid}>
                  <td>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={productName}
                        style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <a
                      href={`/enrich/product/${product.uuid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#008060', textDecoration: 'none' }}
                    >
                      {product.values?.sku?.[0]?.data ?? product.values?.internal_itemid?.[0]?.data ?? product.identifier}
                    </a>
                  </td>
                  <td>{productName}</td>
                  <td>{formattedDate}</td>
                </tr>
              );
            })}
          </tbody>
        </s-table>
      </s-section>
    </s-stack>
  );
};
