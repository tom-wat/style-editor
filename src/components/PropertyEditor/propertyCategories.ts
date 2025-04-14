// src/components/PropertyEditor/propertyCategories.ts

export interface PropertyCategory {
  title: string;
  properties: string[];
}

// プロパティをカテゴリに分類
export const propertyCategories: Record<string, PropertyCategory> = {
  font: {
    title: 'フォント',
    properties: ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'textAlign', 'textDecoration']
  },
  color: {
    title: 'カラー',
    properties: ['color', 'backgroundColor', 'borderColor']
  },
  dimension: {
    title: '幅と高さ',
    properties: ['width', 'height', 'max-width', 'max-height']
  },
  padding: {
    title: 'パディング',
    properties: ['padding', 'padding-inline-start', 'padding-inline-end', 'padding-block-start', 'padding-block-end']
  },
  margin: {
    title: 'マージン',
    properties: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight']
  },
  display: {
    title: 'ディスプレイ',
    properties: ['display']
  },
  border: {
    title: 'ボーダー',
    properties: ['border', 'borderRadius', 'borderWidth', 'borderStyle']
  },
  other: {
    title: 'その他',
    properties: ['position', 'overflow', 'opacity', 'boxShadow', 'transform']
  }
};

// カラーピッカー用のプロパティ
export const colorProperties = ['backgroundColor', 'color', 'borderColor'];

// 数値+単位用のプロパティとその単位
export const unitProperties: Record<string, string> = {
  width: 'px',
  height: 'px',
  'max-width': 'px',
  'max-height': 'px',
  fontSize: 'px',
  padding: 'px',
  'padding-inline-start': 'px',
  'padding-inline-end': 'px',
  'padding-block-start': 'px',
  'padding-block-end': 'px',
  borderRadius: 'px',
  marginTop: 'px',
  marginBottom: 'px',
  marginLeft: 'px',
  marginRight: 'px',
  borderWidth: 'px'
};

// autoを指定できるプロパティ
export const autoProperties = ['width', 'height', 'max-width', 'max-height'];
