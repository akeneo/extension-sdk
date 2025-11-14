import {
  SectionTitle,
  Placeholder,
  ApiIllustration,
  Helper,
  Badge,
  Button
} from "akeneo-design-system";
import { useEffect, useState } from "react";

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
    product_id: number;
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

interface ProductOrderData {
  sku: string;
  productName: string;
  totalQuantity: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderQuantity: number;
  lastOrderDate: string;
  firstOrderDate: string;
  currency: string;
  productUuid: string | null;
  shopifyProductId: number | null;
}

function App() {
  const [topProducts, setTopProducts] = useState<ProductOrderData[]>([]);
  const [isLoadingShopify, setIsLoadingShopify] = useState<boolean>(true);
  const [isLoadingAkeneo, setIsLoadingAkeneo] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrdersAndCalculateTopProducts = async () => {
      try {
        setIsLoadingShopify(true);
        setError(null);

        // Fetch orders from Shopify
        const shopifyResponse = await globalThis.PIM.api.external.call({
          method: 'GET',
          url: `https://extensibility-store-2.myshopify.com/admin/api/2024-01/orders.json?status=any&limit=250`,
          credentials_code: 'shopify_access_token',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Parse the response
        const responseText = await shopifyResponse.text();
        const externalApiResponse: ExternalApiResponse = JSON.parse(responseText);

        if (externalApiResponse.error) {
          setError(`Shopify API error: ${JSON.stringify(externalApiResponse.error)}`);
          setIsLoadingShopify(false);
          return;
        }

        if (externalApiResponse.statusCode !== 200) {
          setError(`Shopify API returned status code: ${externalApiResponse.statusCode}`);
          setIsLoadingShopify(false);
          return;
        }

        const shopifyData = externalApiResponse.body;

        if (!shopifyData.orders || !Array.isArray(shopifyData.orders)) {
          setError('Invalid response from Shopify API - orders not found');
          setIsLoadingShopify(false);
          return;
        }

        // Aggregate product order data with detailed metrics
        const productMap = new Map<string, {
          productName: string;
          totalQuantity: number;
          totalRevenue: number;
          orderIds: Set<number>;
          orderDates: string[];
          currency: string;
          shopifyProductId: number | null;
        }>();

        shopifyData.orders.forEach((order) => {
          order.line_items.forEach((item) => {
            if (item.sku) {
              const existing = productMap.get(item.sku);

              // Calculate item revenue (price * quantity)
              const itemPrice = parseFloat((item as any).price || '0');
              const itemRevenue = itemPrice * item.quantity;

              if (existing) {
                existing.totalQuantity += item.quantity;
                existing.totalRevenue += itemRevenue;
                existing.orderIds.add(order.id);
                existing.orderDates.push(order.created_at);
                // Update product ID if we don't have one yet
                if (!existing.shopifyProductId && item.product_id) {
                  existing.shopifyProductId = item.product_id;
                }
              } else {
                productMap.set(item.sku, {
                  productName: item.name,
                  totalQuantity: item.quantity,
                  totalRevenue: itemRevenue,
                  orderIds: new Set([order.id]),
                  orderDates: [order.created_at],
                  currency: order.currency,
                  shopifyProductId: item.product_id || null
                });
              }
            }
          });
        });

        // Convert to array with calculated metrics
        const productsArray = Array.from(productMap.entries()).map(([sku, data]) => {
          // Sort dates to find first and last order
          const sortedDates = data.orderDates.sort((a, b) =>
            new Date(a).getTime() - new Date(b).getTime()
          );

          return {
            sku,
            productName: data.productName,
            totalQuantity: data.totalQuantity,
            totalOrders: data.orderIds.size,
            totalRevenue: data.totalRevenue,
            averageOrderQuantity: data.totalQuantity / data.orderIds.size,
            lastOrderDate: sortedDates[sortedDates.length - 1],
            firstOrderDate: sortedDates[0],
            currency: data.currency,
            productUuid: null as string | null,
            shopifyProductId: data.shopifyProductId
          };
        });

        // Sort by total quantity (most ordered first)
        productsArray.sort((a, b) => b.totalQuantity - a.totalQuantity);

        // Take top 10 products
        const top10 = productsArray.slice(0, 10);

        // Display products immediately without UUIDs
        setTopProducts(top10);
        setIsLoadingShopify(false);
        setIsLoadingAkeneo(true);

        // Fetch all products from Akeneo to build a SKU-to-UUID mapping
        const skuToUuidMap = new Map<string, string>();

        try {
          // Fetch products from Akeneo (paginated)
          let page = 1;
          let hasMore = true;

          while (hasMore && page <= 5) { // Limit to 5 pages to avoid too many requests
            const productsResult = await globalThis.PIM.api.product_uuid_v1.list({
              page,
              limit: 100
            });

            if (productsResult.items && productsResult.items.length > 0) {
              productsResult.items.forEach((akProduct) => {
                // Try to get SKU from values field
                if (akProduct.values?.sku) {
                  const skuValues = akProduct.values.sku;
                  if (Array.isArray(skuValues) && skuValues.length > 0 && skuValues[0].data) {
                    skuToUuidMap.set(skuValues[0].data, akProduct.uuid);
                  }
                }

                // Also map by identifier as fallback
                if (akProduct.identifier) {
                  skuToUuidMap.set(akProduct.identifier, akProduct.uuid);
                }
              });

              // Update products with UUIDs as we fetch them
              setTopProducts((prevProducts) =>
                prevProducts.map((product) => {
                  if (!product.productUuid) {
                    const uuid = skuToUuidMap.get(product.sku);
                    if (uuid) {
                      return { ...product, productUuid: uuid };
                    }
                  }
                  return product;
                })
              );

              page++;

              // Check if there are more pages
              if (!productsResult.links?.next) {
                hasMore = false;
              }
            } else {
              hasMore = false;
            }
          }
        } catch (err) {
          console.warn('Error fetching Akeneo products:', err);
        }

        setIsLoadingAkeneo(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoadingShopify(false);
        setIsLoadingAkeneo(false);
      }
    };

    fetchOrdersAndCalculateTopProducts();
  }, []);

  const handleProductClick = (productUuid: string) => {
    globalThis.PIM.navigate.internal(`/#/enrich/product/${productUuid}`);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {Ok
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string): string => {
    return `${currency} ${amount.toFixed(2)}`;
  };

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
            <span>Top Products from Shopify</span>
          </div>
        </SectionTitle>
      </div>

      {isLoadingShopify && topProducts.length === 0 && (
        <Placeholder
          illustration={<ApiIllustration />}
          title="Loading Shopify data..."
        >
          Analyzing your most ordered products from Shopify...
        </Placeholder>
      )}

      {error && (
        <Helper level="error" inline={false}>
          {error}
        </Helper>
      )}

      {!isLoadingShopify && !error && topProducts.length === 0 && (
        <Placeholder
          illustration={<ApiIllustration />}
          title="No orders found"
        >
          No products have been ordered yet on Shopify.
        </Placeholder>
      )}

      {topProducts.length > 0 && (
        <div>
          <div style={{ marginBottom: '12px' }}>
            <Helper level="info" inline={false}>
              Showing top {topProducts.length} most ordered products from Shopify
              {isLoadingAkeneo && ' - Finding products in Akeneo...'}
            </Helper>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topProducts.map((product, index) => (
              <div
                key={product.sku}
                style={{
                  border: '1px solid #E8EBEE',
                  borderRadius: '4px',
                  padding: '12px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                {/* Header row with rank and product name */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #F5F5F5'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <Badge level="primary">#{index + 1}</Badge>
                    <strong style={{ fontSize: '15px', flex: 1 }}>{product.productName}</strong>
                  </div>

                  {/* Navigation buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Shopify link */}
                    {product.shopifyProductId ? (
                      <a
                        href={`https://extensibility-store-2.myshopify.com/admin/products/${product.shopifyProductId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
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
                    ) : null}

                    {/* Akeneo PIM button */}
                    {isLoadingAkeneo && !product.productUuid ? (
                      <Button
                        ghost
                        level="secondary"
                        size="small"
                        disabled
                      >
                        Loading...
                      </Button>
                    ) : product.productUuid ? (
                      <Button
                        ghost
                        level="primary"
                        size="small"
                        onClick={() => handleProductClick(product.productUuid!)}
                      >
                        View in PIM
                      </Button>
                    ) : (
                      <div title="Product not found in Akeneo PIM">
                        <Button
                          ghost
                          level="tertiary"
                          size="small"
                          disabled
                        >
                          Not Found
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Performance Highlights */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  marginBottom: '12px',
                  padding: '12px',
                  backgroundColor: '#F9F9FC',
                  borderRadius: '4px'
                }}>
                  <div>
                    <div style={{ color: '#67768A', fontSize: '12px', marginBottom: '4px' }}>Total Revenue</div>
                    <div style={{ fontWeight: 700, fontSize: '20px', color: '#2FAF7B' }}>
                      {formatCurrency(product.totalRevenue, product.currency)}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: '#67768A', fontSize: '12px', marginBottom: '4px' }}>Total Quantity Sold</div>
                    <div style={{ fontWeight: 700, fontSize: '20px', color: '#5E4ABA' }}>
                      {product.totalQuantity} units
                    </div>
                  </div>
                </div>

                {/* Detailed Metrics Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px 8px',
                  fontSize: '13px'
                }}>
                  <div>
                    <div style={{ color: '#67768A', marginBottom: '4px', fontSize: '12px' }}>SKU</div>
                    <div style={{
                      fontWeight: 500,
                      fontFamily: 'monospace',
                      fontSize: '12px'
                    }}>
                      {product.sku}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: '#67768A', marginBottom: '4px', fontSize: '12px' }}>Number of Orders</div>
                    <div style={{ fontWeight: 600 }}>{product.totalOrders}</div>
                  </div>

                  <div>
                    <div style={{ color: '#67768A', marginBottom: '4px', fontSize: '12px' }}>Avg. Qty per Order</div>
                    <div style={{ fontWeight: 600 }}>{product.averageOrderQuantity.toFixed(1)} units</div>
                  </div>

                  <div>
                    <div style={{ color: '#67768A', marginBottom: '4px', fontSize: '12px' }}>First Ordered</div>
                    <div style={{ fontWeight: 500, fontSize: '12px' }}>
                      {formatDate(product.firstOrderDate)}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: '#67768A', marginBottom: '4px', fontSize: '12px' }}>Last Ordered</div>
                    <div style={{ fontWeight: 500, fontSize: '12px' }}>
                      {formatDate(product.lastOrderDate)}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: '#67768A', marginBottom: '4px', fontSize: '12px' }}>Avg. Revenue/Order</div>
                    <div style={{ fontWeight: 600 }}>
                      {formatCurrency(product.totalRevenue / product.totalOrders, product.currency)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
