// src/utils/mcp/mcpService.ts
import { ElementType } from '../bemUtils';

/**
 * MCP サーバーからスタイルデータを取得する関数
 * @param {string} url - MCP サーバーのエンドポイント URL
 * @returns {Promise<{ blockName: string, elements: ElementType[] }>} - 取得したスタイルデータ
 */
export const fetchStylesFromMCPServer = async (url: string): Promise<{ blockName: string, elements: ElementType[] }> => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`MCPサーバーからのデータ取得に失敗しました: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('MCPサーバーからデータを取得できませんでした:', error);
    throw error;
  }
};

/**
 * MCP サーバーにスタイルデータを保存する関数
 * @param {string} url - MCP サーバーのエンドポイント URL
 * @param {string} blockName - ブロック名
 * @param {ElementType[]} elements - 要素データ
 * @returns {Promise<{ success: boolean, message: string }>} - 処理結果
 */
export const saveStylesToMCPServer = async (
  url: string, 
  blockName: string, 
  elements: ElementType[]
): Promise<{ success: boolean, message: string }> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blockName, elements }),
    });
    
    if (!response.ok) {
      throw new Error(`MCPサーバーへのデータ保存に失敗しました: ${response.status} ${response.statusText}`);
    }
    
    // const result = await response.json();
    return { success: true, message: 'スタイルが正常に保存されました' };
  } catch (error) {
    console.error('MCPサーバーにデータを保存できませんでした:', error);
    return { success: false, message: `エラー: ${error instanceof Error ? error.message : '未知のエラー'}` };
  }
};

/**
 * 利用可能なスタイルテンプレートを取得する関数
 * @param {string} url - MCP サーバーのテンプレート一覧エンドポイント URL
 * @returns {Promise<Array<{ id: string, name: string }>>} - テンプレートリスト
 */
export const fetchStyleTemplates = async (url: string): Promise<Array<{ id: string, name: string }>> => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`テンプレート一覧の取得に失敗しました: ${response.status} ${response.statusText}`);
    }
    
    const templates = await response.json();
    return templates;
  } catch (error) {
    console.error('テンプレート一覧を取得できませんでした:', error);
    return [];
  }
};
