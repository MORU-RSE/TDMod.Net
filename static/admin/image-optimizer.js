(function imageOptimizerBootstrap(root) {
  'use strict';

  var DEFAULTS = {
    maxInputBytes: 20 * 1024 * 1024,
    targetBytes: 500 * 1024,
    maxDimension: 1600,
    initialQuality: 0.82,
    minimumQuality: 0.55,
  };
  var ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  var bypassEvents = typeof WeakSet === 'function' ? new WeakSet() : null;
  var statusTimer = null;

  function isAllowedType(type) {
    return ALLOWED_TYPES.indexOf(String(type || '').toLowerCase()) !== -1;
  }

  function calculateDimensions(width, height, maxDimension) {
    if (width <= 0 || height <= 0) {
      throw new Error('The selected image has invalid dimensions.');
    }

    var scale = Math.min(1, maxDimension / Math.max(width, height));
    return {
      width: Math.max(1, Math.round(width * scale)),
      height: Math.max(1, Math.round(height * scale)),
    };
  }

  function scaleDimensions(dimensions, scale, minimumLongestSide) {
    var longestSide = Math.max(dimensions.width, dimensions.height);
    var targetLongestSide = Math.max(
      minimumLongestSide || 1,
      Math.round(longestSide * scale),
    );
    var normalizedScale = targetLongestSide / longestSide;

    return {
      width: Math.max(1, Math.round(dimensions.width * normalizedScale)),
      height: Math.max(1, Math.round(dimensions.height * normalizedScale)),
    };
  }

  function slugifyFilename(filename) {
    var basename = String(filename || 'image').replace(/\.[^.]+$/, '');
    var normalized = typeof basename.normalize === 'function' ? basename.normalize('NFKD') : basename;
    var slug = normalized
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50);
    return slug || 'image';
  }

  function uniqueFilename(originalName, now, randomValues) {
    var date = now || new Date();
    var pad = function pad(value) {
      return String(value).padStart(2, '0');
    };
    var stamp = [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join('') +
      '-' + [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join('');
    var values = randomValues;

    if (!values) {
      values = new Uint32Array(1);
      if (root.crypto && typeof root.crypto.getRandomValues === 'function') {
        root.crypto.getRandomValues(values);
      } else {
        values[0] = Math.floor(Math.random() * 0xffffffff);
      }
    }

    var suffix = Number(values[0]).toString(36).padStart(6, '0').slice(-6);
    return slugifyFilename(originalName) + '-' + stamp + '-' + suffix + '.webp';
  }

  function validateFile(file, options) {
    var config = Object.assign({}, DEFAULTS, options || {});
    if (!file || !isAllowedType(file.type)) {
      throw new Error('Please choose a JPEG, PNG, or WebP image. GIF, BMP, TIFF, and SVG uploads are not supported.');
    }
    if (file.size <= 0) {
      throw new Error('The selected image is empty.');
    }
    if (file.size > config.maxInputBytes) {
      throw new Error('The selected image is larger than 20 MB. Please choose a smaller source image.');
    }
    return config;
  }

  function canvasToBlob(canvas, quality) {
    return new Promise(function resolveBlob(resolve, reject) {
      canvas.toBlob(function onBlob(blob) {
        if (!blob || blob.type !== 'image/webp') {
          reject(new Error('This browser cannot create WebP images. Please use a current version of Chrome, Edge, Firefox, or Safari.'));
          return;
        }
        resolve(blob);
      }, 'image/webp', quality);
    });
  }

  function loadWithImageElement(file) {
    return new Promise(function resolveImage(resolve, reject) {
      var url = URL.createObjectURL(file);
      var image = new Image();
      image.onload = function onLoad() {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = function onError() {
        URL.revokeObjectURL(url);
        reject(new Error('The selected image could not be decoded.'));
      };
      image.src = url;
    });
  }

  async function decodeImage(file) {
    if (typeof root.createImageBitmap === 'function') {
      try {
        return await root.createImageBitmap(file, { imageOrientation: 'from-image' });
      } catch (error) {
        // Fall back for browsers that do not accept imageOrientation options.
        try {
          return await root.createImageBitmap(file);
        } catch (fallbackError) {
          return loadWithImageElement(file);
        }
      }
    }
    return loadWithImageElement(file);
  }

  function sourceWidth(source) {
    return source.width || source.naturalWidth;
  }

  function sourceHeight(source) {
    return source.height || source.naturalHeight;
  }

  function drawSource(source, dimensions) {
    var canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    var context = canvas.getContext('2d', { alpha: true });
    if (!context) {
      throw new Error('Image processing is not available in this browser.');
    }
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(source, 0, 0, dimensions.width, dimensions.height);
    return canvas;
  }

  async function optimizeImage(file, options) {
    var config = validateFile(file, options);
    var source = await decodeImage(file);
    var dimensions = calculateDimensions(sourceWidth(source), sourceHeight(source), config.maxDimension);
    var quality = config.initialQuality;
    var blob;
    var attempts = 0;

    try {
      while (attempts < 12) {
        var canvas = drawSource(source, dimensions);
        blob = await canvasToBlob(canvas, quality);
        canvas.width = 0;
        canvas.height = 0;

        if (blob.size <= config.targetBytes) {
          break;
        }

        if (quality > config.minimumQuality) {
          quality = Math.max(config.minimumQuality, quality - 0.07);
        } else {
          var scale = Math.min(0.9, Math.sqrt(config.targetBytes / blob.size) * 0.95);
          dimensions = scaleDimensions(dimensions, scale, 320);
          quality = Math.max(config.minimumQuality, 0.75);
        }
        attempts += 1;
      }
    } finally {
      if (source && typeof source.close === 'function') {
        source.close();
      }
    }

    if (!blob || blob.size > config.targetBytes) {
      throw new Error('The image could not be compressed below 500 KB. Please crop it and try again.');
    }

    return new File([blob], uniqueFilename(file.name), {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  }

  function statusElement() {
    return document.getElementById('tdmod-image-status');
  }

  function showStatus(message, state, timeout) {
    var element = statusElement();
    if (!element) {
      return;
    }
    if (statusTimer) {
      root.clearTimeout(statusTimer);
      statusTimer = null;
    }
    element.textContent = message;
    element.dataset.state = state || 'working';
    element.hidden = false;
    if (timeout) {
      statusTimer = root.setTimeout(function hideStatus() {
        element.hidden = true;
        statusTimer = null;
      }, timeout);
    }
  }

  function looksLikeImageSelection(input, files) {
    if (!files.length) {
      return false;
    }
    var acceptsImages = String(input.getAttribute('accept') || '').toLowerCase().indexOf('image') !== -1;
    var hasImageMime = files.some(function hasImage(file) {
      return String(file.type || '').toLowerCase().indexOf('image/') === 0;
    });
    return acceptsImages || hasImageMime;
  }

  async function handleFileInput(event) {
    if (bypassEvents && bypassEvents.has(event)) {
      return;
    }

    var input = event.target;
    if (!input || input.tagName !== 'INPUT' || input.type !== 'file') {
      return;
    }

    var files = Array.prototype.slice.call(input.files || []);
    if (!looksLikeImageSelection(input, files)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') {
      event.stopImmediatePropagation();
    }

    input.disabled = true;
    showStatus('Optimizing image before upload…');

    try {
      var optimizedFiles = [];
      for (var index = 0; index < files.length; index += 1) {
        optimizedFiles.push(await optimizeImage(files[index]));
      }

      var transfer = new DataTransfer();
      optimizedFiles.forEach(function addFile(file) {
        transfer.items.add(file);
      });
      input.files = transfer.files;
      input.disabled = false;

      var replacementEvent = new Event('change', { bubbles: true });
      if (bypassEvents) {
        bypassEvents.add(replacementEvent);
      }
      input.dispatchEvent(replacementEvent);
      showStatus('Image optimized and ready to save.', 'success', 3500);
    } catch (error) {
      input.disabled = false;
      input.value = '';
      showStatus(error && error.message ? error.message : 'Image optimization failed.', 'error', 8000);
    }
  }

  function install() {
    if (!root.document || root.__tdmodImageOptimizerInstalled) {
      return;
    }
    root.__tdmodImageOptimizerInstalled = true;
    root.document.addEventListener('change', handleFileInput, true);
  }

  var api = {
    DEFAULTS: DEFAULTS,
    calculateDimensions: calculateDimensions,
    scaleDimensions: scaleDimensions,
    install: install,
    isAllowedType: isAllowedType,
    optimizeImage: optimizeImage,
    slugifyFilename: slugifyFilename,
    uniqueFilename: uniqueFilename,
    validateFile: validateFile,
  };

  root.TDModImageOptimizer = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  install();
})(typeof window !== 'undefined' ? window : globalThis);
