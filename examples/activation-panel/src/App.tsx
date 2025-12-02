import {
  SectionTitle,
  Table,
  Helper,
  Badge,
  Button
} from "akeneo-design-system";
import {useGetChannels} from "./useGetChannels.ts";
import {useEffect} from "react";
import styled from "styled-components";

const PageContainer = styled.div`
  padding: 20px;
  background: #ffffff;
`;

const ChannelCard = styled.div`
  background: #f9f9fb;
  border: 1px solid #c7cbd4;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 30px;
`;

const ChannelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #c7cbd4;
`;

const ChannelInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: #ffffff;
  border-radius: 4px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 11px;
  color: #67768a;
  text-transform: uppercase;
  font-weight: 600;
`;

const InfoValue = styled.span`
  font-size: 13px;
  color: #11324d;
`;

const OrderCard = styled.div`
  background: #ffffff;
  border: 1px solid #a8b3c5;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #c7cbd4;
`;

const OrderNumber = styled.h4`
  margin: 0;
  font-size: 17px;
  color: #11324d;
`;

const OrderDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const ItemsSection = styled.div`
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #c7cbd4;
`;

const SectionLabel = styled.h5`
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #5e6e82;
  font-weight: 600;
`;

function App() {
  const { channels, loading, error, fetchChannels, productSku } = useGetChannels();

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  const getStatusBadgeLevel = (status: string): "primary" | "warning" | "danger" | "tertiary" => {
    switch (status.toUpperCase()) {
      case 'SHIPPED':
        return 'primary';
      case 'WAITING_FOR_SHIPMENT':
      case 'PARTIALLY_SHIPPED':
        return 'warning';
      case 'CANCELED':
      case 'REFUSED':
        return 'danger';
      default:
        return 'tertiary';
    }
  };

  return (
    <PageContainer>
      <SectionTitle>
        <SectionTitle.Title>Channel Orders Dashboard</SectionTitle.Title>
      </SectionTitle>

      {productSku && (
        <div style={{ marginBottom: '20px' }}>
          <Helper level="info" inline={false}>
            Showing orders containing product: <strong>{productSku}</strong>
          </Helper>
        </div>
      )}

      {loading && (
        <Helper level="info" inline={false}>
          Loading channels and orders...
        </Helper>
      )}

      {error && (
        <Helper level="error" inline={false}>
          <strong>Failed to load channels</strong>
          <br />
          {error}
          <br />
          <div style={{ marginTop: '10px' }}>
            <Button onClick={fetchChannels}>
              Retry
            </Button>
          </div>
        </Helper>
      )}

      {!loading && !error && channels.length === 0 && (
        <Helper level="info" inline={false}>
          No channels found. Please configure your channel connections.
        </Helper>
      )}

      {!loading && !error && channels.length > 0 && (
        <>
          {channels.map((channel) => (
            <ChannelCard key={channel.id}>
              <ChannelHeader>
                <div>
                  <SectionTitle>
                    <SectionTitle.Title level="secondary">{channel.label}</SectionTitle.Title>
                  </SectionTitle>
                </div>
                <Badge level="tertiary">{channel.syndicationChannelCode}</Badge>
              </ChannelHeader>

              <ChannelInfo>
                <InfoItem>
                  <InfoLabel>Channel ID</InfoLabel>
                  <InfoValue>{channel.id}</InfoValue>
                </InfoItem>
              </ChannelInfo>

              <SectionLabel>Orders</SectionLabel>

              {channel.ordersLoading && (
                <Helper level="info" inline={false}>
                  Loading orders for this channel...
                </Helper>
              )}

              {channel.ordersError && (
                <Helper level="error" inline={false}>
                  {channel.ordersError}
                </Helper>
              )}

              {!channel.ordersLoading && !channel.ordersError && channel.orders && channel.orders.length === 0 && (
                <Helper level="info" inline={false}>
                  {productSku
                    ? `No orders found for this channel containing product ${productSku}.`
                    : 'No orders found for this channel.'}
                </Helper>
              )}

              {!channel.ordersLoading && !channel.ordersError && channel.orders && channel.orders.length > 0 && (
                <div>
                  {channel.orders.map((order) => (
                    <OrderCard key={order.id}>
                      <OrderHeader>
                        <OrderNumber>#{order.orderNumber}</OrderNumber>
                        <Badge level={getStatusBadgeLevel(order.status)}>
                          {order.status}
                        </Badge>
                      </OrderHeader>

                      <OrderDetails>
                        <InfoItem>
                          <InfoLabel>Purchase Date</InfoLabel>
                          <InfoValue>{new Date(order.purchaseDate).toLocaleString()}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>Total Amount</InfoLabel>
                          <InfoValue>
                            {order.price.amount.toFixed(2)} {order.price.currency}
                            {order.price.taxAmount && ` (Tax: ${order.price.taxAmount.toFixed(2)})`}
                          </InfoValue>
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>Fulfillment</InfoLabel>
                          <InfoValue style={{ textTransform: 'capitalize' }}>{order.fulfillmentCode}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>Buyer</InfoLabel>
                          <InfoValue>
                            {order.buyer.name}
                            {order.buyer.email && (
                              <>
                                <br />
                                <small>{order.buyer.email}</small>
                              </>
                            )}
                          </InfoValue>
                        </InfoItem>
                      </OrderDetails>

                      {order.items && order.items.length > 0 && (
                        <ItemsSection>
                          <SectionLabel>Order Items ({order.items.length})</SectionLabel>
                          <Table>
                            <Table.Header>
                              <Table.HeaderCell>Product</Table.HeaderCell>
                              <Table.HeaderCell>SKU</Table.HeaderCell>
                              <Table.HeaderCell>Ordered</Table.HeaderCell>
                              <Table.HeaderCell>Shipped</Table.HeaderCell>
                              <Table.HeaderCell>Price</Table.HeaderCell>
                              <Table.HeaderCell>Status</Table.HeaderCell>
                            </Table.Header>
                            <Table.Body>
                              {order.items.map((item) => (
                                <Table.Row key={item.id}>
                                  <Table.Cell>{item.label}</Table.Cell>
                                  <Table.Cell><Badge level="tertiary">{item.productSKU}</Badge></Table.Cell>
                                  <Table.Cell>{item.quantityOrdered}</Table.Cell>
                                  <Table.Cell>{item.quantityShipped}</Table.Cell>
                                  <Table.Cell>{item.price.amount.toFixed(2)} {item.price.currency}</Table.Cell>
                                  <Table.Cell>
                                    <Badge level={item.quantityOrdered === item.quantityShipped ? 'primary' : 'warning'}>
                                      {item.status}
                                    </Badge>
                                  </Table.Cell>
                                </Table.Row>
                              ))}
                            </Table.Body>
                          </Table>
                        </ItemsSection>
                      )}
                    </OrderCard>
                  ))}
                </div>
              )}
            </ChannelCard>
          ))}
        </>
      )}
    </PageContainer>
  );
}

export default App
