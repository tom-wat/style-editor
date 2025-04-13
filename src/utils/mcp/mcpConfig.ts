// src/utils/mcp/mcpConfig.ts

// MCP サーバーの設定
export const MCP_CONFIG = {
  // ベース URL
  BASE_URL: 'http://localhost:3000',
  
  // スタイルデータ関連のエンドポイント
  ENDPOINTS: {
    // スタイル取得
    GET_STYLES: '/api/styles',
    
    // スタイル保存
    SAVE_STYLES: '/api/styles/save',
    
    // テンプレート一覧
    GET_TEMPLATES: '/api/styles/templates',
    
    // 特定テンプレートの取得
    GET_TEMPLATE: '/api/styles/templates/:id',
  },
};

/**
 * エンドポイント URL を生成する関数
 * @param {string} endpoint - エンドポイントパス
 * @param {Record<string, string>} params - URL パラメータ（オプション）
 * @returns {string} - 完全な URL
 */
export const getEndpointUrl = (endpoint: string, params?: Record<string, string>): string => {
  let url = `${MCP_CONFIG.BASE_URL}${endpoint}`;
  
  // URLパラメータの置換
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }
  
  return url;
};
