export type AttributeInfo = {
  code: string;
  type: string;
  localizable: boolean;
  scopable: boolean;
  label: string;
};

type RawProductValue = {
  locale?: string | null;
  scope?: string | null;
  data: unknown;
};

type RawProductValues = Record<string, RawProductValue[]>;

export async function fetchAttributeInfo(
  code: string,
  locale: string
): Promise<AttributeInfo> {
  const attribute = (await globalThis.PIM.api.attribute_v1.get({
    code,
  })) as unknown as {
    code: string;
    type: string;
    localizable?: boolean;
    scopable?: boolean;
    labels?: Record<string, string>;
  };

  return {
    code: attribute.code,
    type: attribute.type,
    localizable: attribute.localizable ?? false,
    scopable: attribute.scopable ?? false,
    label: attribute.labels?.[locale] ?? attribute.code,
  };
}

export async function fetchMarkdownValue(
  productUuid: string,
  attribute: AttributeInfo,
  locale: string,
  scope: string
): Promise<string> {
  const product = (await globalThis.PIM.api.product_uuid_v1.get({
    uuid: productUuid,
  })) as unknown as { values?: RawProductValues };

  const values = product.values?.[attribute.code];
  if (!values || values.length === 0) return '';

  const wantedLocale = attribute.localizable ? locale : null;
  const wantedScope = attribute.scopable ? scope : null;
  const match = values.find(
    (v) => (v.locale ?? null) === wantedLocale && (v.scope ?? null) === wantedScope
  );

  return typeof match?.data === 'string' ? match.data : '';
}

export async function saveMarkdownValue(
  productUuid: string,
  attribute: AttributeInfo,
  locale: string,
  scope: string,
  markdown: string
): Promise<void> {
  // The REST API expects explicit null locale/scope for non-localizable /
  // non-scopable values, but the SDK type only allows string | undefined.
  const values = {
    [attribute.code]: [
      {
        locale: attribute.localizable ? locale : null,
        scope: attribute.scopable ? scope : null,
        data: markdown,
      },
    ],
  } as unknown as Record<string, Array<{ locale?: string; scope?: string; data: unknown }>>;

  await globalThis.PIM.api.product_uuid_v1.patch({
    uuid: productUuid,
    data: { values },
  });
}
