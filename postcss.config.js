import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default {
  plugins: [
    autoprefixer(),
    ...(process.env.NODE_ENV === 'production' ? [
      cssnano({
        preset: [
          'advanced',
          {
            discardComments: {
              removeAll: true,
            },
            reduceIdents: true,
            mergeIdents: true,
            discardUnused: true,
            autoprefixer: false,
            zindex: false,
            normalizeWhitespace: true,
            colormin: true,
            convertValues: true,
            discardDuplicates: true,
            discardEmpty: true,
            discardOverridden: true,
            mergeLonghand: true,
            mergeRules: true,
            minifyFontValues: true,
            minifyGradients: true,
            minifyParams: true,
            minifySelectors: true,
            normalizeCharset: true,
            normalizeDisplayValues: true,
            normalizePositions: true,
            normalizeRepeatStyle: true,
            normalizeString: true,
            normalizeTimingFunctions: true,
            normalizeUnicode: true,
            normalizeUrl: true,
            orderedValues: true,
            reduceInitial: true,
            reduceTransforms: true,
            svgo: true,
            uniqueSelectors: true,
          },
        ],
      })
    ] : []),
  ],
};