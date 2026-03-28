import lexicalAnalysis from "./lexical-analysis/browser.mjs";
import syntacticAnalysis from "./syntactic-analysis/indirect/index.mjs";
export { mediaTypes, namespace } from "./adapter.mjs";
export { lexicalAnalysis, syntacticAnalysis };

/**
 * @public
 */
export const detect = async source => {
  try {
    const cst = await lexicalAnalysis(source);
    const isError = !cst.rootNode.isError;
    cst.delete();
    return isError;
  } catch {
    return false;
  }
};

/**
 * @public
 */

/**
 * @public
 */

/**
 * @public
 */
export const parse = async (source, {
  sourceMap = false
} = {}) => {
  const cst = await lexicalAnalysis(source);
  const syntacticAnalysisResult = syntacticAnalysis(cst, {
    sourceMap
  });
  cst.delete();
  return syntacticAnalysisResult;
};