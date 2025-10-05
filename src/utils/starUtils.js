// Utility functions for star-related operations

/**
 * Convert screen coordinates to image coordinates
 * @param {number} screenX - X coordinate on screen
 * @param {number} screenY - Y coordinate on screen  
 * @param {object} viewport - Current viewport state
 * @returns {object} Image coordinates {x, y}
 */
export const screenToImageCoords = (screenX, screenY, viewport) => {
  const { x, y, scale } = viewport;
  
  return {
    x: (screenX - x) / scale,
    y: (screenY - y) / scale
  };
};

/**
 * Convert image coordinates to screen coordinates
 * @param {number} imageX - X coordinate on image
 * @param {number} imageY - Y coordinate on image
 * @param {object} viewport - Current viewport state
 * @returns {object} Screen coordinates {x, y}
 */
export const imageToScreenCoords = (imageX, imageY, viewport) => {
  const { x, y, scale } = viewport;
  
  return {
    x: imageX * scale + x,
    y: imageY * scale + y
  };
};

/**
 * Check if a point is within the visible viewport
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {object} viewport - Current viewport state
 * @returns {boolean} True if point is visible
 */
export const isPointVisible = (x, y, viewport) => {
  const { x: viewX, y: viewY, scale, width, height } = viewport;
  
  const screenCoords = imageToScreenCoords(x, y, viewport);
  
  return screenCoords.x >= -50 && 
         screenCoords.x <= width + 50 && 
         screenCoords.y >= -50 && 
         screenCoords.y <= height + 50;
};

/**
 * Calculate distance between two points
 * @param {number} x1 - First point X
 * @param {number} y1 - First point Y
 * @param {number} x2 - Second point X
 * @param {number} y2 - Second point Y
 * @returns {number} Distance between points
 */
export const calculateDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
