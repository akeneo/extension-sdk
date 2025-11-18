import { Pie } from 'react-chartjs-2';
import { Loader } from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Flag } from '../Flag.tsx';

interface ShadcnDashboardProps {
  productStatusData: any;
  pricingStatusData: any;
  chartOptions: any;
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

export const ShadcnDashboard = ({
  productStatusData,
  pricingStatusData,
  chartOptions,
  selectedFamilyLabel,
  completenessData,
  completenessLoading,
  products,
}: ShadcnDashboardProps) => {
  return (
    <main className="grid gap-4 md:grid-cols-2">
      {/* Pricing Status Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Status</CardTitle>
          <CardDescription>Complete products with or without a price.</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <Pie data={pricingStatusData} options={chartOptions} />
        </CardContent>
      </Card>

      {/* Product Status Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution by completeness status.</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <Pie data={productStatusData} options={chartOptions} />
        </CardContent>
      </Card>

      <div className="md:col-span-2">
        {/* Completeness per Locale Widget */}
        <Card>
          <CardHeader>
            <CardTitle>Completeness per Locale</CardTitle>
            <CardDescription>
              Average score for the '{selectedFamilyLabel}' family.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {completenessLoading ? (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Calculating...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {completenessData.map((item) => (
                  <div key={item.locale}>
                    <div className="flex justify-between mb-1 items-center">
                      <div className="flex items-center gap-2">
                        <Flag locale={item.locale} />
                        <span className="text-sm font-medium">{item.locale}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.completeness}%</span>
                    </div>
                    <Progress value={item.completeness} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {/* Products Table Widget */}
        <Card>
          <CardHeader>
            <CardTitle>Recently updated products in the {selectedFamilyLabel} family</CardTitle>
            <CardDescription>List of 10 products from the PIM.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Last Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
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
                    <TableRow key={product.uuid}>
                      <TableCell>
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={productName} style={{ width: 70, height: 70 }} />
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <a href={`/enrich/product/${product.uuid}`} target="_blank" rel="noopener noreferrer">
                          {product.values?.sku?.[0]?.data ?? product.values?.internal_itemid?.[0]?.data ?? product.identifier}
                        </a>
                      </TableCell>
                      <TableCell>{productName}</TableCell>
                      <TableCell>{formattedDate}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
