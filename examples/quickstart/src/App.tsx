import {
  SectionTitle,
  Placeholder,
  ApiIllustration,
  Helper,
  Badge,
  Button,
  TextInput
} from "akeneo-design-system";
import { useEffect, useState } from "react";

interface ShopifyProduct {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  status: string;
  variants: Array<{
    id: number;
    sku: string;
    title: string;
  }>;
}

interface ShopifyProductsResponse {
  products: ShopifyProduct[];
}

interface ShopifyOrder {
  id: number;
  name: string;
  created_at: string;
  total_price: string;
  currency: string;
  financial_status: string;
  fulfillment_status: string | null;
  customer: {
    first_name: string;
    last_name: string;
  };
  line_items: Array<{
    id: number;
    quantity: number;
    sku: string;
    name: string;
  }>;
}

interface ShopifyOrdersResponse {
  orders: ShopifyOrder[];
}

interface ExternalApiResponse {
  status: string;
  statusCode: number;
  body: ShopifyOrdersResponse;
  contentType: string;
  error: any;
}

function App() {
  const [orders, setOrders] = useState<ShopifyOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [productSku, setProductSku] = useState<string | null>(null);
  const [shopifyProduct, setShopifyProduct] = useState<ShopifyProduct | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(false);
  const [shopifyUrl, setShopifyUrl] = useState<string>('');
  const [shopifyUrlInput, setShopifyUrlInput] = useState<string>('');
  const [isUrlSet, setIsUrlSet] = useState<boolean>(false);

  const fetchProductAndOrders = async (storeUrl: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // Get product UUID from context
        const context = globalThis.PIM.context;

        if (!('product' in context)) {
          setError('This extension must be displayed on a product page');
          setIsLoading(false);
          return;
        }

        const productUuid = context.product.uuid;

        // Fetch product data from Akeneo
        const product = await globalThis.PIM.api.product_uuid_v1.get({
          uuid: productUuid,
        });

        // Get product SKU from values field
        let sku: string | null = null;

        // Try to get SKU from the sku attribute
        if (product.values?.sku) {
          if (Array.isArray(product.values.sku) && product.values.sku.length > 0) {
            sku = product.values.sku[0].data;
          }
        }

        // If SKU not found, search through all identifier-type attributes
        // (identifier field is empty due to a known bug)
        if (!sku && product.values) {
          for (const [attributeCode, attributeValue] of Object.entries(product.values)) {
            if (Array.isArray(attributeValue) && attributeValue.length > 0) {
              const firstValue = attributeValue[0];
              // Check if this is a pim_catalog_identifier type attribute with data
              if (firstValue && typeof firstValue === 'object' &&
                  'attribute_type' in firstValue &&
                  firstValue.attribute_type === 'pim_catalog_identifier' &&
                  'data' in firstValue) {
                const data = firstValue.data;
                if (typeof data === 'string' && data.trim().length > 0) {
                  sku = data.trim();
                  console.log(`Found SKU in identifier attribute '${attributeCode}': ${sku}`);
                  break;
                }
              }
            }
          }
        }

        if (!sku) {
          setError('Product does not have a SKU. Please add a "sku" attribute to this product.');
          setIsLoading(false);
          return;
        }

        setProductSku(sku);

        // Fetch product from Shopify to check if it exists
        try {
          setIsLoadingProduct(true);
          const productsResponse = await globalThis.PIM.api.external.call({
            method: 'GET',
            url: `${storeUrl}/admin/api/2024-01/products.json?limit=250`,
            credentials_code: 'shopify_access_token',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const productsText = await productsResponse.text();
          const productsApiResponse: {
            statusCode: number;
            body: ShopifyProductsResponse;
            error: any;
          } = JSON.parse(productsText);

          if (!productsApiResponse.error && productsApiResponse.statusCode === 200) {
            const products = productsApiResponse.body.products;
            // Find product by SKU in variants
            const foundProduct = products.find(p =>
              p.variants.some(v => v.sku === sku)
            );
            if (foundProduct) {
              setShopifyProduct(foundProduct);
            }
          }
        } catch (err) {
          console.warn('Could not fetch Shopify products:', err);
        } finally {
          setIsLoadingProduct(false);
        }

        // Fetch orders from Shopify
        const shopifyResponse = await globalThis.PIM.api.external.call({
          method: 'GET',
          url: `${storeUrl}/admin/api/2024-01/orders.json?status=any&limit=250`,
          credentials_code: 'shopify_access_token',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Parse the response - the external API returns a wrapper object
        const responseText = await shopifyResponse.text();
        const externalApiResponse: ExternalApiResponse = JSON.parse(responseText);

        if (externalApiResponse.error) {
          setError(`Shopify API error: ${JSON.stringify(externalApiResponse.error)}`);
          setIsLoading(false);
          return;
        }

        if (externalApiResponse.statusCode !== 200) {
          setError(`Shopify API returned status code: ${externalApiResponse.statusCode}`);
          setIsLoading(false);
          return;
        }

        const shopifyData = externalApiResponse.body;

        if (!shopifyData.orders || !Array.isArray(shopifyData.orders)) {
          setError('Invalid response from Shopify API - orders not found');
          setIsLoading(false);
          return;
        }

        // Filter orders that contain this product SKU
        const ordersWithProduct = shopifyData.orders.filter((order) =>
          order.line_items.some((item) => item.sku === sku)
        );

        setOrders(ordersWithProduct);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

  const handleUrlSubmit = () => {
    const trimmedUrl = shopifyUrlInput.trim();

    // Basic validation
    if (!trimmedUrl) {
      setError('Please enter a Shopify store URL');
      return;
    }

    // Remove trailing slash if present
    const cleanedUrl = trimmedUrl.replace(/\/$/, '');

    // Validate URL format
    if (!cleanedUrl.match(/^https:\/\/[^\/]+\.myshopify\.com$/)) {
      setError('Please enter a valid Shopify store URL (e.g., https://your-store.myshopify.com)');
      return;
    }

    setShopifyUrl(cleanedUrl);
    setIsUrlSet(true);
    setError(null);
    fetchProductAndOrders(cleanedUrl);
  };

  const getStatusBadgeLevel = (status: string): 'primary' | 'warning' | 'danger' => {
    if (status === 'paid' || status === 'fulfilled') return 'primary';
    if (status === 'pending' || status === 'partial') return 'warning';
    return 'danger';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateStats = () => {
    if (orders.length === 0) return null;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Get all line items for this product across all orders
    const productLineItems = orders.flatMap(order =>
      order.line_items
        .filter(item => item.sku === productSku)
        .map(item => ({
          ...item,
          orderDate: new Date(order.created_at),
          orderId: order.id,
          orderName: order.name,
        }))
    );

    // Calculate total quantity sold
    const totalQuantitySold = productLineItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    // Calculate quantity sold this month
    const quantityThisMonth = productLineItems
      .filter(item => item.orderDate >= startOfMonth)
      .reduce((sum, item) => sum + item.quantity, 0);

    // Calculate quantity sold this year
    const quantityThisYear = productLineItems
      .filter(item => item.orderDate >= startOfYear)
      .reduce((sum, item) => sum + item.quantity, 0);

    // Find most recent purchase
    const sortedByDate = [...productLineItems].sort(
      (a, b) => b.orderDate.getTime() - a.orderDate.getTime()
    );
    const mostRecentPurchase = sortedByDate[0];

    // Find order with highest quantity
    const sortedByQuantity = [...productLineItems].sort(
      (a, b) => b.quantity - a.quantity
    );
    const largestOrder = sortedByQuantity[0];

    // Calculate total revenue for this product
    const totalRevenue = productLineItems.reduce((sum, item) => {
      const price = parseFloat(item.price);
      return sum + price * item.quantity;
    }, 0);

    // Get first purchase date
    const firstPurchase = [...productLineItems].sort(
      (a, b) => a.orderDate.getTime() - b.orderDate.getTime()
    )[0];

    return {
      totalQuantitySold,
      quantityThisMonth,
      quantityThisYear,
      mostRecentPurchase,
      largestOrder,
      totalRevenue,
      firstPurchase,
      totalOrders: orders.length,
    };
  };

  const stats = calculateStats();

  return (
    <div style={{
      padding: '16px',
      maxWidth: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <SectionTitle>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <span>Shopify Integration</span>
            {productSku && (
              <span style={{
                fontSize: '13px',
                fontWeight: 'normal',
                color: '#67768A',
              }}>
                SKU: {productSku}
              </span>
            )}
          </div>
        </SectionTitle>
      </div>

      {/* Shopify URL Input */}
      <div style={{
        marginBottom: '20px',
        border: '2px solid #5E4ABA',
        borderRadius: '4px',
        padding: '16px',
        backgroundColor: '#F0EDFC'
      }}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{
            display: 'block',
            fontWeight: 600,
            fontSize: '14px',
            marginBottom: '8px',
            color: '#333'
          }}>
            Shopify Store URL
          </label>
          <div style={{ marginBottom: '12px' }}>
            <Helper level="info" inline={false}>
              Enter your Shopify store URL (e.g., https://your-store.myshopify.com)
            </Helper>
          </div>
        </div>

        {!isUrlSet ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <TextInput
                value={shopifyUrlInput}
                onChange={(value: string) => setShopifyUrlInput(value)}
                placeholder="https://your-store.myshopify.com"
              />
            </div>
            <Button
              onClick={handleUrlSubmit}
              level="primary"
              disabled={!shopifyUrlInput.trim()}
            >
              Load Data
            </Button>
          </div>
        ) : (
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#FFFFFF',
            borderRadius: '4px',
            border: '1px solid #E8EBEE'
          }}>
            <div style={{ fontSize: '12px', color: '#67768A', marginBottom: '4px' }}>
              Connected to:
            </div>
            <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '14px' }}>
              {shopifyUrl}
            </div>
          </div>
        )}
      </div>

      {/* Product Presence Section */}
      {!error && productSku && isUrlSet && (
        <div style={{ marginBottom: '20px' }}>
          {isLoadingProduct ? (
            <div style={{
              border: '1px solid #E8EBEE',
              borderRadius: '4px',
              padding: '12px',
              backgroundColor: '#FFFFFF',
            }}>
              <Helper level="info" inline={false}>
                Checking if product exists in Shopify...
              </Helper>
            </div>
          ) : shopifyProduct ? (
            <div style={{
              border: '2px solid #2FAF7B',
              borderRadius: '4px',
              padding: '16px',
              backgroundColor: '#F0FDF4',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <Badge level="primary">Found in Shopify</Badge>
                <strong style={{ fontSize: '15px', color: '#2FAF7B' }}>
                  {shopifyProduct.title}
                </strong>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                fontSize: '13px'
              }}>
                <div>
                  <div style={{ color: '#67768A', marginBottom: '4px', fontSize: '12px' }}>Status</div>
                  <div>
                    <Badge level={shopifyProduct.status === 'active' ? 'primary' : 'warning'}>
                      {shopifyProduct.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <div style={{ color: '#67768A', marginBottom: '4px', fontSize: '12px' }}>Created</div>
                  <div style={{ fontWeight: 500 }}>
                    {formatDate(shopifyProduct.created_at)}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#67768A', marginBottom: '4px', fontSize: '12px' }}>Last Updated</div>
                  <div style={{ fontWeight: 500 }}>
                    {formatDate(shopifyProduct.updated_at)}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <a
                  href={`${shopifyUrl}/admin/products/${shopifyProduct.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#5E4ABA',
                    textDecoration: 'none',
                    border: '1px solid #5E4ABA',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F0EDFC';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  View in Shopify
                </a>
              </div>
            </div>
          ) : (
            <div style={{
              border: '2px solid #F5A623',
              borderRadius: '4px',
              padding: '12px',
              backgroundColor: '#FFF8E1',
            }}>
              <Helper level="warning" inline={false}>
                Product with SKU "{productSku}" was not found in Shopify.
              </Helper>
            </div>
          )}
        </div>
      )}

      {/* Orders Section Title */}
      {!error && !isLoading && orders.length > 0 && (
        <div style={{ marginBottom: '12px', marginTop: '20px' }}>
          <SectionTitle>
            <SectionTitle.Title level="secondary">Orders</SectionTitle.Title>
          </SectionTitle>
        </div>
      )}

      {isLoading && isUrlSet && (
        <Placeholder
          illustration={<ApiIllustration />}
          title="Loading Shopify orders..."
        >
          Fetching orders from your Shopify store...
        </Placeholder>
      )}

      {error && (
        <Helper level="error" inline={false}>
          {error}
        </Helper>
      )}

      {!isLoading && !error && isUrlSet && orders.length === 0 && (
        <Placeholder
          illustration={<ApiIllustration />}
          title="No orders found"
        >
          This product has not been ordered yet on Shopify.
        </Placeholder>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <div>
          <div style={{ marginBottom: '12px' }}>
            <Helper level="info" inline={false}>
              Found {orders.length} order{orders.length !== 1 ? 's' : ''} containing this product
            </Helper>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.map((order) => {
              const productQuantity = order.line_items
                .filter((item) => item.sku === productSku)
                .reduce((sum, item) => sum + item.quantity, 0);

              return (
                <div
                  key={order.id}
                  style={{
                    border: '1px solid #E8EBEE',
                    borderRadius: '4px',
                    padding: '12px',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  {/* Header row with order number and date */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                    paddingBottom: '8px',
                    borderBottom: '1px solid #F5F5F5'
                  }}>
                    <strong style={{ color: '#5E4ABA', fontSize: '15px' }}>{order.name}</strong>
                    <span style={{ fontSize: '13px', color: '#67768A' }}>{formatDate(order.created_at)}</span>
                  </div>

                  {/* Details grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px',
                    fontSize: '13px'
                  }}>
                    <div>
                      <div style={{ color: '#67768A', marginBottom: '2px' }}>Customer</div>
                      <div style={{ fontWeight: 500 }}>
                        {order.customer?.first_name && order.customer?.last_name
                          ? `${order.customer.first_name} ${order.customer.last_name}`
                          : 'Guest'}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: '#67768A', marginBottom: '2px' }}>Quantity</div>
                      <div style={{ fontWeight: 500 }}>{productQuantity}</div>
                    </div>

                    <div>
                      <div style={{ color: '#67768A', marginBottom: '2px' }}>Total order price</div>
                      <div style={{ fontWeight: 500 }}>{order.currency} {order.total_price}</div>
                    </div>

                    <div>
                      <div style={{ color: '#67768A', marginBottom: '2px' }}>Payment</div>
                      <div>
                        <Badge level={getStatusBadgeLevel(order.financial_status)}>
                          {order.financial_status}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <div style={{ color: '#67768A', marginBottom: '2px' }}>Fulfillment</div>
                      <div>
                        {order.fulfillment_status ? (
                          <Badge level={getStatusBadgeLevel(order.fulfillment_status)}>
                            {order.fulfillment_status}
                          </Badge>
                        ) : (
                          <Badge level="warning">unfulfilled</Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: '#67768A', marginBottom: '2px' }}>Shopify ID</div>
                      <div style={{
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        color: '#67768A',
                        userSelect: 'all',
                        cursor: 'text'
                      }}>
                        {order.id}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Statistics Section */}
          {stats && (
            <div style={{ marginTop: '20px' }}>
              <SectionTitle>
                <SectionTitle.Title level="secondary">Product Statistics</SectionTitle.Title>
              </SectionTitle>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
                marginTop: '12px'
              }}>
                {/* Total Sold */}
                <div style={{
                  border: '1px solid #E8EBEE',
                  borderRadius: '4px',
                  padding: '12px',
                  backgroundColor: '#FFFFFF',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: '#5E4ABA', marginBottom: '4px' }}>
                    {stats.totalQuantitySold}
                  </div>
                  <div style={{ fontSize: '12px', color: '#67768A' }}>Total Sold</div>
                </div>

                {/* This Month */}
                <div style={{
                  border: '1px solid #E8EBEE',
                  borderRadius: '4px',
                  padding: '12px',
                  backgroundColor: '#FFFFFF',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: '#5E4ABA', marginBottom: '4px' }}>
                    {stats.quantityThisMonth}
                  </div>
                  <div style={{ fontSize: '12px', color: '#67768A' }}>This Month</div>
                </div>

                {/* This Year */}
                <div style={{
                  border: '1px solid #E8EBEE',
                  borderRadius: '4px',
                  padding: '12px',
                  backgroundColor: '#FFFFFF',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: '#5E4ABA', marginBottom: '4px' }}>
                    {stats.quantityThisYear}
                  </div>
                  <div style={{ fontSize: '12px', color: '#67768A' }}>This Year</div>
                </div>

                {/* Total Orders */}
                <div style={{
                  border: '1px solid #E8EBEE',
                  borderRadius: '4px',
                  padding: '12px',
                  backgroundColor: '#FFFFFF',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: '#5E4ABA', marginBottom: '4px' }}>
                    {stats.totalOrders}
                  </div>
                  <div style={{ fontSize: '12px', color: '#67768A' }}>Orders</div>
                </div>
              </div>

              {/* Additional Details */}
              <div style={{
                marginTop: '12px',
                border: '1px solid #E8EBEE',
                borderRadius: '4px',
                padding: '12px',
                backgroundColor: '#FFFFFF',
                fontSize: '13px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#67768A' }}>Last Purchased</span>
                    <span style={{ fontWeight: 500 }}>
                      {formatDate(stats.mostRecentPurchase.orderDate.toISOString())}
                      <span style={{ color: '#67768A', marginLeft: '4px' }}>
                        ({stats.mostRecentPurchase.orderName})
                      </span>
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#67768A' }}>First Purchased</span>
                    <span style={{ fontWeight: 500 }}>
                      {formatDate(stats.firstPurchase.orderDate.toISOString())}
                      <span style={{ color: '#67768A', marginLeft: '4px' }}>
                        ({stats.firstPurchase.orderName})
                      </span>
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#67768A' }}>Largest Single Order</span>
                    <span style={{ fontWeight: 500 }}>
                      {stats.largestOrder.quantity} units
                      <span style={{ color: '#67768A', marginLeft: '4px' }}>
                        ({stats.largestOrder.orderName})
                      </span>
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '8px',
                    borderTop: '1px solid #F5F5F5',
                    marginTop: '4px'
                  }}>
                    <span style={{ color: '#67768A', fontWeight: 500 }}>Total Revenue</span>
                    <span style={{ fontSize: '16px', fontWeight: 600, color: '#5E4ABA' }}>
                      USD ${stats.totalRevenue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '12px' }}>
            <Helper level="info" inline={false}>
              To view order details in Shopify, copy the Order ID and search for it in your Shopify admin panel.
            </Helper>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
