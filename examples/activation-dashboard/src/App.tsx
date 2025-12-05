import {
  SectionTitle,
  Table,
  Helper,
  Badge,
  Button,
  getColor,
  getFontSize,
  SkeletonPlaceholder
} from "akeneo-design-system";
import {useGetChannels} from "./useGetChannels.ts";
import {useEffect, useState} from "react";
import styled from "styled-components";

const PageContainer = styled.div`
  padding: 20px;
  background: ${getColor('white')};
`;

const ChannelCard = styled.div`
  background: ${getColor('white')};
  border: 1px solid ${getColor('grey', 80)};
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }
`;

const ChannelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: ${getColor('grey', 20)};
  border-bottom: 1px solid ${getColor('grey', 80)};
  cursor: pointer;
  user-select: none;

  &:hover {
    background: ${getColor('grey', 40)};
  }
`;

const ChannelHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
`;

const ChannelTitle = styled.h3`
  margin: 0;
  font-size: ${getFontSize('big')};
  color: ${getColor('grey', 140)};
  font-weight: 600;
`;

const ChannelMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const OrderCount = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: ${getFontSize('small')};
  color: ${getColor('grey', 120)};
  padding: 4px 10px;
  background: ${getColor('white')};
  border-radius: 12px;
  font-weight: 500;
`;

const CollapseIcon = styled.span<{ $isOpen: boolean }>`
  font-size: 18px;
  color: ${getColor('grey', 120)};
  transition: transform 0.2s;
  transform: ${props => props.$isOpen ? 'rotate(90deg)' : 'rotate(0deg)'};
`;

const ChannelContent = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  padding: 20px;
`;

const ChannelInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: ${getColor('grey', 20)};
  border-radius: 6px;
  border: 1px solid ${getColor('grey', 60)};
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: ${getFontSize('small')};
  color: ${getColor('grey', 100)};
  text-transform: uppercase;
  font-weight: 600;
`;

const InfoValue = styled.span`
  font-size: ${getFontSize('default')};
  color: ${getColor('grey', 140)};
`;

const OrdersContainer = styled.div`
  max-height: 600px;
  overflow-y: auto;
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${getColor('grey', 40)};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${getColor('grey', 100)};
    border-radius: 4px;

    &:hover {
      background: ${getColor('grey', 120)};
    }
  }
`;

const OrderCard = styled.div<{ $isExpanded: boolean }>`
  background: ${getColor('grey', 20)};
  border: 1px solid ${getColor('grey', 80)};
  border-radius: 6px;
  margin-bottom: 12px;
  overflow: hidden;
  transition: all 0.2s;

  &:hover {
    border-color: ${getColor('grey', 100)};
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  user-select: none;
  background: ${getColor('white')};

  &:hover {
    background: ${getColor('grey', 20)};
  }
`;

const OrderHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const OrderNumber = styled.h4`
  margin: 0;
  font-size: ${getFontSize('default')};
  color: ${getColor('grey', 140)};
  font-weight: 600;
`;

const OrderSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: ${getFontSize('small')};
  color: ${getColor('grey', 120)};
`;

const OrderContent = styled.div<{ $isExpanded: boolean }>`
  display: ${props => props.$isExpanded ? 'block' : 'none'};
  padding: 15px;
  background: ${getColor('white')};
  border-top: 1px solid ${getColor('grey', 60)};
`;

const OrderDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 15px;
  padding: 12px;
  background: ${getColor('grey', 20)};
  border-radius: 4px;
`;

const ItemsSection = styled.div`
  margin-top: 15px;
`;

const SectionLabel = styled.h5`
  margin: 0 0 10px 0;
  font-size: ${getFontSize('small')};
  color: ${getColor('grey', 120)};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BuyerEmail = styled.small`
  color: ${getColor('grey', 100)};
`;

function App() {
  const { channels, loading, error, fetchChannels } = useGetChannels();
  const [expandedChannels, setExpandedChannels] = useState<Set<string>>(new Set());
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  const toggleChannel = (channelId: string) => {
    setExpandedChannels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(channelId)) {
        newSet.delete(channelId);
      } else {
        newSet.add(channelId);
      }
      return newSet;
    });
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

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

      {loading && (
        <>
          <ChannelCard>
            <div style={{ padding: '20px' }}>
              <SkeletonPlaceholder style={{ height: '40px', marginBottom: '15px' }} />
              <SkeletonPlaceholder style={{ height: '80px', marginBottom: '15px' }} />
              <SkeletonPlaceholder style={{ height: '60px', marginBottom: '10px' }} />
              <SkeletonPlaceholder style={{ height: '60px' }} />
            </div>
          </ChannelCard>
          <ChannelCard>
            <div style={{ padding: '20px' }}>
              <SkeletonPlaceholder style={{ height: '40px', marginBottom: '15px' }} />
              <SkeletonPlaceholder style={{ height: '80px', marginBottom: '15px' }} />
              <SkeletonPlaceholder style={{ height: '60px' }} />
            </div>
          </ChannelCard>
        </>
      )}

      {error && (
        <Helper level="error" inline={false}>
          <strong>Failed to load channels</strong>
          <br />
          {error}
          <br />
          <Button onClick={fetchChannels} style={{ marginTop: '10px' }}>
            Retry
          </Button>
        </Helper>
      )}

      {!loading && !error && channels.length === 0 && (
        <Helper level="info" inline={false}>
          No channels found. Please configure your channel connections.
        </Helper>
      )}

      {!loading && !error && channels.length > 0 && (
        <>
          {channels.map((channel) => {
            const isChannelOpen = expandedChannels.has(channel.id);
            const orderCount = channel.orders?.length || 0;

            return (
              <ChannelCard key={channel.id}>
                <ChannelHeader onClick={() => toggleChannel(channel.id)}>
                  <ChannelHeaderLeft>
                    <CollapseIcon $isOpen={isChannelOpen}>▶</CollapseIcon>
                    <ChannelTitle>{channel.label}</ChannelTitle>
                  </ChannelHeaderLeft>
                  <ChannelMeta>
                    {!channel.ordersLoading && <OrderCount>{orderCount} {orderCount === 1 ? 'order' : 'orders'}</OrderCount>}
                    <Badge level="tertiary">{channel.syndicationChannelCode}</Badge>
                  </ChannelMeta>
                </ChannelHeader>

                <ChannelContent $isOpen={isChannelOpen}>
                  <ChannelInfo>
                    <InfoItem>
                      <InfoLabel>Channel ID</InfoLabel>
                      <InfoValue>{channel.id}</InfoValue>
                    </InfoItem>
                  </ChannelInfo>

              {channel.ordersLoading && (
                <div>
                  <OrderCard $isExpanded={false}>
                    <div style={{ padding: '15px' }}>
                      <SkeletonPlaceholder style={{ height: '20px', marginBottom: '10px' }} />
                      <SkeletonPlaceholder style={{ height: '15px', width: '60%' }} />
                    </div>
                  </OrderCard>
                  <OrderCard $isExpanded={false}>
                    <div style={{ padding: '15px' }}>
                      <SkeletonPlaceholder style={{ height: '20px', marginBottom: '10px' }} />
                      <SkeletonPlaceholder style={{ height: '15px', width: '60%' }} />
                    </div>
                  </OrderCard>
                  <OrderCard $isExpanded={false}>
                    <div style={{ padding: '15px' }}>
                      <SkeletonPlaceholder style={{ height: '20px', marginBottom: '10px' }} />
                      <SkeletonPlaceholder style={{ height: '15px', width: '60%' }} />
                    </div>
                  </OrderCard>
                </div>
              )}

              {channel.ordersError && (
                <Helper level="error" inline={false}>
                  {channel.ordersError}
                </Helper>
              )}

              {!channel.ordersLoading && !channel.ordersError && channel.orders && channel.orders.length === 0 && (
                <Helper level="info" inline={false}>
                  No orders found for this channel.
                </Helper>
              )}

              {!channel.ordersLoading && !channel.ordersError && channel.orders && channel.orders.length > 0 && (
                <OrdersContainer>
                  {channel.orders.map((order) => {
                    const isOrderExpanded = expandedOrders.has(order.id);

                    return (
                      <OrderCard key={order.id} $isExpanded={isOrderExpanded}>
                        <OrderHeader onClick={() => toggleOrder(order.id)}>
                          <OrderHeaderLeft>
                            <CollapseIcon $isOpen={isOrderExpanded}>▶</CollapseIcon>
                            <OrderNumber>#{order.orderNumber}</OrderNumber>
                            <OrderSummary>
                              <span>{new Date(order.purchaseDate).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{order.price.amount.toFixed(2)} {order.price.currency}</span>
                              <span>•</span>
                              <span>{order.items?.length || 0} items</span>
                            </OrderSummary>
                          </OrderHeaderLeft>
                          <Badge level={getStatusBadgeLevel(order.status)}>
                            {order.status}
                          </Badge>
                        </OrderHeader>

                        <OrderContent $isExpanded={isOrderExpanded}>
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
                                    <BuyerEmail>{order.buyer.email}</BuyerEmail>
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
                        </OrderContent>
                      </OrderCard>
                    );
                  })}
                </OrdersContainer>
              )}
                </ChannelContent>
            </ChannelCard>
            );
          })}
        </>
      )}
    </PageContainer>
  );
}

export default App
